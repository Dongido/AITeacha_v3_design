import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStudentExaminations,
  selectStudentExaminations,
  selectStudentExaminationsLoading,
  selectStudentExaminationsError,
} from "../../../../store/slices/studentTestsSlice";
import {
  setSelectedTestType,
  selectSelectedTestType,
  SelectedTestType,
} from "../../../../store/slices/uiSlice";
import {
  fetchTests,
  selectTests,
  selectTestsLoading,
  selectTestsError,
} from "../../../../store/slices/testSlice";
import { Button } from "../../../../components/ui/Button";
import { Skeleton } from "../../../../components/ui/Skeleton";
import { AlertCircle } from "lucide-react";
import { AppDispatch } from "../../../../store";
import JoinTestDialog from "../components/JoinTestDialog";
import BaseTable from "../../../../components/table/BaseTable";
import { testColumns } from "./_components/column.test";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../../../../components/ui/Input";
const StudentExaminationsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const examinations = useSelector(selectStudentExaminations);
  const loading = useSelector(selectStudentExaminationsLoading);
   const selectedType = useSelector(selectSelectedTestType);
  const error = useSelector(selectStudentExaminationsError);
  const joinTestDialogRef = useRef<{ openDialog: () => void }>(null);
  const fetched = useRef(false);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!fetched.current) {
      dispatch(fetchStudentExaminations());
      fetched.current = true;
    }
  }, [dispatch]);

 useEffect(() => {
     if (typeof window !== "undefined") {
       if (selectedType) {
         localStorage.setItem("selectedTestType", selectedType);
         dispatch(fetchTests());
       }
     }
   }, [dispatch, selectedType]);
 
   const handleRowClick = (test: any) => {
     // navigate(`/dashboard/classrooms/details/${test.id}`);
   };
 
   const handleLaunchNew = () => {
     if (selectedType === "exam") {
       navigate("/dashboard/create-exam");
     } else {
       navigate("/dashboard/create-test");
     }
   };


  const handleJoinClick = () => {
    joinTestDialogRef.current?.openDialog();
  };

  if (error) {
    return (
      <div className="p-4">
        <div
          style={{
            backgroundColor: "#f87171",
            color: "white",
            padding: "16px",
            borderRadius: "8px",
            border: "1px solid #b91c1c",
            display: "flex",
            alignItems: "center",
          }}
        >
          <AlertCircle className="h-4 w-4 mr-2" />
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", margin: 0 }}>
            Error
          </h2>
          <p style={{ margin: 0 }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-[30px]">
      
            
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl m-0 font-bold">My Tests & Examinations</h2>
            <p className="text-gray-700 m-0 text-sm">
              List of examinations assigned to you.
            </p>
          </div>
          <Button
            onClick={handleJoinClick}
            variant={"gradient"}
            className="rounded-full"
          >
            Join A Test
          </Button>
        </div>


        {loading === "pending" ? (
                <div className="overflow-x-auto animate-pulse">
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
              )
              :
              (
                <div className="bg-white rounded-3xl p-4 ">
            <Input
                          type="text"
                          placeholder="Search school by"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="py-3 my-5 max-w-full w-[300px] bg-gray-100"
                        />
          <BaseTable data={examinations} columns={testColumns} />
          </div>
                // <BaseTable data={examinations} columns={testColumns} /> 

              )
            
            }


              {/* {!loading &&  (
                      <BaseTable
                        data={examinations}
                        columns={testColumns}
                        onRowClick={handleRowClick}
                      />
                    )} */}
        {/* <BaseTable data={examinations} columns={testColumns} /> */}
      </div>

      <JoinTestDialog ref={joinTestDialogRef} />
    </div>
  );
};

export default StudentExaminationsPage;



// import React, { useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchStudentExaminations,
//   selectStudentExaminations,
//   selectStudentExaminationsLoading,
//   selectStudentExaminationsError,
// } from "../../../../store/slices/studentTestsSlice";
// import {
//   setSelectedTestType,
//   selectSelectedTestType,
//   SelectedTestType,
// } from "../../../../store/slices/uiSlice";
// import {
//   fetchTests,
//   selectTests,
//   selectTestsLoading,
//   selectTestsError,
// } from "../../../../store/slices/testSlice";
// import { Button } from "../../../../components/ui/Button";
// import { Skeleton } from "../../../../components/ui/Skeleton";
// import { AlertCircle } from "lucide-react";
// import { AppDispatch } from "../../../../store";
// import JoinTestDialog from "../components/JoinTestDialog";
// import BaseTable from "../../../../components/table/BaseTable";
// import { testColumns } from "./_components/column.test";
// import { Link, useNavigate } from "react-router-dom";
// import { Input } from "../../../../components/ui/Input";

// const StudentExaminationsPage: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const examinations = useSelector(selectStudentExaminations);
//   const tests = useSelector(selectTests);
//   const loadingExams = useSelector(selectStudentExaminationsLoading);
//   const loadingTests = useSelector(selectTestsLoading);
//   const selectedType = useSelector(selectSelectedTestType);
//   const error = useSelector(selectStudentExaminationsError);
//   const joinTestDialogRef = useRef<{ openDialog: () => void }>(null);
//   const fetched = useRef(false);
  
//     const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();

//   // Load saved test type from localStorage on mount
//   useEffect(() => {
//     const savedType = localStorage.getItem("selectedTestType") as SelectedTestType | null;
//     if (savedType) {
//       dispatch(setSelectedTestType(savedType));
//     } else {
//       dispatch(setSelectedTestType("test"));
//     }
//   }, [dispatch]);

//   // Fetch data when selectedType changes
//   useEffect(() => {
//   if (!selectedType) return; // Prevent null errors

//   if (selectedType === "exam") {
//     dispatch(fetchStudentExaminations());
//   } else if (selectedType === "test") {
//     dispatch(fetchTests());
//   }

//   // Only save if selectedType is defined
//   localStorage.setItem("selectedTestType", selectedType);
// }, [dispatch, selectedType]);


//   const handleLaunchNew = () => {
//     if (selectedType === "exam") {
//       navigate("/dashboard/create-exam");
//     } else {
//       navigate("/dashboard/create-test");
//     }
//   };

  

//   if (error) {
//     return (
//       <div className="p-4">
//         <div className="bg-red-500 text-white p-4 rounded-lg border border-red-700 flex items-center">
//           <AlertCircle className="h-4 w-4 mr-2" />
//           <h2 className="text-lg font-bold m-0 mr-2">Error:</h2>
//           <p className="m-0">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   const isLoading = loadingExams === "pending" || loadingTests === "pending";

//   // Pick which dataset to display
//   const dataToShow = selectedType === "exam" ? examinations : tests;


// //   const filteredData = React.useMemo(() => {
// //   if (!dataToShow) return [];
// //   if (!searchTerm.trim()) return dataToShow;

// //   const term = searchTerm.toLowerCase();

// //   return dataToShow.filter((item: any) => {
// //     const values = Object.values(item)
// //       .filter((v) => typeof v === "string")
// //       .map((v) => v.toLowerCase());
// //     return values.some((v) => v.includes(term));
// //   });
// // }, [dataToShow, searchTerm]);


//   return (
//     <div className="p-4 md:p-[30px]">
//       <div>
//         <h2 className="text-lg font-bold m-0">Test & Exams</h2>
//         <p className="text-sm text-gray-800 m-0">
//           Manage all your tests & exams
//         </p>
//       </div>

//       {/* Test / Exam toggle */}
//       <div className="flex items-center gap-3 mt-[40px]">
//         <button
//           onClick={() => dispatch(setSelectedTestType("test"))}
//           className={`rounded-md p-3 px-4 transition ${
//             selectedType === "test"
//               ? "bg-green-600 text-white hover:bg-green-700"
//               : "bg-transparent text-gray-700 hover:text-gray-900"
//           }`}
//         >
//           Test Manager
//         </button>
//         <button
//           onClick={() => dispatch(setSelectedTestType("exam"))}
//           className={`rounded-md p-3 px-4 transition ${
//             selectedType === "exam"
//               ? "bg-green-600 text-white hover:bg-green-700"
//               : "bg-transparent text-gray-700 hover:text-gray-900"
//           }`}
//         >
//           Exam Manager
//         </button>
//       </div>

//       {/* Created / Joined toggle */}
//       <div className="flex border-b-2 my-[30px] border-gray-300">
//         <Link to={"/dashboard/test"} className="w-full sm:w-auto">
//           <Button
//             variant="ghost"
//             className="flex items-center w-full sm:w-fit h-full gap-3 transition"
//           >
//             Created
//           </Button>
//         </Link>
//         <Link to={"/dashboard/test/joined"} className="w-full sm:w-auto">
//           <Button
//             variant="ghost"
//             className="flex items-center w-full sm:w-fit h-full gap-3 font-semibold text-purple-900 border-purple-900 border-b-2 transition"
//           >
//             Joined
//           </Button>
//         </Link>
//       </div>

//       <div>

//         {isLoading ? (
//           <div className="overflow-x-auto animate-pulse">
//             <table className="min-w-full border-collapse">
//               <thead>
//                 <tr>
//                   {[...Array(5)].map((_, index) => (
//                     <th key={index} className="p-4 border-b">
//                       <Skeleton className="h-4 w-16 rounded" />
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {[...Array(6)].map((_, rowIndex) => (
//                   <tr key={rowIndex} className="border-b">
//                     {[...Array(5)].map((_, colIndex) => (
//                       <td key={colIndex} className="p-4">
//                         <Skeleton className="h-4 w-full rounded" />
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
          // <div className="bg-white rounded-3xl p-4 ">
          //   <Input
          //                 type="text"
          //                 placeholder={
          //                   selectedType === "exam"
          //                     ? "Search by exam title"
          //                     : "Search by test title"
          //                 }
          //                 value={searchTerm}
          //                 onChange={(e) => setSearchTerm(e.target.value)}
          //                 className="py-3 my-5 max-w-full w-[300px] bg-gray-100"
          //               />
          // <BaseTable data={examinations} columns={testColumns} />
          // </div>
//         )}
//       </div>

//       <JoinTestDialog ref={joinTestDialogRef} />
//     </div>
//   );
// };

// export default StudentExaminationsPage;
