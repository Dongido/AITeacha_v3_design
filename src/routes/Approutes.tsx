import {
  HomeIcon,
  BriefcaseIcon,
  WrenchIcon,
  ServerStackIcon,
  RectangleStackIcon,
  ChatBubbleLeftIcon,
  BellIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  UsersIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/solid";
import Dashboard from "../pages/Dashboard/Home";
import Team from "../pages/Dashboard/Team";
import Tools from "../pages/Dashboard/Tools";

import Classrooms from "../pages/Dashboard/classrooms/Class";
import ClassroomDetail from "../pages/Dashboard/classrooms/ClassroomDetail";
import CreateOrEditClassroom from "../pages/Dashboard/classrooms/CreateOrEditClassroom";

import Login from "../pages/Auth/Login";
import SignUp from "../pages/Auth/Signup";
import JoinClassroom from "../pages/Dashboard/classrooms/JoinClassroom";
import ToolDetail from "../pages/Dashboard/tools/ToolDetail";
const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Dashboard />,
      },
      // {
      //   icon: <BriefcaseIcon {...icon} />,
      //   name: "teams",
      //   path: "/team",
      //   element: <Team />,
      // },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "classrooms",
        path: "/classrooms",
        element: <Classrooms />,
      },

      {
        icon: <WrenchIcon {...icon} />,
        name: "My Tools",
        path: "/tools",
        element: <Tools />,
      },
      {
        icon: <ChatBubbleLeftIcon {...icon} />,
        name: "AI Chat",
        path: "/chats",
        element: <Tools />,
      },
      {
        icon: <BellIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Tools />,
      },

      {
        icon: <GlobeAltIcon {...icon} />,
        name: "history",
        path: "/history",
        element: <Tools />,
      },
      // {
      //   icon: <UsersIcon {...icon} />,
      //   name: "students",
      //   path: "/students",
      //   element: <Tools />,
      // },
      {
        icon: <ArrowUpIcon {...icon} />,
        name: "upgrade",
        path: "/upgrade",
        element: <Tools />,
      },
    ],
  },
];

export const Paramroutes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "classrooms",
        path: "/classrooms/details/:id",
        element: <ClassroomDetail />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "classrooms",
        path: "/classrooms/create",
        element: <CreateOrEditClassroom isEdit={false} />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "classrooms",
        path: "/classrooms/edit/:id",
        element: <CreateOrEditClassroom isEdit={true} />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "Join classroom",
        path: "/classroom/s/:id",
        element: <JoinClassroom />,
      },

      {
        icon: <WrenchIcon {...icon} />,
        name: "Tool Detail",
        path: "/tools/:slug",
        element: <ToolDetail />,
      },
    ],
  },
];

export const Authroutes = [
  {
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "login",
        path: "/login",
        element: <Login />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign-up",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
