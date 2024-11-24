import { Routes, Route } from "react-router-dom";
import { Sidenav, DashboardNavbar, Configurator } from "../components/layout";
import routes from "../routes/Approutes";
import { Studentroutes, StudentParamroutes } from "../routes/Approutes";
import { useMaterialTailwindController, setOpenConfigurator } from "../context";
import { RouteConfig } from "../interfaces";
import StudentSidenav from "../components/layout/StudentSidenav";
export function StudentDashboard() {
  const { controller, dispatch } = useMaterialTailwindController();
  const { sidenavType } = controller;

  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      <StudentSidenav
        routes={Studentroutes}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
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
