import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Skeleton } from "../../../components/ui/Skeleton";
import { JaaSMeeting, JitsiMeeting } from "@jitsi/react-sdk";
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

  const fullTranscriptRef = useRef<string>("");

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
        if (
          data &&
          data.data &&
          Array.isArray(data.data) &&
          data.data.length > 0
        ) {
          setMeeting(data.data[0]);
        } else if (data && !Array.isArray(data.data)) {
          setMeeting(data);
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
    };
  }, [meetingId]);

  const startSpeechRecognition = useCallback(() => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    if (recognitionRef.current && isRecording) {
      console.log("Speech recognition already running.");
      return;
    }

    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;
    const recognition: SpeechRecognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onstart = () => {
      setIsRecording(true);
      console.log("Speech recognition started.");
    };

    recognition.onend = () => {
      setIsRecording(false);
      console.log(
        "Speech recognition ended. Attempting to restart if meeting is active."
      );
      if (jitsiApiRef.current) {
        setTimeout(() => {
          if (jitsiApiRef.current) {
            startSpeechRecognition();
          }
        }, 1000);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error, event.message);
      setIsRecording(false);
      if (event.error === "not-allowed") {
        setError(
          "Microphone access denied. Please allow microphone access for speech recognition."
        );
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
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
  }, [isRecording, jitsiApiRef]);
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

    stopSpeechRecognition();
    const finalTranscriptToSend = fullTranscriptRef.current;
    console.log("Final Transcript to Send:", finalTranscriptToSend);
    console.log("Meeting ID:", meetingId);

    if (finalTranscriptToSend && meetingId) {
      await sendTranscriptToBackend(finalTranscriptToSend.trim(), meetingId);
    }

    setTimeout(() => {
      navigate(`/dashboard/liveclass/details/${meetingId}`);
    }, 2000);
  }, [meetingId, navigate, sendTranscriptToBackend, stopSpeechRecognition]);

  const handleJitsiReady = async (api: any) => {
    jitsiApiRef.current = api;
    const roomName = meeting?.classroom_name
      ? meeting.classroom_name.replace(/\s+/g, "-")
      : meetingId;
    const fullMeetingUrl = `https://${JITSI_DOMAIN}/${roomName}`;

    if (meetingId) {
      try {
        await updateLiveClassMeetingUrl(parseInt(meetingId), fullMeetingUrl);
        console.log("Meeting URL successfully updated in the database.");
      } catch (apiError: any) {
        console.error("Failed to update meeting URL in DB:", apiError.message);
      }
    }

    api.addEventListener("videoConferenceJoined", () => {
      console.log("Video conference joined! Starting speech recognition.");
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
      if (jitsiApiRef.current) {
        console.log("Disposing of Jitsi API instance.");
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }
      stopSpeechRecognition();
    };
  };

  const displayedTranscript = speechTranscript + interimSpeechTranscript;
  const jitsiRoomName = meeting?.classroom_name
    ? meeting.classroom_name.replace(/\s+/g, "-")
    : meetingId;

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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {jitsiRoomName} Liveclass
      </h1>
      <div className="w-full max-w-4xl h-[600px] bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
        {meeting && meetingId && jitsiRoomName && (
          <JitsiMeeting
            roomName={jitsiRoomName}
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
    </div>
  );
};

export default JitsiMeetingPage;
