import React, { useState, useEffect } from "react";
import { Popover } from "@headlessui/react";
import { Link, useLocation } from "react-router-dom";
import brandImg from "../../../logo.png";
import Cookies from "js-cookie";
import { MenuIcon, XIcon, ChevronDownIcon } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import {
  IconSupport,
  IconOne,
  IconTools,
  IconTwo,
  IconMission,
  IconPrivacy,
} from "./HeaderComponents";
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const token = Cookies.get("at-accessToken");
  const communities = [
    {
      name: "Pioneer Program",
      to: "/pioneer-program",
      description:
        "Track and analyze user interactions to improve learning outcomes.",
      icon: IconOne,
    },

    {
      name: "Heroes Wall",
      description: "Showcase achievements and celebrate learner milestones.",
      to: "/heroes-wall",
      icon: IconTwo,
    },
  ];

  const resources = [
    {
      name: "Support Center",
      to: "##",
      description: "Get help and find answers to your questions.",
      icon: IconSupport,
    },
    {
      name: "Educator Tools",
      description: "Leverage powerful tools designed for educators.",
      to: "##",
      icon: IconTools,
    },
  ];
  const about = [
    {
      name: "AI Teacha Mission",
      description: "Discover how we aim to revolutionize education with AI.",
      to: "##",
      icon: IconMission,
    },
    {
      name: "Privacy Policy",
      description: "Understand how we protect and use your data responsibly.",

      to: "##",
      icon: IconPrivacy,
    },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md dark:bg-gray-800" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                src={brandImg}
                className="mr-2 h-6 sm:h-9"
                alt="AI Teacha Logo"
              />
              <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                AI Teacha
              </span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center justify-center flex-1 space-x-8">
            <Popover className="relative">
              <Popover.Button
                className={`flex items-center  font-bold ${
                  location.pathname === "/communities"
                    ? "text-primary"
                    : "text-gray-900"
                }`}
              >
                Communities
                <ChevronDownIcon className="ml-1 h-5 w-5" />
              </Popover.Button>
              <Popover.Panel className="absolute z-10 mt-2 p-4 w-48 bg-white shadow-lg rounded-lg">
                {communities.map((item) => (
                  <Link
                    key={item.name}
                    to={item.to}
                    className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12">
                      <item.icon aria-hidden="true" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        {item.name}
                      </p>
                    </div>
                  </Link>
                ))}
              </Popover.Panel>
            </Popover>
            <Link
              to="/pricing"
              className={`block font-bold  ${
                location.pathname === "/pricing"
                  ? "text-primary"
                  : "text-gray-900"
              }`}
            >
              Pricing
            </Link>
            <Popover className="relative">
              <Popover.Button className="flex items-center block font-bold ">
                Resources
                <ChevronDownIcon className="ml-1 h-5 w-5" />
              </Popover.Button>
              <Popover.Panel className="absolute z-10 mt-2 p-4  w-48 bg-white shadow-lg rounded-lg">
                {resources.map((item) => (
                  <Link
                    key={item.name}
                    to={item.to}
                    className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12">
                      <item.icon aria-hidden="true" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        {item.name}
                      </p>
                    </div>
                  </Link>
                ))}
              </Popover.Panel>
            </Popover>
            <Popover className="relative">
              <Popover.Button
                className={`flex items-center font-bold ${
                  location.pathname === "/about"
                    ? "text-primary"
                    : "text-gray-900"
                }`}
              >
                About Us
                <ChevronDownIcon className="ml-1 h-5 w-5" />
              </Popover.Button>
              <Popover.Panel className="absolute z-10 mt-2 w-48 p-4 bg-white shadow-lg rounded-lg">
                {about.map((item) => (
                  <Link
                    key={item.name}
                    to={item.to}
                    className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12">
                      <item.icon aria-hidden="true" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        {item.name}
                      </p>
                    </div>
                  </Link>
                ))}
              </Popover.Panel>
            </Popover>
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            {token ? (
              <Link
                to="/dashboard/home"
                className="text-white bg-primary font-bold focus:ring-4 focus:ring-primary-300  rounded-full text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="text-gray-800 dark:text-white font-bold hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
                >
                  Log in
                </Link>
                <Link
                  to="/auth/onboarding"
                  className="text-white font-bold bg-primary focus:ring-4 focus:ring-primary-300 rounded-full text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
          <div className="lg:hidden">
            <Button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-900 dark:text-white focus:outline-none"
            >
              {menuOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        <div
          className={`${
            menuOpen ? "max-h-screen  bg-white" : "max-h-0 "
          } lg:hidden transition-[max-height,opacity] duration-500 ease-in-out overflow-hidden`}
        >
          <div className="flex flex-col space-y-4 mt-4">
            <Link
              to="/communities"
              className="text-gray-900 dark:text-white px-4 py-2"
            >
              Communities
            </Link>
            <Link
              to="/resources"
              className="text-gray-900 dark:text-white px-4 py-2"
            >
              Resources
            </Link>
            <Link
              to="/about"
              className="text-gray-900 dark:text-white px-4 py-2"
            >
              About Us
            </Link>
            {token ? (
              <Link
                to="/dashboard/home"
                className="text-white bg-primary font-bold focus:ring-4 focus:ring-primary-300  rounded-full text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="text-gray-800 dark:text-white font-bold hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
                >
                  Log in
                </Link>
                <Link
                  to="/auth/onboarding"
                  className="text-white font-bold bg-primary focus:ring-4 focus:ring-primary-300 rounded-full text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
