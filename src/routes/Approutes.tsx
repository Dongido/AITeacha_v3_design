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
  BookOpenIcon,
  FolderIcon,
  ArchiveBoxIcon,
  ClockIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  BanknotesIcon,
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
import TeamClassroomPage from "../pages/Dashboard/team/TeamClassroom";
import FreeUsers from "../pages/Dashboard/admin/FreeUsers";
import PastUsers from "../pages/Dashboard/admin/PastUsers";
import Subscribers from "../pages/Dashboard/admin/Subscribers";
import AdminWithdrawalsPage from "../pages/Dashboard/admin/Withdrawals";
import HeroesWallAdmin from "../pages/Dashboard/HoroesWall";
import Training from "../pages/Dashboard/Training";
import Community from "../pages/Dashboard/Community";
import Home from "../pages/Dashboard/student/Home";
import History from "../pages/Dashboard/student/History";
import Classes from "../pages/Dashboard/student/Classes";
import Classroom from "../pages/Dashboard/student/Classroom";
import OutlineAssessmentReportPage from "../pages/Dashboard/student/ClassroomReport";
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
import EditClassroom from "../pages/Dashboard/classrooms/EditClassroom";
import EditClassroomTools from "../pages/Dashboard/classrooms/EditClassroomTools";
import ReportData from "../pages/Dashboard/report/ReportData";
import ReportDummy from "../pages/Dashboard/ReportDummy";
import StudentReport from "../pages/Dashboard/report/StudentReport";
import HiddenDisability from "../pages/Dashboard/tools/HiddenDisability";
import StaffWorkloadManagementForm from "../pages/Dashboard/tools/StaffWorkloadManagement";
import ReportGenerator from "../pages/Dashboard/tools/ReportGenerator";
import CareerGuidanceForm from "../pages/Dashboard/tools/CareerGuidance";
import LabSimulator from "../pages/Dashboard/tools/LabSimulator";
import ArchivedAssistants from "../pages/Dashboard/premium/Archive";
import Wallet from "../pages/Dashboard/Wallet";

import CreateTest from "../pages/Dashboard/test/CreateTest";
import TestPage from "../pages/Dashboard/test/Test";
import TestDetailsPage from "../pages/Dashboard/test/TestDetails";
import StudentExaminationsPage from "../pages/Dashboard/test/student/StudentTests";
import TestStudentsPage from "../pages/Dashboard/test/TestStudents";
import JoinTest from "../pages/Dashboard/test/JoinTest";
import ExamPage from "../pages/Dashboard/test/TestPage";
import ExamSubmitted from "../pages/Dashboard/test/Submitted";
import TestView from "../pages/Dashboard/test/TestView";
import StudentTestReport from "../pages/Dashboard/test/StudentReport";
import TestReport from "../pages/Dashboard/report/TestReport";
import LiveClass from "../pages/Dashboard/live-class/LiveClass";
import CreateLiveClass from "../pages/Dashboard/live-class/CreateLiveClass";
import LiveClassDetailsPage from "../pages/Dashboard/live-class/LiveClassDetailsPage";
import GoogleMeetIframe from "../pages/Dashboard/live-class/LiveClassPreview";
import JitsiMeetingPage from "../pages/Dashboard/live-class/LiveclassJitsi";
import TranscriptDetailsPage from "../pages/Dashboard/live-class/TranscriptDetails";
import SuccessPage from "../pages/Dashboard/SuccessPage";
import SchoolStudents from "../pages/Dashboard/school/SchoolStudents";
import { UserIcon } from "lucide-react";
import { FaUsersLine } from "react-icons/fa6";
import StaffChat from "../pages/Dashboard/StaffChat";
import UserProfilePage from "../pages/Dashboard/UserProfilePage";
import GroupChatForm from "../pages/Dashboard/GroupChatForm";
import Forumpage from "../pages/Dashboard/Forumpage";
import StudentClass from "../pages/Dashboard/student/StudentChat";
import JitsiStudentMeeting from "../pages/Dashboard/student/JitsiMeeting";
import Participants from "../pages/Dashboard/student/Particpant"
import AdminResourcesPage from "../pages/Dashboard/admin/AdminResources";
import ChatListPage from "../pages/Dashboard/chats/ChatListPage";
import { FaRocketchat } from "react-icons/fa";
import MessageConfiguration from "../pages/Dashboard/forum/MessageConfiguration";

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
        icon: <DocumentTextIcon {...icon} />,
        name: "Test & Exam",
        path: "/test",
        element: <TestPage />,
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
        // adminOnly: true,
      },
      // {
      //   icon: <DocumentTextIcon {...icon} />,
      //   name: "report",
      //   path: "/report",
      //   element: <ReportDummy />,
      // },
      {
        icon: <UserGroupIcon {...icon} />,
        name: "School Features",
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
            icon: <FaUsersLine {...icon} />,
            name: "Staff Chat",
            path: "/premium/forum",
            element: <Forumpage />,
          },
          {
            icon: <UserIcon {...icon} />,
            name: "Students",
            path: "/premium/students",
            element: <SchoolStudents />,
          },
          {
            icon: <DocumentIcon {...icon} />,
            name: "Resources",
            path: "/premium/resources",
            element: <Resources />,
          },
          {
            icon: <BookOpenIcon {...icon} />,
            name: "Institution Archive",
            path: "/premium/archive",
            element: <ArchivedAssistants />,
          },
          {
            icon: <AcademicCapIcon {...icon} />,
            name: "Classrooms",
            path: "/premium/classrooms",
            element: <TeamClassroomPage />,
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
        icon: <BookOpenIcon {...icon} />,
        name: "Resources",
        path: "/resource",
        element: <Training />,
        submenu: [
          {
            icon: <ArchiveBoxIcon {...icon} />,
            name: "Training",
            path: "/resource/training",
            element: <Training />,
          },
          {
            icon: <FolderIcon {...icon} />,
            name: "Community",
            path: "/resource/community",
            element: <Community />,
          },
        ],
      },
      {
        icon: <ShieldCheckIcon {...icon} />,
        name: "Admin",
        path: "/admin",
        element: <AdminTools />,
        adminOnly: true,
        submenu: [
          {
            icon: <WrenchScrewdriverIcon {...icon} />,
            name: "Tools",
            path: "/admin/tools",
            element: <AdminTools />,
          },
          {
            icon: <UsersIcon {...icon} />,
            name: "Free users",
            path: "/admin/free-users",
            element: <FreeUsers />,
          },
          {
            icon: <UsersIcon {...icon} />,
            name: "Past users",
            path: "/admin/past-users",
            element: <PastUsers />,
          },
          {
            icon: <UsersIcon {...icon} />,
            name: "Subscribers",
            path: "/admin/subscribers",
            element: <Subscribers />,
          },
          {
            icon: <BanknotesIcon {...icon} />,
            name: "Withdrawals",
            path: "/admin/withdrawals",
            element: <AdminWithdrawalsPage />,
          },
          {
            icon: <FolderIcon {...icon} />,
            name: "Resources",
            path: "/admin/resources",
            element: <AdminResourcesPage />,
          },
        ],
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
        name: "chat",
        path: "/Studentforum/:id",
        element: <StudentClass />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "classrooms",
        path: "/classrooms/joined",
        element: <Classes />,
      },
       {
        icon: <AcademicCapIcon {...icon} />,
        name: "Chats",
        path: "/participant/chat",
        element: <ChatListPage />,
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
        path: "/class/class-details/:id",
        element: <Classroom />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "classrooms",
        path: "/class/class-report/:id",
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
        element: <EditClassroom />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "classrooms",
        path: "/classrooms/edit-tools/:id",
        element: <EditClassroomTools />,
      },

      {
        icon: <AcademicCapIcon {...icon} />,
        name: "classrooms",
        path: "/class/class-details/:id",
        element: <Classroom />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "classrooms",
        path: "/test/attempt/:id",
        element: <ExamPage />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "classrooms",
        path: "/test/submitted",
        element: <ExamSubmitted />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "classrooms",
        path: "/test/submitted-details/:id",
        element: <TestView />,
      },
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "test",
        path: "/create-test",
        element: <CreateTest />,
      },
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "test",
        path: "/create-exam",
        element: <CreateTest />,
      },
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "test",
        path: "/test/details/:id",
        element: <TestDetailsPage />,
      },
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "test",
        path: "/test/joined",
        element: <StudentExaminationsPage />,
      },
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "test",
        path: "/test/students/:id",
        element: <TestStudentsPage />,
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
        path: "/assignments/edit/:id",
        element: <CreateOrEditAssignment />,
      },
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "report",
        path: "/report/classroom/:id",
        element: <ReportData />,
      },
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "hidden",
        path: "/student-support-screening-assistant",
        element: <HiddenDisability />,
      },
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "hidden",
        path: "/staff-work-management",
        element: <StaffWorkloadManagementForm />,
      },
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "hidden",
        path: "/report-generator",
        element: <ReportGenerator />,
      },
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "hidden",
        path: "/career-guidance",
        element: <CareerGuidanceForm />,
      },
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "hidden",
        path: "/virtual-lab-simulator",
        element: <LabSimulator />,
      },
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "report",
        path: "/report/:reportId/:studentId",
        element: <StudentReport />,
      },
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "report",
        path: "/test/:testId/students/:studentId",
        element: <StudentTestReport />,
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
        path: "/assignments/joined",
        element: <StudentAssignments />,
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
        name: "classrooms",
        path: "/test-report/:examId",
        element: <TestReport />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "Join classroom",
        path: "/classroom/s/:id",
        element: <JoinClassroom />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "Join Test",
        path: "/classroom/cbt/:id",
        element: <JoinTest />,
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
        name: "wallet",
        path: "/wallet",
        element: <Wallet />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "verify",
        path: "/verify-email",
        element: <VerifyEmail />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "liveclass",
        path: "/liveclass/:classroomId",
        element: <LiveClass />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "liveclass",
        path: "/liveclass/create/:meetingId",
        element: <CreateLiveClass />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "liveclass",
        path: "/liveclass/details/:meetingId",
        element: <LiveClassDetailsPage />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "liveclass",
        path: "/liveclass/current",
        element: <GoogleMeetIframe />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "liveclass",
        path: "/liveclass/meeting/live/:meetingId",
        element: <JitsiMeetingPage />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "liveclass",
        path: "/transcripts/details/:liveclassroom_id/:transcriptId",
        element: <TranscriptDetailsPage />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "success",
        path: "/success",
        element: <SuccessPage />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "school-students",
        path: "/school/students",
        element: <SchoolStudents />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "teacherChats",
        path: "/teacherChats/:id",
        element: <GroupChatForm />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "teacherChats",
        path: "/stafforum/:id",
        element: <StaffChat />,
      },
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "profile",
        path: "/user-profile/:id",
        element: <UserProfilePage />,
      },
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "profile",
        path: "/Messageconfiguration",
        element: <MessageConfiguration />,
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
        icon: <AcademicCapIcon {...icon} />,
        name: "Test & Exam",
        path: "/test",
        element: <StudentExaminationsPage />,
      },
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "assignments",
        path: "/assignments",
        element: <StudentAssignments />,
      },
       {
        icon: <FaRocketchat {...icon} />,
        name: "messages",
        path: "/participant/chat",
        element: <ChatListPage />,
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
        name: "classrooms",
        path: "/test/attempt/:id",
        element: <ExamPage />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "classrooms",
        path: "/test/submitted",
        element: <ExamSubmitted />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "classrooms",
        path: "/test/submitted-details/:id",
        element: <TestView />,
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
        name: "Join test",
        path: "/classroom/cbt/:id",
        element: <JoinTest />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "verify",
        path: "/verify-email",
        element: <VerifyEmail />,
      },
       {
        icon: <AcademicCapIcon {...icon} />,
        name: "chat",
        path: "/Studentforum/:id",
        element: <StudentClass />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "chat",
        path: "/Studentchat/:id",
        element: <GroupChatForm />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "meeting",
        path: "/meeting-view",
        element: <JitsiStudentMeeting />,
      },
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "profile",
        path: "/user-profile/:id",
        element: <UserProfilePage />
      },
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "Classparticipant",
        path: "/Classparticipant/:id",
        element: <Participants/>
      },
       {
        icon: <DocumentTextIcon {...icon} />,
        name: "profile",
        path: "/user-profile/:id",
        element: <UserProfilePage />,
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
