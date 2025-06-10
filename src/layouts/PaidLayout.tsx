import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { Sidenav, Configurator, Footer } from "../components/layout";
import routes from "../routes/Approutes";
import { Paramroutes } from "../routes/Approutes";
import { Button } from "../components/ui/Button";
import { useMaterialTailwindController, setOpenConfigurator } from "../context";
import { RouteConfig } from "../interfaces";
import Classroom from "../pages/Dashboard/student/Classroom";

export function PaidLayout() {
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
    navigate("/PaidLayout/verify-email");
  };

  return (
    <div className="">
      <Routes>
        {routes.map(
          ({ layout, pages }: RouteConfig) =>
            layout === "PaidLayout" &&
            pages.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))
        )}
      </Routes>
      <Routes>
        {Paramroutes.map(
          ({ layout, pages }: RouteConfig) =>
            layout === "PaidLayout" &&
            pages.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))
        )}
      </Routes>
      <Routes>
        <Route path="/classrooms/class-details/" element={<Classroom />} />
        <Route path="/classrooms/class-details/:id" element={<Classroom />} />
        <Route path="/class-details/:id" element={<Classroom />} />
      </Routes>
    </div>
  );
}

PaidLayout.displayName = "/src/layout/PaidLayout.tsx";

export default PaidLayout;
