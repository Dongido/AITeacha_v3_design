"use client";

import React, { useEffect, useState, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  LifebuoyIcon,
  XMarkIcon,
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

interface RoutePage {
  icon: React.ReactNode;
  name: string;
  path: string;
  adminOnly?: boolean;
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
  const isAdmin = userDetails.role === 1 || userDetails.role_id === 1;

  // 🧩 Close sidenav when clicking outside (mobile)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        openSidenav &&
        sidenavRef.current &&
        !sidenavRef.current.contains(event.target as Node)
      ) {
        setOpenSidenav(dispatch, false);
      }
    }

    if (openSidenav && window.innerWidth < 1024) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openSidenav, dispatch]);

  // 🧠 Load user profile
  useEffect(() => {
    if (!user) {
      appDispatch(loadUserProfile());
    } else {
      localStorage.setItem("ai-teacha-user", JSON.stringify(user));
    }
  }, [user]);

  // 🧭 Collapse toggle (desktop only)
  const handleToggle = () => {
    setCollapsed(dispatch, !isCollapsed);
    if (onToggle) onToggle(!isCollapsed);
  };

  // 📱 Prevent collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(dispatch, false); // always expanded on mobile
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  // 🔄 Refresh profile
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
      {/* ✅ Overlay for mobile */}
      {isMobile && openSidenav && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-[1px] z-40 transition-opacity duration-300"
          onClick={() => setOpenSidenav(dispatch, false)}
        ></div>
      )}

      <aside
        ref={sidenavRef}
        className={`fixed top-0 left-0 z-50 h-screen transition-all duration-300 ease-in-out
          ${
            sidenavType === "dark"
              ? "bg-gray-900 text-white"
              : "bg-white text-gray-900"
          }
          ${showFullSidebar ? "w-72" : "w-20"}
          ${openSidenav ? "translate-x-0" : "-translate-x-80"}
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <Link to="/dashboard/home" className="flex items-center gap-2">
            {showFullSidebar && (
              <>
                <img src={brandImg} alt="Logo" className="h-8 w-8" />
                <h1 className="text-lg font-bold mt-2">{brandName}</h1>
              </>
            )}
          </Link>

          {/* Collapse toggle (desktop only) */}
          {/* <Button
            variant="ghost"
            onClick={handleToggle}
            className="hidden xl:flex p-2 rounded-md hover:bg-gray-100"
          >
            {isCollapsed ? (
              <ChevronRightIcon className="h-5 w-5 text-gray-600" />
            ) : (
              <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
            )}
          </Button> */}

          {/* Close (mobile only) */}
          <Button
            variant="ghost"
            onClick={() => setOpenSidenav(dispatch, false)}
            className="xl:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <XMarkIcon className="h-5 w-5 text-gray-700" />
          </Button>
        </div>

        {/* NAVIGATION */}
        <div
          className={`flex-1 overflow-y-auto ${
            showFullSidebar
              ? "max-h-[calc(100vh-250px)]"
              : "max-h-[calc(100vh-160px)]"
          } px-3 py-4`}
        >
          {routes.map(({ layout, title, pages }, index) => (
            <ul key={index} className="mb-4 flex flex-col gap-1">
              {showFullSidebar && title && (
                <li className="px-3 py-1 text-xs font-bold text-gray-500 uppercase">
                  {title}
                </li>
              )}

              {pages.map(({ icon, name, path, adminOnly }) => {
                if (adminOnly && !isAdmin) return null;
                const fullPath = `/${layout}${path}`;
                const isActive = location.pathname === fullPath;

                return (
                  <li key={name}>
                    <NavLink
                      to={fullPath}
                      className={`flex items-center capitalize ${
                        showFullSidebar ? "gap-3" : "justify-center"
                      } px-3 py-2.5 rounded transition-all font-medium ${
                        isActive
                          ? "text-[#6200EE] bg-[#EFE6FD] font-semibold border-r-4 border-[#6200EE]"
                          : "text-gray-800 hover:bg-[#efe6fd] hover:text-[#6200EE]"
                      }`}
                      onClick={() => {
                        if (isMobile) setOpenSidenav(dispatch, false);
                      }}
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
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          ))}
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-[#EFE6FD] rounded-t-2xl border-t border-gray-200 ml-2 mr-2">
          {showFullSidebar ? (
            <>
              <p className="text-sm font-semibold text-[#6200EE] mb-1">
                Current Plan
              </p>
              <p className="text-base font-semibold text-[#000000] mb-4">
                {userDetails.package || "A.I Teacha Basic"}
              </p>
              <div className="bg-[#6200EE] rounded-full">
                <Link
                  to="/dashboard/upgrade"
                  className="bg-[#6200EE] text-white flex justify-center py-2 rounded-full transition-all"
                >
                  ↑ Upgrade
                </Link>
              </div>
              <Button
                variant="outline"
                onClick={handleRefreshProfile}
                className="w-full text-[#6200EE] font-semibold bg-transparent mt-2"
              >
                <MdRefresh className="mr-2" /> Refresh Profile
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Button
                className="bg-[#6200EE] text-white rounded-full p-2 hover:bg-[#7a22ef]"
                onClick={handleRefreshProfile}
              >
                ↑
              </Button>
              <MdRefresh
                onClick={handleRefreshProfile}
                className="text-[#6200EE] text-2xl cursor-pointer"
              />
            </div>
          )}
        </div>

        {showFullSidebar && (
          <div>
            <Button
              variant="ghost"
              className="text-[#000] w-full flex items-center justify-center gap-2 font-medium"
            >
              <LifebuoyIcon className="h-5 w-5" />
              Contact Support
            </Button>
          </div>
        )}
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
