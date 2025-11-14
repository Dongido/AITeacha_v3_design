import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Sidenav, DashboardNavbar, Configurator } from "../components/layout";
import routes from "../routes/Approutes";
import { Paramroutes } from "../routes/Approutes";
import {
  useMaterialTailwindController,
  setOpenSidenav,
} from "../context";
import { RouteConfig } from "../interfaces";

// Dashboard pages
import Resources from "../pages/Dashboard/Resources";
import Team from "../pages/Dashboard/Team";
import ResourceSingle from "../pages/Dashboard/ResourcesSingle";
import TeamClassroomPage from "../pages/Dashboard/team/TeamClassroom";
import Training from "../pages/Dashboard/Training";
import Community from "../pages/Dashboard/Community";
import TrainingForm from "../pages/Dashboard/TrainingForm";
import FreeUsers from "../pages/Dashboard/admin/FreeUsers";
import AdminTools from "../pages/Dashboard/AdminTools";
import PastUsers from "../pages/Dashboard/admin/PastUsers";
import Subscribers from "../pages/Dashboard/admin/Subscribers";
import AdminWithdrawalsPage from "../pages/Dashboard/admin/Withdrawals";
import AdminUserDetailsPage from "../pages/Dashboard/admin/UserDetailsPage";
import ArchivedAssistants from "../pages/Dashboard/premium/Archive";
import SchoolStudents from "../pages/Dashboard/school/SchoolStudents";
import AdminResourcesPage from "../pages/Dashboard/admin/AdminResources";
import Forumpage from "../pages/Dashboard/Forumpage";
import Notification from "../pages/Dashboard/admin/Nofification";
import BranchPage from "../pages/Dashboard/school/Branch";

export function Dashboard() {
  const navigate = useNavigate();
  const { controller, dispatch } = useMaterialTailwindController();
  const { sidenavType, openSidenav, collapsed } = controller as {
    sidenavType: string;
    openSidenav: boolean;
    collapsed: boolean;
  };

  const [userDetails, setUserDetails] = useState<any>(null);
  const [isEmailVerified, setIsEmailVerified] = useState<number>(0);

  // ✅ Sidebar defaults
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setOpenSidenav(dispatch, true);
      } else {
        setOpenSidenav(dispatch, false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

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

  return (
    <div className="min-h-screen bg-[#f1f1f1] flex transition-all duration-300 ease-in-out">
      {/* --- SIDENAV --- */}
      <Sidenav
        routes={routes}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />

      {/* --- MAIN CONTENT --- */}
      <div

        // className={`flex-1 overflow-hidden p-4  transition-all duration-300 ease-in-out

        className={`flex-1  pt-4 overflow-hidden transition-all duration-300 ease-in-out

          ${
            openSidenav
              ? collapsed
                ? "xl:ml-20"
                : "xl:ml-72"
              : "xl:ml-0"
          }
        `}
      >
        <DashboardNavbar />

        {/* --- EMAIL VERIFICATION ALERT --- */}
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

        {/* --- CONFIGURATOR --- */}
        <Configurator />

        {/* --- ROUTES --- */}
        <div className="pt-4">
          {/* Regular routes */}
          <Routes>
            {routes.map(
              ({ layout, pages }: RouteConfig) =>
                layout === "dashboard" &&
                pages.map(({ path, element }) => (
                  <Route key={path} path={path} element={element} />
                ))
            )}

            {/* Param routes */}
            {Paramroutes.map(
              ({ layout, pages }: RouteConfig) =>
                layout === "dashboard" &&
                pages.map(({ path, element }) => (
                  <Route key={path} path={path} element={element} />
                ))
            )}

            {/* Extra routes */}
            <Route path="/premium/teams" element={<Team />} />
            <Route path="/premium/students" element={<SchoolStudents />} />
            <Route path="/premium/resources" element={<Resources />} />
            <Route
              path="/premium/classrooms"
              element={<TeamClassroomPage />}
            />
            <Route path="/premium/forum" element={<Forumpage />} />
            <Route path="/premium/archive" element={<ArchivedAssistants />} />
            <Route path="/premium/resources/:id" element={<ResourceSingle />} />
            <Route path="/premium/branch" element={<BranchPage />} />
            <Route path="/resource/training" element={<Training />} />
            <Route
              path="/resource/training/form"
              element={<TrainingForm />}
            />
            <Route path="/resource/community" element={<Community />} />
            <Route path="/admin/tools" element={<AdminTools />} />
            <Route path="/admin/free-users" element={<FreeUsers />} />
            <Route path="/admin/past-users" element={<PastUsers />} />
            <Route path="/admin/subscribers" element={<Subscribers />} />
            <Route
              path="/admin/withdrawals"
              element={<AdminWithdrawalsPage />}
            />
            <Route
              path="/admin/user/:id"
              element={<AdminUserDetailsPage />}
            />
            <Route
              path="/admin/resources"
              element={<AdminResourcesPage />}
            />
            <Route
              path="/admin/notification"
              element={<Notification />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/Dashboard.tsx";
export default Dashboard;
