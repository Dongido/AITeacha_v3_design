import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { CheckCircle, XCircle, Clock, Info } from "lucide-react";

const PaymentStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [icon, setIcon] = useState<JSX.Element | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get("status");
    const sessionId = params.get("session_id");

    setPaymentStatus(status);

    switch (status) {
      case "success":
        setMessage("Payment successful! Your plan has been updated.");
        setIcon(<CheckCircle className="h-16 w-16 text-green-500" />);
        if (sessionId) {
          console.log(`Stripe Session ID: ${sessionId}`);
        }
        break;
      case "failed":
        setMessage("Payment failed. Please try again or contact support.");
        setIcon(<XCircle className="h-16 w-16 text-red-500" />);
        break;
      case "cancelled":
        setMessage("Payment cancelled. You can try again at any time.");
        setIcon(<XCircle className="h-16 w-16 text-gray-500" />);
        break;
      case "closed":
        setMessage("Payment process was closed. You can try again.");
        setIcon(<Info className="h-16 w-16 text-blue-500" />);
        break;
      case "pending-stripe":
        setMessage(
          "Redirecting you to Stripe for payment. Please complete the transaction there."
        );
        setIcon(<Clock className="h-16 w-16 text-blue-500" />);
        break;
      case "pending-flutterwave":
        setMessage(
          "Processing Flutterwave payment. Your transaction is being confirmed."
        );
        setIcon(<Clock className="h-16 w-16 text-blue-500" />);
        break;
      case "unknown":
        setMessage(
          "An unexpected issue occurred with your payment. Please check your dashboard or contact support."
        );
        setIcon(<Info className="h-16 w-16 text-orange-500" />);
        break;
      default:
        setMessage(
          "Invalid payment status. Please try again or contact support."
        );
        setIcon(<Info className="h-16 w-16 text-gray-500" />);
        break;
    }
  }, [location.search]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 text-center shadow-lg">
        <div className="flex flex-col items-center">
          {icon}
          <div className="text-3xl font-bold mt-4">Payment Status</div>
        </div>
        <div>
          <p className="text-lg text-gray-700 mb-6">{message}</p>
          {paymentStatus === "success" && (
            <p className="text-md text-gray-600">
              Your dashboard should reflect the changes shortly.
            </p>
          )}
          <Button
            onClick={() => navigate("/dashboard")}
            className="mt-8 bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-md text-lg"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;
