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
const TRANSCRIBE_API_ENDPOINT =
  "https://vd.aiteacha.com/api/live/class/meeting/transcriber";
// "https://vd.aiteacha.com/api/live/class/meeting/transcriber";
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

  useEffect(() => {
    fullTranscriptRef.current = speechTranscript + interimSpeechTranscript;
  }, [speechTranscript, interimSpeechTranscript]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

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

  const startRecording = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Your browser does not support audio recording.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
        console.log("Data available:", event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        audioChunksRef.current = [];

        try {
          const formData = new FormData();
          formData.append("audio", audioBlob, "recording.webm");
          formData.append("liveclassroom_id", meetingId || "");

          const response = await axios.post(TRANSCRIBE_API_ENDPOINT, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (response.data && response.data.transcription) {
            setSpeechTranscript(
              (prev) => prev + " " + response.data.transcription
            );
          }
        } catch (error) {
          console.error("Error sending audio to transcription API:", error);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      console.log("Recording started");
    } catch (err: any) {
      console.error("Could not start audio recording:", err);
      alert("Could not start audio recording: " + err.message);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      console.log("Recording stopped");
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

    stopRecording();
    const finalTranscriptToSend = fullTranscriptRef.current;
    console.log("Final Transcript to Send:", finalTranscriptToSend);
    console.log("Meeting ID:", meetingId);

    if (finalTranscriptToSend && meetingId) {
      await sendTranscriptToBackend(finalTranscriptToSend.trim(), meetingId);
    }

    setTimeout(() => {
      navigate(`/dashboard/liveclass/details/${meetingId}`);
    }, 2000);
  }, [meetingId, navigate, sendTranscriptToBackend, stopRecording]);

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

  const handleJitsiReady = async (api: any) => {
    jitsiApiRef.current = api;

    const randomSuffix = generateRandomString(6);
    const roomName = meeting?.classroom_name
      ? `${meeting.classroom_name.replace(/\s+/g, "-")}-${randomSuffix}`
      : `${meetingId}-${randomSuffix}`;
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
      startRecording();
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
      startRecording();
    };
  };

  const displayedTranscript = speechTranscript + interimSpeechTranscript;
  const jitsiRoomName = meeting?.classroom_name
    ? meeting.classroom_name.replace(/\s+/g, "-")
    : meetingId;

  const currentMeetingUrl = `https://${JITSI_DOMAIN}/${jitsiRoomName}`;

  const handleCopyLink = () => {
    const encodedMeetingUrl = encodeURIComponent(currentMeetingUrl);
    const meetingUrl = `https://aiteacha.com/student/meeting-view?url=${encodedMeetingUrl}`;
    navigator.clipboard
      .writeText(meetingUrl)
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-0 lg:p-4 md:p-4">
      <div className="flex flex-col md:flex-row items-center md:justify-between w-full max-w-4xl mb-6">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          {jitsiRoomName} Liveclass
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
          Speech Recording Status:
          {isRecording ? (
            <span> 🔴 Recording...</span>
          ) : (
            <span> Not recording</span>
          )}
        </p>
      </div>

      {copySuccess && (
        <motion.div
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white py-2 px-4 rounded-md shadow-lg z-50"
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
