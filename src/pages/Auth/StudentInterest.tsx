import React, { useState } from "react";
import Logo from "../../assets/img/logo.png";
import { Button } from "../../components/ui/Button";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastViewport,
} from "../../components/ui/Toast";
import { completeInterest } from "../../api/auth";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const optionsList = [
  "Equation Solver",
  "Geometry Tool",
  "Music Maestro",
  "Coding Practice Assistant",
  "Creative Writing Prompter",
  "Math Practice Generator",
  "Periodic Table Assistant",
  "Visual Teaching Aid",
  "Tech Tutor",
  "Language Learner",
  "Grammar and Writing Assistant",
  "pronunciation Coach",
];

const StudentInterest: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [toastOpen, setToastOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
    "default"
  );

  const navigate = useNavigate();

  const handleToggle = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const handleContinue = async () => {
  if (selectedOptions.length < 3) {
    setToastMessage("Please select at least 3 interests to continue.");
    setToastVariant("destructive");
    setToastOpen(true);
    return;
  }

  setIsLoading(true);

  try {

    const token = Cookies.get("at-accessToken");
    if (!token) return;
        
    const decoded: any = jwtDecode(token);
    const userId = String(decoded.id);

    console.log(userId)
    if (!userId) throw new Error("User ID not found. Please log in again.");

    // Send selected interests to the API
    console.log(selectedOptions)
    await completeInterest(userId, selectedOptions);

    setToastMessage("Your interests have been saved successfully!");
    setToastVariant("default");
    setToastOpen(true);

    // Navigate to dashboard after short delay
    setTimeout(() => {
      navigate("/student/home");
    }, 1500);
  } catch (error: any) {
    console.error(error);
    setToastMessage(error.message || "Failed to save your interests. Try again.");
    setToastVariant("destructive");
    setToastOpen(true);
  } finally {
    setIsLoading(false);
  }
};

const handleSkip = () => {
  console.log("button clicked")
  sessionStorage.setItem("interestSkipped", "true"); 
  setToastMessage("You chose to skip this step.");
  setToastVariant("default");
  setToastOpen(true);
  setTimeout(() => {
    navigate("/student/home");
  }, 1500);
};

  return (
    <ToastProvider swipeDirection="left">
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
        <div className="min-h-[85vh] flex flex-col items-center justify-between w-full max-w-3xl">
          {/* Logo */}
          <div className="mb-6">
            <img src={Logo} alt="Logo" className="w-20 h-20 object-contain" />
          </div>

          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome to Our Platform
            </h1>
            <p className="text-gray-500 mb-8 text-center max-w-md">
              Select your interests below. Choose multiple options or skip this step.
            </p>
          </div>

          {/* Options */}
          <div className="flex items-center justify-center max-w-xl gap-4 mb-10 w-full flex-wrap">
            {optionsList.map((option) => {
              const isSelected = selectedOptions.includes(option);
              return (
                <button
                  key={option}
                  onClick={() => handleToggle(option)}
                  className={`py-3 text-base rounded-lg cursor-pointer px-7 font-semibold transition-all duration-300 ${
                    isSelected
                      ? "bg-[#5C3CBB] text-white scale-105"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <Button
            type="button"
            onClick={handleContinue}
            className="mt-2 bg-primary max-w-full w-[400px] text-white rounded-full"
          >
            Continue
          </Button>
          <Button
            type="button"
            onClick={handleSkip}
            // disabled{isLoading}
            className="max-w-full w-md cursor-pointer text-gray-800 py-2.5 rounded-md transition font-medium"
          >
            Skip
          </Button>
        </div>

        {/* Toast */}
        <Toast open={toastOpen} onOpenChange={setToastOpen} variant={toastVariant}>
          <ToastTitle>{toastMessage}</ToastTitle>
        </Toast>
        <ToastViewport />
      </div>
    </ToastProvider>
  );
};

export default StudentInterest;
