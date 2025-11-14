// import { useEffect, useRef } from "react";
// import { Button } from "../../../components/ui/Button";
// import { useDispatch, useSelector } from "react-redux";
// import { loadStudentClassrooms } from "../../../store/slices/studentClassroomSlice";
// import { RootState, AppDispatch } from "../../../store";
// import JoinClassDialog from "./_components/JoinClassDialog";
// import { classroomColumns } from "./_components/column.classroom";
// import { Skeleton } from "../../../components/ui/Skeleton";
// import BaseTable from "../../../components/table/BaseTable";
// import { createClassroomSuggestion } from "../../../store/slices/classroomSlice";

// const Classes = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { classrooms, loading, error } = useSelector(
//     (state: RootState) => state.studentClassrooms
//   );
 

//   const joinClassDialogRef = useRef<any>(null);

//   const openJoinClassDialog = () => {
//     if (joinClassDialogRef.current) {
//       joinClassDialogRef.current.openDialog();
//     }
//   };

//   useEffect(() => {
//     if (classrooms.length === 0) {
//       dispatch(loadStudentClassrooms());
//     }
//   }, [dispatch, classrooms.length]);

  

 

//   return (
//     <div className="mt-12">
//       <div className="flex justify-between">
//         <h2 className="text-3xl font-bold text-gray-900 mb-4">
//           Class Overview
//         </h2>
//         <Button
//           variant={"gradient"}
//           className="rounded-full flex px-6 capitalize"
//           onClick={openJoinClassDialog}
//         >
//           Join a class
//         </Button>
//       </div>
//       {loading ? (
//         <div className="overflow-x-auto">
//           <table className="min-w-full border-collapse">
//             <thead>
//               <tr>
//                 {[...Array(5)].map((_, index) => (
//                   <th key={index} className="p-4 border-b">
//                     <Skeleton className="h-4 w-16 rounded" />
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {[...Array(6)].map((_, rowIndex) => (
//                 <tr key={rowIndex} className="border-b">
//                   {[...Array(5)].map((_, colIndex) => (
//                     <td key={colIndex} className="p-4">
//                       <Skeleton className="h-4 w-full rounded" />
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : error ? (
//         <p className="text-red-500">{error}</p>
//       ) : (
//         <BaseTable data={classrooms} columns={classroomColumns} />
//       )}
//       <JoinClassDialog ref={joinClassDialogRef} classId={1} />
//     </div>
//   );
// };

// export default Classes;



import React, { useEffect, useRef, useState } from "react";
import { Button } from "../../../components/ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { loadStudentClassrooms } from "../../../store/slices/studentClassroomSlice";
import { RootState, AppDispatch } from "../../../store";
import JoinClassDialog from "./_components/JoinClassDialog";
import { classroomColumns } from "./_components/column.classroom";
import { Skeleton } from "../../../components/ui/Skeleton";
import BaseTable from "../../../components/table/BaseTable";
import dashImg from "../../../assets/img/0e846ab4-992d-48b3-a818-d62a7803bd8e 1.png";
import { useNavigate, Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { CiSearch } from "react-icons/ci";
import { cn } from "../../../lib/utils";

const Classes = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { classrooms, loading, error } = useSelector(
    (state: RootState) => state.studentClassrooms
  );

  const navigate = useNavigate();
  const joinClassDialogRef = useRef<any>(null);

  const [activeTab, setActiveTab] = useState<"teacher" | "student">("student");
  const [searchQuery, setSearchQuery] = useState("");
  const [classTypeFilter, setClassTypeFilter] = useState<
    "All" | "Free" | "Paid"
  >("All");

  const openJoinClassDialog = () => {
    if (joinClassDialogRef.current) {
      joinClassDialogRef.current.openDialog();
    }
  };

  useEffect(() => {
    dispatch(loadStudentClassrooms());
  }, [dispatch]);

  const handleLaunchNewClassroom = () => {
    navigate("/dashboard/classrooms/create");
  };

  const handleJoinAClassroom = () => {
    navigate("/dashboard/classrooms/joined");
  };

  // const filteredClassrooms = classrooms.filter((classroom) => {
  //   const matchesType =
  //     classTypeFilter === "All" || classroom.class_type === classTypeFilter;
  //   const matchesSearch = classroom.classroom_name
  //     ?.toLowerCase()
  //     .includes(searchQuery.toLowerCase());
  //   return matchesType && matchesSearch;
  // });

  return (
    <div className="mt-4 p-2 md:p-[30px] routes-scroll-area">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-black font-semibold m-0 text-xl">My Classrooms</h1>
        <p className="text-[#3B3A3A] m-0 text-sm">Manage all your classrooms</p>
      </div>

      {/* Hero Section */}
      <div className="relative mt-4">
        <div className="bg-[#EFE6FD] text-white p-8 rounded-lg overflow-hidden">
          <p className="text-xl text-black font-[600] flex items-center">
            Teachers are heroes
          </p>
          <p className="text-sm text-[#3B3A3A] mx-auto md:mx-0">
            Empower your students and create meaningful learning experiences
            today.
          </p>
          <div className="mt-4 flex lg:flex-row flex-col gap-2">
            <button
              className="gap-2 rounded-full bg-[#6200EE] text-white flex pl-[16px] pr-[16px] pt-[8px] pb-[8px]"
              onClick={handleLaunchNewClassroom}
            >
              <Plus className="mt-1" size={"1.1rem"} />
              Launch Classroom
            </button>
            <button
              className="gap-2 rounded-full border border-[#6200EE] text-[#6200EE] flex pl-[16px] pr-[16px] pt-[8px] pb-[8px]"
              onClick={handleJoinAClassroom}
            >
              Join a Classroom
            </button>
          </div>
        </div>

        <img
          src={dashImg}
          alt="Robot reading a book"
          className="absolute lg:block hidden"
          style={{
            height: "200px",
            right: "10%",
            top: "45%",
            transform: "translateY(-50%)",
          }}
        />
      </div>

      {/* Tabs + Guides */}
      <div className="flex items-center justify-between flex-wrap gap-3 mt-8">
        <div className="flex border-b-2 border-gray-300">
          <Button
            variant="ghost"
            onClick={() => {
              setActiveTab("teacher");
              navigate("/dashboard/classrooms");
            }}
            className={`flex items-center w-full sm:w-fit h-full gap-3 transition font-semibold ${
              activeTab === "teacher"
                ? "border-b-4 border-purple-900 text-purple-900"
                : "text-gray-600"
            }`}
          >
            As a Teacher
          </Button>

          <Button
            variant="ghost"
            onClick={() => {
              setActiveTab("student");
              navigate("/dashboard/classrooms/joined");
            }}
            className={`flex items-center w-full sm:w-fit h-full gap-3 transition font-semibold ${
              activeTab === "student"
                ? "border-b-4 border-purple-900 text-purple-900"
                : "text-gray-600"
            }`}
          >
            As a Student
          </Button>
        </div>

        <div className="flex gap-2">
          {/* Guides Button */}
          <Link to="/dashboard/resource/training">
            <button className="flex items-center text-red-600 border border-red-300 rounded-full py-2 px-4 text-sm font-medium hover:bg-red-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 mr-1"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19.615 3.184c-1.88-.33-9.379-.33-11.258 0C6.018 3.516 5.1 4.437 4.77 6.212c-.33 1.775-.33 5.514 0 7.29.33 1.774 1.248 2.696 3.587 3.03 1.88.33 9.379.33 11.258 0 2.339-.333 3.256-1.255 3.587-3.03.33-1.776.33-5.515 0-7.29-.33-1.775-1.248-2.696-3.587-3.03zm-9.78 5.952l5.723 3.328-5.723 3.33V9.136z" />
              </svg>
              Guides
            </button>
          </Link>

          <button
            // variant={"gradient"}
            className="rounded-full px-4 capitalize bg-[#6200EE] py-2 text-white"
            onClick={openJoinClassDialog}
          >
            Join a class
          </button>
        </div>
      </div>

      {/* Filters */}
      <p className="text-sm text-[#3B3A3A] mt-5">
        These are classrooms you’ve joined as a student.
      </p>

      {/* <div className="flex gap-6 mt-4 border-b border-gray-200">
        {["All", "Paid", "Free"].map((tab) => (
          <button
            key={tab}
            onClick={() => setClassTypeFilter(tab as any)}
            className={cn(
              "pb-2 text-sm font-bold relative",
              classTypeFilter === tab
                ? "text-[#6200EE] border-b-2 border-[#6200EE]"
                : "text-[#626161] hover:text-[#6200EE]"
            )}
          >
            {tab}
          </button>
        ))}
      </div> */}

      

      {/* Table Area */}
      <div className="mt-6 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        
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
        ) : error ? (
          <p className="text-red-500 p-4">{error}</p>
        ) : (
          <BaseTable data={classrooms} columns={classroomColumns} />
        )}
      </div>

      {/* Dialog */}
      <JoinClassDialog ref={joinClassDialogRef} classId={1} />
    </div>
  );
};

export default Classes;
