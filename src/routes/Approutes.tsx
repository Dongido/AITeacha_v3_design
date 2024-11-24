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
  DocumentTextIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/solid";
import Dashboard from "../pages/Dashboard/Home";
import Team from "../pages/Dashboard/Team";
import Tools from "../pages/Dashboard/Tools";
import Chat from "../pages/Dashboard/Chat";
import Notifications from "../pages/Dashboard/Notifications";
import Upgrade from "../pages/Dashboard/Upgrade";
import WorkHistory from "../pages/Dashboard/WorkHistory";
import AdminTools from "../pages/Dashboard/AdminTools";
import Report from "../pages/Dashboard/Report";

import Classrooms from "../pages/Dashboard/classrooms/Class";
import ClassroomDetail from "../pages/Dashboard/classrooms/ClassroomDetail";
import CreateOrEditClassroom from "../pages/Dashboard/classrooms/CreateOrEditClassroom";
import Students from "../pages/Dashboard/classrooms/Students";

import Home from "../pages/Dashboard/student/Home";
import History from "../pages/Dashboard/student/History";
import Classes from "../pages/Dashboard/student/Classes";
import Classroom from "../pages/Dashboard/student/Classroom";
import Analytics from "../pages/Dashboard/classrooms/Analytics";

import Login from "../pages/Auth/Login";
import SignUp from "../pages/Auth/Signup";
import JoinClassroom from "../pages/Dashboard/classrooms/JoinClassroom";
import ToolDetail from "../pages/Dashboard/tools/ToolDetail";
import Onboard from "../pages/Auth/Onboard";
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
        name: "Zyra (Chatbot)",
        path: "/chats",
        element: <Chat />,
      },
      {
        icon: <BellIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
      },

      {
        icon: <GlobeAltIcon {...icon} />,
        name: "history",
        path: "/history",
        element: <WorkHistory />,
      },
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "report and asignment",
        path: "/report",
        element: <Report />,
      },

      {
        icon: <ArrowUpIcon {...icon} />,
        name: "upgrade",
        path: "/upgrade",
        element: <Upgrade />,
      },
      {
        icon: <WrenchScrewdriverIcon {...icon} />,
        name: "Admin Tools",
        path: "/admin-tools",
        element: <AdminTools />,
        adminOnly: true,
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
        path: "/classrooms/joined",
        element: <Classes />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "classrooms",
        path: "/classrooms/details/:id",
        element: <ClassroomDetail />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "classrooms",
        path: "/classrooms/joined",
        element: <Classes />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "classrooms",
        path: "/classrooms/class-details/:id",
        element: <Classroom />,
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
        name: "classrooms",
        path: "/classrooms/:id/students",
        element: <Students />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "classrooms",
        path: "/classrooms/:id/students/:studentId",
        element: <Analytics />,
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

export const Studentroutes = [
  {
    layout: "student",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "classes",
        path: "/class",
        element: <Classes />,
      },

      {
        icon: <GlobeAltIcon {...icon} />,
        name: "work history",
        path: "/history",
        element: <History />,
      },
    ],
  },
];
export const StudentParamroutes = [
  {
    layout: "student",
    pages: [
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "classes",
        path: "/class/class-details/:id",
        element: <Classroom />,
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
        icon: <ServerStackIcon {...icon} />,
        name: "onboarding",
        path: "/onboarding",
        element: <Onboard />,
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
