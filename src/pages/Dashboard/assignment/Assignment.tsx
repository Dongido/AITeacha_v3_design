import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadAssignments } from "../../../store/slices/assignmentSlice";
import { RootState, AppDispatch } from "../../../store";
import { Skeleton } from "../../../components/ui/Skeleton";
import BaseTable from "../../../components/table/BaseTable";
import { assignmentColumns } from "./components/column.assignment";
import { Plus, Search, Undo2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import RestrictedPage from "./RestrictedPage";
// import { StudentAssignment } from "";


import { loadStudentAssignments } from "../../../store/slices/studentAssignmentSlice";
import { Input } from "../../../components/ui/Input";
import AssignmentColumnsComponent from "../student/_components/column.assignment";

const Assignment = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { assignments, loading, error } = useSelector(
    (state: RootState) => state.assignments
  );
  // const { assignments, loading, error } = useSelector(
  //   (state: RootState) => state.studentAssignments
  // );
  const [searchTerm, setSearchTerm] = useState("");

  const { assignments: studentAssignments } = useSelector(
    (state: RootState) => state.studentAssignments
  );


  const filteredStudentAssignment = React.useMemo(() => {
      if (!studentAssignments) return [];
      if (!searchTerm.trim()) return studentAssignments;
  
      const term = searchTerm.toLowerCase();
      return studentAssignments.filter((item: any) => {
        const values = Object.values(item)
          .filter((v) => typeof v === "string")
          .map((v) => v.toLowerCase());
        return values.some((v) => v.includes(term));
      });
    }, [studentAssignments, searchTerm]);


  const joinClassDialogRef = useRef<any>(null);
  const columns = AssignmentColumnsComponent();

  useEffect(() => {
    if (assignments.length === 0) {
      dispatch(loadStudentAssignments());
    }
  }, [dispatch, assignments.length]);

  const assignment = useSelector(
    (state: RootState) => state.assignments.selectedAssignment
  );
  const fetchingAssignment = useSelector(
    (state: RootState) => state.assignments.fetchingAssignment
  );

  console.log(assignment);

  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isEmailVerified, setIsEmailVerified] = useState<number>(0);

  const [activeTab, setActiveTab] = useState<"teacher" | "student">("teacher");

  useEffect(() => {
    const userDetailsFromStorage = localStorage.getItem("ai-teacha-user");
    if (userDetailsFromStorage) {
      const parsedDetails = JSON.parse(userDetailsFromStorage);
      setUserDetails(parsedDetails);
      setIsEmailVerified(parsedDetails.is_email_verified);
    }
  }, []);

  useEffect(() => {
    dispatch(loadAssignments());
  }, [dispatch]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const handleLaunchNewAssignment = () => {
    navigate("/dashboard/assignments/create");
  };
  const handleViewAssignment = () => {
    navigate("/dashboard/assignments/joined");
  };

  const filteredAssignments = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return assignments;

    return studentAssignments.filter((assignment: any) => {
      // Adjust depending on your data structure
      const classroomName =
        assignment?.classroom?.name ||
        assignment?.classroom_name ||
        assignment?.classroomName ||
        "";

      return classroomName.toLowerCase().includes(term);
    });
  }, [studentAssignments, searchTerm]);

  const renderError = () => {
    if (error === "Permission restricted for unverified email") {
      return (
        <div
          className="bg-[#ffe6e6] mt-3 mb-4 text-black p-4 rounded-md flex justify-center items-center"
          style={{
            background:
              "linear-gradient(143.6deg, rgba(255, 132, 132, 0) 20.79%, rgba(255, 121, 121, 0.26) 40.92%, rgba(255, 171, 171, 0) 70.35%)",
          }}
        >
          <span className="text-center text-xl font-bold">
            Please verify your email to continue!
          </span>
        </div>
      );
    }

    if (error === "Permission restricted: for free account") {
      return (
        <div>
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
          <RestrictedPage error={error} />
        </div>
      );
    }

    return <p className="text-red-500">{error}</p>;
  };

  if (error) {
    return renderError();
  }

  return (
    <div className="p-3 md:p-[30px] ">
      <>
        <div className="">
          <div className="mb-[50px] ">
            <h2 className="text-xl font-bold text-gray-900 mb-0 ">
              Your Assignments
            </h2>
            <p className="text-sm">
              Manage all your assignments as a teacher and students{" "}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
            <div className="bg-white p-[22px] flex flex-col gap-4 rounded-2xl">
              <h3 className="text-2xl font-medium text-gray-600">
                {assignments.length}
              </h3>
              <div>
                <h3 className="font-semibold text-lg m-0">Teacher</h3>
                <p className="m-0 text-sm">Assignment you created</p>
              </div>
            </div>

            <div className="bg-white p-[22px] flex flex-col gap-4 rounded-2xl">
              <h3 className="text-2xl font-medium text-gray-600">
                {studentAssignments.length}
              </h3>
              <div>
                <h3 className="font-semibold text-lg m-0">Students</h3>
                <p className="m-0 text-sm">Assigned to you as a student</p>
              </div>
            </div>
          </div>

          <div className="flex border-b-2 my-[30px] border-gray-300">
            <Button
              variant="ghost"
              onClick={() => setActiveTab("teacher")}
              className={`flex items-center w-full sm:w-fit h-full gap-3  transition font-semibold ${
                activeTab === "teacher"
                  ? "border-b-4 border-purple-900 text-purple-900"
                  : "text-gray-600"
              }`}
            >
              As a Teacher
            </Button>

            <Button
              variant="ghost"
              onClick={() => setActiveTab("student")}
              className={`flex items-center w-full sm:w-fit h-full gap-3  transition font-semibold ${
                activeTab === "student"
                  ? "border-b-4 border-purple-900 text-purple-900"
                  : "text-gray-600"
              }`}
            >
              As a Student
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  {[...Array(5)].map((_, index) => (
                    <th key={index} className="p-4 border-b">
                      <Skeleton className="h-4 w-16 rounded" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(6)].map((_, rowIndex) => (
                  <tr key={rowIndex} className="border-b">
                    {[...Array(5)].map((_, colIndex) => (
                      <td key={colIndex} className="p-4">
                        <Skeleton className="h-4 w-full rounded" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white mt-[30px] p-4  rounded-3xl">
            <div className="flex flex-wrap gap-3 items-center my-4 justify-between">
              <Input
                type="text"
                placeholder="Search by classroom"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-3 max-w-full w-[300px] bg-gray-100"
              />

              {
                activeTab === "teacher" && <Button
                // variant="gradient"
                className="flex bg-white border-2 border-purple-900 text-primary items-center w-full sm:w-fit h-full gap-3 rounded-full font-semibold"
                onClick={handleLaunchNewAssignment}
              >
                <Plus size={"1.1rem"} />
                New Assignment
              </Button>
              }
              
            </div>

            {activeTab === "teacher" ? (
              <BaseTable
                data={assignments.filter((item) =>
                  item.classroom_name
                    ?.toLowerCase()
                    .includes(searchTerm.trim().toLowerCase())
                )}
                columns={assignmentColumns}
              />
            ) : (
              <BaseTable
                data={filteredStudentAssignment}
                columns={columns}
              />

              
            )}

          </div>
        )}
      </>
    </div>
  );
};

export default Assignment;
