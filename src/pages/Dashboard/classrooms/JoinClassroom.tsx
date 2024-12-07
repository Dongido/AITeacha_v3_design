import React, { useEffect, useState } from "react";
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
import {
  fetchClassroomByJoinCode,
  joinClassroom,
  checkIfStudentInClassroom,
  addStudentToClassroom,
} from "../../../api/classrooms";
import { ClassroomData } from "../../../api/interface";
import { Link } from "react-router-dom";
const JoinClassroom = () => {
  const { id: joinCode } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [classroom, setClassroom] = useState<ClassroomData | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isInClassroom, setIsInClassroom] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
    "default"
  );

  useEffect(() => {
    const fetchClassroom = async () => {
      try {
        const classroomData = await fetchClassroomByJoinCode(joinCode!);
        setClassroom(classroomData);

        const studentStatus = await checkIfStudentInClassroom(classroomData.id);
        setIsInClassroom(studentStatus);
      } catch (error: any) {
        setToastMessage("Failed to check if student is in the classroom.");
        setToastVariant("destructive");
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };

    fetchClassroom();
  }, [joinCode]);

  const userDetails = JSON.parse(
    localStorage.getItem("ai-teacha-user") || "{}"
  );

  const handleJoinClassroom = async () => {
    if (classroom) {
      setIsJoining(true);
      try {
        const currentUrl = window.location.href;
        const response = await joinClassroom(
          classroom.join_url,
          classroom.join_code!
        );
        setToastMessage(
          response.message || "Successfully joined the classroom!"
        );
        setToastVariant("default");
        setShowToast(true);

        if (userDetails) {
          if (userDetails.role === 3) {
            setTimeout(() => {
              navigate(`/student/class/class-details/${classroom.id}`);
            }, 2000);
          } else {
            setTimeout(() => {
              navigate(`/dashboard/classrooms/class-details/${classroom.id}`);
            }, 2000);
          }
        }
      } catch (error: any) {
        setToastMessage(error.message || "Failed to join the classroom.");
        setToastVariant("destructive");
        setShowToast(true);
      } finally {
        setIsJoining(false);
      }
    }
  };
  const navigateToClassroom =
    userDetails.role === 3
      ? `/student/class/class-details/${classroom?.id}`
      : `/dashboard/classrooms/class-details/${classroom?.id}`;

  if (loading) {
    return <p>Loading classroom...</p>;
  }

  if (!classroom) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white shadow-lg rounded-lg p-10 md:p-16 w-full max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-6">Classroom Not Found</h2>
          <p className="text-lg text-gray-700">
            The classroom you are trying to join does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white shadow-lg rounded-lg p-10 md:p-16 w-full max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-6">
            {isInClassroom ? "Already a Member" : `Join "${classroom.name}"`}
          </h2>
          <p className="mb-8 text-lg text-gray-700">
            {isInClassroom
              ? "You are already a member of this classroom."
              : classroom.description || "Join this exciting classroom!"}
          </p>
          {isInClassroom ? (
            <Link to={navigateToClassroom}>
              <Button
                variant={"gradient"}
                className="flex items-center justify-center text-white font-semibold py-3 px-6 rounded-full text-lg"
              >
                view classroom
              </Button>
            </Link>
          ) : (
            ""
          )}

          {!isInClassroom && (
            <div className="flex justify-center">
              <Button
                onClick={handleJoinClassroom}
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
                    Join Classroom
                    <ArrowRightIcon className="h-6 w-6 ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {showToast && (
          <Toast variant={toastVariant} onOpenChange={setShowToast}>
            <ToastTitle>
              {toastVariant === "destructive" ? "Error" : "Success"}
            </ToastTitle>
            <ToastDescription>{toastMessage}</ToastDescription>
            <ToastClose />
          </Toast>
        )}
        <ToastViewport />
      </div>
    </ToastProvider>
  );
};

export default JoinClassroom;
