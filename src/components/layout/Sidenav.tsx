"use client";

import React, { useEffect, useState, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  LifebuoyIcon,
  XMarkIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { MdRefresh } from "react-icons/md";
import {
  useMaterialTailwindController,
  setOpenSidenav,
  setCollapsed,
} from "../../context/index";
import { Button } from "../ui/Button";
import brandImg from "../../logo.png";
import {
  Toast,
  ToastTitle,
  ToastDescription,
  ToastProvider,
  ToastViewport,
} from "../ui/Toast";
import { useDispatch, useSelector } from "react-redux";
import { loadUserProfile, selectUser } from "../../store/slices/profileSlice";
import type { AppDispatch } from "../../store";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "../ui/Tooltip";
import Zyra from "../../assets/img/zyra.svg"

interface RoutePage {
  icon: React.ReactNode;
  name: string;
  path: string;
  submenu?: RoutePage[];
}

interface Route {
  layout: string;
  title?: string;
  pages: RoutePage[];
}

interface SidenavProps {
  brandImg?: string;
  brandName?: string;
  routes: Route[];
  onToggle?: (collapsed: boolean) => void;
}

type SidenavType = "dark" | "white" | "transparent";

export function Sidenav({
  brandName = "AiTeacha",
  routes,
  onToggle,
}: SidenavProps) {
  const { controller, dispatch } = useMaterialTailwindController();
  const { sidenavType, openSidenav, collapsed: isCollapsed } = controller as {
    sidenavType: SidenavType;
    openSidenav: boolean;
    collapsed: boolean;
  };

  const appDispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const sidenavRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const userDetails = JSON.parse(localStorage.getItem("ai-teacha-user") || "{}");

  // ✅ Close sidenav when clicking outside (mobile)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openSidenav &&
        sidenavRef.current &&
        !sidenavRef.current.contains(event.target as Node)
      ) {
        setOpenSidenav(dispatch, false);
      }
    };
    if (openSidenav && window.innerWidth < 1024) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openSidenav, dispatch]);

  // ✅ Load user profile
  useEffect(() => {
    if (!user) {
      appDispatch(loadUserProfile());
    } else {
      localStorage.setItem("ai-teacha-user", JSON.stringify(user));
    }
  }, [user]);

  // ✅ Collapse toggle (desktop only)
  const handleToggle = () => {
    setCollapsed(dispatch, !isCollapsed);
    if (onToggle) onToggle(!isCollapsed);
  };

  // ✅ Manage dropdown expansion
  const [expanded, setExpanded] = useState<string | null>(null);
  const toggleExpand = (name: string) => {
    setExpanded((prev) => (prev === name ? null : name));
  };

  // ✅ Refresh Profile
  const handleRefreshProfile = async () => {
    try {
      await appDispatch(loadUserProfile()).unwrap();
      setToastMessage("Profile refreshed successfully!");
    } catch {
      setToastMessage("Failed to refresh profile");
    } finally {
      setToastVisible(true);
    }
  };

  // ✅ Responsive check
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const showFullSidebar = isMobile ? true : !isCollapsed;

  return (
    <TooltipProvider>
      {isMobile && openSidenav && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-[1px] z-40"
          onClick={() => setOpenSidenav(dispatch, false)}
        ></div>
      )}

      <aside
        ref={sidenavRef}
        className={`fixed top-0 left-0 z-50 h-screen transition-all duration-300 ease-in-out ${
          sidenavType === "dark"
            ? "bg-gray-900 text-white"
            : "bg-white text-gray-900"
        } ${showFullSidebar ? "w-72" : "w-20"} ${
          openSidenav ? "translate-x-0" : "-translate-x-80"
        }`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <Link to="/dashboard/home" className="flex items-center gap-2">
            <img src={brandImg} alt="Logo" className="h-8 w-8" />
            {showFullSidebar && (
              <h1 className="text-lg font-bold mt-3">{brandName}</h1>
            )}
          </Link>

          <Button
            variant="ghost"
            onClick={() => setOpenSidenav(dispatch, false)}
            className="xl:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <XMarkIcon className="h-5 w-5 text-gray-700" />
          </Button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div
          className={`flex-1 overflow-y-auto px-3 ${
            showFullSidebar
              ? "max-h-[calc(100vh-220px)]"
              : "max-h-[calc(100vh-160px)]"
          }`}
        >
          {/* 🌟 Zyra EduBot */}
          <div className="px-1 mb-2">
            <NavLink
              to="/dashboard/chats"
              onClick={() => isMobile && setOpenSidenav(dispatch, false)}
              className={`flex items-center   rounded-md font-semibold transition-all bg-[#EFE6FD] text-sm ${showFullSidebar ? "px-3 py-2 gap-3" : "p-2"}    ${
                location.pathname.includes("/zyra-edubot")
                  ? "bg-[#EFE6FD] text-[#6200EE] border-r-4 border-[#6200EE]"
                  : "text-gray-800 hover:bg-[#efe6fd] hover:text-[#6200EE]"
              }`}
            >
              <div className="relative flex items-center gap-3">
                <img
                  src={Zyra}
                  alt="Zyra"
                  className="h-8 w-8 rounded-full object-cover"
                />
                {showFullSidebar && (
                  <div className="flex flex-col">
                    <span className="font-semibold text-[16px] text-[#2A2929]">Zyra</span>
                    <span className="text-xs text-[#6200EE]">Your Edubot</span>
                  </div>
                )}
              </div>
            </NavLink>
          </div>

          {/* MAIN NAVIGATION */}
          {routes.map(({ layout, title, pages }, index) => (
            <ul key={index} className="mb-4 flex flex-col gap-1">
              {showFullSidebar && title && (
                <li className="px-3 py-1 text-xs font-bold text-gray-500 uppercase">
                  {title}
                </li>
              )}

              {pages.map(({ icon, name, path, submenu }) => {
                const fullPath = `/${layout}${path}`;
                const isActive =
                  location.pathname === fullPath ||
                  submenu?.some(
                    (sub) => location.pathname === `/${layout}${sub.path}`
                  );
                const isExpanded = expanded === name;

                return (
                  <li key={name}>
                    <NavLink
                      to={submenu ? "#" : fullPath}
                      onClick={(e) => {
                        if (submenu) {
                          e.preventDefault();
                          toggleExpand(name);
                        } else if (isMobile) {
                          setOpenSidenav(dispatch, false);
                        }
                      }}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-md transition-all font-medium capitalize ${
                        isActive
                          ? "bg-[#EFE6FD] text-[#6200EE] border-r-4 border-[#6200EE]"
                          : "text-gray-800 hover:bg-[#efe6fd] hover:text-[#6200EE]"
                      }`}
                    >
                      <div
                        className={`flex items-center ${
                          showFullSidebar ? "gap-3" : "justify-center w-full"
                        }`}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-lg">{icon}</span>
                          </TooltipTrigger>
                          {!showFullSidebar && (
                            <TooltipContent
                              side="right"
                              className="bg-gray-900 text-white border-none"
                            >
                              {name}
                            </TooltipContent>
                          )}
                        </Tooltip>
                        {showFullSidebar && <span>{name}</span>}
                      </div>

                      {submenu && showFullSidebar && (
                        <ChevronDownIcon
                          className={`h-4 w-4 ml-auto transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </NavLink>

                    {submenu && isExpanded && (
                      <ul className="ml-5 mt-2 border-l border-gray-200 pl-2">
                        {submenu.map(
                          ({ icon: subIcon, name: subName, path: subPath }) => {
                            const subFullPath = `/${layout}${subPath}`;
                            const subActive =
                              location.pathname === subFullPath;
                            return (
                              <li key={subName}>
                                <NavLink
                                  to={subFullPath}
                                  onClick={() =>
                                    isMobile && setOpenSidenav(dispatch, false)
                                  }
                                  className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                                    subActive
                                      ? "text-[#6200EE] bg-[#EFE6FD]"
                                      : "text-gray-700 hover:bg-[#efe6fd]"
                                  }`}
                                >
                                  <span className="text-sm">{subIcon}</span>
                                  {showFullSidebar && <span>{subName}</span>}
                                </NavLink>
                              </li>
                            );
                          }
                        )}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          ))}
        </div>

        {/* FOOTER */}
        <div className="p-3 bg-[#EFE6FD] rounded-2xl mx-2 bottom-1 lg:-mt-[10%] -mt-[5%] relative z-100">
          {showFullSidebar ? (
            <>
              <p className="text-sm font-semibold text-[#6200EE] mb-1">
                Current Plan
              </p>
              <p className="text-base font-semibold text-[#000] mb-3">
                {userDetails.package || "A.I Teacha Basic"}
              </p>
              <Link
                to="/dashboard/upgrade"
                className="bg-[#6200EE] text-white flex justify-center py-2 rounded-full"
              >
                ↑ Upgrade
              </Link>
              <Button
                variant="outline"
                onClick={handleRefreshProfile}
                className="w-full text-[#6200EE] font-semibold"
              >
                <MdRefresh className="mr-2" /> Refresh Profile
              </Button>
              {/* <Button
                variant="ghost"
                className="text-[#000] w-full flex items-center justify-center gap-2 font-medium"
              >
                <LifebuoyIcon className="h-5 w-5" />
                Contact Support
              </Button> */}
            </>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <MdRefresh
                onClick={handleRefreshProfile}
                className="text-[#6200EE] text-2xl cursor-pointer"
              />
              <LifebuoyIcon className="h-5 w-5 text-[#6200EE]" />
            </div>
          )}
        </div>
      </aside>

      {/* TOAST */}
      <ToastProvider swipeDirection="right">
        {toastVisible && (
          <Toast
            open={toastVisible}
            onOpenChange={setToastVisible}
            duration={3000}
          >
            <ToastTitle>Status</ToastTitle>
            <ToastDescription>{toastMessage}</ToastDescription>
          </Toast>
        )}
        <ToastViewport className="fixed bottom-0 right-0 p-4 w-[300px]" />
      </ToastProvider>
    </TooltipProvider>
  );
}

Sidenav.displayName = "/src/widgets/layout/Sidenav.tsx";
export default Sidenav;