import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Skeleton } from "../../../components/ui/Skeleton";
const AuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Processing authentication...");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");

    if (code) {
      console.log("Authorization Code received:", code);
      setMessage(
        "Authentication successful! Redirecting to live class creation..."
      );
      navigate(`/dashboard/liveclass/create?code=${code}`);
    } else {
      console.error("Authorization code not found in URL.");
      setMessage("Authentication failed: No authorization code received.");
    }
    setLoading(false);
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        {loading ? (
          <>
            <Skeleton className="h-8 w-64 mb-4 mx-auto" />
            <Skeleton className="h-6 w-48 mx-auto" />
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {message.includes("successful") ? "Success!" : "Error!"}
            </h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
