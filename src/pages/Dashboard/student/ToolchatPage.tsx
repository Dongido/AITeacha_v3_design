// import React, { useEffect, useRef, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { FiSend, FiArrowLeft, FiCopy, FiVolume2 } from "react-icons/fi";
// import { motion } from "framer-motion";
// import { Button } from "../../../components/ui/Button";
// import MarkdownRenderer from "../_components/MarkdownRenderer";
// import { sendClassroomToolMessage } from "../../../api/classrooms";
// import { Sidenav } from "../classrooms/components/Sidenav";
// import StudentNavbar from "../../../components/layout/Student-Navbar";

// export default function ToolChatPage() {
//   const { classId, toolName } = useParams();
//   const navigate = useNavigate();

//   const [inputText, setInputText] = useState("");
//   const [messages, setMessages] = useState<any[]>([]);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   // ✅ Scroll to bottom on new message
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // ✅ Send message to backend
//   const handleSend = async () => {
//     if (!inputText.trim()) return;

//     setMessages((prev) => [...prev, { text: inputText, fromUser: true }]);
//     setInputText("");
//     setMessages((prev) => [
//       ...prev,
//       { text: `${toolName} is thinking...`, fromUser: false, isLoading: true },
//     ]);

//     try {
//       const response = await sendClassroomToolMessage({
//         classroom_id: Number(classId),
//         tool_name: toolName,
//         student_message: inputText,
//         content_from: "classroom_tools",
//       });

//       setMessages((prev) =>
//         prev.map((msg) =>
//           msg.isLoading
//             ? {
//                 ...msg,
//                 text: response?.data || "No response received.",
//                 isLoading: false,
//               }
//             : msg
//         )
//       );
//     } catch (err) {
//       console.error("AI error:", err);
//       setMessages((prev) =>
//         prev.map((msg) =>
//           msg.isLoading
//             ? {
//                 ...msg,
//                 text: "⚠️ Error: could not get a response.",
//                 isLoading: false,
//               }
//             : msg
//         )
//       );
//     }
//   };

//   // ✅ Keyboard shortcut: Enter to send
//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   // ✅ Text-to-speech
//   const handleTextToSpeech = (text: string) => {
//     if (isSpeaking) {
//       window.speechSynthesis.cancel();
//       setIsSpeaking(false);
//     } else {
//       const utterance = new SpeechSynthesisUtterance(text);
//       window.speechSynthesis.speak(utterance);
//       setIsSpeaking(true);
//       utterance.onend = () => setIsSpeaking(false);
//     }
//   };

//   // ✅ Copy text
//   const handleCopy = (text: string) => {
//     navigator.clipboard.writeText(text);
//   };

//   return (
//     <div className="flex min-h-screen bg-[#F8F9FC]">
//       {/* ✅ Left Sidenav */}
//       <Sidenav classroomId={classId} outlines={[]} tools={[]} />

//       {/* ✅ Right Chat Area */}
//       <div className="flex flex-col flex-1">
//         <StudentNavbar />

//         {/* Header */}
//         <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
//           <button
//             onClick={() => navigate(`/class/class-details/${classId}`)}
//             className="flex items-center gap-2 text-gray-600 hover:text-[#6200EE]"
//           >
//             <FiArrowLeft /> Back to Classroom
//           </button>
//           <h1 className="text-lg font-semibold text-[#6200EE] capitalize">
//             {toolName}
//           </h1>
//           <div />
//         </div>

//         {/* Chat Messages */}
//         <div className="flex-1 overflow-y-auto p-6 space-y-4">
//           {messages.map((msg, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.25 }}
//               className={`flex ${msg.fromUser ? "justify-end" : "justify-start"}`}
//             >
//               <div
//                 className={`p-3 rounded-2xl max-w-[80%] text-sm ${
//                   msg.fromUser
//                     ? "bg-[#6200EE] text-white rounded-tr-none"
//                     : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
//                 }`}
//               >
//                 {!msg.fromUser && (
//                   <div className="flex justify-end gap-2 mb-1 text-xs text-gray-500">
//                     <button onClick={() => handleCopy(msg.text)}>Copy</button>
//                     <button onClick={() => handleTextToSpeech(msg.text)}>
//                       {isSpeaking ? "Stop" : "Voice"}
//                     </button>
//                   </div>
//                 )}
//                 <MarkdownRenderer content={msg.text} />
//               </div>
//             </motion.div>
//           ))}
//           <div ref={messagesEndRef} />
//         </div>

//         {/* Input Box */}
//         <div className="border-t bg-white p-4 flex items-center gap-3">
//           <input
//             value={inputText}
//             onChange={(e) => setInputText(e.target.value)}
//             onKeyDown={handleKeyDown}
//             placeholder={`Ask ${toolName} something...`}
//             className="flex-grow border rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#6200EE] outline-none text-sm bg-gray-50"
//           />
//           <Button
//             onClick={handleSend}
//             disabled={!inputText.trim()}
//             className="bg-[#6200EE] text-white rounded-lg px-4 py-2 hover:bg-[#5300d6]"
//           >
//             <FiSend className="w-5 h-5" />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
