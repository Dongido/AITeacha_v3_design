// import { useState, useEffect } from "react";
// import { useLocation, Link, useNavigate } from "react-router-dom";
// import { Input } from "../ui/Input";
// import {
//   UserCircleIcon,
//   Cog6ToothIcon,
//   Bars3Icon,
//   ArrowRightEndOnRectangleIcon,
// } from "@heroicons/react/24/solid";
// import { Popover } from "@headlessui/react";
// import {
//   useMaterialTailwindController,
//   setOpenConfigurator,
//   setOpenSidenav,
// } from "../../context/index";
// import { Button } from "../ui/Button";
// import Text from "../ui/Text";
// import Cookies from "js-cookie";
// import {
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogHeader,
//   DialogFooter,
//   DialogTitle,
//   DialogClose,
// } from "../ui/Dialogue";
// import { useSelector, useDispatch } from "react-redux";
// import { AppDispatch, RootState } from "../../store";
// import {
//   loadProfileImage,
//   resetProfileState,
// } from "../../store/slices/profileSlice";
// import { useAppSelector } from "../../store/hooks";
// import { getCount } from "../../store/slices/staffchats";
// import { FaRocketchat } from "react-icons/fa";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "../ui/Tooltip";
// import { MdChevronLeft, MdChevronRight } from "react-icons/md";

// export function StudentNavbar() {
//   const { controller, dispatch: uiDispatch } = useMaterialTailwindController();
//   const { fixedNavbar, openSidenav } = controller as {
//     fixedNavbar: boolean;
//     openSidenav: boolean;
//   };

//   const dispatch = useDispatch<AppDispatch>();
//   const { imageUrl, loading } = useSelector((state: any) => state.profile);
//   const { messageCount } = useAppSelector(
//     (state: RootState) => state.staffChats
//   );

//   useEffect(() => {
//     if (!imageUrl) {
//       dispatch(loadProfileImage());
//     }
//     dispatch(getCount());
//   }, [dispatch, imageUrl]);

//   const { pathname } = useLocation();
//   const navigate = useNavigate();
//   const [layout, page] = pathname.split("/").filter((el) => el !== "");

//   const imageURL = imageUrl
//     ? imageUrl.startsWith("http")
//       ? imageUrl
//       : `https://${imageUrl}`
//     : "https://img.freepik.com/premium-photo/cool-asian-head-logo_925613-50527.jpg?w=360";

//   const handleLogout = () => {
//     Cookies.remove("at-accessToken");
//     Cookies.remove("at-refreshToken");
//     localStorage.removeItem("ai-teacha-user");
//     sessionStorage.clear();
//     localStorage.removeItem("redirectPath");
//     dispatch(resetProfileState());
//     navigate("/auth/login");
//   };

//   return (
//     <TooltipProvider>
//       <div
//         className={`rounded-xl transition-all bg-white py-3 ${
//           fixedNavbar
//             ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
//             : "px-0 py-1"
//         }`}
//       >
//         <div className="flex items-center justify-between lg:justify-between md:gap-6 lg:md:flex-row md:items-center ">
//           <div className="flex gap-2 items-center">
//             <Button
//               variant="text"
//               color="blue-gray"
//               className="grid xl:hidden"
//               onClick={() => setOpenSidenav(uiDispatch, !openSidenav)}
//               aria-label="Toggle sidenav"
//             >
//               <Bars3Icon
//                 strokeWidth={3}
//                 className="h-6 w-6 text-blue-gray-500"
//               />
//             </Button>
//             <div className="capitalize px-4 hidden sm:block">
//               {/* <Text variant="large" color="blue-gray">
//                 {page}
//               </Text> */}

//               <button onClick={() => navigate(-1)} className="flex gap-1">
//                 <MdChevronLeft className="mt-1" /> Back
//               </button>
//             </div>
//           </div>
//           <div className="flex items-center gap-x-6  ml-auto lg:mr-3 ">
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Link
//                   to="/student/participant/chat"
//                   className="relative flex items-center gap-2 bg-purple-50 rounded-full px-3 py-1 transition cursor-pointer"
//                 >
//                   <FaRocketchat className="font-medium text-purple-400 text-lg" />
//                   {messageCount.length > 0 && (
//                     <span
//                       className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px]
//                       font-semibold rounded-full h-5 w-5 flex items-center justify-center shadow-md"
//                     >
//                       {messageCount.length > 9 ? "9+" : messageCount.length}
//                     </span>
//                   )}
//                 </Link>
//               </TooltipTrigger>
//               <TooltipContent>
//                 <p className="font-extrabold text-md capitalize">
//                   Chat with staff
//                 </p>
//               </TooltipContent>
//             </Tooltip>

//             {/* Profile Link with Tooltip */}
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Link to="/student/profile">
//                   <img
//                     src={imageURL}
//                     alt="Profile"
//                     className="h-8 w-8 rounded-full object-cover border border-gray-300"
//                   />
//                 </Link>
//               </TooltipTrigger>
//               <TooltipContent>
//                 <p className="font-extrabold text-md capitalize">
//                   View profile
//                 </p>
//               </TooltipContent>
//             </Tooltip>

//             {/* Logout Dialog Trigger with Tooltip */}
//             <Dialog>
//               <DialogTrigger asChild>
//                 <ArrowRightEndOnRectangleIcon className="h-5 w-5 text-blue-gray-500 cursor-pointer" />
//               </DialogTrigger>
//               <DialogContent>
//                 <DialogHeader>
//                   <DialogTitle>Confirm Logout</DialogTitle>
//                 </DialogHeader>
//                 <p>Are you sure you want to logout?</p>
//                 <DialogFooter>
//                   <Button
//                     variant="destructive"
//                     className="rounded-md"
//                     onClick={handleLogout}
//                   >
//                     Yes, Logout
//                   </Button>
//                   <DialogClose asChild>
//                     <Button variant="text">Cancel</Button>
//                   </DialogClose>
//                 </DialogFooter>
//               </DialogContent>
//             </Dialog>

//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Cog6ToothIcon
//                   onClick={() => setOpenConfigurator(uiDispatch, true)}
//                   aria-label="Open configurator"
//                   className="h-5 w-5 text-blue-gray-500 cursor-pointer"
//                 />
//               </TooltipTrigger>
//               <TooltipContent>
//                 <p className="font-extrabold text-md capitalize">
//                   Open settings
//                 </p>
//               </TooltipContent>
//             </Tooltip>
//           </div>
//         </div>
//       </div>
//     </TooltipProvider>
//   );
// }

// StudentNavbar.displayName = "/src/widgets/layout/DashboardNavbar.tsx";

// export default StudentNavbar;



import { useEffect, Fragment } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowRightEndOnRectangleIcon,
  ChevronDownIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import { Transition, Popover } from "@headlessui/react";
import { AiOutlineMessage } from "react-icons/ai";
import { MdChevronLeft } from "react-icons/md";
import { HiMenuAlt2 } from "react-icons/hi";
import Cookies from "js-cookie";
import {
  useMaterialTailwindController,
  setOpenSidenav,
} from "../../context";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/Tooltip";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  loadProfileImage,
  resetProfileState,
} from "../../store/slices/profileSlice";
import { useAppSelector } from "../../store/hooks";
import { getCount } from "../../store/slices/staffchats";
import { FiMessageCircle } from "react-icons/fi";

export function StudentNavbar() {
  const { controller, dispatch: uiDispatch } = useMaterialTailwindController();
  const { openSidenav } = controller as { openSidenav: boolean };
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const { imageUrl } = useSelector((state: any) => state.profile);
  const { messageCount } = useAppSelector(
    (state: RootState) => state.staffChats
  );

  // check if the current page is home
  const isHomePage =
    location.pathname === "/student/home" ||
    location.pathname === "/home" ||
    location.pathname === "/student";

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (!imageUrl) dispatch(loadProfileImage());
    dispatch(getCount());
  }, [dispatch, imageUrl]);

  const imageURL = imageUrl
    ? imageUrl.startsWith("http")
      ? imageUrl
      : `https://${imageUrl}`
    : "https://img.freepik.com/premium-photo/cool-asian-head-logo_925613-50527.jpg?w=360";

  const handleLogout = () => {
    Cookies.remove("at-accessToken");
    Cookies.remove("at-refreshToken");
    localStorage.removeItem("ai-teacha-user");
    dispatch(resetProfileState());
    sessionStorage.clear();
    localStorage.removeItem("redirectPath");
    navigate("/auth/login");
  };

  return (
    <TooltipProvider>
      <div className="w-full bg-white px-3 sticky top-0 z-50 shadow-sm rounded-lg">
        <div className="flex justify-between items-center py-3">
          {/* ✅ Conditionally show Back button */}
          {!isHomePage ? (
            <button
              onClick={handleGoBack}
              className="flex items-center gap-1 text-gray-700 hover:text-[#6200EE] transition-all duration-200"
            >
              <MdChevronLeft className="text-2xl" />
              <span className="text-sm font-medium">Back</span>
            </button>
          ) : (
            <div /> // empty placeholder for layout balance
          )}

          {/* 🔽 Hamburger Menu (for mobile) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpenSidenav(uiDispatch, !openSidenav)}
              className="xl:hidden p-2 rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-100 transition-all duration-200"
              aria-label={openSidenav ? "Close Menu" : "Open Menu"}
            >
              {openSidenav ? (
                // Close icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-6 w-6 text-gray-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                // Hamburger icon
                <HiMenuAlt2 className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>

          {/* 🔽 Right Section */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Chat Icon */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/student/participant/chat"
                  className="relative flex items-center gap-2 rounded-full px-3 py-1 cursor-pointer"
                >
                  <AiOutlineMessage className="text-lg" />
                  {messageCount.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-semibold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                      {messageCount.length > 9 ? "9+" : messageCount.length}
                    </span>
                  )}
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold text-md capitalize">Chat</p>
              </TooltipContent>
            </Tooltip>

            {/* Profile Dropdown */}
            <Popover className="relative">
              {({ open }) => (
                <>
                  <Popover.Button className="flex items-center gap-1 focus:outline-none">
                    <img
                      src={imageURL}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover border border-gray-300 cursor-pointer"
                    />
                    <ChevronDownIcon
                      className={`h-4 w-4 text-gray-600 transition-transform duration-300 ${
                        open ? "rotate-180" : "rotate-0"
                      }`}
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
                    <Popover.Panel className="absolute right-0 mt-3 w-72 rounded-xl shadow-lg bg-white ring-1 ring-black/5 z-50">
                      <div className="py-3 px-2">
                        <Link
                          to="/student/profile"
                          className="flex items-center gap-3 px-4 py-2 hover:bg-[#EFE6FD] rounded-lg text-sm text-gray-700"
                        >
                          <UserCircleIcon className="h-5 w-5 text-gray-600" />
                          Profile
                        </Link>

                        <Link
                          to="/student/participant/chat"
                          className="flex items-center gap-3 px-4 py-2 hover:bg-[#EFE6FD] rounded-lg text-sm text-gray-700"
                        >
                          <FiMessageCircle className="h-5 w-5 text-gray-600" />
                          Messages
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="group flex items-center gap-3 px-4 py-2 w-full text-left text-sm text-gray-700 hover:bg-red-600 hover:text-white rounded-lg"
                        >
                          <ArrowRightEndOnRectangleIcon className="h-5 w-5 text-gray-600 group-hover:text-white" />
                          Logout
                        </button>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

StudentNavbar.displayName = "/src/widgets/layout/StudentNavbar.tsx";
export default StudentNavbar;