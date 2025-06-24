import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Skeleton } from "../../../components/ui/Skeleton";
import { JitsiMeeting } from "@jitsi/react-sdk";
import {
  updateLiveClassMeetingUrl,
  getLiveClassById,
} from "../../../api/liveclass";
import axios from "axios";
import {
  SpeechRecognition,
  SpeechRecognitionEvent,
  SpeechRecognitionResultList,
  SpeechRecognitionErrorEvent,
} from "./interface";
import { motion } from "framer-motion";
import { Button } from "../../../components/ui/Button";

export interface Meeting {
  id: number;
  user_id: number;
  name: string;
  title: string | null;
  description: string | null;
  meeting_code: string;
  meeting_url: string;
  meeting_timezone: string | null;
  meeting_location: string | null;
  notes: string | null;
  participant: string | null;
  classroom_name: string | null;
  meeting_type: string;
  created_at: string;
  updated_at: string;
}

const JITSI_DOMAIN = "meet.aiteacha.com:8443";
const TRANSCRIPT_API_URL =
  "https://vd.aiteacha.com/api/live/class/add/transcript";

const JitsiMeetingPage = () => {
  const navigate = useNavigate();
  const { meetingId } = useParams<{ meetingId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const jitsiApiRef = useRef<any>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState<string>("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [interimSpeechTranscript, setInterimSpeechTranscript] =
    useState<string>("");

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const fullTranscriptRef = useRef<string>("");
  const [isMeetingActive, setIsMeetingActive] = useState(false);

  useEffect(() => {
    fullTranscriptRef.current = speechTranscript + interimSpeechTranscript;
  }, [speechTranscript, interimSpeechTranscript]);

  useEffect(() => {
    const fetchMeetingDetails = async () => {
      if (!meetingId) {
        setError("Meeting ID is missing from the URL.");
        setLoading(false);
        return;
      }

      const id = parseInt(meetingId);
      if (isNaN(id)) {
        setError("Invalid Meeting ID in the URL.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await getLiveClassById(id);
        if (data && data.data) {
          if (Array.isArray(data.data) && data.data.length > 0) {
            setMeeting(data.data[0]);
          } else {
            setMeeting(data.data);
          }
        } else {
          setError("Meeting data not found in API response.");
        }
      } catch (err: any) {
        console.error("Failed to fetch meeting details:", err);
        setError(
          "Failed to load meeting details: " + (err.message || "Unknown error")
        );
        setMeeting(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetingDetails();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }
      setIsMeetingActive(false);
    };
  }, [meetingId]);

  const startSpeechRecognition = useCallback(() => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support speech recognition.");
      setError("Speech recognition not supported by your browser.");
      return;
    }

    if (!isMeetingActive || (recognitionRef.current && isRecording)) {
      if (!isMeetingActive) {
        console.log("Meeting not active, preventing speech recognition start.");
      } else {
        console.log(
          "Speech recognition already running, preventing duplicate start."
        );
      }
      return;
    }

    const SpeechRecognitionAPI =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;
    const recognition: SpeechRecognition = new SpeechRecognitionAPI();

    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onstart = () => {
      setIsRecording(true);
      console.log("Speech recognition started.");
    };

    recognition.onend = () => {
      setIsRecording(false);
      console.log("Speech recognition ended.");
      if (isMeetingActive) {
        console.log(
          "Meeting still active, attempting to restart speech recognition..."
        );
        setTimeout(() => {
          if (isMeetingActive) {
            startSpeechRecognition();
          } else {
            console.log(
              "Meeting became inactive during restart delay, not restarting."
            );
          }
        }, 500);
      } else {
        console.log(
          "Meeting is not active, not restarting speech recognition."
        );
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "aborted" && isMeetingActive) {
        console.warn(
          "Speech recognition aborted (likely due to mic contention). OnEnd will handle restart."
        );
        setIsRecording(false);
        recognitionRef.current?.stop();
        return;
      }

      console.error("Speech recognition error:", event.error, event.message);
      setIsRecording(false);
      if (event.error === "not-allowed") {
        setError(
          "Microphone access denied. Please allow microphone access for speech recognition."
        );
      } else if (event.error === "network") {
        setError(
          "Speech recognition network error. Please check your internet connection."
        );
      } else if (event.error === "no-speech") {
        console.warn(
          "No speech detected, recognition will attempt to restart if continuous."
        );
      }

      recognitionRef.current?.stop();

      if (isMeetingActive && event.error !== "not-allowed") {
        console.log(
          "Error occurred, but meeting is active. Attempting restart."
        );
        setTimeout(() => {
          if (isMeetingActive) {
            startSpeechRecognition();
          }
        }, 1000);
      }
    };

    recognition.onresult = (
      event: SpeechRecognitionEvent & {
        resultIndex: number;
        results: SpeechRecognitionResultList;
      }
    ) => {
      let currentInterimTranscript = "";
      let finalTranscriptChunk = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscriptChunk += transcript.trim();
          if (finalTranscriptChunk && !/[.!?]$/.test(finalTranscriptChunk)) {
            finalTranscriptChunk += ". ";
          } else if (finalTranscriptChunk) {
            finalTranscriptChunk += " ";
          }
        } else {
          currentInterimTranscript += transcript;
        }
      }

      if (finalTranscriptChunk) {
        setSpeechTranscript((prev) => prev + finalTranscriptChunk);
        setInterimSpeechTranscript("");
      } else {
        setInterimSpeechTranscript(currentInterimTranscript);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [isRecording, isMeetingActive]);

  const stopSpeechRecognition = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsRecording(false);
      console.log("Speech recognition explicitly stopped.");
    }
  }, []);

  const sendTranscriptToBackend = useCallback(
    async (transcript: string, id: string) => {
      console.log("Sending transcript to backend...");
      if (!transcript.trim()) {
        console.log("Transcript is empty, not sending to backend.");
        return;
      }
      try {
        const response = await axios.post(TRANSCRIPT_API_URL, {
          liveclassroom_id: id,
          transcript: transcript,
        });

        if (response.status === 200 || response.status === 201) {
          console.log(
            "Transcript successfully sent to backend.",
            response.data
          );
        } else {
          console.error(
            "Failed to send transcript to backend with status:",
            response.status,
            response.data
          );
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            "Axios error sending transcript to backend:",
            error.message,
            error.response?.data || error.response?.statusText
          );
        } else {
          console.error(
            "Network or unknown error sending transcript to backend:",
            error
          );
        }
      }
    },
    []
  );

  const handleMeetingEnd = useCallback(async () => {
    console.log("Frontend: Meeting ending sequence initiated.");
    setIsMeetingActive(false);

    stopSpeechRecognition();

    const finalTranscriptToSend = fullTranscriptRef.current;
    console.log("Final Transcript to Send:", finalTranscriptToSend);
    console.log("Meeting ID:", meetingId);

    if (finalTranscriptToSend && meetingId) {
      await sendTranscriptToBackend(finalTranscriptToSend.trim(), meetingId);
    }

    if (jitsiApiRef.current) {
      console.log("Disposing of Jitsi API instance on meeting end.");
      jitsiApiRef.current.dispose();
      jitsiApiRef.current = null;
    }

    setTimeout(() => {
      navigate(`/dashboard/liveclass/details/${meetingId}`);
    }, 2000);
  }, [meetingId, navigate, sendTranscriptToBackend, stopSpeechRecognition]);

  const generateRandomString = (length: number) => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const [jitsiLiveRoomName, setJitsiLiveRoomName] = useState<string | null>(
    null
  );

  const handleJitsiReady = async (api: any) => {
    jitsiApiRef.current = api;

    const randomSuffix = generateRandomString(6);
    const baseRoomName = meeting?.classroom_name
      ? meeting.classroom_name.replace(/\s+/g, "-")
      : `liveclass-${meetingId}`;
    const uniqueRoomName = `${baseRoomName}-${randomSuffix}`;
    setJitsiLiveRoomName(uniqueRoomName);

    const fullMeetingUrl = `https://${JITSI_DOMAIN}/${uniqueRoomName}`;

    if (meetingId) {
      try {
        await updateLiveClassMeetingUrl(parseInt(meetingId), fullMeetingUrl);
        console.log(
          "Meeting URL successfully updated in the database:",
          fullMeetingUrl
        );
      } catch (apiError: any) {
        console.error("Failed to update meeting URL in DB:", apiError.message);
      }
    }

    api.addEventListener("videoConferenceJoined", () => {
      console.log(
        "Video conference joined! Setting meeting active and starting speech recognition."
      );
      setIsMeetingActive(true);
      startSpeechRecognition();
    });

    api.addEventListener("readyToClose", () => {
      console.log("Jitsi readyToClose event received on frontend.");
      handleMeetingEnd();
    });

    api.addEventListener("hangup", () => {
      console.log("Jitsi hangup event received on frontend.");
      handleMeetingEnd();
    });

    return () => {
      console.log(
        "Jitsi Meeting component unmounting or API changing. Initiating cleanup."
      );
      if (jitsiApiRef.current) {
        try {
          jitsiApiRef.current.dispose();
          console.log("Jitsi API instance disposed from onApiReady cleanup.");
        } catch (e) {
          console.warn("Error disposing Jitsi API during cleanup:", e);
        }
        jitsiApiRef.current = null;
      }
      stopSpeechRecognition();
      setIsMeetingActive(false);
      setJitsiLiveRoomName(null);
    };
  };

  const displayedTranscript = speechTranscript + interimSpeechTranscript;

  const displayRoomName = meeting?.classroom_name
    ? meeting.classroom_name.replace(/\s+/g, "-")
    : `liveclass-${meetingId}`;

  const studentShareUrl = `${window.location.origin}/student/meeting-view?meetingId=${meetingId}`;

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(studentShareUrl)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Loading Meeting...
        </h2>
        <Skeleton className="w-full max-w-4xl h-[600px] rounded-lg" />
        <p className="text-gray-600 mt-4">Preparing your virtual classroom.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-50 p-4">
        <div className="text-center text-red-700 bg-red-100 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Error!</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="flex flex-col md:flex-row items-center md:justify-between w-full max-w-4xl mb-6">
        <h1 className="text-2xl md:text-3xl lg:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          {displayRoomName} Liveclass
        </h1>
        <Button
          onClick={handleCopyLink}
          variant={"outlined"}
          className="px-4 py-2 bg-gray-200 text-white rounded-full  border border-gray-500 transition-colors text-sm md:text-base"
        >
          Copy Meeting Link
        </Button>
      </div>
      <div className="w-full max-w-4xl h-[600px] bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
        {meeting && meetingId && displayRoomName && (
          <JitsiMeeting
            roomName={displayRoomName}
            domain={JITSI_DOMAIN}
            configOverwrite={{
              disableLocalVideoFlip: true,
              backgroundAlpha: 0.5,
              startWithAudioMuted: false,
              startWithVideoMuted: false,
            }}
            interfaceConfigOverwrite={{
              VIDEO_LAYOUT_FIT: "nocrop",
              MOBILE_APP_PROMO: false,
              TILE_VIEW_MAX_COLUMNS: 4,
              TOOLBAR_BUTTONS: [
                "microphone",
                "camera",
                "closedcaptions",
                "desktop",
                "fullscreen",
                "fodeviceselection",
                "hangup",
                "profile",
                "chat",
                "recording",
                "livestreaming",
                "etherpad",
                "sharedvideo",
                "settings",
                "raisehand",
                "videoquality",
                "filmstrip",
                "feedback",
                "stats",
                "shortcuts",
                "tileview",
                "videobackgroundblur",
                "download",
                "help",
                "mute-everyone",
                "security",
              ],
            }}
            onApiReady={handleJitsiReady}
            getIFrameRef={(iframeRef) => {
              if (iframeRef) {
                iframeRef.style.width = "100%";
                iframeRef.style.height = "100%";
              }
            }}
          />
        )}
      </div>
      <p className="text-gray-600 mt-4 text-center">
        Your meeting is live. Ensure your microphone and camera are enabled.
      </p>

      <div className="mt-4 p-3 rounded-lg text-sm font-medium">
        <p className="text-gray-700">
          Speech Recording Status: {isRecording ? "Recording..." : "Stopped"}
        </p>
      </div>
      {(displayedTranscript.length > 0 || isRecording) && (
        <div className="mt-8 w-full max-w-4xl bg-white p-6 rounded-lg shadow-xl border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Live Speech Transcript
          </h2>
          <div className="h-48 overflow-y-auto border border-gray-300 p-3 rounded-md bg-gray-50">
            <p className="text-sm text-gray-700">
              {displayedTranscript}
              {isRecording && !interimSpeechTranscript && (
                <span className="animate-pulse text-gray-500">_</span>
              )}{" "}
            </p>
          </div>
        </div>
      )}

      {copySuccess && (
        <motion.div
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-purple-300 text-white py-2 px-4 rounded-md shadow-lg z-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          Meeting link copied!
        </motion.div>
      )}
    </div>
  );
};

export default JitsiMeetingPage;
