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
  DocumentIcon,
  DocumentTextIcon,
  UsersIcon,
  UserGroupIcon,
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
import Assignment from "../pages/Dashboard/assignment/Assignment";
import Profile from "../pages/Dashboard/Profile";
import HistoryDetail from "../pages/Dashboard/History";
import CreateOrEditAssignment from "../pages/Dashboard/assignment/CreateOrEditAssignment";
import StudentToolDetail from "../pages/Dashboard/tools/StudentToolDetail";
import Classrooms from "../pages/Dashboard/classrooms/Class";
import ClassroomDetail from "../pages/Dashboard/classrooms/ClassroomDetail";
import CreateOrEditClassroom from "../pages/Dashboard/classrooms/CreateOrEditClassroom";
import Students from "../pages/Dashboard/classrooms/Students";
import AssignmentDetail from "../pages/Dashboard/assignment/AssignmentDetail";
import StudentAssignments from "../pages/Dashboard/student/Assignments";
import Resources from "../pages/Dashboard/Resources";
import AssignmentStudents from "../pages/Dashboard/assignment/Students";
import StudentAssignment from "../pages/Dashboard/student/Assignment";
import StudentAnalytics from "../pages/Dashboard/assignment/StudentAnalytics";
import AssignmentDetails from "../pages/Dashboard/student/AssignmentDetails";

import HeroesWallAdmin from "../pages/Dashboard/HoroesWall";
import Home from "../pages/Dashboard/student/Home";
import History from "../pages/Dashboard/student/History";
import Classes from "../pages/Dashboard/student/Classes";
import Classroom from "../pages/Dashboard/student/Classroom";
import Analytics from "../pages/Dashboard/classrooms/Analytics";
import VerifyEmail from "../pages/Dashboard/VerifyEmail";
import UpgradeSupport from "../pages/Dashboard/UpgradeSupport";
import Login from "../pages/Auth/Login";
import SignUp from "../pages/Auth/Signup";
import TeacherSignUp from "../pages/Auth/TeacherSignUp";
import VerifyForm from "../pages/Auth/VerifyForm";
import ResetForm from "../pages/Auth/ResetForm";
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
        name: "Zyra (Edubot)",
        path: "/chats",
        element: <Chat />,
      },
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "assignment",
        path: "/assignment",
        element: <Assignment />,
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
        name: "report",
        path: "/report",
        element: <Report />,
      },
      {
        icon: <UserGroupIcon {...icon} />,
        name: "Premium Features",
        path: "/premium",
        element: <Team />,
        submenu: [
          {
            icon: <UserGroupIcon {...icon} />,
            name: "Teams",
            path: "/premium/teams",
            element: <Team />,
          },
          {
            icon: <DocumentIcon {...icon} />,
            name: "Resources",
            path: "/premium/resources",
            element: <Resources />,
          },
        ],
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
      {
        icon: <WrenchScrewdriverIcon {...icon} />,
        name: "Heroes Wall",
        path: "/heroes-wall",
        element: <HeroesWallAdmin />,
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
        name: "upgrade",
        path: "/upgrade/support",
        element: <UpgradeSupport />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "classrooms",
        path: "/classrooms/joined",
        element: <Classes />,
      },
      {
        icon: <GlobeAltIcon {...icon} />,
        name: "history",
        path: "/history/:id",
        element: <HistoryDetail />,
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
        path: "/classrooms/class-details/:id",
        element: <Classroom />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "assignments",
        path: "/assignments/create",
        element: <CreateOrEditAssignment />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "assignments",
        path: "//assignments/edit/:id",
        element: <CreateOrEditAssignment />,
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
        path: "/assignments/:id/students/:assignmentId",
        element: <AssignmentStudents />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "classrooms",
        path: "/classrooms/:id/students/:studentId",
        element: <Analytics />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "classrooms",
        path: "/assignments/report/:id/students/:studentId",
        element: <StudentAnalytics />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "Join classroom",
        path: "/classroom/s/:id",
        element: <JoinClassroom />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "Join classroom",
        path: "/assignment/details/:id",
        element: <AssignmentDetail />,
      },

      {
        icon: <WrenchIcon {...icon} />,
        name: "Tool Detail",
        path: "/tools/:slug",
        element: <ToolDetail />,
      },
      {
        icon: <WrenchIcon {...icon} />,
        name: "Tool Detail",
        path: "/student/tools/:slug",
        element: <StudentToolDetail />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "verify",
        path: "/verify-email",
        element: <VerifyEmail />,
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
        icon: <DocumentTextIcon {...icon} />,
        name: "assignments",
        path: "/assignments",
        element: <StudentAssignments />,
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

      {
        icon: <AcademicCapIcon {...icon} />,
        name: "classes",
        path: "/assignments/attempt/:id",
        element: <StudentAssignment />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "classes",
        path: "/assignments/:id/details/:assignmentId",
        element: <AssignmentDetails />,
      },

      {
        icon: <AcademicCapIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "Join classroom",
        path: "/classroom/s/:id",
        element: <JoinClassroom />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "verify",
        path: "/verify-email",
        element: <VerifyEmail />,
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
        path: "/student",
        element: <SignUp />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign-up",
        path: "/sign-up",
        element: <TeacherSignUp />,
      },

      {
        icon: <RectangleStackIcon {...icon} />,
        name: "verify-email",
        path: "/verify-email",
        element: <VerifyForm />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "reset-password",
        path: "/reset-password",
        element: <ResetForm />,
      },
    ],
  },
];

export default routes;
