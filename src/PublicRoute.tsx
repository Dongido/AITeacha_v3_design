import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

interface PublicRouteProps {
  redirectTo?: string;
}

export function PublicRoute({
  redirectTo = "/dashboard/home",
}: PublicRouteProps) {
  const token = Cookies.get("at-accessToken");

  if (token) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
