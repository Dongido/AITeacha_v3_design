import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  Bars3Icon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { Popover } from "@headlessui/react";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setOpenSidenav,
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
import { FiMessageCircle } from "react-icons/fi";
import { useAppSelector } from "../../store/hooks";
import { getCount } from "../../store/slices/staffchats";
import { FaRocketchat } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/Tooltip";

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
    localStorage.removeItem("redirectPath");
    navigate("/auth/login");
  };

  return (
    <TooltipProvider>
      <div
        className={`rounded-xl transition-all bg-white py-3 ${
          fixedNavbar
            ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
            : "px-0 py-1"
        }`}
      >
        <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
          <div className="capitalize px-4 hidden md:block">
            <Text variant="large" color="blue-gray">
              {pageName}
            </Text>
          </div>

          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/dashboard/participant/chat"
                  className="hidden lg:flex relative items-center gap-2 rounded-full px-3 py-1 transition cursor-pointer"
                >
                  <FaRocketchat className="font-medium text-purple-400 text-lg" />
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

            <Button
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
            </Button>

            <div className="flex items-center gap-x-6  ml-auto lg:mr-3">
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

              <Dialog>
                <DialogTrigger asChild>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <ArrowRightEndOnRectangleIcon className="h-5 w-5 text-blue-gray-500 cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-extrabold text-md capitalize">
                        Logout
                      </p>
                    </TooltipContent>
                  </Tooltip>
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
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/DashboardNavbar.tsx";

export default DashboardNavbar;
