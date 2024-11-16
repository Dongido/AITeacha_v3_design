import { Routes, Route } from "react-router-dom";
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

export function Dashboard() {
  const { controller, dispatch } = useMaterialTailwindController();
  const { sidenavType } = controller;

  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      <Sidenav
        routes={routes}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
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
        {/* <div className="text-blue-gray-600">
          <Footer />
        </div> */}
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/Dashboard.tsx";

export default Dashboard;
