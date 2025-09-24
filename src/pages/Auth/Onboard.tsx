import React, { useState, useEffect } from "react";
import Logo from "../../assets/img/logo.png";
import { Button } from "../../components/ui/Button";
import { FaCheck } from "react-icons/fa";
import { updateUserRole } from "../../api/profile";
import { useNavigate, useLocation } from "react-router-dom";

type Role = "student" | "lecturer" | "teacher" | "school";

const Onboard = () => {
  const [selectedRole, setSelectedRole] = useState<Role | null>("teacher");
  const [loading, setLoading] = useState<boolean>(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("referralCode");
    setReferralCode(code);
  }, [location]);

  const roles: { id: Role; label: string; icon: JSX.Element }[] = [
    {
      id: "student",
      label: "Student",
      icon: (
        <svg
          width="46"
          height="30"
          viewBox="0 0 56 46"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M28 45.5L10.5 36V21L0.5 15.5L28 0.5L55.5 15.5V35.5H50.5V18.25L45.5 21V36L28 45.5ZM28 24.75L45.125 15.5L28 6.25L10.875 15.5L28 24.75ZM28 39.8125L40.5 33.0625V23.625L28 30.5L15.5 23.625V33.0625L28 39.8125Z"
            fill={selectedRole === "student" ? "#E8EAED" : "#5C3CBB"}
          />
        </svg>
      ),
    },
    {
      id: "teacher",
      label: "Teacher",
      icon: (
        <svg
          width="35"
          height="30"
          viewBox="0 0 51 53"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21.25 45C21.5 45.8333 21.8438 46.6979 22.2812 47.5938C22.7188 48.4896 23.1667 49.2917 23.625 50H5.5C4.125 50 2.94792 49.5104 1.96875 48.5312C0.989583 47.5521 0.5 46.375 0.5 45V5C0.5 3.625 0.989583 2.44792 1.96875 1.46875C2.94792 0.489583 4.125 0 5.5 0H35.5C36.875 0 38.0521 0.489583 39.0312 1.46875C40.0104 2.44792 40.5 3.625 40.5 5V22.75C39.75 22.6667 38.9167 22.625 38 22.625C37.0833 22.625 36.25 22.6667 35.5 22.75V5H23V22.5L16.75 18.75L10.5 22.5V5H5.5V45H21.25ZM38 52.5C34.5417 52.5 31.5938 51.2812 29.1562 48.8438C26.7188 46.4062 25.5 43.4583 25.5 40C25.5 36.5417 26.7188 33.5938 29.1562 31.1562C31.5938 28.7188 34.5417 27.5 38 27.5C41.4583 27.5 44.4062 28.7188 46.8438 31.1562C49.2812 33.5938 50.5 36.5417 50.5 40C50.5 43.4583 49.2812 46.4062 46.8438 48.8438C44.4062 51.2812 41.4583 52.5 38 52.5ZM34.875 46.25L44.875 40L34.875 33.75V46.25ZM21.25 5H5.5H35.5H20.5H21.25Z"
            fill={selectedRole === "teacher" ? "#E8EAED" : "#5C3CBB"}
          />
        </svg>
      ),
    },
    {
      id: "lecturer",
      label: "Lecturer",
      icon: (
        <svg
          width="35"
          height="30"
          viewBox="0 0 50 45"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M47.5 20H42.5V5H45V0H5V5H7.5V20H2.5C1.83696 20 1.20107 20.2634 0.732233 20.7322C0.263392 21.2011 0 21.837 0 22.5V45H50V22.5C50 21.837 49.7366 21.2011 49.2678 20.7322C48.7989 20.2634 48.163 20 47.5 20ZM30 40V30H20V40H12.5V5H37.5V40H30Z"
            fill={selectedRole === "lecturer" ? "#E8EAED" : "#5C3CBB"}
          />
        </svg>
      ),
    },
    {
      id: "school",
      label: "School",
      icon: (
        <svg
          width="46"
          height="30"
          viewBox="0 0 56 46"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M28 0L56 20.5L28 41L0 20.5L28 0ZM28 8L11 20.5L28 33L45 20.5L28 8ZM28 38.625L9.25 25.375L0 31V43.5L28 46L56 43.5V31L46.75 25.375L28 38.625Z"
            fill={selectedRole === "school" ? "#E8EAED" : "#5C3CBB"}
          />
        </svg>
      ),
    },
  ];
  const handleSelectRole = (role: Role) => {
    setSelectedRole(role);
  };

  const handleContinue = async () => {
    if (selectedRole) {
      setLoading(true);

      localStorage.setItem("selectedRole", selectedRole);

      let roleId;
      if (selectedRole === "student") {
        roleId = 3;
      } else if (selectedRole === "school") {
        roleId = 4;
      } else {
        roleId = 2;
      }

      localStorage.setItem("roleId", roleId.toString());
      if (referralCode) {
        localStorage.setItem("referralCode", referralCode);
      }
      try {
        if (selectedRole === "student") {
          navigate("/auth/student");
        } else {
          navigate("/auth/sign-up");
        }
      } catch (error) {
        console.error("Error updating user role:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center my-3 mt-3 lg:mt-32 justify-center">
      <div className=" top-8 left-8 flex gap-1 text-black text-2xl font-bold mb-8">
        <img className="h-8 w-auto" src={Logo} alt="AI-Teacha Logo" />
        <span>AiTeacha</span>
      </div>

      <h2 className="text-2xl lg:text-3xl text-center max-w-2xl font-bold mb-6">
        What are you joining AiTeacha as:
      </h2>
      <div className="mt-8  flex items-center justify-center w-full lg:px-0 px-8">
        <div className="grid  grid-cols-2 gap-4 md:flex md:flex-wrap justify-center lg:justify-between w-full max-w-5xl  ">
          {roles.map((role) => (
            <div
              key={role.id}
              className={`relative w-auto md:w-40 lg:w-56 h-40 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-300 ${
                selectedRole === role.id
                  ? "bg-primary text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => handleSelectRole(role.id)}
            >
              {selectedRole === role.id && (
                <div className="absolute top-2 right-2 text-white">
                  <FaCheck size={20} />
                </div>
              )}
              <div className="flex flex-col items-center justify-center">
                <span>{role.icon}</span>
                <span className="text-ms text-center font-semibold">
                  {role.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center items-center gap-4">
        <Button
          variant={"gradient"}
          className="rounded-full px-6 py-2 mt-6"
          onClick={handleContinue}
          disabled={!selectedRole || loading}
        >
          {loading ? "Saving..." : "Continue"}
        </Button>
        <Button
          className="flex items-center bg-white rounded-md mt-6 text-black w-fit h-full gap-3 px-6 py-2"
          onClick={() => navigate(-1)}
          variant={"ghost"}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default Onboard;
