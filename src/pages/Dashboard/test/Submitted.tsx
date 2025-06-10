import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const ExamSubmitted = () => {
  const navigate = useNavigate();

  const userDetails = JSON.parse(
    localStorage.getItem("ai-teacha-user") || "{}"
  );
  const handleGoHome = () => {
    const isStudent = userDetails.role === 3 || userDetails.role_id === 3;

    navigate(isStudent ? "/student/test" : "/dashboard/test/joined");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center border border-gray-200">
        <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Submission Successful
        </h1>
        <p className="text-gray-600 mb-6">
          Your answers have been submitted. Good job! 🎉
        </p>

        <button
          onClick={handleGoHome}
          className="bg-primary hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md transition-all"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default ExamSubmitted;
