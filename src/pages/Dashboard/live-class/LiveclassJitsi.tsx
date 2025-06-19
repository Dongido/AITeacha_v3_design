import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Skeleton } from "../../../components/ui/Skeleton";
import { JaaSMeeting } from "@jitsi/react-sdk";
import { updateLiveClassMeetingUrl } from "../../../api/liveclass";
import axios from "axios";
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

const JITSI_DOMAIN = "8x8.vc";
const APP_ID = "vpaas-magic-cookie-ca24806932244ad4920f362f4487ca67";
const EXTERNAL_TRANSCRIPT_API_ENDPOINT =
  "https://vd.aiteacha.com/api/live/class/add/transcript";

const JITSI_JWT =
  "eyJraWQiOiJ2cGFhcy1tYWdpYy1jb29raWUtY2EyNDgwNjkzMjI0NGFkNDkyMGYzNjJmNDQ4N2NhNjcvMDlmMDE2LVNBTVBMRV9BUFAiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6ImNoYXQiLCJpYXQiOjE3NTAzMzYzMTcsImV4cCI6MTc1MDM0MzUxNywibmJmIjoxNzUwMzM2MzEyLCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtY2EyNDgwNjkzMjI0NGFkNDkyMGYzNjJmNDQ4N2NhNjciLCJjb250ZXh0Ijp7ImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOnRydWUsIm91dGJvdW5kLWNhbGwiOnRydWUsInNpcC1vdXRib3VuZC1jYWxsIjpmYWxzZSwidHJhbnNjcmlwdGlvbiI6dHJ1ZSwicmVjb3JkaW5nIjp0cnVlLCJmbGlwIjpmYWxzZX0sInVzZXIiOnsiaGlkZGVuLWZyb20tcmVjb3JkZXItdHJ1ZSwibW9kZXJhdG9yIjp0cnVlLCJuYW1lIjoiY2h1a3d1bWFzYW11ZWwzNzEiLCJpZCI6Imdvb2dsZS1vYXV0aDJ8MTEzOTg2MzM0ODUzOTU4OTM1MzY3IiwiYXZhdGFyIjoiIiwiZW1haWwiOiJjaHVrd3VtYXNhbXVlbDM3MUBnbWFpbC5jb20ifX0sInJvb20iOiIqIn0.Sxc9AWp_QAz-j6mariXAh9UUlj5zSoJH92KBI_tAmKdKIOID0Ydtz6xmIGFw-yyycuymAFlnB_PoEMMYdWZiRubJ0OGAvbfv_QImPT4yCxhOUs3O69ezSbNfki0FTG48K-bB-T8MHzSdXLWnawFDnQcpuB50QnJWKte9w9T_V5ySa1XNYjwnrUZ4gSCpOZG7kHhf0KtlwR7Kw-KtIcGGnmFTgfWdvSdxFVcJggWbvT5YYR9NAsfda8-fTGS9fcQ7tv53ldz46HbgJtlCYsx5HIFTZnlxPe6nP7qf6WBddb79xh8UHjEDRZ9JSJ6VcFvik17K_JZPxxJqD4-8P6EWaw";

const JitsiMeetingPage = () => {
  const navigate = useNavigate();
  const { meetingId } = useParams<{ meetingId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const jitsiApiRef = useRef<any>(null);

  const speechRecognitionRef = useRef<any>(null);
  const [userSpeechTranscript, setUserSpeechTranscript] = useState<string>("");
  const [isRecognitionActive, setIsRecognitionActive] = useState(false);
  const lastTranscriptTime = useRef<number>(0);
  const INACTIVITY_THRESHOLD = 5000;
  const [chatTranscript, setChatTranscript] = useState<string[]>([]);

  const startSpeechRecognition = async () => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      console.error(
        "BROWSER CONSOLE: Your browser does not support Speech Recognition."
      );
      setError("Speech recognition not supported in this browser.");
      return;
    }

    try {
      const SpeechRecognition =
        window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.continuous = true;
      recognition.onstart = () => {
        console.log("BROWSER CONSOLE: Speech Recognition: Started.");
        setIsRecognitionActive(true);
      };

      recognition.onend = () => {
        console.log(
          "BROWSER CONSOLE: Speech Recognition: Ended. Restarting for continuous listening..."
        );
        if (isRecognitionActive) {
          recognition.start();
        }
      };

      recognition.onerror = (event: any) => {
        console.error(
          "BROWSER CONSOLE: Speech Recognition Error:",
          event.error
        );
        if (
          event.error === "not-allowed" ||
          event.error === "permission-denied"
        ) {
          setError(
            "Microphone permission denied for speech recognition. Please enable it in browser settings."
          );
          setIsRecognitionActive(false);
          recognition.stop();
        } else if (isRecognitionActive) {
          console.warn(
            "BROWSER CONSOLE: Speech Recognition: Attempting to restart on error..."
          );
          recognition.start();
        }
      };

      recognition.onresult = (event: any) => {
        let finalTranscriptSegment = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscriptSegment += event.results[i][0].transcript;
          }
        }

        if (finalTranscriptSegment.trim().length > 0) {
          setUserSpeechTranscript((prevFullTranscript) => {
            const currentTime = Date.now();
            const newSegment = finalTranscriptSegment.trim();
            let updatedTranscript = prevFullTranscript;

            // Add punctuation based on inactivity, similar to the backend agent
            if (
              updatedTranscript.length > 0 &&
              currentTime - lastTranscriptTime.current > INACTIVITY_THRESHOLD
            ) {
              if (
                !updatedTranscript.endsWith(".") &&
                !updatedTranscript.endsWith("?") &&
                !updatedTranscript.endsWith("!")
              ) {
                updatedTranscript += ". ";
              } else {
                updatedTranscript += " ";
              }
            } else if (updatedTranscript.length > 0) {
              updatedTranscript += " ";
            }
            updatedTranscript += newSegment;
            lastTranscriptTime.current = currentTime; // Update ref

            console.log(`Frontend Speech: ${updatedTranscript}`);
            return updatedTranscript;
          });
        }
      };

      speechRecognitionRef.current = recognition; // Store the recognition object in a ref
      recognition.start();
      console.log("Speech recognition process initialized and started.");
    } catch (err) {
      console.error("Failed to start Speech Recognition:", err);
      setError("Failed to start speech recognition. " + err);
      setIsRecognitionActive(false);
    }
  };

  const stopSpeechRecognition = () => {
    console.log("BROWSER CONSOLE: Speech Recognition: Stopping.");
    setIsRecognitionActive(false); // Set flag to prevent restart
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
      speechRecognitionRef.current = null;
    }
  };
  // --- End Speech Recognition Functions ---

  useEffect(() => {
    if (!meetingId) {
      setError("Meeting code is missing. Cannot start Jitsi meeting.");
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [meetingId]);

  const handleMeetingEnd = async () => {
    console.log("Frontend: Meeting ending sequence initiated.");
    stopSpeechRecognition(); // Stop speech recognition immediately

    // Send user's speech transcript
    if (userSpeechTranscript.trim().length > 0) {
      const transcriptData = {
        liveclassroom_id: meetingId,
        transcript: userSpeechTranscript.trim(),
      };

      console.log(
        `Frontend: Sending user speech transcript to ${EXTERNAL_TRANSCRIPT_API_ENDPOINT}`
      );
      try {
        const response = await axios.post(
          EXTERNAL_TRANSCRIPT_API_ENDPOINT,
          transcriptData
        );

        if (response.status === 200 || response.status === 201) {
          console.log(
            "Frontend: User speech transcript sent successfully to external API!"
          );
        } else {
          console.error(
            `Frontend: Failed to send user speech transcript to external API. Status: ${response.status}, Message: ${response.data}`
          );
        }
      } catch (axiosError: any) {
        console.error(
          "Frontend: Error sending user speech transcript to external API:",
          axiosError.message
        );
      }
    } else {
      console.log("Frontend: No user speech transcript to send.");
    }

    // You might still want to notify a backend of the meeting end,
    // if that backend does other things (like stopping the *previous* agent).
    // For now, removing the agent specific notification as per request.
    // However, if the old agent is still running, it needs to be stopped.
    // The previous implementation had a specific endpoint for this:
    /*
    try {
      const response = await fetch(
        `${BACKEND_AGENT_SERVER_URL}/api/meeting-ended`, // Removed BACKEND_AGENT_SERVER_URL constant
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ meetingId }),
        }
      );
      if (response.ok) {
        console.log("Frontend: Backend successfully notified of meeting end.");
      } else {
        console.error(
          "Frontend: Failed to notify backend of meeting end:",
          await response.text()
        );
      }
    } catch (error) {
      console.error(
        "Frontend: Network error notifying backend of meeting end:",
        error
      );
    }
    */

    setTimeout(() => {
      navigate(`/dashboard/liveclass/details/${meetingId}`);
    }, 2000);
  };

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
      console.log("Video conference joined! Starting user speech recognition.");
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

    // Still handle chat messages if you want to display them or save them separately
    api.addEventListener(
      "incomingMessage",
      (message: { from: string; message: string; privateMessage: boolean }) => {
        const timestamp = new Date().toLocaleTimeString();
        const sender = message.from;
        const text = message.message;
        const isPrivate = message.privateMessage ? "[PRIVATE] " : "";
        const fullMessage = `${timestamp} - ${isPrivate}${sender}: ${text}`;
        console.log("Incoming Chat Message:", fullMessage);
        setChatTranscript((prevTranscript) => [...prevTranscript, fullMessage]);
      }
    );

    // Cleanup when component unmounts
    return () => {
      console.log("JitsiMeetingPage unmounting.");
      stopSpeechRecognition(); // Ensure recognition is stopped on unmount
      if (jitsiApiRef.current) {
        console.log("Disposing of Jitsi API instance.");
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }
    };
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
      {userSpeechTranscript.length > 0 && (
        <div className="mt-4 w-full max-w-4xl bg-white p-6 rounded-lg shadow-xl border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Your Spoken Transcript
          </h2>
          <div className="h-48 overflow-y-auto border border-gray-300 p-3 rounded-md bg-gray-50">
            <p className="text-sm text-gray-700">{userSpeechTranscript}</p>
          </div>
        </div>
      )}

      {chatTranscript.length > 0 && (
        <div className="mt-8 w-full max-w-4xl bg-white p-6 rounded-lg shadow-xl border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Chat Transcript
          </h2>
          <div className="h-48 overflow-y-auto border border-gray-300 p-3 rounded-md bg-gray-50">
            {chatTranscript.map((msg, index) => (
              <p key={index} className="text-sm text-gray-700 mb-1">
                {msg}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JitsiMeetingPage;
