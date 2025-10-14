"use client"

// import React, { useEffect, useState, useRef } from "react";
// import { Link, NavLink, useLocation } from "react-router-dom";
// import {
//   XMarkIcon,
//   ChevronLeftIcon,
//   LifebuoyIcon,
//   ChevronRightIcon,
// } from "@heroicons/react/24/outline";
// import { MdRefresh } from "react-icons/md";
// import {
//   useMaterialTailwindController,
//   setOpenSidenav,
// } from "../../context/index";
// import { Button } from "../ui/Button";
// import Text from "../ui/Text";
// import brandImg from "../../logo.png";
// import {
//   Toast,
//   ToastTitle,
//   ToastDescription,
//   ToastProvider,
//   ToastViewport,
// } from "../ui/Toast";
// import { useDispatch, useSelector } from "react-redux";
// import { loadUserProfile, selectUser } from "../../store/slices/profileSlice";
// import { AppDispatch } from "../../store";

// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "../ui/Tooltip";

// interface RoutePage {
//   icon: React.ReactNode;
//   name: string;
//   path: string;
//   adminOnly?: boolean;
//   submenu?: RoutePage[];
// }

// interface Route {
//   layout: string;
//   title?: string;
//   pages: RoutePage[];
// }

// interface SidenavProps {
//   brandImg?: string;
//   brandName?: string;
//   routes: Route[];
//   onToggle?: (collapsed: boolean) => void;
// }

// type SidenavType = "dark" | "white" | "transparent";

// export function Sidenav({
//   brandName = "AiTeacha",
//   routes,
//   onToggle,
// }: SidenavProps) {
//   const { controller, dispatch } = useMaterialTailwindController();
//   const [toastVisible, setToastVisible] = useState<boolean>(false);
//   const [toastMessage, setToastMessage] = useState<string>("");
//   const { sidenavColor, sidenavType, openSidenav } = controller as {
//     sidenavColor: string;
//     sidenavType: SidenavType;
//     openSidenav: boolean;
//   };

//   const appdispatch = useDispatch<AppDispatch>();

//   const user = useSelector(selectUser);
//   const loading = useSelector((state: any) => state.profile.loading);
//   const error = useSelector((state: any) => state.profile.error);

//   const userDetails = JSON.parse(
//     localStorage.getItem("ai-teacha-user") || "{}"
//   );

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (
//         openSidenav &&
//         sidenavRef.current &&
//         !sidenavRef.current.contains(event.target as Node)
//       ) {
//         setOpenSidenav(dispatch, false);
//       }
//     }
//     if (openSidenav && window.innerWidth < 1280) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [openSidenav, dispatch]);

//   useEffect(() => {
//     if (!user) {
//       appdispatch(loadUserProfile());
//     }
//     if (user) {
//       localStorage.setItem("ai-teacha-user", JSON.stringify(user));
//       console.log(user);
//     }
//   }, [dispatch, user]);

//   console.log(userDetails.package);
//   const isAdmin = userDetails.role === 1 || userDetails.role_id === 1;

//   const [isCollapsed, setIsCollapsed] = React.useState(false);

//   const sidenavTypes: Record<SidenavType, string> = {
//     dark: "bg-gradient-to-br from-gray-800 to-gray-900",
//     white: "bg-white shadow-sm",
//     transparent: "bg-transparent",
//   };

//   const sidenavRef = React.useRef<HTMLDivElement>(null);

//   const handleToggle = () => {
//     const newCollapsedState = !isCollapsed;
//     setIsCollapsed(newCollapsedState);
//     if (onToggle) {
//       onToggle(newCollapsedState);
//     }
//   };

//   const handleRefreshProfile = async () => {
//     try {
//       await appdispatch(loadUserProfile()).unwrap();
//       setToastMessage("Profile refreshed successfully!");
//     } catch (err) {
//       setToastMessage("Failed to refresh profile: " + err);
//     } finally {
//       setToastVisible(true);
//     }
//   };

//   return (
//     <TooltipProvider>
//       <aside
//         ref={sidenavRef}
//         className={`routes-scroll-area ${sidenavTypes[sidenavType]} ${
//           openSidenav ? "translate-x-0" : "-translate-x-80"
//         } fixed inset-0 z-50 h-[calc(100vh)] ${
//           isCollapsed ? "w-32 " : "w-72"
//         } transition-transform duration-300 xl:translate-x-0`}
//       >
//         <div className="relative flex items-center justify-between p-4">
//           <Link to={"/dashboard/home"}>
//             <div className="flex items-center">
//               {brandImg && !isCollapsed && (
//                 <img src={brandImg} alt="Brand Logo" className="h-8 w-8 mr-2" />
//               )}
//               {!isCollapsed && (
//                 <Text variant="large" className="text-center text-black">
//                   {brandName}
//                 </Text>
//               )}
//             </div>
//           </Link>
//           <Button
//             variant={"default"}
//             className="p-2 rounded-full xl:inline-block hidden"
//             onClick={handleToggle}
//           >
//             {isCollapsed ? (
//               <ChevronRightIcon className="h-5 w-5 text-gray-700" />
//             ) : (
//               <ChevronLeftIcon className="h-5 w-5 text-gray-700" />
//             )}
//           </Button>
//           <Button
//             variant={"default"}
//             className="absolute right-0 top-0 p-2 rounded-br-none rounded-tl-none xl:hidden"
//             onClick={() => setOpenSidenav(dispatch, false)}
//           >
//             <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-gray-700" />
//           </Button>
//         </div>
//         <div
//           className={`my-4 overflow-y-auto ${
//             isCollapsed
//               ? "max-h-[calc(100vh-140px)] "
//               : "max-h-[calc(100vh-220px)]"
//           }`}
//         >
//           {routes.map(({ layout, title, pages }, key) => (
//             <ul key={key} className="mb-4 flex flex-col gap-1">
//               {title && !isCollapsed && (
//                 <li className="mx-3.5 mt-4 mb-2 list-none">
//                   <Text
//                     variant="small"
//                     color={sidenavType === "dark" ? "white" : "blue-gray"}
//                     className="font-black uppercase opacity-75"
//                   >
//                     {title}
//                   </Text>
//                 </li>
//               )}
//               {pages.map(({ icon, name, path, adminOnly, submenu }) => {
//                 if (adminOnly && !isAdmin) return null;

//                 const fullPath = `/${layout}${path}`;
//                 const [isExpanded, setIsExpanded] = React.useState(false);
//                 const location = useLocation();

//                 React.useEffect(() => {
//                   if (
//                     submenu?.some(
//                       (sub) => location.pathname === `/${layout}${sub.path}`
//                     )
//                   ) {
//                     setIsExpanded(true);
//                   }
//                 }, [location.pathname, submenu, layout]);
//                 const keywords = ["premium", "resource"];
//                 const isPremium = keywords.some((keyword) =>
//                   name.toLowerCase().includes(keyword)
//                 );

//                 return (
//                   <li key={name} className="menu-item list-none">
//                     {isCollapsed ? (
//                       <Tooltip delayDuration={300}>
//                         <TooltipTrigger asChild>
//                           <NavLink
//                             to={!submenu ? fullPath : "#"}
//                             onClick={(e) => {
//                               if (submenu) {
//                                 e.preventDefault();
//                                 setIsExpanded(!isExpanded);
//                               } else if (window.innerWidth < 1280) {
//                                 setOpenSidenav(dispatch, false);
//                               }
//                             }}
//                             className="focus:outline-none w-full"
//                           >
//                             {({ isActive: navLinkIsActive }) => (
//                               <Button
//                                 variant={
//                                   isPremium
//                                     ? "ghost"
//                                     : navLinkIsActive
//                                     ? "gradient"
//                                     : "ghost"
//                                 }
//                                 color={
//                                   navLinkIsActive
//                                     ? sidenavColor
//                                     : sidenavType === "dark"
//                                     ? "white"
//                                     : "blue-gray"
//                                 }
//                                 className={`px-4 capitalize rounded-full justify-center hover:bg-[#d2a9f3] hover:text-white`}
//                               >
//                                 <span className="w-6 flex items-center justify-center">
//                                   {icon}
//                                 </span>
//                               </Button>
//                             )}
//                           </NavLink>
//                         </TooltipTrigger>
//                         <TooltipContent>
//                           <p className="font-extrabold text-md capitalize">
//                             {name}
//                           </p>
//                         </TooltipContent>
//                       </Tooltip>
//                     ) : (
//                       <NavLink
//                         to={!submenu ? fullPath : "#"}
//                         onClick={() => {
//                           if (submenu) {
//                             setIsExpanded(!isExpanded);
//                           } else if (window.innerWidth < 1280) {
//                             setOpenSidenav(dispatch, false);
//                           }
//                         }}
//                       >
//                         {({ isActive }) => (
//                           <Button
//                             variant={
//                               isPremium
//                                 ? "ghost"
//                                 : isActive
//                                 ? "gradient"
//                                 : "ghost"
//                             }
//                             color={
//                               isActive
//                                 ? sidenavColor
//                                 : sidenavType === "dark"
//                                 ? "white"
//                                 : "blue-gray"
//                             }
//                             className={`w-full px-4 capitalize text-[#000000] flex items-center hover:bg-[#efe6fd] hover:text-[#6200EE]`}
//                           >
//                             <div className="flex items-center gap-2 w-full">
//                               <span className="w-6 flex items-center justify-center">
//                                 {icon}
//                               </span>
//                               <Text
//                                 color="inherit"
//                                 className="font-medium capitalize text-left flex-1"
//                               >
//                                 {name}
//                               </Text>
//                               {submenu && (
//                                 <span
//                                   className={`ml-auto transition-transform ${
//                                     isExpanded ? "rotate-90" : ""
//                                   }`}
//                                 >
//                                   ▶
//                                 </span>
//                               )}
//                             </div>
//                           </Button>
//                         )}
//                       </NavLink>
//                     )}
//                     {submenu && isExpanded && (
//                       <ul className="submenu ml-0 mt-2">
//                         {submenu.map(
//                           ({ icon: subIcon, name: subName, path: subPath }) => (
//                             <li
//                               key={subName}
//                               className="submenu-item list-none"
//                             >
//                               {isCollapsed ? (
//                                 <Tooltip delayDuration={300}>
//                                   <TooltipTrigger asChild>
//                                     <NavLink
//                                       to={`/${layout}${subPath}`}
//                                       onClick={() => {
//                                         if (window.innerWidth < 1280) {
//                                           setOpenSidenav(dispatch, false);
//                                         }
//                                       }}
//                                       className="focus:outline-none w-full"
//                                     >
//                                       {({ isActive }) => (
//                                         <Button
//                                           variant={
//                                             isActive ? "gradient" : "ghost"
//                                           }
//                                           color={
//                                             isActive
//                                               ? sidenavColor
//                                               : "blue-gray"
//                                           }
//                                           className={`w-full px-4 capitalize rounded-full justify-center hover:bg-[#d2a9f3] hover:text-white`}
//                                         >
//                                           <span className="w-6 flex items-center justify-center">
//                                             {subIcon}
//                                           </span>
//                                         </Button>
//                                       )}
//                                     </NavLink>
//                                   </TooltipTrigger>
//                                   <TooltipContent>
//                                     <p className="font-extrabold text-md capitalize">
//                                       {subName}
//                                     </p>
//                                   </TooltipContent>
//                                 </Tooltip>
//                               ) : (
//                                 <NavLink
//                                   to={`/${layout}${subPath}`}
//                                   onClick={() => {
//                                     if (window.innerWidth < 1280) {
//                                       setOpenSidenav(dispatch, false);
//                                     }
//                                   }}
//                                 >
//                                   {({ isActive }) => (
//                                     <Button
//                                       variant={isActive ? "gradient" : "ghost"}
//                                       color={
//                                         isActive ? sidenavColor : "blue-gray"
//                                       }
//                                       className={`w-full px-4 capitalize rounded-full flex items-center hover:bg-[#d2a9f3] hover:text-white`}
//                                     >
//                                       <div className="flex items-center gap-2">
//                                         <span className="w-6 flex items-center justify-center">
//                                           {subIcon}
//                                         </span>
//                                         {!isCollapsed && (
//                                           <Text
//                                             color="inherit"
//                                             className="font-medium capitalize text-left"
//                                           >
//                                             {subName}
//                                           </Text>
//                                         )}
//                                       </div>
//                                     </Button>
//                                   )}
//                                 </NavLink>
//                               )}
//                             </li>
//                           )
//                         )}
//                       </ul>
//                     )}
//                   </li>
//                 );
//               })}
//             </ul>
//           ))}
//         </div>
//         {!isCollapsed && (
//           <div className="absolute bottom-4 left-4 right-4 bg-[#EFE6FD] p-2 rounded-xl">
//             {/* <Link to="/dashboard/support">
//               <Button
//                 variant="ghost"
//                 color={sidenavColor}
//                 className="w-full rounded-full flex items-center justify-center gap-2"
//               >
//                 <LifebuoyIcon className="h-5 w-5" />
//                 <span>Support</span>
//               </Button>
//             </Link> */}
//             {/* <Button
//               variant="outlined"
//               color="blue-gray"
//               className="text-black text-left"
//             >
//               Current Plan: {userDetails.package}
//             </Button> */}

//             <p className="text-black text-sm text-left">
//               Current Plan: {userDetails.package}
//             </p>

//             <div className="bg-[#6200EE] rounded-full w-full flex justify-center items-center">
//               <p className="text-white text-center pt-2">↑ upgrade</p>
//             </div>

//             <Button
//               variant="outlined"
//               onClick={handleRefreshProfile}
//               aria-label="Open configurator"
//               className="font-bold text-[#6200EE] flex justify-center gap-2 w-full rounded-full"
//             >
//               {loading ? (
//                 <span>Refreshing...</span>
//               ) : (
//                 <span className="flex gap-2"><MdRefresh className="mt-1" /> Refresh Profile</span>
//               )}
//             </Button>
//             <Button
//                 variant="ghost"
//                 color={sidenavColor}
//                 className="w-full rounded-full flex items-center justify-center gap-2"
//               >
//                 <LifebuoyIcon className="h-5 w-5" />
//                 <span>Contact Support</span>
//               </Button>
//           </div>
//         )}
//       </aside>

//       <ToastProvider swipeDirection="right">
//         {toastVisible && (
//           <Toast
//             open={toastVisible}
//             onOpenChange={setToastVisible}
//             duration={3000}
//             className="data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=end]:animate-swipeOut translate-x-full"
//           >
//             <ToastTitle className="text-lg font-bold">Status</ToastTitle>
//             <ToastDescription className="text-sm">
//               {toastMessage}
//             </ToastDescription>
//           </Toast>
//         )}
//         <ToastViewport className="[--viewport-padding:_25px] fixed bottom-0 right-0 flex flex-col p-(--viewport-padding) gap-[10px] w-[390px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none" />
//       </ToastProvider>
//     </TooltipProvider>
//   );
// }

// Sidenav.displayName = "/src/widgets/layout/Sidenav.tsx";

// export default Sidenav;

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import { ChevronLeftIcon, LifebuoyIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import { MdRefresh } from "react-icons/md"
import { useMaterialTailwindController, setOpenSidenav } from "../../context/index"
import { Button } from "../ui/Button"
import brandImg from "../../logo.png"
import { Toast, ToastTitle, ToastDescription, ToastProvider, ToastViewport } from "../ui/Toast"
import { useDispatch, useSelector } from "react-redux"
import { loadUserProfile, selectUser } from "../../store/slices/profileSlice"
import type { AppDispatch } from "../../store"
import { TooltipProvider } from "../ui/Tooltip"

interface RoutePage {
  icon: React.ReactNode
  name: string
  path: string
  adminOnly?: boolean
  submenu?: RoutePage[]
}

interface Route {
  layout: string
  title?: string
  pages: RoutePage[]
}

interface SidenavProps {
  brandImg?: string
  brandName?: string
  routes: Route[]
  onToggle?: (collapsed: boolean) => void
}

type SidenavType = "dark" | "white" | "transparent"

export function Sidenav({ brandName = "AiTeacha", routes, onToggle }: SidenavProps) {
  const { controller, dispatch } = useMaterialTailwindController()
  const { sidenavType, openSidenav } = controller as {
    sidenavType: SidenavType
    openSidenav: boolean
  }

  const appdispatch = useDispatch<AppDispatch>()
  const user = useSelector(selectUser)
  const loading = useSelector((state: any) => state.profile.loading)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isOpen, setIsOpen] = useState("")

  const sidenavRef = useRef<HTMLDivElement>(null)
  const userDetails = JSON.parse(localStorage.getItem("ai-teacha-user") || "{}")
  const isAdmin = userDetails.role === 1 || userDetails.role_id === 1

  // handle click outside (mobile)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (openSidenav && sidenavRef.current && !sidenavRef.current.contains(event.target as Node)) {
        setOpenSidenav(dispatch, false)
      }
    }
    if (openSidenav && window.innerWidth < 1280) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [openSidenav, dispatch])

  // load user profile
  useEffect(() => {
    if (!user) {
      appdispatch(loadUserProfile())
    } else {
      localStorage.setItem("ai-teacha-user", JSON.stringify(user))
    }
  }, [user])

  const handleToggle = () => {
    const newCollapsedState = !isCollapsed
    setIsCollapsed(newCollapsedState)
    if (onToggle) onToggle(newCollapsedState)
  }

  const handleRefreshProfile = async () => {
    try {
      await appdispatch(loadUserProfile()).unwrap()
      setToastMessage("Profile refreshed successfully!")
    } catch {
      setToastMessage("Failed to refresh profile")
    } finally {
      setToastVisible(true)
    }
  }

  const sidenavTypes: Record<SidenavType, string> = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900 text-white",
    white: "bg-white shadow-sm text-gray-800",
    transparent: "bg-transparent",
  }

  return (
    <TooltipProvider>
      <aside
        ref={sidenavRef}
        className={`${sidenavTypes[sidenavType]} fixed top-0 left-0 h-screen z-50 flex flex-col transition-all duration-300
          ${isCollapsed ? "w-20" : "w-72"}
          ${openSidenav ? "translate-x-0" : "-translate-x-full"} xl:translate-x-0`}
      >
        {/* --- HEADER --- */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <Link to="/dashboard/home" className="flex items-center gap-2">
            {!isCollapsed && (
              <>
                <img src={brandImg} alt="Logo" className="h-8 w-8" />
                <h1 className="text-lg font-bold">{brandName}</h1>
              </>
            )}
          </Link>

          {/* Toggle collapse (desktop) */}
          <Button variant="ghost" onClick={handleToggle} className="hidden xl:flex p-2 rounded-md hover:bg-gray-100">
            {isCollapsed ? (
              <ChevronRightIcon className="h-5 w-5 text-gray-600" />
            ) : (
              <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
            )}
          </Button>

          {/* Close (mobile) */}
          {/* <Button
            variant="ghost"
            onClick={() => setOpenSidenav(dispatch, false)}
            className="xl:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <XMarkIcon className="h-5 w-5 text-gray-700" />
          </Button> */}
        </div>

        {/* <div
              className={`bg-[#EFE6FD] rounded-xl p-4 mb-6 flex items-center gap-3 transition-all duration-300 ${
                !isOpen ? "justify-center" : ""
              }`}
            >
              <img src={Zyra} alt="Zyra" className="w-10 h-10 rounded-full" />
              {isOpen && (
                <div>
                  <h4 className="font-semibold text-black">Zyra</h4>
                  <p className="text-xs text-gray-500">Your Edubot</p>
                </div>
              )}
            </div> */}

        {/* --- NAVIGATION --- */}
        <div
          className={`flex-1 overflow-y-auto ${
            isCollapsed ? "max-h-[calc(100vh-160px)]" : "max-h-[calc(100vh-250px)]"
          } px-3 py-4`}
        >
          {routes.map(({ layout, title, pages }, index) => (
            <ul key={index} className="mb-4 flex flex-col gap-1">
              {!isCollapsed && title && (
                <li className="px-3 py-1 text-xs font-bold text-gray-500 uppercase">{title}</li>
              )}

              {pages.map(({ icon, name, path, adminOnly, submenu }) => {
                if (adminOnly && !isAdmin) return null
                const fullPath = `/${layout}${path}`
                const location = useLocation()
                const [isExpanded, setIsExpanded] = useState(false)

                useEffect(() => {
                  if (submenu?.some((sub) => location.pathname === `/${layout}${sub.path}`)) {
                    setIsExpanded(true)
                  }
                }, [location.pathname])

                return (
                  <li key={name}>
                    <NavLink
                      to={!submenu ? fullPath : "#"}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2.5 rounded transition-all capitalize font-medium 
                         ${
                           isActive
                             ? "text-[#6200EE] bg-[#EFE6FD] font-semibold border-r-4 border-[#6200EE]"
                             : "text-gray-800 hover:bg-[#efe6fd] hover:text-[#6200EE]"
                         }`
                      }
                      onClick={(e) => {
                        if (submenu) {
                          e.preventDefault()
                          setIsExpanded(!isExpanded)
                        } else if (window.innerWidth < 1280) {
                          setOpenSidenav(dispatch, false)
                        }
                      }}
                    >
                      <span className="text-lg">{icon}</span>
                      {!isCollapsed && <span>{name}</span>}
                      {submenu && !isCollapsed && (
                        <span className={`ml-auto transition-transform ${isExpanded ? "rotate-90" : ""}`}>▶</span>
                      )}
                    </NavLink>

                    {/* --- SUBMENU --- */}
                    {submenu && isExpanded && (
                      <ul className="ml-6 mt-2 space-y-1">
                        {submenu.map(({ icon: subIcon, name: subName, path: subPath }) => (
                          <li key={subName}>
                            <NavLink
                              to={`/${layout}${subPath}`}
                              className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm
                                ${
                                  isActive
                                    ? "bg-[#6200EE] text-white"
                                    : "text-gray-700 hover:bg-[#efe6fd] hover:text-[#6200EE]"
                                }`
                              }
                              onClick={() => {
                                if (window.innerWidth < 1280) setOpenSidenav(dispatch, false)
                              }}
                            >
                              <span className="text-base">{subIcon}</span>
                              {!isCollapsed && <span>{subName}</span>}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                )
              })}
            </ul>
          ))}
        </div>

        {/* --- FOOTER SECTION --- */}
        {/* --- FOOTER SECTION --- */}
        <div className="p-4 bg-[#EFE6FD] rounded-t-2xl border-t border-gray-200 ml-2 mr-2">
          {!isCollapsed ? (
            <>
              {/* Plan Label */}
              <p className="text-sm font-semibold text-[#6200EE] mb-1">Current Plan</p>

              {/* Plan Name */}
              <p className="text-base font-semibold text-[#000000] mb-4">{userDetails.package || "A.I Teacha Basic"}</p>

              {/* Upgrade Button */}
              <div className="bg-[#6200EE] rounded-full">
                <Button
                  onClick={handleRefreshProfile}
                  className="w-full text-white rounded-full hover:bg-[#7a22ef] transition-all"
                >
                  ↑ Upgrade
                </Button>
              </div>

              {/* Refresh Profile Button */}
              <Button
                variant="outline"
                onClick={handleRefreshProfile}
                className="w-full text-[#6200EE] font-semibold bg-transparent"
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
              <MdRefresh onClick={handleRefreshProfile} className="text-[#6200EE] text-2xl cursor-pointer" />
            </div>
          )}
        </div>

        {/* --- CONTACT SUPPORT OUTSIDE BOX --- */}
        {!isCollapsed && (
          <div className="">
            <Button variant="ghost" className="text-[#000] w-full flex items-center justify-center gap-2 font-medium">
              <LifebuoyIcon className="h-5 w-5" />
              Contact Support
            </Button>
          </div>
        )}
      </aside>

      {/* --- TOAST NOTIFICATIONS --- */}
      <ToastProvider swipeDirection="right">
        {toastVisible && (
          <Toast open={toastVisible} onOpenChange={setToastVisible} duration={3000}>
            <ToastTitle>Status</ToastTitle>
            <ToastDescription>{toastMessage}</ToastDescription>
          </Toast>
        )}
        <ToastViewport className="fixed bottom-0 right-0 p-4 w-[300px]" />
      </ToastProvider>
    </TooltipProvider>
  )
}

Sidenav.displayName = "/src/widgets/layout/Sidenav.tsx"
export default Sidenav
