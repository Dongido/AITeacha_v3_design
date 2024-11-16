import { Routes, Route } from "react-router-dom";
import { Authroutes } from "../routes/Approutes";
import { RouteConfig } from "../interfaces";

export function Auth() {
  return (
    <div>
      <Routes>
        {Authroutes.map(
          ({ layout, pages }: RouteConfig) =>
            layout === "auth" &&
            pages.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))
        )}
      </Routes>
    </div>
  );
}

Auth.displayName = "/src/layout/Auth.tsx";

export default Auth;
