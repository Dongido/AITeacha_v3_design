import { Fragment, useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  Bars3Icon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { Popover, Transition } from "@headlessui/react";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setOpenSidenav,
  setCollapsed,
} from "../../context/index";
import { Button } from "../ui/Button";
import Text from "../ui/Text";
import Cookies from "js-cookie";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from "../ui/Dialogue";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  loadProfileImage,
  resetProfileState,
} from "../../store/slices/profileSlice";
import { AiOutlineMessage } from "react-icons/ai";
import { FiMessageCircle } from "react-icons/fi";
import { useAppSelector } from "../../store/hooks";
import { getCount } from "../../store/slices/staffchats";
import { FaRegUser, FaRocketchat } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/Tooltip";
import { HiMenuAlt2 } from "react-icons/hi";
import { ChevronDownIcon } from "lucide-react";
import { LiaWalletSolid } from "react-icons/lia";
import { GoBell } from "react-icons/go";

export function DashboardNavbar() {
  const { controller, dispatch: uiDispatch } = useMaterialTailwindController();

  const { fixedNavbar, openSidenav } = controller as {
    fixedNavbar: boolean;
    openSidenav: boolean;
  };

  const dispatch = useDispatch<AppDispatch>();
  const { imageUrl, loading } = useSelector((state: any) => state.profile);
  const { messageCount } = useAppSelector(
    (state: RootState) => state.staffChats
  );

  useEffect(() => {
    if (!imageUrl) {
      dispatch(loadProfileImage());
    }
    dispatch(getCount());
  }, [dispatch, imageUrl]);

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");

  const imageURL = imageUrl
    ? imageUrl.startsWith("http")
      ? imageUrl
      : `https://${imageUrl}`
    : "https://placehold.co/32x32/cccccc/000000?text=P";

  const pageName = page === undefined ? "dashboard" : page;

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
      <div
      // className={`rounded-full transition-all py-3 ${
      //   fixedNavbar
      //     ? "sticky top-4 z-40 py-3 bg-white shadow-blue-gray-500/5"
      //     : "px-0 py-1"
      // }`}
      className="px-4 md:px-[30px]"
      >
        <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
          <div className="hidden lg:flex text-black">
            <button
              onClick={() => setCollapsed(uiDispatch, !controller.collapsed)}
              className="hidden lg:flex text-black"
            >
              <HiMenuAlt2 className="h-6 w-6"/>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/dashboard/participant/chat"
                  className="hidden lg:flex relative items-center gap-2 rounded-full px-3 py-1 transition cursor-pointer"
                >
                  <AiOutlineMessage className="font-medium text-lg" />
                  {messageCount.length > 0 && (
                    <span
                      className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px]
                      font-semibold rounded-full h-5 w-5 flex items-center justify-center shadow-md"
                    >
                      {messageCount.length > 9 ? "9+" : messageCount.length}
                    </span>
                  )}
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-extrabold text-md capitalize">
                  Chat with staff
                </p>
              </TooltipContent>
            </Tooltip>

            {/* <Button
              variant="text"
              color="blue-gray"
              className="grid xl:hidden"
              onClick={() => setOpenSidenav(uiDispatch, !openSidenav)}
              aria-label="Toggle sidenav"
            >
              <Bars3Icon
                strokeWidth={3}
                className="h-6 w-6 text-blue-gray-500"
              />
            </Button> */}

            <button
              onClick={() => setOpenSidenav(uiDispatch, !openSidenav)}
              className="flex xl:hidden md:hidden text-black"
              aria-label="Toggle sidenav"
            >
              <HiMenuAlt2 className="h-6 w-6" />
            </button>

            {/* <div className="flex items-center gap-x-6  ml-auto lg:mr-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="/dashboard/participant/chat"
                    className="flex lg:hidden cursor-pointer relative items-center gap-2 rounded-full px-3 py-1 transition"
                  >
                    <FaRocketchat className="font-medium  text-lg" />
                    {messageCount.length > 0 && (
                      <span
                        className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px]
                        font-semibold rounded-full h-5 w-5 flex items-center justify-center shadow-md"
                      >
                        {messageCount.length > 9 ? "9+" : messageCount.length}
                      </span>
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-extrabold text-md capitalize">
                    Chat with staff
                  </p>
                </TooltipContent>
              </Tooltip>

              <Dialog>
                <DialogTrigger asChild>
                  <span className="flex items-center">
                    <ArrowRightEndOnRectangleIcon className="h-5 w-5 text-blue-gray-500 cursor-pointer" />
                  </span>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Logout</DialogTitle>
                  </DialogHeader>
                  <p>Are you sure you want to logout?</p>
                  <DialogFooter>
                    <Button
                      variant="destructive"
                      className="rounded-md"
                      onClick={handleLogout}
                    >
                      Yes, Logout
                    </Button>
                    <DialogClose asChild>
                      <Button variant="text">Cancel</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Cog6ToothIcon
                    aria-label="Open configurator"
                    onClick={() => setOpenConfigurator(uiDispatch, true)}
                    className="h-5 w-5 text-blue-gray-500 cursor-pointer"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-extrabold text-md capitalize">
                    Open settings
                  </p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="/dashboard/profile"
                    className="flex relative items-center gap-[1px] px-1 py-1 transition cursor-pointer"
                  >
                    <img
                      src={imageURL}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover border border-gray-300"
                    />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-extrabold text-md capitalize">
                    View profile
                  </p>
                </TooltipContent>
              </Tooltip>
            </div> */}

            {/* Right side (Chat + Profile dropdown) */}
          <div className="flex items-center gap-3 ml-auto">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/dashboard/notifications"
                  className="relative items-center flex gap-2 rounded-full px-3 py-1 cursor-pointer"
                >
                  <GoBell className="text-lg" />
                  {messageCount.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-semibold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                      {messageCount.length > 9 ? "9+" : messageCount.length}
                    </span>
                  )}
                </Link>
              </TooltipTrigger>
            </Tooltip>

            {/* <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/dashboard/participant/chat"
                  className="relative items-center flex gap-2 rounded-full px-3 py-1 cursor-pointer"
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
            </Tooltip> */}

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
                          to="/dashboard/profile"
                          className="flex items-center gap-3 px-4 py-2 hover:bg-[#EFE6FD] rounded-lg text-sm text-gray-700"
                        >
                          <FaRegUser className="h-5 w-5 text-gray-600" />
                          Profile
                        </Link>

                        <Link
                          to="/dashboard/wallet"
                          className="flex items-center gap-3 px-4 py-2 hover:bg-[#EFE6FD] rounded-lg text-sm text-gray-700"
                        >
                          <LiaWalletSolid className="h-5 w-5 text-gray-600" />
                          Wallet Settings
                        </Link>

                        <Link
                          to="/dashboard/configuration"
                          className="flex items-center gap-3 px-4 py-2 hover:bg-[#EFE6FD] rounded-lg text-sm text-gray-700"
                        >
                          <FiMessageCircle className="h-5 w-5 text-gray-600" />
                          Messages Configuration
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
      </div>
    </TooltipProvider>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/DashboardNavbar.tsx";

export default DashboardNavbar;
