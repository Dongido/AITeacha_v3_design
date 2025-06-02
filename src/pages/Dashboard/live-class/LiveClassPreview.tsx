import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface GoogleMeetLinkProps {
  meetingName?: string;
}

const GoogleMeetLink: React.FC<GoogleMeetLinkProps> = ({
  meetingName = "Your Live Class Meeting",
}) => {
  const location = useLocation();
  const [currentMeetingUri, setCurrentMeetingUri] = useState<string | null>(
    null
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    let uriFromQuery = params.get("code");

    if (uriFromQuery && !uriFromQuery.startsWith("https://meet.google.com/")) {
      uriFromQuery = `https://meet.google.com/${uriFromQuery}`;
    }

    setCurrentMeetingUri(uriFromQuery);
    console.log("Current Meeting URI:", uriFromQuery);
  }, [location.search]);

  if (!currentMeetingUri) {
    return (
      <div className="flex justify-center items-center h-full min-h-[300px] bg-gray-100 rounded-lg text-gray-600">
        <p>No Google Meet URL provided in query parameters.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full p-4 mt-12 text-center">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
        🚀 {meetingName}
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
        Your interactive session is ready!
      </p>
      <a
        href={currentMeetingUri}
        target="_blank" // Opens in a new tab
        rel="noopener noreferrer" // Security best practice
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Join Google Meet Now
        <svg
          className="ml-3 -mr-1 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10.293 15.707a1 1 0 010-1.414L13.586 11H3a1 1 0 110-2h10.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </a>
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        (This will open in a new tab)
      </p>
    </div>
  );
};

export default GoogleMeetLink;
