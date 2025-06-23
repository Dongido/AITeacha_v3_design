import React, { useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  XMarkIcon,
  LifebuoyIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import {
  useMaterialTailwindController,
  setOpenSidenav,
} from "../../context/index";
import { Button } from "../ui/Button";
import Text from "../ui/Text";
import brandImg from "../../logo.png";
import { setOpenConfigurator } from "../../context/index";
import { useDispatch, useSelector } from "react-redux";
import { loadUserProfile, selectUser } from "../../store/slices/profileSlice";
import { AppDispatch } from "../../store";
interface RoutePage {
  icon: React.ReactNode;
  name: string;
  path: string;
  adminOnly?: boolean;
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
  const { sidenavColor, sidenavType, openSidenav } = controller as {
    sidenavColor: string;
    sidenavType: SidenavType;
    openSidenav: boolean;
  };

  const appdispatch = useDispatch<AppDispatch>();

  const user = useSelector(selectUser);
  const loading = useSelector((state: any) => state.profile.loading);
  const error = useSelector((state: any) => state.profile.error);

  const userDetails = JSON.parse(
    localStorage.getItem("ai-teacha-user") || "{}"
  );

  useEffect(() => {
    if (!user) {
      appdispatch(loadUserProfile());
    }
    if (user) {
      localStorage.setItem("ai-teacha-user", JSON.stringify(user));
      console.log(user);
    }
  }, [dispatch, user]);

  console.log(userDetails.package);
  const isAdmin = userDetails.role === 1 || userDetails.role_id === 1;

  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const sidenavTypes: Record<SidenavType, string> = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };

  const sidenavRef = React.useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onToggle) {
      onToggle(newCollapsedState);
    }
  };

  return (
    <aside
      ref={sidenavRef}
      className={`${sidenavTypes[sidenavType]} ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 h-[calc(100vh)] ${
        isCollapsed ? "w-28 " : "w-72"
      } transition-transform duration-300 xl:translate-x-0`}
    >
      <div className="relative flex items-center justify-between p-4">
        <Link to={"/dashboard/home"}>
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
            ? "max-h-[calc(100vh-140px)] "
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
            {pages.map(({ icon, name, path, adminOnly, submenu }) => {
              if (adminOnly && !isAdmin) return null;

              const fullPath = `/${layout}${path}`;
              const [isExpanded, setIsExpanded] = React.useState(false);
              const location = useLocation();

              React.useEffect(() => {
                if (
                  submenu?.some(
                    (sub) => location.pathname === `/${layout}${sub.path}`
                  )
                ) {
                  setIsExpanded(true);
                }
              }, [location.pathname, submenu]);
              const keywords = ["premium", "resource"];
              const isPremium = keywords.some((keyword) =>
                name.toLowerCase().includes(keyword)
              );

              return (
                <li key={name} className="menu-item list-none">
                  <NavLink
                    to={!submenu ? fullPath : "#"}
                    onClick={() => {
                      if (submenu) {
                        setIsExpanded(!isExpanded);
                      } else if (window.innerWidth < 1280) {
                        setOpenSidenav(dispatch, false);
                      }
                    }}
                  >
                    {({ isActive }) => (
                      <Button
                        variant={
                          isPremium ? "ghost" : isActive ? "gradient" : "ghost"
                        }
                        color={
                          isActive
                            ? sidenavColor
                            : sidenavType === "dark"
                            ? "white"
                            : "blue-gray"
                        }
                        className={`w-full px-4 capitalize rounded-full ${
                          isCollapsed ? "justify-center" : "flex items-center"
                        } hover:bg-[#d2a9f3] hover:text-white`}
                      >
                        <div className="flex items-center gap-2 w-full">
                          <span className="w-6 flex items-center justify-center">
                            {icon}
                          </span>
                          {!isCollapsed && (
                            <Text
                              color="inherit"
                              className="font-medium capitalize text-left flex-1"
                            >
                              {name}
                            </Text>
                          )}
                          {submenu && (
                            <span
                              className={`ml-auto transition-transform ${
                                isExpanded ? "rotate-90" : ""
                              }`}
                            >
                              ▶
                            </span>
                          )}
                        </div>
                      </Button>
                    )}
                  </NavLink>

                  {/* Render submenu */}
                  {submenu && isExpanded && (
                    <ul className="submenu ml-0 mt-2">
                      {submenu.map(
                        ({ icon: subIcon, name: subName, path: subPath }) => (
                          <li key={subName} className="submenu-item list-none">
                            <NavLink
                              to={`/${layout}${subPath}`} // Full submenu path
                              onClick={() => {
                                if (window.innerWidth < 1280) {
                                  setOpenSidenav(dispatch, false);
                                }
                              }}
                            >
                              {({ isActive }) => (
                                <Button
                                  variant={isActive ? "gradient" : "ghost"}
                                  color={isActive ? sidenavColor : "blue-gray"}
                                  className={`w-full px-4 capitalize rounded-full ${
                                    isCollapsed
                                      ? "justify-center"
                                      : "flex items-center"
                                  } hover:bg-[#d2a9f3] hover:text-white`}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="w-6 flex items-center justify-center">
                                      {subIcon}
                                    </span>
                                    {!isCollapsed && (
                                      <Text
                                        color="inherit"
                                        className="font-medium capitalize text-left"
                                      >
                                        {subName}
                                      </Text>
                                    )}
                                  </div>
                                </Button>
                              )}
                            </NavLink>
                          </li>
                        )
                      )}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        ))}
      </div>

      {!isCollapsed && (
        <div className="absolute bottom-4 bg-white left-4 right-4">
          <Button
            variant="ghost"
            color={sidenavColor}
            className="w-full rounded-full flex items-center justify-center gap-2"
          >
            <LifebuoyIcon className="h-5 w-5" />
            <span>Support</span>
          </Button>
          <Button
            variant="outlined"
            color="blue-gray"
            className="w-full mb-2 bg-gray-200 rounded-full hover:bg-gray-400"
          >
            Current Plan: {userDetails.package}
          </Button>
          <Button
            variant="black"
            color={sidenavColor}
            onClick={() => setOpenConfigurator(dispatch, true)}
            aria-label="Open configurator"
            className="w-full rounded-full flex items-center justify-center gap-2"
          >
            <Cog6ToothIcon className="h-5 w-5" />
            <span>Account Settings</span>
          </Button>
        </div>
      )}
    </aside>
  );
}

Sidenav.displayName = "/src/widgets/layout/Sidenav.tsx";

export default Sidenav;
