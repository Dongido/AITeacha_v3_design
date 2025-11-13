import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  loadTools,
  loadStudentTools,
  loadToolsCategory,
} from "../../store/slices/toolsSlice";
import { RootState, AppDispatch } from "../../store";
import { FaHeart } from "react-icons/fa";
import { Skeleton } from "../../components/ui/Skeleton";
import { checkEligibility } from "../../api/tools";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../../components/ui/Dialogue";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";

const Tools = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    tools,
    loading,
    error,
    studentTools,
    studentLoading,
    studentError,
    categories,
    categoryLoading,
  } = useSelector((state: RootState) => state.tools);

  const [showStudentTools, setShowStudentTools] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    if (tools.length === 0) dispatch(loadTools());
    if (studentTools.length === 0) dispatch(loadStudentTools());
    if (categories.length === 0) dispatch(loadToolsCategory());
  }, [dispatch, tools.length, studentTools.length, categories.length]);

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
    } catch {
      setIsDialogOpen(true);
    }
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const filteredTools = showStudentTools
    ? studentTools
    : selectedCategory && selectedCategory !== "all"
    ? tools.filter((tool) => tool.category === selectedCategory)
    : tools;

  const popularTools = filteredTools.filter((tool) => tool.tag === "popular");
  const otherTools = filteredTools.filter((tool) => tool.tag !== "popular");

  const handleExternalNavigation = async (tool: any) => {
    try {
      const eligibility = await checkEligibility(tool.id);
      if (eligibility) {
        switch (tool.service_id) {
          case "career guidance and counseling":
            window.location.href = "/dashboard/career-guidance";
            break;
          case "school staff workload management":
            window.location.href = "/dashboard/staff-work-management";
            break;
          case "student support screening assistant":
            window.location.href =
              "/dashboard/student-support-screening-assistant";
            break;
          case "virtual lab simulator":
            window.location.href = "/dashboard/virtual-lab-simulator";
            break;
          case "school Document and report generator":
            window.location.href = "/dashboard/report-generator";
            break;
          default:
            handleToolClick(tool.id, tool.slug);
        }
      } else {
        setIsDialogOpen(true);
      }
    } catch {
      setIsDialogOpen(true);
    }
  };

  return (
    <div className="mt-4">
      <div>
        <h1 className="text-xl text-black font-semibold">AI Tools</h1>
        <p className="text-sm text-gray-600">
          AI Tools to enhance your experience
        </p>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        {/* Left Tabs */}
        <div className="flex items-center">
          <div className="relative bg-white rounded-full flex items-center p-1 w-fit shadow-md border border-gray-200">
            {/* Sliding Indicator */}
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-1 left-1 w-1/2 h-[calc(100%-8px)] rounded-full bg-[#6200EE] shadow-md"
              animate={{
                x: showStudentTools ? "100%" : "0%",
              }}
            />

            {/* Tabs */}
            <button
              onClick={() => setShowStudentTools(false)}
              className={`relative z-10 px-5 py-2 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
                !showStudentTools ? "text-white" : "text-gray-800"
              }`}
            >
              Teacher Tools
            </button>
            <button
              onClick={() => setShowStudentTools(true)}
              className={`relative z-10 px-5 py-2 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
                showStudentTools ? "text-white" : "text-gray-800"
              }`}
            >
              Student Tools
            </button>
          </div>
        </div>

        {/* Right Dropdown (Always Visible) */}
        <div className="flex justify-start md:justify-end">
          <div className="lg:w-full w-[70%]">
            <Select
              value={selectedCategory || "all"}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="bg-white border-gray-200 rounded-md text-sm sm:text-base font-medium w-full">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categoryLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
                ) : (
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Tools Display */}
      {(showStudentTools ? studentLoading : loading) ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 text-center mx-auto">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-24 w-full rounded-md" />
          ))}
        </div>
      ) : (showStudentTools ? studentError : error) ? (
        <p className="text-red-500 text-center mt-4">
          {showStudentTools ? studentError : error}
        </p>
      ) : (
        <>
          {popularTools.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 px-2">
                Recommended Tools
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 text-center mx-auto">
                {popularTools.slice(0, 6).map((tool) => (
                  <div
                    key={tool.id}
                    onClick={() => handleToolClick(tool.id, tool.slug)}
                    className="flex items-center border border-gray-300 px-4 py-3 rounded-3xl bg-[#EFE6FD] hover:bg-gray-50 cursor-pointer transition duration-500 ease-in-out transform hover:scale-105"
                  >
                    <div className="text-primary  shrink-0 text-2xl mr-4">
                      {tool.thumbnail ? (
                        <img
                          src={
                            tool.thumbnail.startsWith("http")
                              ? tool.thumbnail
                              : `https://${tool.thumbnail}`
                          }
                          alt={tool.name || "Tool Thumbnail"}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <FaHeart className="text-purple-500 w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center" />
                      )}
                    </div>
                    <div className="text-left">
                      <h3 className="text-base capitalize font-semibold text-gray-900">
                        {tool.name === "math calculator" ? "Solver" : tool.name}
                      </h3>
                      <p className="text-gray-700 text-sm">
                        {tool.description.charAt(0).toUpperCase() +
                          tool.description.slice(1)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <h2 className="text-xl font-bold text-gray-900 mb-4 px-2">
            More Tools
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 text-center mx-auto">
            {otherTools
              .filter((tool) => tool.service_id !== "ssistant")
              .map((tool) => (
                <div
                  key={tool.id}
                  onClick={() => handleExternalNavigation(tool)}
                  className="relative flex items-center border border-gray-300 px-4 py-3 rounded-3xl bg-white hover:bg-gray-50 cursor-pointer transition duration-500 ease-in-out transform hover:scale-105"
                >
                  <div className="text-primary shrink-0 text-2xl mr-4">
                    {tool.thumbnail ? (
                      <img
                        src={
                          tool.thumbnail.startsWith("http")
                            ? tool.thumbnail
                            : `https://${tool.thumbnail}`
                        }
                        alt={tool.name || "Tool Thumbnail"}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <FaHeart className="text-purple-500 w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center" />
                    )}
                  </div>
                  <div className="text-left">
                    <h3 className="text-base capitalize font-semibold text-gray-900">
                      {tool.name === "math calculator" ? "Solver" : tool.name}
                    </h3>
                    <p className="text-gray-700 text-sm">
                      {tool.description.charAt(0).toUpperCase() +
                        tool.description.slice(1)}
                    </p>
                  </div>
                  {tool.tag === "new" && (
                    <div className="absolute bottom-2 right-2 bg-primary text-white text-xs font-semibold py-1 px-2 rounded-full">
                      New
                    </div>
                  )}
                </div>
              ))}
          </div>
        </>
      )}

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader className="flex justify-center items-center mx-auto text-center">
            <DialogTitle>Eligibility Check</DialogTitle>
            <DialogDescription className="text-xl font-medium">
              You are not eligible to access this tool.
            </DialogDescription>
            <Link to={"/dashboard/upgrade"}>
              <Button variant={"gradient"} className="rounded-full mt-6">
                Please Upgrade your Plan to use this tool.
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
