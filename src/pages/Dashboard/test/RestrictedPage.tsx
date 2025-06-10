import React, { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";

// Placeholder icons - replace with your actual icon components
const TestCreationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
    <path d="M14 2v6l6 6" />
    <path d="M16 13h-4" />
    <path d="M16 17h-4" />
  </svg>
);

const QuestionManagementIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 9h16" />
    <path d="M4 15h16" />
    <path d="M12 9v6" />
    <path d="M6 7l-3-3 3-3" />
    <path d="M18 7l3-3-3-3" />
    <path d="M6 17l-3 3 3 3" />
    <path d="M18 17l3 3-3 3" />
  </svg>
);

const TestTakingIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c3.81 5.41 4.56 8.38 5.31 16.77" />
    <path d="M12 20c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z" />
  </svg>
);

const RestrictedPage: React.FC<{ error: string }> = ({ error }) => {
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="p-6 bg-gray-50 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Unlock the Full Potential of Assessment
        </h3>
        <p className="text-lg text-gray-700 mb-6">
          Elevate your teaching with powerful tools designed to streamline test
          creation, enhance student engagement, and provide valuable insights.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-center gap-4">
            <TestCreationIcon />
            <div>
              <h4 className="font-semibold text-lg text-gray-900">
                Effortless Test Creation
              </h4>
              <p className="text-gray-600">
                Quickly generate a variety of assessments, including quizzes,
                exams, and practice tests, with an intuitive and user-friendly
                interface.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <QuestionManagementIcon />
            <div>
              <h4 className="font-semibold text-lg text-gray-900">
                Comprehensive Question Management
              </h4>
              <p className="text-gray-600">
                Build and organize a robust question bank with multiple choice,
                true/false, and open-ended questions, making it easy to reuse
                and adapt content.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <TestTakingIcon />
            <div>
              <h4 className="font-semibold text-lg text-gray-900">
                Flexible Test Delivery
              </h4>
              <p className="text-gray-600">
                Offer students a seamless test-taking experience with
                customizable settings, timing options, and accessibility
                features.
              </p>
            </div>
          </div>
        </div>
        <Button
          onClick={() => navigate("/dashboard/upgrade")}
          variant={"gradient"}
          className="px-6 py-2 mt-4 text-white font-semibold rounded-full hover:bg-blue-600 transition"
        >
          Upgrade To Access Now
        </Button>
        <Button
          onClick={openPopup}
          variant={"outline"}
          className="flex items-center px-6 py-3 mt-4 bg-red-500 text-white text-lg font-medium rounded-lg shadow-lg  space-x-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="white"
          >
            <path d="M19.615 3.184c-1.88-.33-9.379-.33-11.258 0C6.018 3.516 5.1 4.437 4.77 6.212c-.33 1.775-.33 5.514 0 7.29.33 1.774 1.248 2.696 3.587 3.03 1.88.33 9.379.33 11.258 0 2.339-.333 3.256-1.255 3.587-3.03.33-1.776.33-5.515 0-7.29-.33-1.775-1.248-2.696-3.587-3.03zm-9.78 5.952l5.723 3.328-5.723 3.33V9.136z" />
          </svg>
          <span className="text-white">Classroom Walkthrough</span>
        </Button>

        {isPopupOpen && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="relative bg-white rounded-lg shadow-lg w-[90%] max-w-3xl">
              <button
                onClick={closePopup}
                className="absolute top-3 right-3 bg-red-500 text-gray-600 hover:bg-gray-300 p-2 rounded-full"
              >
                <span className="text-white"> ✕</span>
              </button>

              <div className="p-4">
                <iframe
                  width="100%"
                  height="400"
                  src="https://www.youtube.com/embed/o688vxKkcPw?si=CoKNScNo2C7XA8Dp"
                  title="Community Preview"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestrictedPage;
