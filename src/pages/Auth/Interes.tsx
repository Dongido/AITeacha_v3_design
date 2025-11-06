import React, { useState } from "react";
import Logo from "../../assets/img/logo.png";
import { Button } from "../../components/ui/Button";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastViewport,
} from "../../components/ui/Toast";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { completeInterest } from "../../api/auth";


const optionsList = [
  "Text To Speech",
  "Assignment Generator",
  "Lesson Plans",
  "Classrooms",
  "Test & Exams",
  "Syllabus Generator",
  "Power Point Slide",
  "Visual Teaching Aid",
  "Reports",
  "Tailored Curriculum",
  "Grammar Correction",
  "Audio Transcriber",
];

const Interest: React.FC = () => {
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
      await completeInterest(userId, selectedOptions);
  
      setToastMessage("Your interests have been saved successfully!");
      setToastVariant("default");
      setToastOpen(true);
  
      // Navigate to dashboard after short delay
      setTimeout(() => {
        navigate("/dashboard/home");
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
    navigate("/dashboard/home");
  }, 1500);
};

  return (
    <ToastProvider swipeDirection="left">
      <div className="min-h-screen overflow-hidden py-[30px] px-4 flex flex-col items-center justify-center bg-gray-100">
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
          <div className="flex items-center justify-center max-w-xl gap-3 md:gap-4 mb-10 w-full flex-wrap">
            {optionsList.map((option) => {
              const isSelected = selectedOptions.includes(option);
              return (
                <button
                  key={option}
                  onClick={() => handleToggle(option)}
                  className={`py-2 md:py-3 text-sm md:text-base rounded-lg cursor-pointer px-3 md:px-7 font-semibold transition-all duration-300 ${
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
          <div className="flex w-full flex-col items-center justify-center">

          <Button
            type="button"
            onClick={handleContinue}
            className="mt-2 bg-primary w-full md:w-[400px] text-white rounded-full"
          >
            Continue
          </Button>
          <Button
            type="button"
            onClick={handleSkip}
            className="max-w-full w-md cursor-pointer text-gray-800 py-2.5 rounded-md transition font-medium"
          >
            Skip
          </Button>
          </div>
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

export default Interest;
