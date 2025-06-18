import React, { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";

// Define generic icon components (you can replace these with your actual icons)
const FeatureIcon1 = () => (
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
    className="w-8 h-8 text-indigo-500"
  >
    <circle cx="12" cy="12" r="10" />
  </svg>
);

const FeatureIcon2 = () => (
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
    className="w-8 h-8 text-indigo-500"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
  </svg>
);

const FeatureIcon3 = () => (
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
    className="w-8 h-8 text-indigo-500"
  >
    <polyline points="9 11 12 14 22 4" />
  </svg>
);

const FeatureIcon4 = () => (
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
    className="w-8 h-8 text-indigo-500"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

interface GeneralRestrictedPageProps {
  error: string;
  title?: string;
  description?: string;
  features?: {
    icon: React.FC;
    title: string;
    description: string;
  }[];
  upgradeButtonText?: string;
  walkthroughButtonText?: string;
  walkthroughVideoUrl?: string;
}

const GeneralRestrictedPage: React.FC<GeneralRestrictedPageProps> = ({
  error,
  title = "Unlock Full Access",
  description = "Upgrade your account to enjoy all the amazing features.",
  features = [
    {
      icon: FeatureIcon1,
      title: "Enhanced Functionality",
      description:
        "Access a wider range of tools and options to boost your productivity.",
    },
    {
      icon: FeatureIcon2,
      title: "Premium Content",
      description: "Get exclusive access to valuable resources and materials.",
    },
    {
      icon: FeatureIcon3,
      title: "Advanced Analytics",
      description:
        "Gain deeper insights with comprehensive data tracking and reporting.",
    },
    {
      icon: FeatureIcon4,
      title: "Dedicated Support",
      description: "Receive priority support from our expert team.",
    },
  ],
  upgradeButtonText = "Upgrade Now",
  walkthroughButtonText = "Learn More",
  walkthroughVideoUrl = "https://www.youtube.com/embed/o688vxKkcPw?si=CoKNScNo2C7XA8Dp", // Replace with your actual URL
}) => {
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  return (
    <div className="flex flex-col items-center justify-center  bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full ">
        <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          {title}
        </h3>
        <p className="text-lg text-gray-700 mb-8 text-center">{description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="rounded-full bg-indigo-100 p-3">
                <feature.icon />
              </div>
              <div>
                <h4 className="font-semibold text-lg text-gray-900">
                  {feature.title}
                </h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8">
          <Button
            onClick={() => navigate("/dashboard/upgrade")}
            variant={"gradient"}
            className="px-8 py-3 text-white font-semibold rounded-full hover:bg-blue-600 transition"
          >
            {upgradeButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GeneralRestrictedPage;
