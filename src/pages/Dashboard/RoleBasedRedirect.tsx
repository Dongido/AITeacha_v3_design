import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const RoleBasedRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    const userDetails = JSON.parse(
      localStorage.getItem("ai-teacha-user") || "{}"
    );

    if (userDetails?.role === 2) {
      navigate(`/dashboard${currentPath}`);
    } else if (userDetails?.role === 3) {
      navigate(`/student${currentPath}`);
    } else {
      navigate(`/dashboard${currentPath}`);
    }
  }, [location, navigate]);

  return null;
};

export default RoleBasedRedirect;
