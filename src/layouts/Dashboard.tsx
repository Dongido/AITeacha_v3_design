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
          isCollapsed ? "xl:ml-20" : "xl:ml-72"
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
          <Route path="/premium/resources" element={<Resources />} />
          <Route path="/premium/resources/:id" element={<ResourceSingle />} />
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
