import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";
import Dashboard from "./layouts/Dashboard";
import StudentDashboard from "./layouts/StudentDashboard";
import PaidLayout from "./layouts/PaidLayout";
import Onboard from "./pages/Auth/Onboard";
import Auth from "./layouts/Auth";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import "@fontsource/vibur";
import "@fontsource-variable/urbanist";
import Home from "./pages/Landing/Home";
import Blog from "./pages/Landing/Blog";
import Contact from "./pages/Landing/Contact";
import Pricing from "./pages/Landing/Pricing";
import About from "./pages/Landing/About";
import Terms from "./pages/Landing/Terms";
import Privacy from "./pages/Landing/Privacy";
import LevelUp from "./pages/Landing/BlogPages/LevelUp";
import AiRole from "./pages/Landing/BlogPages/AIRole";
import AITransformation from "./pages/Landing/BlogPages/AITransformation";
import AIEducation from "./pages/Landing/BlogPages/AIEducation";
import UpgradeSupport from "./pages/Landing/UpgradeSupport";
import RoleBasedRedirect from "./pages/Dashboard/RoleBasedRedirect";
import Faqs from "./pages/Landing/Faqs";
import PioneersProgram from "./pages/Landing/communities/PioneerProgram";
import Pioneers from "./pages/Landing/communities/Pioneers";
import AITeachaMission from "./pages/Landing/communities/Mission";
import EducatorTools from "./pages/Landing/Tools";
import StudentTools from "./pages/Landing/StudentTools";
import TermsPolicy from "./pages/Landing/TermsPolicy";
import HeroesWall from "./pages/Landing/HeroesWall";
import AIPolicy from "./pages/Landing/communities/AIPolicy";
import StudentDataPolicy from "./pages/Landing/communities/StudentDataPolicy";
import DataPrivacy from "./pages/Landing/communities/DataPrivacy";
import Resources from "./pages/Dashboard/Resources";
import DashboardHandler from "./DashboardHandler";
import ScrollToTop from "./ScrollToTop";
import Payment from "./pages/Auth/components/payment";
import AITeachaOnboarding from "./pages/Landing/communities/AITeachaOnboarding";
import Training from "./pages/Dashboard/Training";
import Ads from "./pages/Landing/communities/Ads";
import Community from "./pages/Dashboard/Community";
import AuthCallback from "./pages/Dashboard/live-class/AuthCallback";
import CreateLiveClass from "./pages/Dashboard/live-class/CreateLiveClass";
import ExamPage from "./pages/Dashboard/test/TestPage";
import Interest from "./pages/Auth/Interes";
import CompleteProfile from "./pages/Auth/CompleteProfile";
import CompleteProfileStudent from "./pages/Auth/CompleteProfileStudent";
import StudentInterest from "./pages/Auth/StudentInterest";
import Outline from "./pages/Dashboard/student/Outline";
import ResultDetails from "./pages/Dashboard/result/ResultDetails";

function App() {
  const location = useLocation();

  useEffect(() => {
    const resetOnLeave = () => {
      if (location.pathname !== "/heroes-wall") {
        localStorage.setItem("isHeroesWallLoaded", "false");
      }
    };

    window.addEventListener("beforeunload", resetOnLeave);

    return () => {
      window.removeEventListener("beforeunload", resetOnLeave);
      resetOnLeave();
    };
  }, [location.pathname]);

  return (
    <div className="app-scroll-wrapper">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/communities/pioneer-program"
          element={<PioneersProgram />}
        />
        <Route
          path="/ai-in-education-trainer-program"
          element={<AITeachaOnboarding />}
        />
        <Route path="/lagos-conference" element={<Ads />} />
        <Route path="/communities/pioneers" element={<Pioneers />} />
        <Route path="/educator-tools" element={<EducatorTools />} />
        <Route path="/student-tools" element={<StudentTools />} />
        <Route path="/blogs" element={<Blog />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="/heroes-wall" element={<HeroesWall />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/legal-terms" element={<TermsPolicy />} />
        <Route path="/terms-of-service" element={<Terms />} />
        <Route path="/mission" element={<AITeachaMission />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="/ai-policy" element={<AIPolicy />} />
        <Route path="/data-privacy" element={<DataPrivacy />} />
        <Route path="/student-policy" element={<StudentDataPolicy />} />
        <Route
          path="/blogs/level-up-your-teaching-introducing-the-ai-teacher-certification-course"
          element={<LevelUp />}
        />
        <Route
          path="/blogs/the-role-of-ai-natural-language-processors"
          element={<AiRole />}
        />
        <Route
          path="/blogs/artificial-intelligence-transforming-education"
          element={<AITransformation />}
        />
        <Route
          path="/blogs/is-it-really-safe-to-use-ai-in-education"
          element={<AIEducation />}
        />
        <Route path="/upgrade/support" element={<UpgradeSupport />} />
        <Route path="/dashboard" element={<DashboardHandler />} />
        <Route path="/student" element={<DashboardHandler />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/auth/oauth2callback" element={<AuthCallback />} />

          {/* <Route path="/dashboard/resource/training" element={<Training />} />
            <Route path="/dashboard/resource/community" element={<Community />} />  */}
          <Route path="/payment" element={<Payment />} />
          <Route path="/interest" element={<Interest />} />
          <Route path="/student/interest" element={<StudentInterest />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/student/complete-profile" element={<CompleteProfileStudent />} />
          <Route path="/classroom/s/*" element={<RoleBasedRedirect />} />
          <Route path="/classroom/cbt/*" element={<RoleBasedRedirect />} />
          <Route path="/examination/attempt/:id" element={<ExamPage />} />

          <Route
            path="/student"
            element={<Navigate to="/student/home" replace />}
          />
          <Route path="/student/*" element={<StudentDashboard />} />
          <Route path="/class/*" element={<PaidLayout />} />
          <Route path="/student/classrooms/outlines" element={<Outline />} />
          <Route path="/dashboard/result/resultdetails" element={<ResultDetails />} />
        </Route>

        <Route element={<PublicRoute />}>
          <Route path="/auth/*" element={<Auth />} />
        </Route>
        <Route
          path="/dashboard"
          element={<Navigate to="/dashboard/home" replace />}
        />
        <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
      </Routes>
    </div>
  );
}

export default App;
