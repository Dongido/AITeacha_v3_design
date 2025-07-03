import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { JitsiMeetExternalApi } from "@jitsi/react-sdk/lib/types";

const JitsiStudentMeeting: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [meetingUrl, setMeetingUrl] = useState<string>("");

  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    const userDetailsFromStorage = localStorage.getItem("ai-teacha-user");
    if (userDetailsFromStorage) {
      const parsedDetails = JSON.parse(userDetailsFromStorage);
      setUserDetails(parsedDetails);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlParam = params.get("url");

    if (urlParam) {
      try {
        const decodedUrl = decodeURIComponent(urlParam);
        console.log("Decoded Jitsi URL:", decodedUrl);
        const url = new URL(decodedUrl);
        if (url.port !== "8443") {
          url.port = "8443";
        }
        const normalizedUrl = url.toString();
        console.log("Normalized Jitsi URL with port:", normalizedUrl);
        setMeetingUrl(normalizedUrl);
      } catch (e) {
        console.error("Error decoding URL parameter:", e);
        setError("Invalid URL format provided.");
      }
    } else {
      setError(
        "No meeting URL provided. Please provide a URL in the format: /student-view?url=ENCODED_LINK"
      );
    }
  }, [location.search]);

  useEffect(() => {
    const loadScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.JitsiMeetExternalAPI) {
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.src = "https://meet.aiteacha.com:8443/external_api.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Jitsi API"));
        document.body.appendChild(script);
      });
    };

    let api: any;

    if (meetingUrl && jitsiContainerRef.current) {
      loadScript()
        .then(() => {
          const url = new URL(meetingUrl);
          const domain = url.host;
          const roomName = url.pathname.split("/").pop();

          if (!roomName) {
            throw new Error("Invalid room name");
          }

          const options = {
            roomName: roomName,
            parentNode: jitsiContainerRef.current,
            userInfo: {
              displayName: userDetails.firstname,
              email: userDetails.email,
            },
          };

          api = new window.JitsiMeetExternalAPI(domain, options);

          api.addEventListener("readyToClose", () => {
            navigate("/student/class");
          });
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to load Jitsi Meet API or join the meeting.");
        });
    }

    return () => {
      if (api) {
        api.dispose?.();
      }
    };
  }, [meetingUrl]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <main className="flex-grow flex items-center justify-center p-4">
        {error ? (
          <div className="text-center text-red-700 bg-red-100 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p>{error}</p>
          </div>
        ) : (
          <div
            ref={jitsiContainerRef}
            className="w-full max-w-4xl h-[700px] bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200"
          />
        )}
      </main>
    </div>
  );
};

export default JitsiStudentMeeting;
