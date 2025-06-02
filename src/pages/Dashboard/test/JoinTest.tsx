import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { Button } from "../../../components/ui/Button";
import {
  Toast,
  ToastProvider,
  ToastViewport,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from "../../../components/ui/Toast";
import { joinTest, validateByCode, checkStudent } from "../../../api/test";
import { Link } from "react-router-dom";

const JoinTest = () => {
  const { id: joinCode } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [testDetails, setTestDetails] = useState<any | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isTestValid, setIsTestValid] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
    "default"
  );

  useEffect(() => {
    const fetchTestData = async () => {
      if (!joinCode) {
        setToastMessage("Test code is missing from the URL.");
        setToastVariant("destructive");
        setShowToast(true);
        setLoading(false);
        return;
      }
      try {
        const testData = await validateByCode(joinCode);
        setTestDetails(testData[0]);
        setIsTestValid(true);
      } catch (error: any) {
        setToastMessage(error.message || "Failed to validate test code.");
        setToastVariant("destructive");
        setShowToast(true);
        setIsTestValid(false);
      } finally {
        setLoading(false);
      }
    };

    fetchTestData();
  }, [joinCode]);

  const userDetails = JSON.parse(
    localStorage.getItem("ai-teacha-user") || "{}"
  );

  const handleJoinTest = async () => {
    if (!testDetails) return;

    setIsJoining(true);
    try {
      const response = await joinTest({
        join_url: testDetails.join_url,
        join_code: testDetails.join_code,
      });
      await checkStudent(testDetails.join_code);
      setToastMessage("Successfully joined the test!");
      setToastVariant("default");
      setShowToast(true);

      if (userDetails) {
        if (userDetails.role_id === 3 || userDetails.role === 3) {
          setTimeout(() => {
            navigate("/student/test");
          }, 2000);
        } else {
          setTimeout(() => {
            navigate(" /dashboard/test/joined");
          }, 2000);
        }
      }
    } catch (error: any) {
      setToastMessage(error.message || "Failed to join the test.");
      setToastVariant("destructive");
      setShowToast(true);
    } finally {
      setIsJoining(false);
    }
  };

  const navigateToTest =
    userDetails.role === 3 ? `/dashboard/test` : `/dashboard/test`;

  if (loading) {
    return <p>Loading test details...</p>;
  }

  if (!isTestValid) {
    return (
      <ToastProvider>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
          <div className="bg-white shadow-lg rounded-lg p-10 md:p-16 w-full max-w-3xl text-center">
            <h2 className="text-3xl font-bold mb-6">
              Test Not Found or Invalid
            </h2>
            <p className="text-lg text-gray-700">
              The test you are trying to join does not exist or the code is
              invalid.
            </p>
          </div>
          <Toast
            open={showToast}
            onOpenChange={setShowToast}
            variant={toastVariant}
          >
            <ToastTitle>
              {toastVariant === "destructive" ? "Error" : "Success"}
            </ToastTitle>
            <ToastDescription>{toastMessage}</ToastDescription>
            <ToastClose />
          </Toast>
          <ToastViewport />
        </div>
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white shadow-lg rounded-lg p-10 md:p-16 w-full max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-6">
            Join Test "{testDetails.subject}"
          </h2>
          <p className="mb-8 text-lg text-gray-700">
            {testDetails.description || "Join this exam session!"}
          </p>

          <div className="flex justify-center">
            <Button
              onClick={handleJoinTest}
              variant={"gradient"}
              className="flex items-center justify-center text-white font-semibold py-3 px-6 rounded-full text-lg"
              disabled={isJoining}
            >
              {isJoining ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 text-white mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                  Joining...
                </div>
              ) : (
                <>
                  Join Test
                  <ArrowRightIcon className="h-6 w-6 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
        <Toast
          open={showToast}
          onOpenChange={setShowToast}
          variant={toastVariant}
        >
          <ToastTitle>
            {toastVariant === "destructive" ? "Error" : "Success"}
          </ToastTitle>
          <ToastDescription>{toastMessage}</ToastDescription>
          <ToastClose />
        </Toast>
        <ToastViewport />
      </div>
    </ToastProvider>
  );
};

export default JoinTest;
