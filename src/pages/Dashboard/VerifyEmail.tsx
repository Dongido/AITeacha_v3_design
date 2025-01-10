import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { sendCode, verifyEmail } from "../../api/auth";
import { Skeleton } from "../../components/ui/Skeleton";
import {
  Toast,
  ToastProvider,
  ToastViewport,
  ToastTitle,
  ToastDescription,
} from "../../components/ui/Toast";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState<any>(null);
  const [token, setToken] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
    "default"
  );

  useEffect(() => {
    const userDetailsFromStorage = localStorage.getItem("ai-teacha-user");

    if (userDetailsFromStorage) {
      const parsedDetails = JSON.parse(userDetailsFromStorage);
      setUserDetails(parsedDetails);
      setIsEmailVerified(parsedDetails.isEmailVerified);
    }

    const countdown = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(countdown);
          setCanResend(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const sendVerificationCode = async () => {
    if (!userDetails?.email) {
      setToastMessage("Email is missing.");
      setToastVariant("destructive");
      setToastOpen(true);
      return;
    }

    setIsSendingCode(true);

    try {
      await sendCode(userDetails.email);
      setTimer(30);
      setTimeout(() => {
        const countdown = setInterval(() => {
          setTimer((prevTime) => {
            if (prevTime <= 1) {
              clearInterval(countdown);
              setCanResend(true);
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);

        return () => {
          clearInterval(countdown);
        };
      }, 1000);

      setToastMessage("Verification code has been sent!");
      setToastVariant("default");
      setToastOpen(true);
      setCanResend(false);
      setTimer(30);
    } catch (error: any) {
      setToastMessage(error.message || "Failed to send verification code.");
      setToastVariant("destructive");
      setToastOpen(true);
    } finally {
      setIsSendingCode(false);
    }
  };

  useEffect(() => {
    if (userDetails && userDetails.email && !isEmailVerified) {
      sendVerificationCode();
    }
  }, [userDetails, isEmailVerified]);

  const handleSendCode = async () => {
    if (!userDetails?.email) {
      setToastMessage("Email is missing.");
      setToastVariant("destructive");
      setToastOpen(true);
      return;
    }

    setTimer(30);
    setCanResend(false);
    sendVerificationCode();
  };

  const handleVerify = async () => {
    if (!token || !userDetails?.email) {
      setToastMessage("Please enter the verification code.");
      setToastVariant("destructive");
      setToastOpen(true);
      return;
    }

    setIsVerifyingCode(true);

    try {
      const response = await verifyEmail(userDetails.email, token);

      setToastMessage(response.message || "Verification code has been sent!");
      setToastVariant("default");
      setToastOpen(true);

      if (response.status == "success") {
        const updatedUserDetails = { ...userDetails, is_email_verified: 1 };
        localStorage.setItem(
          "ai-teacha-user",
          JSON.stringify(updatedUserDetails)
        );

        setIsEmailVerified(true);

        navigate("/dashboard/home");

        window.location.reload();
      }
    } catch (error) {
      setToastMessage("Verification failed. Please try again.");
      setToastVariant("destructive");
      setToastOpen(true);
    } finally {
      setIsVerifyingCode(false);
    }
  };

  if (isEmailVerified) {
    return <div>Your email has been verified!</div>;
  }

  return (
    <ToastProvider swipeDirection="right">
      <div className="max-w-md mx-auto mt-10">
        <h2 className="text-xl font-bold">Verify Your Email</h2>

        <div className="mt-4">
          <div>
            <Label>Verification Code</Label>
            <Input
              type="text"
              placeholder="Enter your verification code"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <Button
            onClick={handleVerify}
            disabled={isVerifyingCode}
            className="bg-primary text-white rounded-full"
          >
            {isVerifyingCode ? "Verifying..." : "Verify Code"}
          </Button>

          <div className="text-sm">
            <span>
              Resend code in {timer} seconds
              {canResend && (
                <Button
                  onClick={handleSendCode}
                  disabled={isSendingCode}
                  className="ml-2 text-primary"
                >
                  Resend Code
                </Button>
              )}
            </span>
          </div>
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
};

export default VerifyEmail;
