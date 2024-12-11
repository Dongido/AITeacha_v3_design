import React from "react";
import { Button } from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";
const LessonManagementIcon = () => (
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

const StudentEngagementIcon = () => (
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

const PersonalizedLearningIcon = () => (
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
    <path d="M17 10h4V7h-4V3l-5 5 5 5v-4zM7 10v4h4v5l5-5-5-5v4z"></path>
  </svg>
);

interface RestrictedPageProps {
  error: string;
}

const RestrictedPage: React.FC<RestrictedPageProps> = ({ error }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="p-6 bg-gray-50 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Effortlessly manage virtual classrooms and engage students anytime,
          anywhere.
        </h3>
        <p className="text-lg text-gray-700 mb-6">
          Let AI simplify classroom management and personalize learning for your
          students.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-center gap-4">
            <LessonManagementIcon />
            <div>
              <h4 className="font-semibold text-lg text-gray-900">
                Seamless Lesson Management
              </h4>
              <p className="text-gray-600">
                Easily create virtual classrooms and upload lesson plans,
                curriculum, and teaching materials for students to access
                anytime.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <StudentEngagementIcon />
            <div>
              <h4 className="font-semibold text-lg text-gray-900">
                Enhanced Student Engagement
              </h4>
              <p className="text-gray-600">
                Use interactive tools like Q&A, polls, and live chat to keep
                students actively involved and foster deeper understanding.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <PersonalizedLearningIcon />
            <div>
              <h4 className="font-semibold text-lg text-gray-900">
                Personalized Learning Support
              </h4>
              <p className="text-gray-600">
                Leverage AI-driven tools to provide tailored resources and
                assistance, ensuring every student’s unique needs are addressed.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <InsightsTrackingIcon />
            <div>
              <h4 className="font-semibold text-lg text-gray-900">
                Advanced Insights and Tracking
              </h4>
              <p className="text-gray-600">
                Monitor student participation and performance with real-time
                data to identify and address learning gaps effectively.
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
      </div>
    </div>
  );
};

export default RestrictedPage;
