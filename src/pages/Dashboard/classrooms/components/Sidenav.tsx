import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import {
  useMaterialTailwindController,
  setOpenSidenav,
} from "../../../../context/index";
import Text from "../../../../components/ui/Text";
import { Button } from "../../../../components/ui/Button";
import brandImg from "../../../../logo.png";
import { Undo2, List, BookAIcon } from "lucide-react";
import { IoBookSharp } from "react-icons/io5";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/Dialogue";
import { NavLink } from "react-router-dom";
import { getOutlineAssessmentReport } from "../../../../api/studentassignment";
import { Skeleton } from "../../../../components/ui/Skeleton";
interface SidenavProps {
  brandName?: string;
  outlines: any[];
  tools: any[];
  selectedTool?: string | null;
  onSelectTool?: (tool: string | null) => void;
  onToggle?: (collapsed: boolean) => void;
  selectedOutline?: any;
  onSelectOutline?: (outline: any) => void;
  selectedOverview?: boolean;
  setSelectedOverview?: React.Dispatch<React.SetStateAction<boolean>>;
  onOverviewClick?: () => void;
  classroomId?: string;
  viewState?: string;
  onToggleView?: () => void;
}

export interface ReportData {
  assessments: any[];
  overallStatus: string;
}

export interface AssessmentReportItem {
  total_score: number;
  outline: string;
  no_of_question: number;
  passed: number;
  failed: number;
}

export interface OutlineAssessmentReportResponse {
  status: string;
  message: string;
  data: AssessmentReportItem[];
}

type SidenavType = "dark" | "white" | "transparent";

export function Sidenav({
  brandName = "AiTeacha",
  outlines,
  tools,
  selectedTool,
  onSelectTool,
  onToggle,
  selectedOutline,
  onSelectOutline,
  selectedOverview,
  setSelectedOverview,
  onOverviewClick,
  classroomId,
  viewState,
  onToggleView,
}: SidenavProps) {
  const { controller, dispatch } = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller as {
    sidenavColor: string;
    sidenavType: SidenavType;
    openSidenav: boolean;
  };
  const [showDialog, setShowDialog] = React.useState(false);
  const [showGradeDialog, setShowGradeDialog] = React.useState(false);
  const [reportData, setReportData] = React.useState<
    AssessmentReportItem[] | null
  >(null);

  const [loadingGrade, setLoadingGrade] = React.useState(false);
  const [errorGrade, setErrorGrade] = React.useState<string | null>(null);
  const openSidenavRef = React.useRef(openSidenav);

  const sidenavRef = React.useRef<HTMLDivElement>(null);

  const sidenavTypes: Record<SidenavType, string> = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const navigate = useNavigate();

  const handleToggle = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onToggle) {
      onToggle(newCollapsedState);
    }
  };

  // const handleSelectOutlineInternal = (outline: any) => {
  //   setSelectedOverview?.(false);
  //   const selectedIndex = outlines.findIndex((o) => o === outline);

  //   const isPreviousUnread =
  //     selectedIndex > 0 && outlines[selectedIndex - 1]?.mark_as_read === 0;

  //   if (selectedOutline && selectedOutline.mark_as_read === 0) {
  //     if (isPreviousUnread) {
  //       setShowDialog(true);
  //     } else {
  //       onSelectOutline?.(outline);
  //       onSelectTool?.(null);
  //     }
  //   } else {
  //     onSelectOutline?.(outline);
  //     onSelectTool?.(null);
  //   }
  // };

  const handleSelectOutlineInternal = (outline: any) => {
    setSelectedOverview?.(false);
    onSelectOutline?.(outline);
    onSelectTool?.(null);
  };

  const handleSelectToolInternal = (tool: any) => {
    setSelectedOverview?.(false);
    if (onSelectTool) {
      onSelectTool(tool);
    }
    if (onSelectOutline) {
      onSelectOutline(null);
    }
  };

  const handleViewGradesClick = () => {
    setShowGradeDialog(true);
    setLoadingGrade(true);
    setErrorGrade(null);
    setReportData(null);
    const fetchGrade = async () => {
      try {
        if (classroomId) {
          const response = await getOutlineAssessmentReport(classroomId);

          setReportData(response.data);
        } else {
          setErrorGrade("Classroom ID not available.");
        }
      } catch (err: any) {
        setErrorGrade(err.message || "Failed to fetch grades.");
      } finally {
        setLoadingGrade(false);
      }
    };
    fetchGrade();
  };

  const handleCloseGradeDialog = () => {
    setShowGradeDialog(false);
    setReportData(null);
    setErrorGrade(null);
  };

  // const handleOverviewClick = () => {
  //   setSelectedOverview?.(true)
  //   if (onOverviewClick) {
  //     onOverviewClick();
  //     setSelectedOverview?.(true);
  //   }

  //   handleSelectToolInternal(null);
  // };

  const handleOverviewClick = () => {
    setSelectedOverview?.(true);
    if (onOverviewClick) {
      onOverviewClick();
    }
    if (onSelectTool) {
      onSelectTool(null);
    }
    if (onSelectOutline) {
      onSelectOutline(null);
    }
  };

  React.useEffect(() => {
    openSidenavRef.current = openSidenav;
  }, [openSidenav]);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        openSidenavRef.current &&
        sidenavRef.current &&
        !sidenavRef.current.contains(event.target as Node)
      ) {
        setOpenSidenav(dispatch, false);
      }
    }

    if (openSidenav) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openSidenav, dispatch]);
  //  console.log(outlines, "outlines")

  return (
    <aside
      ref={sidenavRef}
      className={`routes-scroll-area ${sidenavTypes[sidenavType]} ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 h-[calc(100vh)] ${
        isCollapsed ? "w-28 " : "w-72"
      } transition-transform duration-300 xl:translate-x-0 flex flex-col`}
    >
      <div className="relative flex items-center justify-between p-4">
        <Link to={"/student/home"}>
          <div className="flex items-center">
            {brandImg && !isCollapsed && (
              <img src={brandImg} alt="Brand Logo" className="h-8 w-8 mr-2" />
            )}
            {!isCollapsed && (
              <Text variant="large" className="text-center text-black">
                {brandName}
              </Text>
            )}
          </div>
        </Link>
        {/* <Button
          variant={"default"}
          className="p-2 rounded-full xl:inline-block hidden"
          onClick={handleToggle}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-5 w-5 text-gray-700" />
          ) : (
            <ChevronLeftIcon className="h-5 w-5 text-gray-700" />
          )}
        </Button> */}

        <Button
          variant={"default"}
          className="absolute right-0 top-0 p-2 rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-gray-700" />
        </Button>
      </div>

      <nav className="flex-1 p-4">
        {/* <Button
          className="flex items-center rounded-md w-full  gap-3 py-2"
          onClick={() => navigate(-1)}
          variant={"gray"}
        >
          <Undo2 size={"1.1rem"} color="black" />
          Back
        </Button> */}

        {!isCollapsed && (
          <>
            <div
              className={`mb-6
               ${selectedOverview ? "" : ""} transition-all duration-300 mb-2`}
              onClick={handleOverviewClick}
            >
              <div className="flex items-center gap-2">
                <IoBookSharp />

                <Text className="text-lg text-black font-semibold capitalize">
                  Classroom Outlines
                </Text>
              </div>
            </div>

            <div className="overflow-y-auto">
              <NavLink
                to={`/class/class-details/${classroomId}`}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-md capitalize transition-all duration-200 ${
                    isActive
                      ? "bg-[#EFE6FD] text-[#6200EE] font-semibold"
                      : "text-black hover:bg-gray-100 hover:text-[#6200EE]"
                  }`
                }
              >
                Overview
              </NavLink>

              <Link to="/student/classrooms/outlines">
                {outlines.length > 0 ? (
                  outlines.map((outline, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelectOutlineInternal(outline)}
                      className={`flex flex-col gap-1 cursor-pointer rounded-lg px-3 py-2 mb-2 transition-all duration-200 
        ${
          selectedOutline?.name === outline.name
            ? "bg-[#EFE6FD] text-[#6200EE] font-semibold"
            : "text-black hover:bg-gray-100 hover:text-[#6200EE]"
        }`}
                    >
                      <span className="text-sm font-medium">
                        {`Outline ${index + 1}: ${outline.name
                          .replace(/#/g, "")
                          .replace(/[*`~_>!-]/g, "")}`}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-gray-500">
                    No Outlines Available
                  </div>
                )}
              </Link>
            </div>

            {/* {!outlines?.some(
              (outline) => outline.assessments && outline.assessments.length > 0
            ) && (
                <p className="text-sm px-2 text-gray-500 mt-2 italic">
                  No assessments available for this classroom.{" "}
                </p>
              )} */}
            {/* <div className="mt-auto py-4 ">
              <h3 className="text-lg font-semibold mb-2">Class Tools</h3>

              <div
                key="main"
                className={`border cursor-pointer px-4 py-3 rounded-lg ${selectedTool === null ? "bg-primary text-white" : ""
                  }`}
                onClick={() => handleSelectToolInternal(null)}
              >
                Main Classroom
              </div>

              <div className="max-h-40 overflow-y-auto bg-gray-100 p-1 rounded-md">
                {tools.map((tool, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectToolInternal(tool.tool_name)}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${selectedTool === tool.tool_name
                      ? "bg-primary text-white"
                      : "hover:bg-gray-200"
                      }`}
                  >
                    {!isCollapsed && <span>{tool.tool_name}</span>}
                  </div>
                ))}
              </div>
            </div> */}
            {/* <div className="mt-4">
              {onToggleView && viewState && (
                <Button
                  onClick={onToggleView}
                  variant="outline"
                  className={`w-full rounded-md ${sidenavType === "white"
                    ? "text-blue-gray-900 border-blue-gray-300 hover:bg-blue-gray-50"
                    : "text-white border-white/70 hover:bg-white/10"
                    }`}
                >
                  View {viewState === "classroom" ? "Resources" : "Classroom"}
                </Button>
              )}
            </div> */}
          </>
        )}
      </nav>

      <div className="mx-2 my-5">
        {outlines.every((outline) => outline.mark_as_read === 1) &&
        outlines.some(
          (outline) => outline.assessments && outline.assessments.length > 0
        ) ? (
          <button
            className="mt-4 text-sm bg-[#6200EE] text-white px-2 py-2 rounded-full"
            onClick={handleViewGradesClick}
            // variant={"gray"}
          >
            View Grades{" "}
          </button>
        ) : (
          <button
            className="mt-4 text-sm bg-[#6200EE] text-white px-2 py-2 rounded-full"
            // variant={"gray"}
            disabled
          >
            View Grades (Complete Assessments)
          </button>
        )}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogTitle>Unread Outline</DialogTitle>
          <DialogDescription>
            Please read the previous outline first.
          </DialogDescription>
        </DialogContent>
      </Dialog>

      <Dialog open={showGradeDialog} onOpenChange={setShowGradeDialog}>
        <DialogContent className="max-w-3xl">
          <DialogTitle>Assessment Grades</DialogTitle>
          <DialogDescription>
            {loadingGrade ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 text-center mx-auto">
                {[...Array(6)].map((_, index) => (
                  <Skeleton key={index} className="h-24 w-full rounded-md" />
                ))}
              </div>
            ) : errorGrade ? (
              <p className="text-red-500">{errorGrade}</p>
            ) : reportData && reportData.length > 0 ? (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full divide-y text-left divide-gray-200 shadow-md rounded-md bg-white">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Outline
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Score
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        No. of Questions
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Passed
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Failed
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.map((item, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.outline}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.total_score}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.no_of_question}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.passed}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.failed}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No assessment grade details available.</p>
            )}
          </DialogDescription>
          <div className="mt-4 flex justify-end">
            <Button variant="secondary" onClick={handleCloseGradeDialog}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
