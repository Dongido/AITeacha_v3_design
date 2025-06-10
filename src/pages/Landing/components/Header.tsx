import { useState, useEffect } from "react";
import { Dialog, Disclosure, Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { Link, useLocation } from "react-router-dom";
import brandImg from "../../../logo.png";
import Cookies from "js-cookie";
import { Fragment } from "react";
import { solutions, resources } from "./HeaderComponents";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const location = useLocation();
  const [showCommunityPopup, setShowCommunityPopup] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);

    const sections = document.querySelectorAll("section");
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.3,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );
    sections.forEach((section) => observer.observe(section));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const token = Cookies.get("at-accessToken");
  const scrollToSectionOnHome = (id: string) => {
    if (window.location.pathname === "/") {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      setTimeout(() => scrollToSectionOnHome(hash), 100);
    }
  }, [location]);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md dark:bg-gray-800" : "bg-transparent"
      }`}
    >
      <nav className="border-gray-200 px-2 lg:px-12 py-2.5">
        <div className="flex flex-wrap justify-between items-center mx-auto py-3">
          <Link to="/" className="flex items-center">
            <img
              src={brandImg}
              className="mr-2 h-6 sm:h-9"
              alt="AiTeacha Logo"
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              AiTeacha
            </span>
          </Link>
          <div className="flex items-center lg:order-2">
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
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              type="button"
              className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="mobile-menu-2"
              aria-expanded={menuOpen ? "true" : "false"}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <div className="relative">
            <nav className="bg-white px-4 lg:px-6 py-2.5 ">
              <div className="container flex flex-wrap items-center justify-between mx-auto">
                <div
                  className={`${
                    menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
                  } lg:flex lg:opacity-100 lg:max-h-full lg:relative lg:bg-transparent absolute top-full left-0 w-full bg-white lg:w-auto z-40 lg:z-auto transition-[max-height,opacity] duration-500 ease-in-out overflow-hidden`}
                  id="mobile-menu-2"
                >
                  <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                    <li>
                      {" "}
                      <div className="fixed w-full max-w-sm px-4">
                        <Popover className="relative">
                          {({ open }) => (
                            <>
                              <Popover.Button
                                className={`
                ${open ? "text-black" : "text-black/90"}
                group inline-flex items-center py-2 text-base font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75`}
                              >
                                <span>Communities</span>
                                <ChevronDownIcon
                                  className={`${
                                    open ? "text-black" : "text-black/70"
                                  }
                  ml-2 h-5 w-5 transition duration-150 ease-in-out group-hover:text-primary`}
                                  aria-hidden="true"
                                />
                              </Popover.Button>
                              <Transition
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1"
                              >
                                <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl">
                                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                                    <div className="relative grid gap-8 bg-white p-7 lg:grid-cols-2">
                                      {solutions.map((item) => (
                                        <a
                                          key={item.name}
                                          href={item.href}
                                          className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50"
                                        >
                                          <div className="flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12">
                                            <item.icon aria-hidden="true" />
                                          </div>
                                          <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-900">
                                              {item.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                              {item.description}
                                            </p>
                                          </div>
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                </Popover.Panel>
                              </Transition>
                            </>
                          )}
                        </Popover>
                      </div>
                    </li>
                    <li>
                      <Link
                        to="/pricing"
                        className={`block py-2 ml-36 font-bold pr-2 pl-2 lg:p-2 ${
                          location.pathname === "/pricing"
                            ? "text-primary"
                            : "text-gray-900"
                        }`}
                      >
                        Pricing
                      </Link>
                    </li>

                    <li>
                      {" "}
                      <div className="fixed w-full max-w-sm px-4">
                        <Popover className="relative">
                          {({ open }) => (
                            <>
                              <Popover.Button
                                className={`
                ${open ? "text-black" : "text-black/90"}
                group inline-flex items-center py-2 text-base font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75`}
                              >
                                <span>Resources</span>
                                <ChevronDownIcon
                                  className={`${
                                    open ? "text-black" : "text-black/70"
                                  }
                  ml-2 h-5 w-5 transition duration-150 ease-in-out group-hover:text-primary`}
                                  aria-hidden="true"
                                />
                              </Popover.Button>
                              <Transition
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1"
                              >
                                <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl">
                                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                                    <div className="relative grid gap-8 bg-white p-7 lg:grid-cols-2">
                                      {resources.map((item) => (
                                        <a
                                          key={item.name}
                                          href={item.href}
                                          className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50"
                                        >
                                          <div className="flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12">
                                            <item.icon aria-hidden="true" />
                                          </div>
                                          <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-900">
                                              {item.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                              {item.description}
                                            </p>
                                          </div>
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                </Popover.Panel>
                              </Transition>
                            </>
                          )}
                        </Popover>
                      </div>
                    </li>

                    <li>
                      <Link
                        to="/about"
                        className={`block py-2 ml-36 font-bold pr-2 pl-2 lg:p-2 ${
                          location.pathname === "/about"
                            ? "text-primary"
                            : "text-gray-900"
                        }`}
                      >
                        About Us
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
