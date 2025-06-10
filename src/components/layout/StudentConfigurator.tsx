import React, { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Switch } from "../ui/Switch";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setFixedNavbar,
} from "../../context/index";
import { Button } from "../ui/Button";
import Text from "../ui/Text";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
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

export function StudentConfigurator() {
  const { controller, dispatch } = useMaterialTailwindController();
  const { openConfigurator, sidenavColor, sidenavType, fixedNavbar } =
    controller;
  const [stars, setStars] = useState<string>("");
  const navigate = useNavigate();
  const sidenavColors: Record<string, string> = {
    white: "from-gray-100 to-gray-100 border-gray-200",
    dark: "from-black to-black border-gray-200",
    green: "from-green-400 to-green-600",
    orange: "from-orange-400 to-orange-600",
    red: "from-red-400 to-red-600",
    pink: "from-pink-400 to-pink-600",
  };

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

  const handleLogout = () => {
    Cookies.remove("at-accessToken");
    Cookies.remove("at-refreshToken");
    localStorage.removeItem("ai-teacha-user");
    localStorage.removeItem("redirectPath");
    navigate("/auth/login");
  };
  return (
    <aside
      className={`fixed top-0 right-0 z-50 h-screen w-96 bg-white px-2.5 shadow-lg transition-transform duration-300 ${
        openConfigurator ? "translate-x-0" : "translate-x-96"
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
          onClick={() => setOpenConfigurator(dispatch, false)}
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

        <Button
          className="w-full  text-white hover:bg-gray-800 rounded-md transition duration-300"
          variant={"destructive"}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </aside>
  );
}

StudentConfigurator.displayName = "/src/widgets/layout/StudentConfigurator.tsx";

export default StudentConfigurator;
