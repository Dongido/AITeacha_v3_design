// import { useEffect, useState, useRef } from "react";
// import { DeleteIcon, Edit, Undo2, Delete, ArrowRightIcon } from "lucide-react";
// import { Button } from "../../../components/ui/Button";
// import { useNavigate, useParams, Link } from "react-router-dom";
// import DeleteClassroomDialog from "./components/DeleteClassroomDialogue";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchClassroomByIdThunk } from "../../../store/slices/classroomSlice";
// import { RootState, AppDispatch } from "../../../store";
// import { ClipboardIcon, CheckIcon } from "@heroicons/react/24/solid";
// import { Skeleton } from "../../../components/ui/Skeleton";
// import { ChevronLeft } from "lucide-react";
// import { IoCopyOutline } from "react-icons/io5";
// import { FaEdit } from "react-icons/fa";

// const ClassroomDetail = () => {
//   const navigate = useNavigate();
//   const { id } = useParams<{ id: string }>();
//   const dispatch = useDispatch<AppDispatch>();
//   const deleteDialogRef = useRef<any>(null);

//   const classroom = useSelector(
//     (state: RootState) => state.classrooms.selectedClassroom
//   );
//   const fetchingClassroom = useSelector(
//     (state: RootState) => state.classrooms.fetchingClassroom
//   );

//   useEffect(() => {
//     if (id) {
//       dispatch(fetchClassroomByIdThunk(Number(id)));
//     }
//   }, [dispatch, id]);

//   const handleEditClassroom = () => {
//     navigate(`/dashboard/classrooms/edit/${id}`);
//   };
//   const handleEditTools = () => {
//     navigate(`/dashboard/classrooms/edit-tools/${id}`);
//   };

//   const openDeleteDialog = () => {
//     deleteDialogRef.current?.openDialog();
//   };
//   const [copied, setCopied] = useState(false);

//   const handleCopyLink = () => {
//     navigator.clipboard
//       .writeText(classroom?.join_url || "")
//       .then(() => {
//         setCopied(true);
//         setTimeout(() => setCopied(false), 2000);
//       })
//       .catch((error) => console.error("Failed to copy link:", error));
//   };

//   const handleCopyCode = () => {
//     navigator.clipboard
//       .writeText(classroom?.join_code || "")
//       .then(() => {
//         setCopied(true);
//         setTimeout(() => setCopied(false), 2000);
//       })
//       .catch((error) => console.error("Failed to copy link:", error));
//   };

//   const [userDetails, setUserDetails] = useState<any>(null);
//   const [isEmailVerified, setIsEmailVerified] = useState<number>(0);

//   useEffect(() => {
//     const userDetailsFromStorage = localStorage.getItem("ai-teacha-user");

//     if (userDetailsFromStorage) {
//       const parsedDetails = JSON.parse(userDetailsFromStorage);
//       setUserDetails(parsedDetails);
//       setIsEmailVerified(parsedDetails.is_email_verified);
//     }
//   }, []);

//   return (
//     <div className="mt-4">
//       <Button
//         className="flex items-center text-black py-2 text-lg"
//         onClick={() => navigate(-1)}
//       >
//         <ChevronLeft className="text-sm" />
//         Back
//       </Button>
//       <div className="flex w-full mt-6 mb-6 items-center justify-between">
//         <p className="text-sm bg-[#E7F8F3] border border-[#0DBA86] text-[#0DBA86] px-6 py-2 rounded-full">
//           Status: {classroom?.status}
//         </p>
//         <div className="flex gap-2">
//           {/* <Button
//             variant={"gray"}
//             onClick={handleEditClassroom}
//             className="flex items-center w-fit h-full gap-3 py-2 rounded-md"
//           >
//             <Edit size={"1.1rem"} color="white" />
//             Edit Classroom
//           </Button> */}
//           <Button
//             variant={"danger"}
//             onClick={openDeleteDialog}
//             className="flex items-center w-fit h-full gap-3 py-2"
//           >
//             Delete Classroom
//           </Button>
//         </div>
//       </div>

//       {fetchingClassroom ? (
//         <div className="border rounded-lg">
//           <div className="bg-[#EFE6FD] text-white p-8 rounded-lg overflow-hidden">
//             <Skeleton className="h-6 w-1/4 mb-4" />
//             <Skeleton className="h-8 w-3/4 mb-2" />
//             <Skeleton className="h-4 w-2/3 mb-4" />
//             <Skeleton className="h-4 w-1/2" />
//             <Skeleton className="h-10 w-32 mt-4" />
//           </div>
//           <Skeleton className="h-4 w-1/3 mt-4" />
//           <Skeleton className="h-4 w-1/4" />
//           <Skeleton className="h-4 w-1/2" />
//           <Skeleton className="h-4 w-1/3" />
//           <Skeleton className="h-4 w-full mt-2" />
//           <Skeleton className="h-4 w-3/4" />
//           <Skeleton className="h-4 w-5/6" />
//         </div>
//       ) : (
//         <div className=" border rounded-lg">
//           <div className="bg-[#EFE6FD] text-black p-4 lg:p-8 md:p-8 rounded-lg overflow-hidden">
//             <h2 className="text-xl font-bold mt-2">
//               {classroom?.classroom_name}
//             </h2>
//             <p className="text-sm">
//               {" "}
//               {classroom?.classroom_description
//                 ? classroom.classroom_description.length > 270
//                   ? `${classroom.classroom_description.slice(0, 270)}...`
//                   : classroom.classroom_description
//                 : ""}
//             </p>
//             <div className="flex flex-col sm:flex-row items-center mt-4 justify-between gap-4 sm:gap-6 flex-wrap">
//               <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
//                 <button
//                   onClick={() =>
//                     navigate(`/dashboard/liveclass/${classroom?.classroom_id}`)
//                   }
//                   className="w-full sm:w-auto flex items-center justify-center border border-[#6200EE] text-[#6200EE] py-2 px-4 rounded-full text-sm"
//                 >
//                   Go to Live Class
//                   <ArrowRightIcon className="ml-2 w-3 h-3" />
//                 </button>

//                 <button
//                   onClick={() =>
//                     navigate(
//                       `/dashboard/Studentforum/${classroom?.classroom_id}`
//                     )
//                   }
//                   className="w-full sm:w-auto flex items-center justify-center border border-[#6200EE] text-[#6200EE] py-2 px-4 rounded-full text-sm"
//                 >
//                   Group Chats
//                   <ArrowRightIcon className="h-3 w-3 ml-2" />
//                 </button>

//                 <button
//                   className="w-full flex gap-2 sm:w-auto border border-[#6200EE] text-[#6200EE] py-2 px-4 rounded-full text-sm"
//                   onClick={() => {
//                     navigator.clipboard.writeText(
//                       classroom?.join_url || "Link not available"
//                     );
//                     handleCopyLink();
//                   }}
//                 >
//                   <IoCopyOutline className="mt-1" />
//                   Copy Class Link
//                 </button>

//                 <button
//                   className="w-full flex gap-2 sm:w-auto bg-[#6200EE] text-[#FFFFFF] py-2 px-4 rounded-full text-sm"
//                   onClick={() => {
//                     navigator.clipboard.writeText(
//                       classroom?.join_code || "Code not available"
//                     );
//                     handleCopyCode();
//                   }}
//                 >
//                   <IoCopyOutline className="mt-1" />
//                   Copy Class Code
//                 </button>

//                 <div className="flex items-center mt-2 sm:mt-0">
//                   {copied && (
//                     <CheckIcon className="h-5 w-5 ml-2 text-green-400" />
//                   )}
//                 </div>
//               </div>

//               <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4 sm:mt-0"></div>
//             </div>
//             {/* END - Responsive changes applied here */}
//           </div>

//           <div className="flex justify-between items-center bg-white rounded-2xl p-4 mt-10">
//             <div>
//               <h1 className="text-xl font-semibold">Course Introduction</h1>
//               <p className="text-sm">
//                 Manage and add extra details such as polls, quiz, videos and
//                 more
//               </p>
//             </div>
//             <div>
//               <button className="bg-black rounded-full text-white px-5 py-2 flex gap-2 items-center">
//                 <FaEdit />
//                 Edit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <DeleteClassroomDialog
//         ref={deleteDialogRef}
//         classroomId={Number(id)}
//         onSuccess={() => navigate("/dashboard/classrooms")}
//       />
//     </div>
//   );
// };

// export default ClassroomDetail;

import { useEffect, useState, useRef } from "react";
import { DeleteIcon, Edit, Undo2, Delete, ArrowRightIcon } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { useNavigate, useParams, Link } from "react-router-dom";
import DeleteClassroomDialog from "./components/DeleteClassroomDialogue";
import { useDispatch, useSelector } from "react-redux";
import { fetchClassroomByIdThunk } from "../../../store/slices/classroomSlice";
import { RootState, AppDispatch } from "../../../store";
import { ClipboardIcon, CheckIcon } from "@heroicons/react/24/solid";
import { Skeleton } from "../../../components/ui/Skeleton";
import { ChevronLeft } from "lucide-react";
import { IoCopyOutline } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { PiEyeSlashLight } from "react-icons/pi";
import { IoTrashOutline } from "react-icons/io5";
import { Pagination } from "../../../components/table/Pagination";

const ClassroomDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const deleteDialogRef = useRef<any>(null);

  const classroom = useSelector(
    (state: RootState) => state.classrooms.selectedClassroom
  );
  const fetchingClassroom = useSelector(
    (state: RootState) => state.classrooms.fetchingClassroom
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchClassroomByIdThunk(Number(id)));
    }
  }, [dispatch, id]);

  const openDeleteDialog = () => {
    deleteDialogRef.current?.openDialog();
  };

  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((error) => console.error("Failed to copy:", error));
  };

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

  // --- Tab State ---
  const [activeTab, setActiveTab] = useState("Overview");
  const tabs = ["Overview", "Contents", "Students", "Assignments"];

  return (
    <div className="mt-4 mb-10">
      {/* Back Button */}
      <Button
        className="flex items-center text-black py-2 text-lg"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="text-sm" />
        Back
      </Button>

      {/* Header Section */}
      <div className="flex w-full mt-6 mb-6 items-center justify-between">
        <p className="text-sm bg-[#E7F8F3] border border-[#0DBA86] text-[#0DBA86] px-6 py-2 rounded-full">
          Status: {classroom?.status}
        </p>
        <div className="flex gap-2">
          <Button
            variant={"danger"}
            onClick={openDeleteDialog}
            className="flex items-center w-fit h-full gap-3 py-2"
          >
            Delete Classroom
          </Button>
        </div>
      </div>

      {/* Classroom Content */}
      {fetchingClassroom ? (
        <div className="border rounded-lg">
          <div className="bg-[#EFE6FD] p-8 rounded-lg overflow-hidden">
            <Skeleton className="h-6 w-1/4 mb-4" />
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-2/3 mb-4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-32 mt-4" />
          </div>
        </div>
      ) : (
        <div className="border rounded-lg">
          <div className="bg-[#EFE6FD] text-black p-4 lg:p-8 md:p-8 rounded-lg overflow-hidden">
            <h2 className="text-xl font-bold mt-2">
              {classroom?.classroom_name}
            </h2>
            <p className="text-sm">
              {classroom?.classroom_description
                ? classroom.classroom_description.length > 270
                  ? `${classroom.classroom_description.slice(0, 270)}...`
                  : classroom.classroom_description
                : ""}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center mt-4 justify-between gap-4 flex-wrap">
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button
                  onClick={() =>
                    navigate(`/dashboard/liveclass/${classroom?.classroom_id}`)
                  }
                  className="w-full sm:w-auto flex items-center justify-center border border-[#6200EE] text-[#6200EE] py-2 px-4 rounded-full text-sm"
                >
                  Go to Live Class
                  <ArrowRightIcon className="ml-2 w-3 h-3" />
                </button>

                <button
                  onClick={() =>
                    navigate(
                      `/dashboard/Studentforum/${classroom?.classroom_id}`
                    )
                  }
                  className="w-full sm:w-auto flex items-center justify-center border border-[#6200EE] text-[#6200EE] py-2 px-4 rounded-full text-sm"
                >
                  Group Chats
                  <ArrowRightIcon className="ml-2 w-3 h-3" />
                </button>

                <button
                  className="w-full sm:w-auto flex items-center justify-center border border-[#6200EE] text-[#6200EE] py-2 px-4 rounded-full text-sm"
                  onClick={() => handleCopy(classroom?.join_url || "")}
                >
                  <IoCopyOutline className="mr-1" />
                  Copy Class Link
                </button>

                <button
                  className="w-full sm:w-auto flex items-center justify-center bg-[#6200EE] text-white py-2 px-4 rounded-full text-sm"
                  onClick={() => handleCopy(classroom?.join_code || "")}
                >
                  <IoCopyOutline className="mr-1" />
                  Copy Class Code
                </button>

                {copied && <CheckIcon className="h-5 w-5 text-green-400" />}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center bg-white rounded-2xl p-4 mt-10">
            <div>
              <h1 className="text-xl font-semibold">Course Introduction</h1>
              <p className="text-sm text-gray-500">
                Manage and add extra details such as polls, quiz, videos and
                more
              </p>
            </div>
            <button className="bg-black rounded-full text-white px-5 py-2 flex gap-2 items-center">
              <FaEdit />
              Edit
            </button>
          </div>

          {/* Tabbed Section */}
          <div className="bg-white rounded-lg border p-4 md:p-6 mt-10">
            <div className="flex gap-8 border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-sm font-semibold ${
                    activeTab === tab
                      ? "text-[#6200EE] border-b-4 border-[#6200EE]"
                      : "text-black"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="mt-6">
              {activeTab === "Overview" && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Class Details</h2>
                  <div className="space-y-5">
                    <input
                      type="text"
                      placeholder="E.g Intro to web design"
                      className="w-full border rounded-full px-4 py-2 text-sm"
                    />
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-sm">
                        <input type="radio" name="pricing" />
                        Free Classroom
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="radio" name="pricing" defaultChecked />
                        Paid Classroom
                      </label>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <select className="border rounded-full px-3 py-2 text-sm">
                          <option>🇳🇬 NGN</option>
                        </select>
                        <input
                          type="number"
                          placeholder="0"
                          className="border rounded-full px-4 py-2 text-sm w-full"
                        />
                      </div>
                      <label className="flex items-center gap-2 text-sm mt-2">
                        <input type="checkbox" /> The service fee would be
                        deducted from the amount
                      </label>
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                      <select className="border rounded-full px-4 py-2 text-sm">
                        <option>Select Grade</option>
                      </select>
                      <select className="border rounded-full px-4 py-2 text-sm">
                        <option>Select Country</option>
                      </select>
                    </div>
                    <select className="border rounded-full px-4 py-2 text-sm">
                      <option>Select Curriculum Type</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === "Contents" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Outlines</h3>

                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between border rounded-lg p-3"
                      >
                        <input
                          type="text"
                          value="Learning Numbers and counting"
                          readOnly
                          className="border-none outline-none flex-1 text-sm"
                        />
                        <div className="flex gap-4">
                          <button className="text-[#000000] flex items-center gap-1 text-sm">
                            <FaEdit /> Edit Content
                          </button>
                          <button className="text-red-500 flex items-center gap-1 text-sm">
                            <Delete size={16} /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="text-[#6200EE] text-sm mt-4 font-medium">
                    + Add Outline
                  </button>
                </div>
              )}

              {activeTab === "Students" && (
                <div className="text-gray-500 text-sm">
                  {classroom?.number_of_students}
                </div>
              )}

              {activeTab === "Assignments" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <input
                      type="text"
                      placeholder="Search by classroom"
                      className="border rounded-full px-4 py-2 w-1/3 text-sm"
                    />
                    <Button className="border border-[#6200EE] text-[#6200EE] rounded-full px-4 py-2 text-sm">
                      + New Assignment
                    </Button>
                  </div>

                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="py-2">Classroom Name</th>
                        <th className="py-2">Assignment Description</th>
                        <th className="py-2">Grade</th>
                        <th className="py-2">Status</th>
                        <th className="py-2">Students Completed</th>
                        <th className="py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 text-[#6200EE]">Cyber Security</td>
                        <td>Security assessments</td>
                        <td>Grade 5</td>
                        <td>
                          <span className="text-green-500 bg-green-50 px-3 py-1 rounded-full text-xs">
                            active
                          </span>
                        </td>
                        <td>0</td>
                        <td className="flex gap-4">
                          <button className="text-[#6200EE] text-sm flex gap-2 items-center">
                            <PiEyeSlashLight /> View
                          </button>
                          <button className="text-red-500 text-sm flex gap-2 items-center">
                            <IoTrashOutline /> Delete
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-[#6200EE]">Cyber Security</td>
                        <td>Coding technique check</td>
                        <td>Pre-School</td>
                        <td>
                          <span className="text-green-500 bg-green-50 px-3 py-1 rounded-full text-xs">
                            active
                          </span>
                        </td>
                        <td>8</td>
                        <td className="flex gap-4">
                          <button className="text-[#6200EE] text-sm flex gap-2 items-center">
                            <PiEyeSlashLight /> View
                          </button>
                          <button className="text-red-500 text-sm flex gap-2 items-center">
                            <IoTrashOutline /> Delete
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <DeleteClassroomDialog
        ref={deleteDialogRef}
        classroomId={Number(id)}
        onSuccess={() => navigate("/dashboard/classrooms")}
      />
    </div>
  );
};

export default ClassroomDetail;
