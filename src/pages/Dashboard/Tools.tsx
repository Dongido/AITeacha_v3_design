import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadTools, loadStudentTools } from "../../store/slices/toolsSlice";
import { RootState, AppDispatch } from "../../store";
import { FaHeart } from "react-icons/fa";
import { Skeleton } from "../../components/ui/Skeleton";
import { Link } from "react-router-dom";
import { Switch } from "../../components/ui/Switch";

const Tools = () => {
  const dispatch = useDispatch<AppDispatch>();

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
            <Link
              to={
                showStudentTools
                  ? `/dashboard/student/tools/${tool.slug}`
                  : `/dashboard/tools/${tool.slug}`
              }
              key={tool.id}
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
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tools;
