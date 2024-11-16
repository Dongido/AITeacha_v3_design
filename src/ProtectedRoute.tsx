import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

interface ProtectedRouteProps {
  redirectTo?: string;
}

export function ProtectedRoute({
  redirectTo = "/auth/login",
}: ProtectedRouteProps) {
  const token = Cookies.get("at-accessToken");

  if (!token) {
    console.log("Saving redirect path:", location.pathname);
    localStorage.setItem("redirectPath", location.pathname);
    return <Navigate to={redirectTo} replace />;
  }
  return <Outlet />;
}
