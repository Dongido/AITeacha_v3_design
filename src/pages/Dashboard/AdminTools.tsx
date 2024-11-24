import { Button } from "../../components/ui/Button";
import { Plus, Search, Undo2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
const AdminTools = () => {
  const navigate = useNavigate();
  const handleLaunchNewTool = () => {
    navigate("/dashboard/classrooms/create");
  };
  return (
    <div className="mt-12">
      <div className="flex w-full mt-12 mb-6 items-center justify-between flex-col sm:flex-row">
        <h2 className="text-xl font-medium text-gray-900 sm:mb-0 mb-4">
          Welcome Back! 👋 View and Build your AI tools
        </h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            variant="gradient"
            className="flex items-center w-full sm:w-fit h-full gap-3 rounded-md"
            onClick={handleLaunchNewTool}
          >
            <Plus size={"1.1rem"} />
            Launch New Tool
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminTools;
