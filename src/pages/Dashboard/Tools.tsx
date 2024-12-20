import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { loadTools, loadStudentTools } from "../../store/slices/toolsSlice";
import { RootState, AppDispatch } from "../../store";
import { FaHeart } from "react-icons/fa";
import { Skeleton } from "../../components/ui/Skeleton";
import { useNavigate } from "react-router-dom";
import { Switch } from "../../components/ui/Switch";
import { checkEligibility } from "../../api/tools";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogTrigger,
} from "../../components/ui/Dialogue";
import { Button } from "../../components/ui/Button";
const Tools = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate(); // Initialize navigate

  const { tools, loading, error, studentTools, studentLoading, studentError } =
    useSelector((state: RootState) => state.tools);

  const [showStudentTools, setShowStudentTools] = useState(false);

  useEffect(() => {
    if (tools.length === 0) {
      dispatch(loadTools());
    }
    if (studentTools.length === 0) {
      dispatch(loadStudentTools());
    }
  }, [dispatch, tools.length, studentTools.length]);

  const [userDetails, setUserDetails] = useState<any>(null);
  const [isEmailVerified, setIsEmailVerified] = useState<number>(0);

  useEffect(() => {
    const userDetailsFromStorage = localStorage.getItem("ai-teacha-user");

    if (userDetailsFromStorage) {
      const parsedDetails = JSON.parse(userDetailsFromStorage);
      setUserDetails(parsedDetails);
      setIsEmailVerified(parsedDetails.is_email_verified);
    }
  }, []);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleToolClick = async (toolId: number, slug: string) => {
    try {
      const eligibility = await checkEligibility(toolId);
      if (eligibility) {
        navigate(
          showStudentTools
            ? `/dashboard/student/tools/${slug}`
            : `/dashboard/tools/${slug}`
        );
      } else {
        setIsDialogOpen(true);
      }
    } catch (error) {
      setIsDialogOpen(true);
      //  alert("Failed to check eligibility. Please try again.");
    }
  };

  useEffect(() => {
    const userDetailsFromStorage = localStorage.getItem("ai-teacha-user");

    if (userDetailsFromStorage) {
      const parsedDetails = JSON.parse(userDetailsFromStorage);
      setUserDetails(parsedDetails);
      setIsEmailVerified(parsedDetails.is_email_verified);
    }
  }, []);
  const handleVerifyEmail = () => {
    navigate("/dashboard/verify-email");
  };

  return (
    <div className="mt-4">
      {userDetails && isEmailVerified === 1 && (
        <div
          className="bg-[#e5dbff] mt-3 mb-4 text-black p-4 rounded-md flex justify-center items-center"
          style={{
            background:
              "linear-gradient(143.6deg, rgba(192, 132, 252, 0) 20.79%, rgba(232, 121, 249, 0.26) 40.92%, rgba(204, 171, 238, 0) 70.35%)",
          }}
        >
          <span className="text-center text-xl font-bold">
            Teachers Are Heroes🎉
          </span>
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-gray-900">
          AI Tools to enhance your experience🤓
        </h2>
        <div className="flex items-center">
          <span className="text-gray-900 font-medium mr-2">Student Tools</span>
          <Switch
            checked={showStudentTools}
            onCheckedChange={() => setShowStudentTools(!showStudentTools)}
          />
        </div>
      </div>

      {(showStudentTools ? studentLoading : loading) ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 text-center mx-auto">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-24 w-full rounded-md" />
          ))}
        </div>
      ) : (showStudentTools ? studentError : error) ? (
        <p className="text-red-500">
          {showStudentTools ? studentError : error}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 text-center mx-auto">
          {(showStudentTools ? studentTools : tools).map((tool) => (
            <div
              key={tool.id}
              onClick={() => handleToolClick(tool.id, tool.slug)}
              className="flex items-center border border-gray-300 px-4 py-3 rounded-3xl bg-white hover:bg-gray-50 cursor-pointer transition duration-500 ease-in-out transform hover:scale-105"
            >
              <div className="text-primary text-2xl mr-4">
                {tool.thumbnail ? (
                  <img
                    src={
                      tool.thumbnail.startsWith("http")
                        ? tool.thumbnail
                        : `https://${tool.thumbnail}`
                    }
                    alt={tool.name || "Tool Thumbnail"}
                    className="w-16 h-16 object-cover rounded-lg"
                    width={300}
                    height={300}
                  />
                ) : (
                  <FaHeart className="text-purple-500 w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center" />
                )}
              </div>

              <div className="text-left">
                <h3 className="text-base capitalize font-semibold text-gray-900">
                  {tool.name === "math calculator" ? "Solver" : tool.name}
                </h3>
                {tool.description.charAt(0).toUpperCase() +
                  tool.description.slice(1)}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader className="flex justify-center items-center mx-auto text-center">
            <DialogTitle>Eligibility Check</DialogTitle>
            <DialogDescription className="text-xl font-medium">
              You are not eligible to access this tool.
            </DialogDescription>
            <Link to={"/dashboard/upgrade"}>
              <Button variant={"gradient"} className="rounded-full mt-6">
                Please Upgrade your Plan to use this
              </Button>
            </Link>
          </DialogHeader>
          <DialogFooter>
            <DialogClose
              className=" text-black rounded-lg p-2"
              onClick={() => setIsDialogOpen(false)}
            >
              Close
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tools;
