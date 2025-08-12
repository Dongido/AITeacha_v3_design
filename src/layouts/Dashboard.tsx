import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "../components/layout";
import routes from "../routes/Approutes";
import { Paramroutes } from "../routes/Approutes";
import { Button } from "../components/ui/Button";
import { useMaterialTailwindController, setOpenConfigurator } from "../context";
import { RouteConfig } from "../interfaces";
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
import StaffChat from "../pages/Dashboard/StaffChat";
import GroupChatForm from "../pages/Dashboard/GroupChatForm";
import AdminResourcesPage from "../pages/Dashboard/admin/AdminResources";
import Forumpage from "../pages/Dashboard/Forumpage";
import Notification from "../pages/Dashboard/admin/Nofification";
import BranchPage from "../pages/Dashboard/school/Branch";
export function Dashboard() {
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

  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      <Sidenav
        routes={routes}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
        onToggle={(collapsed) => setIsCollapsed(collapsed)}
      />
      <div
        className={`p-4 transition-all duration-300 ${
          isCollapsed ? "xl:ml-28" : "xl:ml-72"
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
        {/* <span className="fixed bottom-8 right-8 z-40 cursor-pointer">
          <Cog6ToothIcon
            onClick={() => setOpenConfigurator(dispatch, true)}
            className="h-5 w-5"
          />
        </span> */}
        <Routes>
          {routes.map(
            ({ layout, pages }: RouteConfig) =>
              layout === "dashboard" &&
              pages.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))
          )}
        </Routes>
        <Routes>
          {Paramroutes.map(
            ({ layout, pages }: RouteConfig) =>
              layout === "dashboard" &&
              pages.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))
          )}
        </Routes>
        <Routes>
          <Route path="/premium/teams" element={<Team />} />
          <Route path="/premium/students" element={<SchoolStudents />} />
          <Route path="/premium/resources" element={<Resources />} />
          <Route path="/premium/classrooms" element={<TeamClassroomPage />} />
          <Route path="/premium/forum" element={<Forumpage />} />
          <Route path="/premium/archive" element={<ArchivedAssistants />} />
          <Route path="/premium/resources/:id" element={<ResourceSingle />} />
          <Route path="/premium/branch" element={<BranchPage />} />

          <Route path="/resource/training" element={<Training />} />
          <Route path="/resource/training/form" element={<TrainingForm />} />
          <Route path="/resource/community" element={<Community />} />
          <Route path="/admin/tools" element={<AdminTools />} />
          <Route path="/admin/free-users" element={<FreeUsers />} />

          <Route path="/admin/past-users" element={<PastUsers />} />

          <Route path="/admin/subscribers" element={<Subscribers />} />
          <Route path="/admin/withdrawals" element={<AdminWithdrawalsPage />} />
          <Route path="/admin/user/:id" element={<AdminUserDetailsPage />} />
          <Route path="/admin/resources" element={<AdminResourcesPage />} />
          <Route path="/admin/notification" element={<Notification />} />
        </Routes>
        {/* <div className="text-blue-gray-600">
          <Footer />
        </div> */}
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/Dashboard.tsx";

export default Dashboard;
