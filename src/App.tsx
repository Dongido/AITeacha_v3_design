import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Dashboard from "./layouts/Dashboard";
import StudentDashboard from "./layouts/StudentDashboard";
import Onboard from "./pages/Auth/Onboard";
import Auth from "./layouts/Auth";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import Home from "./pages/Landing/Home";
import Pioneers from "./pages/Landing/Pioneers";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pioneer" element={<Pioneers />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard/*" element={<Dashboard />} />
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
