import React, { useEffect, useState, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  XMarkIcon,
  LifebuoyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Popover, Transition } from "@headlessui/react";
import {
  useMaterialTailwindController,
  setOpenSidenav,
} from "../../context/index";
import { Button } from "../ui/Button";
import Text from "../ui/Text";
import brandImg from "../../logo.png";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  useHover,
  useInteractions,
} from "@floating-ui/react";
import { createPortal } from "react-dom";

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
  const { sidenavColor, sidenavType, openSidenav } = controller as {
    sidenavColor: string;
    sidenavType: SidenavType;
    openSidenav: boolean;
  };

  const userDetails = JSON.parse(
    localStorage.getItem("ai-teacha-user") || "{}"
  );
  const isAdmin = userDetails.role === 1;

  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const sidenavTypes: Record<SidenavType, string> = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };

  const sidenavRef = React.useRef<HTMLDivElement>(null);
  const openSidenavRef = React.useRef(openSidenav);

  const handleToggle = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onToggle) {
      onToggle(newCollapsedState);
    }
  };

  useEffect(() => {
    openSidenavRef.current = openSidenav;
  }, [openSidenav]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        openSidenavRef.current &&
        sidenavRef.current &&
        !sidenavRef.current.contains(event.target as Node)
      ) {
        setOpenSidenav(dispatch, false);
      }
    }

    if (openSidenav && window.innerWidth < 1280) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openSidenav, dispatch]);

  return (
    <aside
      ref={sidenavRef}
      className={` routes-scroll-area ${sidenavTypes[sidenavType]} ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 h-[calc(100vh)] ${
        isCollapsed ? "w-28" : "w-72"
      } transition-transform duration-300 xl:translate-x-0`}
    >
      <div className="relative flex items-center justify-between p-4">
        <Link to={"/student"}>
          <div className="flex items-center">
            {brandImg && !isCollapsed && (
              <img src={brandImg} alt="Brand Logo" className="h-8 w-8 mr-2" />
            )}
            {!isCollapsed && (
              <Text variant="large" className="text-center text-black">
                {brandName}
              </Text>
            )}
          </div>
        </Link>
        <Button
          variant={"default"}
          className="p-2 rounded-full xl:inline-block hidden"
          onClick={handleToggle}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-5 w-5 text-gray-700" />
          ) : (
            <ChevronLeftIcon className="h-5 w-5 text-gray-700" />
          )}
        </Button>

        <Button
          variant={"default"}
          className="absolute right-0 top-0 p-2 rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-gray-700" />
        </Button>
      </div>

      {/* Routes Section */}
      <div
        className={`my-4 overflow-y-auto ${
          isCollapsed
            ? "max-h-[calc(100vh-140px)]"
            : "max-h-[calc(100vh-220px)]"
        }`}
      >
        {routes.map(({ layout, title, pages }, key) => (
          <ul key={key} className="mb-4 flex flex-col gap-1">
            {title && !isCollapsed && (
              <li className="mx-3.5 mt-4 mb-2 list-none">
                <Text
                  variant="small"
                  color={sidenavType === "dark" ? "white" : "blue-gray"}
                  className="font-black uppercase opacity-75"
                >
                  {title}
                </Text>
              </li>
            )}
            {pages.map(({ icon, name, path, adminOnly }) => {
              if (adminOnly && !isAdmin) return null;
              const fullPath = `/${layout}${path}`;

              // Floating UI and Headless UI for the hover popover
              const [isOpen, setIsOpen] = useState(false);
              const { refs, floatingStyles, context } = useFloating({
                open: isOpen,
                onOpenChange: setIsOpen,
                placement: "right-start",
                middleware: [offset(10), flip(), shift()],
                whileElementsMounted: autoUpdate,
              });

              const hover = useHover(context, {
                delay: 200, // Add a small delay to prevent accidental popovers
                move: false,
                enabled: isCollapsed, // Only enable on collapsed state
              });
              const { getReferenceProps, getFloatingProps } = useInteractions([
                hover,
              ]);

              return (
                <li key={name} className="list-none">
                  {isCollapsed ? (
                    <NavLink
                      to={fullPath}
                      className="focus:outline-none w-full"
                    >
                      {({ isActive }) => (
                        <div
                          ref={refs.setReference}
                          {...getReferenceProps()}
                          className="w-full flex justify-center"
                        >
                          <Button
                            variant={isActive ? "gradient" : "ghost"}
                            color={
                              isActive
                                ? sidenavColor
                                : sidenavType === "dark"
                                ? "white"
                                : "blue-gray"
                            }
                            className={`px-4 capitalize rounded-full justify-center hover:bg-[#d2a9f3] hover:text-white`}
                          >
                            <span className="w-6 flex items-center justify-center">
                              {icon}
                            </span>
                          </Button>
                          {isOpen &&
                            createPortal(
                              <div
                                ref={refs.setFloating}
                                style={floatingStyles}
                                {...getFloatingProps()}
                                className="z-[1000] min-w-max"
                              >
                                <Transition
                                  show={isOpen}
                                  enter="transition ease-out duration-200"
                                  enterFrom="opacity-0 translate-x-1"
                                  enterTo="opacity-100 translate-x-0"
                                  leave="transition ease-in duration-150"
                                  leaveFrom="opacity-100 translate-x-0"
                                  leaveTo="opacity-0 translate-x-1"
                                >
                                  <div
                                    className="relative capital bg-white border border-gray-200 rounded-xl shadow-xl text-sm p-2
                                    before:content-[''] before:absolute before:top-1/2 before:-left-2 before:-translate-y-1/2
                                    before:border-y-8 before:border-y-transparent before:border-r-8 before:border-r-gray-200 capitalize"
                                  >
                                    <div className="bg-white text-gray-800 font-bold text-sm px-3 py-1 rounded-md whitespace-nowrap">
                                      {name}
                                    </div>
                                  </div>
                                </Transition>
                              </div>,
                              document.body
                            )}
                        </div>
                      )}
                    </NavLink>
                  ) : (
                    <NavLink
                      to={fullPath}
                      onClick={() => {
                        if (window.innerWidth < 1280) {
                          setOpenSidenav(dispatch, false);
                        }
                      }}
                    >
                      {({ isActive }) => (
                        <Button
                          variant={isActive ? "gradient" : "ghost"}
                          color={
                            isActive
                              ? sidenavColor
                              : sidenavType === "dark"
                              ? "white"
                              : "blue-gray"
                          }
                          className={`w-full px-4 capitalize rounded-full flex items-center
                            hover:bg-[#d2a9f3] hover:text-white`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-6 flex items-center justify-center">
                              {icon}
                            </span>
                            <Text
                              color="inherit"
                              className="font-medium w-40 capitalize text-left"
                            >
                              {name}
                            </Text>
                          </div>
                        </Button>
                      )}
                    </NavLink>
                  )}
                </li>
              );
            })}
          </ul>
        ))}
      </div>
    </aside>
  );
}

Sidenav.displayName = "/src/widgets/layout/Sidenav.tsx";

export default Sidenav;
