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

export function DashboardNavbar() {
  const { controller, dispatch } = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller as {
    fixedNavbar: boolean;
    openSidenav: boolean;
  };
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");

  const handleLogout = () => {
    Cookies.remove("at-accessToken");
    Cookies.remove("at-refreshToken");
    localStorage.removeItem("ai-teacha-user");
    localStorage.removeItem("redirectPath");
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
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize px-4">
          <Text variant="large" color="blue-gray">
            {page}
          </Text>
        </div>
        <div className="flex items-center gap-0">
          <div className="mr-auto sm:ml-6 md:mr-4 sm:mr-0 md:w-56">
            <Input
              placeholder="Search for anything.."
              type="search"
              className="w-full bg-gray-100 border-transparent"
            />
          </div>
          <Button
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
            aria-label="Toggle sidenav"
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </Button>
          <Link to="#">
            <Button variant="text" color="blue-gray" className="grid">
              <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
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
            onClick={() => setOpenConfigurator(dispatch, true)}
            aria-label="Open configurator"
          >
            <Cog6ToothIcon className="h-5 w-5 text-blue-gray-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/DashboardNavbar.tsx";

export default DashboardNavbar;
