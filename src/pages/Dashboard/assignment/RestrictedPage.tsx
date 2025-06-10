import React, { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";

const AIQuestionGeneratorIcon = () => (
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
    <path d="M8 17v-5h8v5M6 7h12c1.104 0 2 .896 2 2v8c0 1.104-.896 2-2 2H6c-1.104 0-2-.896-2-2V9c0-1.104.896-2 2-2z"></path>
  </svg>
);

const AutoGradingIcon = () => (
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
    <path d="M17 10h4V7h-4V3l-5 5 5 5v-4zM7 10v4h4v5l5-5-5-5v4z"></path>
  </svg>
);

const InsightsTrackingIcon = () => (
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
    <path d="M15 3H9v18h6V3zm-2 14H11v-4h2v4zm-2-6h2V7h-2v4z"></path>
  </svg>
);

interface RestrictedPageProps {
  error: string;
}

const RestrictedPage: React.FC<RestrictedPageProps> = ({ error }) => {
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="p-6 bg-gray-50 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          AI-powered Assignments: Generate, Grade, and Track with Ease.
        </h3>
        <p className="text-lg text-gray-700 mb-6">
          Automate assignment creation and grading, giving students real-time
          feedback and insights.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-center gap-4">
            <AIQuestionGeneratorIcon />
            <div>
              <h4 className="font-semibold text-lg text-gray-900">
                Generate Questions with AI
              </h4>
              <p className="text-gray-600">
                Automatically generate high-quality questions tailored to your
                curriculum and difficulty level.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <AutoGradingIcon />
            <div>
              <h4 className="font-semibold text-lg text-gray-900">
                Automated Grading System
              </h4>
              <p className="text-gray-600">
                Instantly grade assignments with AI, providing students with
                immediate feedback.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <InsightsTrackingIcon />
            <div>
              <h4 className="font-semibold text-lg text-gray-900">
                Insights and Performance Tracking
              </h4>
              <p className="text-gray-600">
                Get real-time insights on student progress and identify learning
                gaps effectively.
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
          className="flex items-center px-6 py-3 mt-12 bg-red-500 text-white text-lg font-medium rounded-full shadow-lg space-x-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="white"
          >
            <path d="M19.615 3.184c-1.88-.33-9.379-.33-11.258 0C6.018 3.516 5.1 4.437 4.77 6.212c-.33 1.775-.33 5.514 0 7.29.33 1.774 1.248 2.696 3.587 3.03 1.88.33 9.379.33 11.258 0 2.339-.333 3.256-1.255 3.587-3.03.33-1.776.33-5.515 0-7.29-.33-1.775-1.248-2.696-3.587-3.03zm-9.78 5.952l5.723 3.328-5.723 3.33V9.136z" />
          </svg>
          <span className="text-white">Assignment Walkthrough</span>
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
                  src="https://www.youtube.com/embed/aDwj6TI49c8?si=PV7aatcb14CI8n8C"
                  title="Assignment Preview"
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
