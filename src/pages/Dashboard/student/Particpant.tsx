import React from "react";
import { FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";
import { BsChatDotsFill } from "react-icons/bs";

type Participant = {
  id: number;
  name: string;
  role: "teacher" | "student";
  image?: string;
};

const participants: Participant[] = [
  {
    id: 1,
    name: "Mr. John Doe",
    role: "teacher",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Julieth Kehinde",
    role: "student",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    name: "Samuel Ade",
    role: "student",
    image: "https://randomuser.me/api/portraits/men/48.jpg",
  },
  {
    id: 4,
    name: "Mary Tomiwa",
    role: "student",
    image: "https://randomuser.me/api/portraits/women/33.jpg",
  },
  // Add more if needed
];

const Participants = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Chat Sidebar */}
      <aside className="w-full max-w-sm md:w-80 bg-white shadow-md border-r border-gray-200 p-4">
        <h2 className="text-xl font-bold text-purple-700 mb-4 px-2">
          Class Participants
        </h2>

        <div className="space-y-2 overflow-y-auto h-[calc(100vh-100px)] pr-1">
          {participants.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-purple-50 cursor-pointer transition"
            >
              <div className="flex items-center gap-3">
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{user.name}</span>
                  <span
                    className={`text-xs font-medium ${
                      user.role === "teacher"
                        ? "text-red-500"
                        : "text-gray-400"
                    } flex items-center gap-1`}
                  >
                    {user.role === "teacher" ? (
                      <>
                        <FaChalkboardTeacher /> Teacher
                      </>
                    ) : (
                      <>
                        <FaUserGraduate /> Student
                      </>
                    )}
                  </span>
                </div>
              </div>

              <button className="text-purple-600 hover:text-purple-800 transition">
                <BsChatDotsFill size={18} />
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* Optional chat window placeholder */}
      <main className="hidden md:flex flex-1 items-center justify-center text-gray-500">
        Select a participant to start chat
      </main>
    </div>
  );
};

export default Participants;
