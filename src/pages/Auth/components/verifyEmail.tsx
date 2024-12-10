import { useState, useEffect } from "react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import { useNavigate } from "react-router-dom";
import { verifyEmail, sendCode } from "../../../api/auth";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastViewport,
} from "../../../components/ui/Toast";
import { Link } from "react-router-dom";

export function VerifyAuthEmail() {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
    "default"
  );
  const navigate = useNavigate();

  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    if (countdown === 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerify = async () => {
    if (!userEmail || !token) {
      setToastMessage("Please provide a token.");
      setToastVariant("destructive");
      setToastOpen(true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await verifyEmail(userEmail, token);
      setToastMessage(response.message);
      setToastVariant("default");
      setToastOpen(true);

      if (response.status == "success") {
        navigate("/auth/login");
      }
    } catch (error: any) {
      setToastMessage("Verification failed. Please try again.");
      setToastVariant("destructive");
      setToastOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!userEmail) {
      setToastMessage("Unable to resend code. Please try again.");
      setToastVariant("destructive");
      setToastOpen(true);
      return;
    }

    setIsSending(true);
    setCanResend(false);
    setCountdown(30);

    try {
      const response = await sendCode(userEmail);
      setToastMessage(response.message);
      setToastVariant("default");
      setToastOpen(true);
    } catch (error: any) {
      setToastMessage("Failed to resend verification code. Please try again.");
      setToastVariant("destructive");
      setToastOpen(true);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <ToastProvider swipeDirection="right">
      <div className="max-w-md mx-auto mt-10">
        <div className="mt-4">
          <div>
            <Label>Verification Code</Label>
            <Input
              type="text"
              placeholder="Enter your code"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </div>
        </div>
        <Button
          onClick={handleVerify}
          disabled={isLoading}
          className="mt-4 bg-primary text-white w-full rounded-md"
        >
          {isLoading ? "Verifying..." : "Verify Email"}
        </Button>

        <div className="mt-4 text-sm text-center">
          <p>
            {countdown > 0 ? (
              <span>Resend In: {countdown}s</span>
            ) : (
              <Button
                onClick={handleResend}
                disabled={isSending || countdown > 0}
                variant={"ghost"}
                className=" rounded-full"
              >
                {isSending ? "Resending..." : "Resend Code"}
              </Button>
            )}
          </p>

          <p className="text-xl font-bold">
            Didn't get code?{" "}
            <Link to={"/auth/login"} className="text-primary">
              Proceed to Login
            </Link>
          </p>
        </div>

        <Toast
          open={toastOpen}
          onOpenChange={setToastOpen}
          variant={toastVariant}
        >
          <ToastTitle>{toastMessage}</ToastTitle>
        </Toast>
        <ToastViewport />
      </div>
    </ToastProvider>
  );
}
