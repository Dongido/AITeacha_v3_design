import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Sidenav, Configurator } from "../components/layout";
import DashboardNavbar from "../components/layout/Student-Navbar";
import routes from "../routes/Approutes";
import { Studentroutes, StudentParamroutes } from "../routes/Approutes";
import { useMaterialTailwindController, setOpenConfigurator } from "../context";
import { RouteConfig } from "../interfaces";
import StudentSidenav from "../components/layout/StudentSidenav";
export function StudentDashboard() {
  const navigate = useNavigate();
  const { controller, dispatch } = useMaterialTailwindController();
  const { sidenavType } = controller;
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [userDetails, setUserDetails] = useState<any>(null);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);

  useEffect(() => {
    const userDetailsFromStorage = localStorage.getItem("ai-teacha-user");

    if (userDetailsFromStorage) {
      const parsedDetails = JSON.parse(userDetailsFromStorage);
      setUserDetails(parsedDetails);
      setIsEmailVerified(parsedDetails.isEmailVerified);
    }
  }, []);

  const handleVerifyEmail = () => {
    navigate("/student/verify-email");
  };

  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      <StudentSidenav
        routes={Studentroutes}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
        onToggle={(collapsed) => setIsCollapsed(collapsed)}
      />
      <div
        className={`p-4 transition-all duration-300 ${
          isCollapsed ? "xl:ml-20" : "xl:ml-72"
        }`}
      >
        <DashboardNavbar />
        {userDetails && !isEmailVerified && (
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
          {Studentroutes.map(
            ({ layout, pages }: RouteConfig) =>
              layout === "student" &&
              pages.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))
          )}
        </Routes>
        <Routes>
          {StudentParamroutes.map(
            ({ layout, pages }: RouteConfig) =>
              layout === "student" &&
              pages.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))
          )}
        </Routes>
      </div>
    </div>
  );
}

StudentDashboard.displayName = "/src/layout/Dashboard.tsx";

export default StudentDashboard;
