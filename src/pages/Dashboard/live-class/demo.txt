import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Skeleton } from "../../../components/ui/Skeleton";
import { JaaSMeeting } from "@jitsi/react-sdk";
import { updateLiveClassMeetingUrl } from "../../../api/liveclass";

const JITSI_DOMAIN = "8x8.vc";
const APP_ID = "vpaas-magic-cookie-e64e5f39d0264ee28720dfbfe8003553";
const BACKEND_AGENT_SERVER_URL = "https://meet.aiteacha.com";

const JITSI_JWT =
  "eyJhbGciOiJSUzI1NiIsImtpZCI6InZwYWFzLW1hZ2ljLWNvb2tpZS1lNjRlNWYzOWQwMjY0ZWUyODcyMGRmYmZlODAwMzU1My80ODQ2ZDUiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJqaXRzaSIsImNvbnRleHQiOnsidXNlciI6eyJpZCI6IjBmOGI3NzYwLWMxN2YtNGExMi1iMTM0LWM2YWMzNzE2NzE0NCIsIm5hbWUiOiJubHBnYSBhZG1pbiIsImF2YXRhciI6Imh0dHBzOi8vd3d3LmFwaS5uaWdlcmlhbHBnYXMuY29tL3N0b3JhZ2UvYXBwL3B1YmxpYy9maWxldXBsb2FkL2xvZ28ucG5nIiwiZW1haWwiOiJuaWdlcmlhbHBnYUBnbWFpbC5jb20iLCJtb2RlcmF0b3IiOiJ0cnVlIn0sImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOiJ0cnVlIiwib3V0Ym91bmQtY2FsbCI6InRydWUiLCJ0cmFuc2NyaXB0aW9uIjoiZmFsc2UiLCJyZWNvcmRpbmciOiJ0cnVlIn0sInJvb20iOnsicmVnZXgiOmZhbHNlfX0sImV4cCI6MjAzMDM4MjcwMSwiaXNzIjoiY2hhdCIsIm5iZiI6MTcxNDg0OTkwMSwicm9vbSI6IioiLCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtZTY0ZTVmMzlkMDI2NGVlMjg3MjBkZmJmZTgwMDM1NTMifQ.cGVSL8VyZxl4600UxoDW3kTAyLs9jTAWX1Fa63rptwHjYvXOmoHW6YqGsUHxniH20Tp_XBe8n3xryKhXoFzFkbCOOxmAB2uBIS4AuXLToz5LwZVxxwwh8W_IX6ZF6XQCVi0ZL2BEobQ1gNBDx58zNsu1xM3bICSkSxL9kg365-TbTW2RCY8Sna81YM4s_S9W6iUYOv8ZXWWH6EZaXlD-4iGNqmFVlc9myDpZEXtTt0PWAy2gpBKtkYYa9kosrDEQwIf0vWewht0JhNvhzQGL_iZU6qYuA7dL654vHPivUZVjh8-QJ1zc5zxKKLOKIN1c_2RhKq7-OmCUPLGR6iPL5g";

const JitsiMeetingPage = () => {
  const navigate = useNavigate();
  const { meetingId } = useParams<{ meetingId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const jitsiApiRef = useRef<any>(null);
  const [chatTranscript, setChatTranscript] = useState<string[]>([]);
  const [agentTriggered, setAgentTriggered] = useState(false);
  const [agentStatus, setAgentStatus] = useState<
    "idle" | "triggering" | "running" | "ended" | "error"
  >("idle");

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
    setAgentStatus("ended");

    try {
      const response = await fetch(
        `${BACKEND_AGENT_SERVER_URL}/api/meeting-ended`,
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
    } finally {
      setTimeout(() => {
        navigate(`/dashboard/liveclass/details/${meetingId}`);
      }, 2000);
    }
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
      console.log("Video conference joined!");
      if (fullMeetingUrl && !agentTriggered) {
        triggerJitsiAgent(fullMeetingUrl, `AiTeacha Agent`);
      }
    });

    api.addEventListener("readyToClose", () => {
      console.log("Jitsi readyToClose event received on frontend.");
      handleMeetingEnd();
    });

    api.addEventListener("hangup", () => {
      console.log("Jitsi hangup event received on frontend.");
      handleMeetingEnd();
    });

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

    return () => {
      if (jitsiApiRef.current) {
        console.log("Disposing of Jitsi API instance.");
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }
    };
  };

  const triggerJitsiAgent = async (
    meetingUrl: string,
    agentDisplayName: string
  ) => {
    setAgentStatus("triggering");
    try {
      console.log(
        `Attempting to trigger Jitsi agent via backend for URL: ${meetingUrl}`
      );
      const response = await fetch(
        `${BACKEND_AGENT_SERVER_URL}/start-jitsi-agent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            meetingUrl: meetingUrl,
            displayName: agentDisplayName,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Jitsi agent successfully triggered:", data.message);
        setAgentTriggered(true);
        setAgentStatus("running");
      } else {
        console.error(
          "Failed to trigger Jitsi agent:",
          data.error || response.statusText
        );
        setAgentStatus("error");
      }
    } catch (fetchError: any) {
      console.error(
        "Network error when trying to trigger Jitsi agent:",
        fetchError
      );
      setAgentStatus("error");
    }
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

      <div className="mt-4 p-3 rounded-lg text-sm font-medium">
        {agentStatus === "idle" && (
          <p className="text-gray-700">Agent Status: Idle</p>
        )}
        {agentStatus === "triggering" && (
          <p className="text-blue-600">Agent Status: Triggering...</p>
        )}
        {agentStatus === "running" && (
          <p className="text-green-600">Agent Status: Running</p>
        )}
        {agentStatus === "ended" && (
          <p className="text-purple-600">Agent Status: Ended</p>
        )}
        {agentStatus === "error" && (
          <p className="text-red-600">Agent Status: Error starting</p>
        )}
      </div>

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
