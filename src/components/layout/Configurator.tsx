import React, { useEffect, useState, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Switch } from "../ui/Switch";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
} from "../../context/index";
import { Button } from "../ui/Button";
import Text from "../ui/Text";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadUserProfile, selectUser } from "../../store/slices/profileSlice";
import { AppDispatch } from "../../store";

function formatNumber(number: number, decPlaces: number): string {
  const dec = Math.pow(10, decPlaces);
  const abbrev = ["K", "M", "B", "T"];

  for (let i = abbrev.length - 1; i >= 0; i--) {
    const size = Math.pow(10, (i + 1) * 3);
    if (size <= number) {
      number = Math.round((number * dec) / size) / dec;
      if (number === 1000 && i < abbrev.length - 1) {
        number = 1;
        i++;
      }
      return number + abbrev[i];
    }
  }
  return number.toString();
}

export function Configurator() {
  const { controller, dispatch: contextDispatch } =
    useMaterialTailwindController();
  const { openConfigurator } = controller;
  const [stars, setStars] = useState<string>("");
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const userDetails = useSelector(selectUser);
  const [isRefreshingProfile, setIsRefreshingProfile] =
    useState<boolean>(false);

  const configuratorRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch(
      "https://api.github.com/repos/creativetimofficial/material-tailwind-dashboard-react"
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.stargazers_count) {
          setStars(formatNumber(data.stargazers_count, 1));
        }
      })
      .catch((error) => console.error("Failed to fetch star count:", error));
  }, []);

  useEffect(() => {
    if (!userDetails && !isRefreshingProfile) {
      setIsRefreshingProfile(true);
      dispatch(loadUserProfile()).finally(() => {
        setIsRefreshingProfile(false);
      });
    }
  }, [userDetails, dispatch, isRefreshingProfile]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        openConfigurator &&
        configuratorRef.current &&
        !configuratorRef.current.contains(event.target as Node)
      ) {
        setOpenConfigurator(contextDispatch, false);
      }
    }

    if (openConfigurator) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openConfigurator, contextDispatch]);

  const getUpgradeText = (): string => {
    if (userDetails?.package === "AI Teacha Enterprise") {
      return "You're all set with AI Teacha Enterprise.";
    } else if (userDetails?.package === "AI Teacha Pro") {
      return "Upgrade to Premium";
    } else if (userDetails?.package === "AI Teacha Premium") {
      return "You're all set with AI Teacha Premium.";
    } else {
      return "Upgrade to Pro";
    }
  };

  const upgradeText = getUpgradeText();
  const upgradeLink = "/dashboard/upgrade";

  const handleLogout = (): void => {
    Cookies.remove("at-accessToken");
    Cookies.remove("at-refreshToken");
    localStorage.removeItem("ai-teacha-user");
    localStorage.removeItem("redirectPath");
    navigate("/auth/login");
  };

  const handleRefreshProfile = async (): Promise<void> => {
    setIsRefreshingProfile(true);
    try {
      await dispatch(loadUserProfile());
    } catch (error) {
      console.error("Failed to refresh user profile:", error);
    } finally {
      setIsRefreshingProfile(false);
    }
  };

  return (
    <aside
      ref={configuratorRef}
      className={`fixed top-0 right-0 z-50 h-screen w-96 bg-white px-2.5 shadow-lg transition-transform duration-300 ${
        openConfigurator ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-start justify-between px-6 pt-8 pb-6">
        <div>
          <Text className="font-normal text-blue-gray-600">
            Account Settings.
          </Text>
        </div>
        <Button
          variant="text"
          color="blue-gray"
          onClick={() => setOpenConfigurator(contextDispatch, false)}
          aria-label="Close configurator"
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex flex-col gap-4 px-6">
        <Link to={"/"}>
          <Button className="w-full hover:bg-gray-100 transition duration-300">
            Go to Home
          </Button>
        </Link>

        {userDetails?.role_id !== 3 && (
          <Link to={"/dashboard/wallet"}>
            <Button className="w-full hover:bg-gray-100 transition duration-300">
              Wallet Settings
            </Button>
          </Link>
        )}

        {userDetails && userDetails.role_id !== 3 && (
          <Link to={upgradeLink}>
            <Button className="flex hover:bg-pink-200 items-center bg-pink-100 text-black font-semibold py-2 px-4 rounded-md text-sm w-full">
              {upgradeText}
            </Button>
          </Link>
        )}

        <Button
          className="w-full hover:bg-gray-100 transition duration-300"
          onClick={handleRefreshProfile}
          disabled={isRefreshingProfile}
        >
          {isRefreshingProfile ? "Refreshing..." : "Refresh Profile"}
        </Button>

        <Button
          className="w-full text-white hover:bg-gray-800 rounded-md transition duration-300"
          variant={"destructive"}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </aside>
  );
}

Configurator.displayName = "/src/widgets/layout/Configurator.tsx";

export default Configurator;
