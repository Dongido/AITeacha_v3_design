import React, { useEffect, useState } from "react";
import { FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";
import { BsChatDotsFill } from "react-icons/bs";
import { RootState } from "../../../store";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { getParticipants } from "../../../store/slices/staffchats";
import { useParams } from "react-router-dom";
import SideChatPopup from "../forum/SideChatPopup";

const Participants = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { participant } = useAppSelector((state: RootState) => state.staffChats);

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
      setSenderId(parsedDetails.id); // Assuming parsedDetails.id is numeric
    }
  }, []);

  // ✅ Merge participants by teacher_id
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
    <div className={showSideChat ? "min-h-screen bg-white flex" : "min-h-screen bg-gray-100 flex"}>
      {/* Sidebar */}
      <aside className="w-full max-w-sm md:w-80 bg-white shadow-md border-r border-gray-200 p-4">
        <h2 className="text-xl font-bold text-purple-700 mb-4 px-2">
          Class Participants
        </h2>

        <div className="space-y-2 overflow-y-auto h-[calc(100vh-100px)] pr-1">
          {mergedParticipants.map((group: any, groupIndex: number) => (
            <React.Fragment key={groupIndex}>
              {/* Teacher */}
              {group.teacher_id !== senderId && (
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-purple-50">
                  <div className="flex items-center gap-3">
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
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{group.teacher_name}</span>
                      <span className="text-xs font-medium text-red-500 flex items-center gap-1">
                        <FaChalkboardTeacher /> Teacher
                      </span>
                    </div>
                  </div>
                  <button
                    className="text-purple-600 hover:text-purple-800 transition"
                    onClick={() => {
                      setShowSideChat(true);
                      setStudentId(group.teacher_id.toString());
                    }}
                  >
                    <BsChatDotsFill size={18} />
                  </button>
                </div>
              )}

              {/* Students */}
              {group.students.map((student: any) => {
                if (student.student_id === senderId) return null; // ❌ Don't show if sender

                return (
                  <div
                    key={student.student_id}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-purple-50 cursor-pointer transition"
                  >
                    <div className="flex items-center gap-3">
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
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">
                          {student.firstname} {student.lastname}
                        </span>
                        <span className="text-xs font-medium text-gray-400 flex items-center gap-1">
                          <FaUserGraduate /> Student
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setShowSideChat(true);
                        setStudentId(student.student_id.toString());
                      }}
                      className="text-purple-600 hover:text-purple-800 transition"
                    >
                      <BsChatDotsFill size={18} />
                    </button>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </aside>

      {/* Middle Placeholder */}
      {!showSideChat && (
        <main className="hidden md:flex flex-1 items-center justify-center text-gray-500">
          Select a participant to start chat
        </main>
      )}

      {/* Side Chat */}
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
