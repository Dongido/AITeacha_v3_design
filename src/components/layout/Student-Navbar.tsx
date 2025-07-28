import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Input } from "../ui/Input";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  Bars3Icon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/24/solid";
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
import { useAppSelector } from "../../store/hooks";
import { getCount } from "../../store/slices/staffchats";
import { FaRocketchat } from "react-icons/fa";

export function StudentNavbar() {
  const { controller, dispatch: uiDispatch } = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller as {
    fixedNavbar: boolean;
    openSidenav: boolean;
  };

  const dispatch = useDispatch<AppDispatch>();
  const { imageUrl, loading } = useSelector((state: any) => state.profile);
  //  const [unreadCount, setUnreadCount] = useState<number>(4);
  const { messageCount } = useAppSelector(
    (state: RootState) => state.staffChats
  );

  useEffect(() => {
    if (!imageUrl) {
      dispatch(loadProfileImage());
    }
    dispatch(getCount());
    // console.log(imageUrl);
  }, [dispatch, imageUrl]);

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");

  const imageURL = imageUrl
    ? imageUrl.startsWith("http")
      ? imageUrl
      : `https://${imageUrl}`
    : "https://img.freepik.com/premium-photo/cool-asian-head-logo_925613-50527.jpg?w=360";

  const handleLogout = () => {
    Cookies.remove("at-accessToken");
    Cookies.remove("at-refreshToken");
    localStorage.removeItem("ai-teacha-user");
    localStorage.removeItem("redirectPath");
    dispatch(resetProfileState());
    navigate("/auth/login");
  };

  return (
    <div
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all bg-white py-3 ${
        fixedNavbar
          ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
          : "px-0 py-1"
      }`}
    >
      <div className="flex items-center justify-between lg:justify-between md:gap-6 lg:md:flex-row md:items-center ">
        <div className="flex gap-2 items-center">
           <Button
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={() => setOpenSidenav(uiDispatch, !openSidenav)}
            aria-label="Toggle sidenav"
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </Button>
        <div className="capitalize px-4 hidden sm:block">
          <Text variant="large" color="blue-gray">
            {page}
          </Text>
        </div>
        </div>
        <div className="flex md:items-center gap-0 items-center ">
          <Link to="/student/participant/chats">
            <div className="relative flex items-center gap-2 bg-purple-50 rounded-full px-3 py-1 transition cursor-pointer">
              <FaRocketchat className=" font-medium text-purple-400 text-lg" />
              {/* <span className="text-sm font-medium text-purple-400">Chat</span> */}
              {messageCount.length > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px]
                  font-semibold rounded-full h-5 w-5 flex items-center justify-center shadow-md"
                >
                  {messageCount.length > 9 ? "9+" : messageCount.length}
                </span>
              )}
            </div>
          </Link>
         
          <Link to="/student/profile">
            <Button variant="text" color="blue-gray" className="grid mb-2">
              <img
                src={imageURL}
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover border border-gray-300"
              />
            </Button>
          </Link>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="text" color="blue-gray" aria-label="Logout">
                <ArrowRightEndOnRectangleIcon className="h-5 w-5 text-blue-gray-500" />
              </Button>
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

          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setOpenConfigurator(uiDispatch, true)}
            aria-label="Open configurator"
          >
            <Cog6ToothIcon className="h-5 w-5 text-blue-gray-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}


StudentNavbar.displayName = "/src/widgets/layout/DashboardNavbar.tsx";

export default StudentNavbar;
