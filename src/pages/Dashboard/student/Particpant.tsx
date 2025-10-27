// import React, { useEffect, useState } from "react";
// import { FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";
// import { BsChatDotsFill } from "react-icons/bs";
// import { RootState } from "../../../store";
// import { useAppDispatch, useAppSelector } from "../../../store/hooks";
// import {
//   getParticipants,
//   resetParticipant,
// } from "../../../store/slices/staffchats";
// import { useParams } from "react-router-dom";
// import SideChatPopup from "../forum/SideChatPopup";

// const Participants = () => {
//   const { id } = useParams<{ id: string }>();
//   const dispatch = useAppDispatch();
//   const { participant, loading } = useAppSelector(
//     (state: RootState) => state.staffChats
//   );

//   const [showSideChat, setShowSideChat] = useState(false);
//   const [studentId, setStudentId] = useState<string | null>(null);
//   const [senderId, setSenderId] = useState<number | null>(null);

//   useEffect(() => {
//     if (id) {
//       const classroomId = Number(id);
//       dispatch(getParticipants(classroomId));
//     }
//   }, [id, dispatch]);

//   useEffect(() => {
//     const userDetailsFromStorage = localStorage.getItem("ai-teacha-user");
//     if (userDetailsFromStorage) {
//       const parsedDetails = JSON.parse(userDetailsFromStorage);
//       setSenderId(parsedDetails.id);
//     }
//     dispatch(resetParticipant());
//   }, [dispatch]);

//   const mergedParticipants = participant.reduce((acc: any[], current: any) => {
//     const existing = acc.find((item) => item.teacher_id === current.teacher_id);
//     if (existing) {
//       existing.students = [...existing.students, ...current.students];
//     } else {
//       acc.push({ ...current });
//     }
//     return acc;
//   }, []);

//   return (
//     <div
//       className={
//         showSideChat
//           ? "min-h-screen bg-white flex"
//           : "min-h-screen bg-gray-100 flex"
//       }
//     >
//       {/* Sidebar */}
//       <aside className="h-full w-full max-w-[320px] bg-white shadow-md border-r border-gray-200 p-4 overflow-y-auto">
//         {/* <h2 className="text-xl font-bold text-purple-700 mb-4 px-2">
//           Class Participants
//         </h2> */}

//         <div className="space-y-2 overflow-y-auto h-[calc(100vh-100px)] pr-1">
//           {loading ? (
//             <div className="flex flex-col justify-center items-center h-full gap-2 text-purple-600 font-semibold">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
//               <span>Loading participants...</span>
//             </div>
//           ) : (
//             mergedParticipants.map((group: any, groupIndex: number) => (
//               <React.Fragment key={groupIndex}>
//                 {/* Teacher */}
//                 {group.teacher_id !== senderId && (
//                   <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white rounded-2xl shadow-bg">
//                     <button
//                       className="text-[#6200EE] transition flex justify-between"
//                       onClick={() => {
//                         setShowSideChat(true);
//                         setStudentId(group.teacher_id.toString());
//                       }}
//                     >
//                       <div className="flex items-center gap-3">
//                         <img
//                           src={
//                             group.imageurl
//                               ? group.imageurl.startsWith("http")
//                                 ? group.imageurl
//                                 : `https://${group.imageurl}`
//                               : "https://via.placeholder.com/40x40.png?text=T"
//                           }
//                           alt={group.teacher_name}
//                           className="w-10 h-10 rounded-full object-cover border"
//                         />
//                         <div className="flex flex-col">
//                           <span className="font-medium text-sm">
//                             {group.teacher_name}
//                           </span>
//                           <span className="text-xs font-medium text-red-500 flex items-center gap-1">
//                             <FaChalkboardTeacher /> Teacher
//                           </span>
//                         </div>
//                       </div>

//                       <div>
//                         <BsChatDotsFill className="text-[#6200EE]" />
//                       </div>
//                     </button>
//                   </div>
//                 )}

//                 {/* Students */}
//                 {group.students.map((student: any) => {
//                   if (student.student_id === senderId) return null;

//                   return (
//                     <div
//                       key={student.student_id}
//                       className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-purple-50 cursor-pointer transition"
//                     >
//                       <div className="flex items-center gap-3">
//                         <img
//                           src={
//                             student.profile_image
//                               ? student.profile_image.startsWith("http")
//                                 ? student.profile_image
//                                 : `https://${student.profile_image}`
//                               : "https://via.placeholder.com/40x40.png?text=S"
//                           }
//                           alt={`${student.firstname} ${student.lastname}`}
//                           className="w-10 h-10 rounded-full object-cover border"
//                         />
//                         <div className="flex flex-col">
//                           <span className="font-medium text-sm">
//                             {student.firstname} {student.lastname}
//                           </span>
//                           <span className="text-xs font-medium text-gray-400 flex items-center gap-1">
//                             <FaUserGraduate /> Student
//                           </span>
//                         </div>
//                       </div>
//                       <button
//                         onClick={() => {
//                           setShowSideChat(true);
//                           setStudentId(student.student_id.toString());
//                         }}
//                         className="text-purple-600 hover:text-purple-800 transition"
//                       >
//                         <BsChatDotsFill size={18} />
//                       </button>
//                     </div>
//                   );
//                 })}
//               </React.Fragment>
//             ))
//           )}
//         </div>
//       </aside>

//       {/* Middle Placeholder */}
//       {!showSideChat && (
//         <main className="hidden md:flex flex-1 items-center justify-center text-gray-500">
//           Select a participant to start chat
//         </main>
//       )}

//       {/* Side Chat */}
//       {showSideChat && studentId !== null && (
//         <SideChatPopup
//           isOpen={showSideChat}
//           onClose={() => setShowSideChat(false)}
//           id={studentId}
//         />
//       )}
//     </div>
//   );
// };

// export default Participants;

import React, { useEffect, useState } from "react";
import { RootState } from "../../../store";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  getParticipants,
  resetParticipant,
} from "../../../store/slices/staffchats";
import { useParams } from "react-router-dom";
import SideChatPopup from "../forum/SideChatPopup";
import { BiMessageRoundedDetail } from "react-icons/bi";

const Participants = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { participant, loading } = useAppSelector(
    (state: RootState) => state.staffChats
  );

  const [showSideChat, setShowSideChat] = useState(false);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [senderId, setSenderId] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      const classroomId = Number(id);
      dispatch(getParticipants(classroomId));
    }
  }, [id, dispatch]);

  useEffect(() => {
    const userDetailsFromStorage = localStorage.getItem("ai-teacha-user");
    if (userDetailsFromStorage) {
      const parsedDetails = JSON.parse(userDetailsFromStorage);
      setSenderId(parsedDetails.id);
    }
    dispatch(resetParticipant());
  }, [dispatch]);

  const mergedParticipants = participant.reduce((acc: any[], current: any) => {
    const existing = acc.find((item) => item.teacher_id === current.teacher_id);
    if (existing) {
      existing.students = [...existing.students, ...current.students];
    } else {
      acc.push({ ...current });
    }
    return acc;
  }, []);

  return (
    <div className="px-4 py-10 flex flex-col items-center">
      {loading ? (
        <div className="flex flex-col justify-center items-center h-full gap-2 text-[#6200EE] font-semibold">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6200EE]"></div>
          <span>Loading participants...</span>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-4">
          {mergedParticipants.map((group: any, index: number) => (
            <React.Fragment key={index}>
              {/* Teacher */}
              {group.teacher_id !== senderId && (
                <div
                  onClick={() => {
                    setShowSideChat(true);
                    setStudentId(group.teacher_id.toString());
                  }}
                  className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-200 cursor-pointer flex items-center justify-between px-6 py-4"
                >
                  <div className="flex gap-3 pt-6">
                    <img
                      src={
                        group.imageurl
                          ? group.imageurl.startsWith("http")
                            ? group.imageurl
                            : `https://${group.imageurl}`
                          : "https://via.placeholder.com/40x40.png?text=T"
                      }
                      alt={group.teacher_name}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                    <div>
                      <p className="font-medium text-gray-900 capitalize">
                        {group.teacher_name}
                      </p>
                      <p className="text-sm text-black flex gap-1 font-semibold -mt-4">
                        Joined:{" "}
                        <p className="text-gray-500 text-sm">
                          {group.joined_date || "03 Oct, 2024"}
                        </p>
                      </p>
                    </div>
                  </div>
                  <span className="text-[#6200EE] text-xl">
                    <BiMessageRoundedDetail />
                  </span>
                </div>
              )}

              {/* Students */}
              {group.students.map((student: any) => {
                if (student.student_id === senderId) return null;
                return (
                  <div
                    key={student.student_id}
                    onClick={() => {
                      setShowSideChat(true);
                      setStudentId(student.student_id.toString());
                    }}
                    className="w-full bg-white rounded-2xl border border-[#6200EE] shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-200 cursor-pointer flex items-center justify-between px-6 py-4"
                  >
                    <div className="flex pt-6 gap-3">
                      <img
                        src={
                          student.profile_image
                            ? student.profile_image.startsWith("http")
                              ? student.profile_image
                              : `https://${student.profile_image}`
                            : "https://via.placeholder.com/40x40.png?text=S"
                        }
                        alt={`${student.firstname} ${student.lastname}`}
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {student.firstname} {student.lastname}
                        </p>
                        <p className="text-sm text-black flex gap-1 font-semibold -mt-4">
                          Joined:{" "}
                          <p className="text-gray-500 text-sm">
                            {student.joined_date || "03 Oct, 2024"}
                          </p>
                        </p>
                      </div>
                    </div>
                    <span className="text-[#6200EE] text-xl">
                      <BiMessageRoundedDetail />
                    </span>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Footer */}
      <footer className="mt-10 text-center text-sm text-gray-600">
        © 2025 <span className="text-[#6200EE] font-medium">AiTeacha</span>. All
        Rights Reserved.
      </footer>

      {/* Chat Popup */}
      {showSideChat && studentId !== null && (
        <SideChatPopup
          isOpen={showSideChat}
          onClose={() => setShowSideChat(false)}
          id={studentId}
        />
      )}
    </div>
  );
};

export default Participants;
