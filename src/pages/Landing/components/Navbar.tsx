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
  IconBlog,
  IconFAQ,
  IconTwo,
  IconMission,
  IconPrivacy,
} from "./HeaderComponents";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
      to: "/communities/pioneer-program",
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
    {
      name: "Schools Onboarding Program",
      description:
        "A program to onboard schools effortlessly, empowering educators with innovative tools to enhance teaching and streamline operations.",
      to: "/communities/pioneers",
      icon: IconTwo,
    },
  ];

  const resources = [
    {
      name: "Support Center",
      to: "/contact",
      description: "Get help and find answers to your questions.",
      icon: IconSupport,
    },
    {
      name: "Educator Tools",
      description: "Leverage powerful tools designed for educators.",
      to: "/educator-tools",
      icon: IconTools,
    },
    {
      name: "Student Tools",
      description: "Leverage powerful tools designed for students.",
      to: "/student-tools",
      icon: IconFAQ,
    },
  ];
  const about = [
    {
      name: "AI Teacha Mission",
      description: "Discover how we aim to revolutionize education with AI.",
      to: "/mission",
      icon: IconMission,
    },
    {
      name: "Legal Terms",
      description:
        "Understand how we protect and use your data responsibly,and learn about the guidelines and agreements for using our services responsibly and securely.",
      to: "/legal-terms",
      icon: IconPrivacy,
    },

    {
      name: "FAQ",
      description:
        "Find answers to frequently asked questions about our services.",
      to: "/faqs",
      icon: IconFAQ,
    },
    {
      name: "Blog",
      description:
        "Explore articles and updates about education and technology.",
      to: "/blogs",
      icon: IconBlog,
    },
    {
      name: "Contact Us",
      description:
        "Reach out to us for support, feedback, or collaboration opportunities. We're here to help!",

      to: "/contact",
      icon: IconTwo,
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
                Community
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
              <Popover.Button
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                className="flex items-center block font-bold"
              >
                Resources
                <ChevronDownIcon className="ml-1 h-5 w-5" />
              </Popover.Button>
              {isOpen && (
                <Popover.Panel className="absolute z-10 mt-2 p-4 w-48 bg-white shadow-lg rounded-lg">
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
              )}
            </Popover>
            <Popover className="relative">
              <Popover.Button
                className={`flex items-center font-bold ${
                  location.pathname === "/about"
                    ? "text-primary"
                    : "text-gray-900"
                }`}
              >
                About AI Teacha
                <ChevronDownIcon className="ml-1 h-5 w-5" />
              </Popover.Button>
              <Popover.Panel className="absolute z-10 mt-2 w-64 p-4 bg-white shadow-lg rounded-lg">
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
                      <p className="text-sm font-medium whitespace-nowrap text-gray-900">
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

        <Drawer
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          direction="left"
          className="lg:hidden px-6  pt-12"
        >
          <div className="flex flex-col space-y-4 mt-4">
            <Popover className="relative">
              <Popover.Button
                className={`flex items-center  font-bold ${
                  location.pathname === "/communities"
                    ? "text-primary"
                    : "text-gray-900"
                }`}
              >
                Community
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
              <Popover.Button
                onMouseEnter={() => setIsOpen(true)}
                className="flex items-center block font-bold"
              >
                Resources
                <ChevronDownIcon className="ml-1 h-5 w-5" />
              </Popover.Button>
              {isOpen && (
                <Popover.Panel className="absolute z-10 mt-2 p-4 w-48 bg-white shadow-lg rounded-lg">
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
              )}
            </Popover>
            <Popover className="relative">
              <Popover.Button
                className={`flex items-center font-bold ${
                  location.pathname === "/about"
                    ? "text-primary"
                    : "text-gray-900"
                }`}
              >
                About AI Teacha
                <ChevronDownIcon className="ml-1 h-5 w-5" />
              </Popover.Button>
              <Popover.Panel className="absolute z-10 mt-2 w-64 p-4 bg-white shadow-lg rounded-lg">
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
                      <p className="text-sm font-medium whitespace-nowrap text-gray-900">
                        {item.name}
                      </p>
                    </div>
                  </Link>
                ))}
              </Popover.Panel>
            </Popover>
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
        </Drawer>
      </nav>
    </header>
  );
};

export default Navbar;
