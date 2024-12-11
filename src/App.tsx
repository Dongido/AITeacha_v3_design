import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Dashboard from "./layouts/Dashboard";
import StudentDashboard from "./layouts/StudentDashboard";
import Onboard from "./pages/Auth/Onboard";
import Auth from "./layouts/Auth";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
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
import Pioneers from "./pages/Landing/communities/Pioneers";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/communities/pioneers" element={<Pioneers />} />
      <Route path="/blogs" element={<Blog />} />
      <Route path="/faqs" element={<Faqs />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/about" element={<About />} />
      <Route path="/terms-of-service" element={<Terms />} />
      <Route path="/privacy-policy" element={<Privacy />} />
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

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/classroom/s/*" element={<RoleBasedRedirect />} />
        <Route
          path="/dashboard"
          element={<Navigate to="/dashboard/home" replace />}
        />
        <Route
          path="/student"
          element={<Navigate to="/student/home" replace />}
        />
        <Route path="/student/*" element={<StudentDashboard />} />
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
  );
}

export default App;
