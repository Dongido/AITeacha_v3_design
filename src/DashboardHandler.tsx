import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "./interfaces";
import { setAuthData } from "./store/slices/authSlice";

const DashboardHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const accessToken = queryParams.get("accessToken");
    const refreshToken = queryParams.get("refreshToken");

    if (accessToken && refreshToken) {
      try {
        const decodedToken = jwtDecode(accessToken) as DecodedToken;

        Cookies.set("at-accessToken", accessToken, { expires: 7 });
        Cookies.set("at-refreshToken", refreshToken, { expires: 7 });

        const userDetails = {
          id: decodedToken.id,
          email: decodedToken.uemail,
          role: decodedToken.role,
          package: decodedToken.package,
          firstname: decodedToken.firstname,
          is_email_verified: decodedToken.is_email_verified,
          imageurl: decodedToken.imageurl,
        };

        localStorage.setItem("ai-teacha-user", JSON.stringify(userDetails));

        dispatch(
          setAuthData({
            token: accessToken,
            user: {
              id: decodedToken.id,
              email: decodedToken.uemail,
              role: decodedToken.role,
            },
          })
        );

        navigate("/dashboard/home", { replace: true });
      } catch (error) {
        console.error("Error decoding token:", error);
        navigate("/dashboard/home", { replace: true });
      }
    } else {
      navigate("/dashboard/home", { replace: true });
    }
  }, [location, navigate, dispatch]);

  return null;
};

export default DashboardHandler;
