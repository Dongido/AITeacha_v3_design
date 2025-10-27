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



    console.log(assignment)

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
    <div className="p-3 md:p-[30px]">
      <>
        {/* <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            variant="gray"
            className="flex items-center w-full sm:w-fit h-full gap-3 rounded-md"
            onClick={handleViewAssignment}
          >
            View Your Assignments
          </Button>
          <Button
            variant="gradient"
            className="flex items-center w-full sm:w-fit h-full gap-3 rounded-md"
            onClick={handleLaunchNewAssignment}
          >
            <Plus size={"1.1rem"} />
            Create New Assignment
          </Button>
          <Button
            onClick={openPopup}
            variant={"outline"}
            className="flex items-center px-6 py-3  bg-red-500 text-white text-lg font-medium rounded-lg shadow-lg   space-x-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="white"
            >
              <path d="M19.615 3.184c-1.88-.33-9.379-.33-11.258 0C6.018 3.516 5.1 4.437 4.77 6.212c-.33 1.775-.33 5.514 0 7.29.33 1.774 1.248 2.696 3.587 3.03 1.88.33 9.379.33 11.258 0 2.339-.333 3.256-1.255 3.587-3.03.33-1.776.33-5.515 0-7.29-.33-1.775-1.248-2.696-3.587-3.03zm-9.78 5.952l5.723 3.328-5.723 3.33V9.136z" />
            </svg>
            <span className="text-white">Guide</span>
          </Button>
          {isPopupOpen && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
              <div className="relative bg-white rounded-lg shadow-lg w-[90%] max-w-3xl">
                <button
                  onClick={closePopup}
                  className="absolute top-3 right-3 bg-red-500 text-gray-600 hover:bg-gray-300 p-2 rounded-full"
                >
                  <span className="text-white"> ✕</span>
                </button>

                <div className="p-4">
                  <iframe
                    width="100%"
                    height="400"
                    src="https://www.youtube.com/embed/aDwj6TI49c8?si=PV7aatcb14CI8n8C"
                    title="Community Preview"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          )}
        </div> */}
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
              <h3 className="text-2xl font-medium text-gray-600">{studentAssignments.length}</h3>
              <div>
                <h3 className="font-semibold text-lg m-0">Students</h3>
                <p className="m-0 text-sm">Assigned to you as a student</p>
              </div>
            </div>
          </div>

          {/* <div className="flex border-b-2 my-[30px] border-gray-300">
            <Link to={"/dashboard/assignment"} className="w-full sm:w-auto">
              <Button
                variant="ghost"
                className="flex items-center w-full sm:w-fit border-b-2 font-semibold border-purple-900 hover:bg-gray-200 h-full gap-3 text-purple-900 transition"
              >
                Teacher
              </Button>
            </Link>
            <Link
              to={"/dashboard/assignments/joined"}
              className="w-full sm:w-auto"
            >
              <Button
                variant="ghost"
                className="flex items-center w-full sm:w-fit h-full gap-3 rounded-md transition"
              >
                Students
              </Button>
            </Link>
          </div> */}



          <div className="flex border-b-2 my-[30px] border-gray-300">
  <Button
    variant="ghost"
    onClick={() => setActiveTab("teacher")}
    className={`flex items-center w-full sm:w-fit h-full gap-3  transition font-semibold ${
      activeTab === "teacher"
        ? "border-b-2 border-purple-900 text-purple-900"
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
        ? "border-b-2 border-purple-900 text-purple-900"
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
          <div className="bg-white mt-[30px] p-4 rounded-3xl">
            <div className="flex flex-wrap gap-3 items-center my-4 justify-between">
              <Input
                type="text"
                placeholder="Search by classroom"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-3 max-w-full w-[300px] bg-gray-100"
              />
              <Button
                // variant="gradient"
                className="flex bg-white border-2 border-purple-900 text-primary items-center w-full sm:w-fit h-full gap-3 rounded-full font-semibold"
                onClick={handleLaunchNewAssignment}
              >
                <Plus size={"1.1rem"} />
                New Assignment
              </Button>
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
                data={studentAssignments}
                // data={studentAssignments.filter((item) =>
                //   item.assignment_name
                //     ?.toLowerCase()
                //     .includes(searchTerm.trim().toLowerCase())
                // )}
                columns={columns} // student columns
              />
            )}


            {/* <BaseTable
              data={assignments.filter((item) =>
                item.classroom_name
                  ?.toLowerCase()
                  .includes(searchTerm.trim().toLowerCase())
              )}
              columns={assignmentColumns}
            /> */}
          </div>
        )}
      </>
    </div>
  );
};

export default Assignment;
