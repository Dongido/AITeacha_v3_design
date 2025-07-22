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
import { Undo2, List } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/Dialogue";
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

  const handleSelectOutlineInternal = (outline: any) => {
    setSelectedOverview?.(false);
    const selectedIndex = outlines.findIndex((o) => o === outline);

    const isPreviousUnread =
      selectedIndex > 0 && outlines[selectedIndex - 1]?.mark_as_read === 0;

    if (selectedOutline && selectedOutline.mark_as_read === 0) {
      if (isPreviousUnread) {
        setShowDialog(true);
      } else {
        onSelectOutline?.(outline);
        onSelectTool?.(null);
      }
    } else {
      onSelectOutline?.(outline);
      onSelectTool?.(null);
    }
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

  const handleOverviewClick = () => {
    if (onOverviewClick) {
      onOverviewClick();
      setSelectedOverview?.(true);
    }

    handleSelectToolInternal(null);
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
        <Link to={"/"}>
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
        <Button
          variant={"default"}
          className="p-2 rounded-full xl:inline-block hidden"
          onClick={handleToggle}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-5 w-5 text-gray-700" />
          ) : (
            <ChevronLeftIcon className="h-5 w-5 text-gray-700" />
          )}
        </Button>

        <Button
          variant={"default"}
          className="absolute right-0 top-0 p-2 rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-gray-700" />
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <Button
          className="flex items-center rounded-md w-full  gap-3 py-2"
          onClick={() => navigate(-1)}
          variant={"gray"}
        >
          <Undo2 size={"1.1rem"} color="black" />
          Back
        </Button>

        {!isCollapsed && (
          <>
            <div className="flex items-center gap-2 mt-4">
              <List size={20} color="gray" />
              <Text className="text-lg text-gray-800 font-semibold uppercase tracking-wider">
                Classroom Outlines
              </Text>
            </div>
            <Button
              variant={"outline"}
              className="bg-black rounded-md text-white w-full my-2"
              onClick={() => handleOverviewClick()}
            >
              <span className="text-white">Overview</span>
            </Button>
            <div className="max-h-60 overflow-y-auto">
              {outlines.length > 0 ? (
                outlines.map((outline, index) => (
                  <div
                    key={index}
                    className={`flex flex-col gap-1 p-3 rounded-lg cursor-pointer ${
                      selectedOutline?.name === outline.name
                        ? "bg-gray-400 text-white"
                        : "bg-gray-100 hover:bg-gray-500 hover:text-black"
                    } transition-all duration-300 mb-2`}
                    onClick={() => handleSelectOutlineInternal(outline)}
                  >
                    <span className="text-sm font-medium ">
                      {` Outline ${index + 1}: ${outline.name
                        .replace(/#/g, "")
                        .replace(/[*`~_>!-]/g, "")}`}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center">No Outlines Available</div>
              )}
            </div>
            {outlines.every((outline) => outline.mark_as_read === 1) &&
            outlines.some(
              (outline) => outline.assessments && outline.assessments.length > 0
            ) ? (
              <Button
                className="mt-4 w-full px-2 rounded-md"
                onClick={handleViewGradesClick}
                variant={"gray"}
              >
                View Grades{" "}
              </Button>
            ) : (
              <Button
                className="mt-4 w-full text-sm rounded-md"
                variant={"gray"}
                disabled
              >
                View Grades (Complete Assessments)
              </Button>
            )}

            {!outlines?.some(
              (outline) => outline.assessments && outline.assessments.length > 0
            ) && (
              <p className="text-sm px-2 text-gray-500 mt-2 italic">
                No assessments available for this classroom.{" "}
              </p>
            )}
            <div className="mt-auto py-4 ">
              <h3 className="text-lg font-semibold mb-2">Class Tools</h3>

              <div
                key="main"
                className={`border cursor-pointer px-4 py-3 rounded-lg ${
                  selectedTool === null ? "bg-primary text-white" : ""
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
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${
                      selectedTool === tool.tool_name
                        ? "bg-primary text-white"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    {!isCollapsed && <span>{tool.tool_name}</span>}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4">
              {onToggleView && viewState && (
                <Button
                  onClick={onToggleView}
                  variant="outline"
                  className={`w-full rounded-md ${
                    sidenavType === "white"
                      ? "text-blue-gray-900 border-blue-gray-300 hover:bg-blue-gray-50"
                      : "text-white border-white/70 hover:bg-white/10"
                  }`}
                >
                  View {viewState === "classroom" ? "Resources" : "Classroom"}
                </Button>
              )}
            </div>
          </>
        )}
      </nav>

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
