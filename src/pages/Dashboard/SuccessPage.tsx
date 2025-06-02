import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

const SuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const paymentStatus = queryParams.get("status");

    if (
      paymentStatus === "success" ||
      paymentStatus === "completed" ||
      paymentStatus === "successful"
    ) {
      const timer = setTimeout(() => {
        navigate("/dashboard");
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      navigate("/upgrade");
    }
  }, [navigate, location]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Your plan has been upgraded successfully. You will be redirected
          shortly.
        </p>
        <p className="text-sm text-gray-500">
          If you are not redirected, please click{" "}
          <button
            onClick={() => navigate("/dashboard")}
            className="text-blue-600 hover:underline"
          >
            here
          </button>{" "}
          to go to your dashboard.
        </p>
      </div>
    </div>
  );
};

export default SuccessPage;
