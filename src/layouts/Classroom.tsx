import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { DashboardNavbar, Configurator, Footer } from "../components/layout";
import { Sidenav } from "../pages/Dashboard/classrooms/components/Sidenav";
import routes from "../routes/Approutes";
import { Paramroutes } from "../routes/Approutes";
import { Button } from "../components/ui/Button";
import { useMaterialTailwindController, setOpenConfigurator } from "../context";
import { RouteConfig } from "../interfaces";
import Classroom from "../pages/Dashboard/student/Classroom";

export function ClassroomDashboard() {
  const navigate = useNavigate();
  const { controller, dispatch } = useMaterialTailwindController();
  const { sidenavType } = controller;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isEmailVerified, setIsEmailVerified] = useState<number>(0);

  useEffect(() => {
    const userDetailsFromStorage = localStorage.getItem("ai-teacha-user");

    if (userDetailsFromStorage) {
      const parsedDetails = JSON.parse(userDetailsFromStorage);
      setUserDetails(parsedDetails);
      setIsEmailVerified(parsedDetails.is_email_verified);
    }
  }, []);

  const handleVerifyEmail = () => {
    navigate("/dashboard/verify-email");
  };

  // Manually parsing outlines and tools as arrays (not relying on layout filter)
  const outlines = [
    {
      icon: <Cog6ToothIcon />,
      name: "Classrooms",
      path: "/classrooms",
    },
    // Add more outline items as needed
  ];

  const tools = [
    {
      icon: <Cog6ToothIcon />,
      name: "Tool 1",
      path: "/tool1",
    },
    {
      icon: <Cog6ToothIcon />,
      name: "Tool 2",
      path: "/tool2",
    },
    // Add more tools as needed
  ];

  return (
    <div className="min-h-screen bg-[#F1F1F1] flex routes-scroll-area">
      {/* Sidenav with manually parsed outlines/tools */}
      <Sidenav
        brandName="AiTeacha"
        outlines={outlines}
        tools={tools}
        onToggle={(collapsed) => setIsCollapsed(collapsed)}
      />

      <div
        className={`flex-1 transition-all duration-300 routes-scroll-area ${
          isCollapsed ? "ml-28" : "ml-72"
        }`}
      >
        <DashboardNavbar />

        {userDetails && isEmailVerified === 0 && (
          <div className="bg-yellow-200 mt-3 text-black p-4 rounded-md flex justify-between items-center">
            <span>Your email is not verified. Please verify your email.</span>
            <button
              onClick={handleVerifyEmail}
              className="text-primary hover:underline"
            >
              Verify Email
            </button>
          </div>
        )}

        <Configurator />

        <Routes>
          {outlines.map(({ path, name }) => (
            <Route key={path} path={path} element={<div>{name}</div>} />
          ))}
        </Routes>

        <Routes>
          {tools.map(({ path, name }) => (
            <Route key={path} path={path} element={<div>{name}</div>} />
          ))}
        </Routes>

        <Routes>
          <Route path="/classrooms/class-details/" element={<Classroom />} />
          <Route path="/classrooms/class-details/:id" element={<Classroom />} />
        </Routes>
      </div>
    </div>
  );
}

ClassroomDashboard.displayName = "/src/layout/Dashboard.tsx";

export default ClassroomDashboard;
