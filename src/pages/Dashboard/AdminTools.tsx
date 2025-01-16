import { Button } from "../../components/ui/Button";
import { Plus, Search, Undo2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ToolUsageDashboard from "./report/tool-usage-dashboard";
const AdminTools = () => {
  const navigate = useNavigate();
  const handleLaunchNewTool = () => {
    navigate("/dashboard/classrooms/create");
  };
  return (
    <div className="mt-12">
      <div className="flex w-full mt-12 mb-6 items-center justify-between flex-col sm:flex-row">
        <h2 className="text-xl font-medium text-gray-900 sm:mb-0 mb-4">
          Welcome Back! 👋 View and Build your AI tools Analytics
        </h2>
      </div>
      <ToolUsageDashboard />
    </div>
  );
};

export default AdminTools;
