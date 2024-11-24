import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Dashboard from "./layouts/Dashboard";
import StudentDashboard from "./layouts/StudentDashboard";
import Onboard from "./pages/Auth/Onboard";
import Auth from "./layouts/Auth";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import Home from "./pages/Landing/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/student/*" element={<StudentDashboard />} />
      </Route>

      <Route element={<PublicRoute />}>
        <Route path="/auth/*" element={<Auth />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
    </Routes>
  );
}

export default App;
