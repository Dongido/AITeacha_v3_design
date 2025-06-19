import React, { useEffect, useRef, useState, useCallback } from "react"; // Import useCallback
import { useParams, useNavigate } from "react-router-dom";
import { Skeleton } from "../../../components/ui/Skeleton";
import { JaaSMeeting } from "@jitsi/react-sdk";
import { updateLiveClassMeetingUrl } from "../../../api/liveclass";
import axios from "axios";
import {
  SpeechRecognition,
  SpeechRecognitionEvent,
  SpeechRecognitionResultList,
  SpeechRecognitionErrorEvent,
} from "./interface";

const JITSI_DOMAIN = "8x8.vc";
const APP_ID = "vpaas-magic-cookie-7cfdd85f7d9d411aaec362313fee83f9";
const TRANSCRIPT_API_URL =
  "https://vd.aiteacha.com/api/live/class/add/transcript";

const JITSI_JWT =
  "eyJraWQiOiJ2cGFhcy1tYWdpYy1jb29raWUtN2NmZGQ4NWY3ZDlkNDExYWFlYzM2MjMxM2ZlZTgzZjkvODUzOWZjLVNBTVBMRV9BUFAiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6ImNoYXQiLCJpYXQiOjE3NTAzNDIzMjYsImV4cCI6MTc1MDM0OTUyNiwibmJmIjoxNzUwMzQyMzIxLCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtN2NmZGQ4NWY3ZDlkNDExYWFlYzM2MjMxM2ZlZTgzZjkiLCJjb250ZXh0Ijp7ImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOnRydWUsIm91dGJvdW5kLWNhbGwiOnRydWUsInNpcC1vdXRib3VuZC1jYWxsIjpmYWxzZSwidHJhbnNjcmlwdGlvbiI6dHJ1ZSwicmVjb3JkaW5nIjp0cnVlLCJmbGlwIjpmYWxzZX0sInVzZXIiOnsiaGlkZGVuLWZyb20tcmVjb3JkZXIiOmZhbHNlLCJtb2RlcmF0b3IiOnRydWUsIm5hbWUiOiJvZmZpY2lhbHNhbTM3MSIsImlkIjoiZ29vZ2xlLW9hdXRoMnwxMDA2MTY0MTkwODU5NTU1MzcxMTgiLCJhdmF0YXIiOiIiLCJlbWFpbCI6Im9mZmljaWFsc2FtMzcxQGdtYWlsLmNvbSJ9fSwicm9vbSI6IioifQ.tnrMvUaYm_JxD9AWrMkHqLQC1AYL5oWeL-wE5U2-q_OEJ4k8EHrAWfkd2uo4LCYtDzucB_rTYt3lfAXq8zupSGCmTmCFuji5qfBBDOe5qnETK3Yu-3uIUE22RSd--4LyfBDqJ9P-QAn2Dxy3AKGavaRYIQmJk45FUrFT1cOQh0LnXCZIhArs7pHFN6EFhpAUfdtjoyMBnRf8J1a00NrXaZQXND8Gy4dp_Dnq_5BeWMD-VWwBRR0UsIsqJdY27Jkk5FNFP8DBwcTumBC-zaruLujLKEaODjP6N5NEAp_VPXfTykOR27wROYb-8zztyGBCd-JZ9WpxwQVCZPTQYN3l3A";
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

  // Use a ref to hold the latest full transcript
  const fullTranscriptRef = useRef<string>("");

  useEffect(() => {
    fullTranscriptRef.current = speechTranscript + interimSpeechTranscript;
  }, [speechTranscript, interimSpeechTranscript]);

  useEffect(() => {
    if (!meetingId) {
      setError("Meeting code is missing. Cannot start Jitsi meeting.");
      setLoading(false);
    } else {
      setLoading(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null; // Ensure cleanup
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
      // Optional: If you want to automatically restart recognition if the meeting is still active
      // and it ended unexpectedly (not by explicit stopSpeechRecognition call)
      if (jitsiApiRef.current) {
        // Check if Jitsi meeting is still active
        // Small delay before restarting to avoid rapid restarts on temporary issues
        setTimeout(() => {
          if (jitsiApiRef.current) {
            // Re-check after delay
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
      // If error, also try to stop it gracefully if it's still somehow active
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
          // Add punctuation and space if missing, to make the final transcript more readable
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
        setInterimSpeechTranscript(""); // Clear interim once a final chunk is processed
      } else {
        setInterimSpeechTranscript(currentInterimTranscript);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [isRecording, jitsiApiRef]); // Add jitsiApiRef to useCallback dependencies

  const stopSpeechRecognition = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null; // Clear the ref after stopping
      setIsRecording(false);
      console.log("Speech recognition explicitly stopped.");
    }
  }, []);

  // Updated to use Axios
  const sendTranscriptToBackend = useCallback(
    async (transcript: string, id: string) => {
      console.log("Sending transcript to backend...");
      if (!transcript.trim()) {
        console.log("Transcript is empty, not sending to backend.");
        return;
      }
      try {
        const response = await axios.post(TRANSCRIPT_API_URL, {
          meetingId: id,
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
  ); // No dependencies needed for this as it uses parameters

  const handleMeetingEnd = useCallback(async () => {
    console.log("Frontend: Meeting ending sequence initiated.");

    stopSpeechRecognition(); // Stop recognition immediately

    // Access the latest full transcript from the ref
    const finalTranscriptToSend = fullTranscriptRef.current;
    console.log("Final Transcript to Send:", finalTranscriptToSend);
    console.log("Meeting ID:", meetingId);

    if (finalTranscriptToSend && meetingId) {
      await sendTranscriptToBackend(finalTranscriptToSend.trim(), meetingId);
    }

    setTimeout(() => {
      navigate(`/dashboard/liveclass/details/${meetingId}`);
    }, 2000);
  }, [meetingId, navigate, sendTranscriptToBackend, stopSpeechRecognition]); // Add dependencies

  const handleJitsiReady = async (api: any) => {
    jitsiApiRef.current = api;
    setLoading(false);
    console.log("Jitsi Meeting is ready!", api);

    const fullMeetingUrl = `https://${JITSI_DOMAIN}/${APP_ID}/${meetingId}`;

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

    // Cleanup on unmount or before new API instance
    return () => {
      if (jitsiApiRef.current) {
        console.log("Disposing of Jitsi API instance.");
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }
      stopSpeechRecognition(); // Ensure recognition is stopped on component unmount
    };
  };

  const displayedTranscript = speechTranscript + interimSpeechTranscript;

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
        Jitsi Meeting: {meetingId}
      </h1>
      <div className="w-full max-w-4xl h-[600px] bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
        {meetingId && (
          <JaaSMeeting
            appId={APP_ID}
            roomName={meetingId}
            jwt={JITSI_JWT}
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
