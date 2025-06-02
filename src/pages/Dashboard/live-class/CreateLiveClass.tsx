import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Skeleton } from "../../../components/ui/Skeleton";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";

import { createLiveClass } from "../../../api/liveclass";

import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastViewport,
} from "../../../components/ui/Toast";

const CreateLiveClass = () => {
  const { meetingId } = useParams<{ meetingId: string }>();
  const navigate = useNavigate();

  const [status, setStatus] = useState("Loading form...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [meetingName, setMeetingName] = useState<string>("");

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastDescription, setToastDescription] = useState("");
  const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
    "default"
  );

  useEffect(() => {
    if (!meetingId) {
      setError("Meeting ID not found in URL. Cannot create live class.");
      setToastMessage("Error");
      setToastDescription(
        "Meeting ID is missing. Please ensure you have a valid link."
      );
      setToastVariant("destructive");
      setToastOpen(true);
    } else {
      setStatus(`Ready to create class for Meeting ID: ${meetingId}`);
    }
    setLoading(false);
  }, [meetingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToastOpen(false);
    setToastMessage("");
    setToastDescription("");
    setToastVariant("default");
    setError(null);

    if (!meetingId) {
      setError("Meeting ID is missing. Cannot create live class.");
      setToastMessage("Error");
      setToastDescription("Cannot create class: Meeting ID is missing.");
      setToastVariant("destructive");
      setToastOpen(true);
      setLoading(false);
      return;
    }

    const classData: {
      meeting_name?: string;
      classroom_id: string;
    } = {
      meeting_name: meetingName || "Untitled Live Class",
      classroom_id: meetingId,
    };

    try {
      const response = await createLiveClass(classData);
      console.log("Live Class Creation Response:", response);

      setToastMessage("Success!");
      setToastDescription("Live class created successfully!");
      setToastVariant("default");
      setToastOpen(true);

      navigate("/dashboard/liveclass");
    } catch (err: any) {
      setError(err.message || "Failed to create live class. Please try again.");
      setToastMessage("Error");
      setToastDescription(
        err.message || "Failed to create live class. Please try again."
      );
      setToastVariant("destructive");
      setToastOpen(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <Skeleton className="h-8 w-80 mb-4 mx-auto" />
          <Skeleton className="h-6 w-60 mx-auto" />
          <Skeleton className="h-4 w-40 mt-4 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <ToastProvider swipeDirection="right">
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 font-inter">
        <div className="bg-white p-8 rounded-lg shadow-md text-center w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Create Live Class
          </h2>
          <p className="text-gray-600 mb-4">{status}</p>

          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3  relative mb-4 rounded-lg"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {!error && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="meetingName"
                  className="block text-left text-sm font-medium text-gray-700 mb-1"
                >
                  Class Name (Optional)
                </label>
                <Input
                  id="meetingName"
                  type="text"
                  value={meetingName}
                  onChange={(e) => setMeetingName(e.target.value)}
                  placeholder="e.g., My Awesome Lecture"
                  className="rounded-md"
                />
              </div>

              <Button
                type="submit"
                disabled={loading || !meetingId}
                className="w-full bg-primary hover:bg-purple-800 text-white font-semibold py-2 px-4 rounded-lg shadow-md "
              >
                {loading ? "Creating Class..." : "Create Live Class"}
              </Button>
            </form>
          )}
        </div>
      </div>
      <Toast
        open={toastOpen}
        onOpenChange={setToastOpen}
        variant={toastVariant}
      >
        <ToastTitle>{toastMessage}</ToastTitle>
        {toastDescription && (
          <ToastDescription>{toastDescription}</ToastDescription>
        )}
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
};

export default CreateLiveClass;
