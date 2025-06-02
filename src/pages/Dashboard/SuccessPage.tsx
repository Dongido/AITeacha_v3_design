import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle2, XCircle, Ban } from "lucide-react";

const SuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get("status");
    setPaymentStatus(status);

    let redirectPath = "/upgrade";

    if (
      status === "success" ||
      status === "completed" ||
      status === "successful"
    ) {
      redirectPath = "/dashboard";
    }

    const timer = setTimeout(() => {
      navigate(redirectPath);
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, location]);

  let title = "Payment Status";
  let message = "Processing your request...";
  let icon = null;
  let iconColorClass = "text-gray-500";
  let redirectToText = "dashboard";

  if (
    paymentStatus === "success" ||
    paymentStatus === "completed" ||
    paymentStatus === "successful"
  ) {
    title = "Payment Successful!";
    message =
      "Your plan has been upgraded successfully. You will be redirected shortly.";
    icon = <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />;
    iconColorClass = "text-green-500";
    redirectToText = "dashboard";
  } else if (paymentStatus === "failed") {
    title = "Payment Failed!";
    message =
      "Unfortunately, your payment could not be processed. Please try again or contact support.";
    icon = <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />;
    iconColorClass = "text-red-500";
    redirectToText = "upgrade";
  } else if (paymentStatus === "closed") {
    title = "Payment Cancelled!";
    message =
      "The payment process was cancelled. You can try again to upgrade your plan.";
    icon = <Ban className="w-20 h-20 text-yellow-500 mx-auto mb-4" />;
    iconColorClass = "text-yellow-500";
    redirectToText = "upgrade";
  } else {
    title = "Processing Payment...";
    message = "Please wait while we confirm your payment status.";
    icon = (
      <CheckCircle2 className="w-20 h-20 text-gray-500 mx-auto mb-4 animate-pulse" />
    );
    iconColorClass = "text-gray-500";
    redirectToText = "upgrade";
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        {icon}
        <h1 className={`text-3xl font-bold ${iconColorClass} mb-2`}>{title}</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        <p className="text-sm text-gray-500">
          If you are not redirected, please click{" "}
          <button
            onClick={() => navigate(`/${redirectToText}`)}
            className="text-blue-600 hover:underline"
          >
            here
          </button>{" "}
          to go to your {redirectToText}.
        </p>
      </div>
    </div>
  );
};

export default SuccessPage;
