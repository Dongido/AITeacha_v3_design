import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiSend } from "react-icons/fi";
import { Button } from "../../../components/ui/Button";
import { TextArea } from "../../../components/ui/TextArea";
import { Undo2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClassroomByIdThunk } from "../../../store/slices/classroomSlice";
import { RootState, AppDispatch } from "../../../store";
import { motion } from "framer-motion";
import {
  sendClassroomMessage,
  sendClassroomToolMessage,
} from "../../../api/studentclassroom";
import { marked } from "marked";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import greyImg from "../../../assets/img/greyimg.avif";

const Classroom = () => {
  const [inputText, setInputText] = useState("");
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [messages, setMessages] = useState<{
    [key: string]: { text: string; fromUser: boolean; isLoading?: boolean }[];
  }>({ main: [] });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const classroom = useSelector(
    (state: RootState) => state.classrooms.selectedClassroom
  );
  const tools = classroom?.tools || [];
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchClassroomByIdThunk(Number(id)));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedTool]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const currentKey = selectedTool || "main";

    setMessages((prev) => ({
      ...prev,
      [currentKey]: [
        ...(prev[currentKey] || []),
        { text: inputText, fromUser: true, isLoading: false },
      ],
    }));

    setInputText("");

    setMessages((prev) => ({
      ...prev,
      [currentKey]: [
        ...(prev[currentKey] || []),
        {
          text: `${classroom?.author} AI Assistant typing...`,
          fromUser: false,
          isLoading: true,
        },
      ],
    }));

    const markdownToPlainText = async (markdown: string): Promise<string> => {
      const html = await marked(markdown);
      const decodedHtml = new DOMParser().parseFromString(html, "text/html")
        .body.innerText;
      return decodedHtml.replace(/<[^>]*>?/gm, "");
    };

    const messageData = selectedTool
      ? {
          classroom_id: classroom?.classroom_id || 0,
          classname: classroom?.classroom_name || "",
          description: classroom?.classroom_description || "",
          scope_restriction: classroom?.scope_restriction || true,
          grade: classroom?.grade || "",
          student_message: inputText,
          content_from: "classroom_tools",
          file_content:
            classroom?.classroomresources?.map(
              (resource) => resource.file_content
            ) || [],
          tool_name: selectedTool || "",
          tool_id:
            tools.find((tool) => tool.tool_name === selectedTool)?.tool_id || 0,
          tool_description:
            tools.find((tool) => tool.tool_name === selectedTool)
              ?.tool_description || "",
        }
      : {
          classroom_id: classroom?.classroom_id || 0,
          classname: classroom?.classroom_name || "",
          scope_restriction: classroom?.scope_restriction || true,
          description: classroom?.classroom_description || "",
          grade: classroom?.grade || "",
          file_content: classroom?.classroomresources
            ? classroom.classroomresources
                .map((resource) => resource.file_content)
                .join("\n\n")
            : "",
          student_message: inputText,
          content_from: "classroom",
        };

    try {
      console.log(messageData);
      const response = selectedTool
        ? await sendClassroomToolMessage(messageData)
        : await sendClassroomMessage(messageData);

      const plainTextResponse = await markdownToPlainText(response.data);

      setMessages((prev) => ({
        ...prev,
        [currentKey]: [
          ...(prev[currentKey] || []).filter((msg) => !msg.isLoading),
          { text: plainTextResponse, fromUser: false },
        ],
      }));
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => ({
        ...prev,
        [currentKey]: [
          ...(prev[currentKey] || []).filter((msg) => !msg.isLoading),
          {
            text: "An error occurred. Please try again later.",
            fromUser: false,
          },
        ],
      }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentMessages = messages[selectedTool || "main"] || [];
  const welcomeMessage = selectedTool
    ? `Hi👋, welcome to <strong>${selectedTool}</strong>. Start your conversation here!`
    : `Hi👋, welcome to class "<strong>${
        classroom?.classroom_name || "the classroom"
      }</strong>." Start your conversation here!`;

  return (
    <div className="mt-6">
      <div className="flex items-center mb-4 justify-between flex-col sm:flex-row">
        <Button
          className="flex items-center bg-white rounded-md text-black w-fit h-full gap-3 py-2"
          onClick={() => navigate(-1)}
        >
          <Undo2 size={"1.1rem"} color="black" />
          Back
        </Button>

        <div className="mx-auto text-center mt-4 sm:mt-0">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            {classroom?.classroom_name}
          </h2>
          <p className="text-sm sm:text-md font-medium text-gray-900">
            {classroom?.classroom_description}
          </p>
          {selectedTool && (
            <p className="text-primary text-sm font-bold">
              In use: {selectedTool}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col h-[calc(100vh-260px)] lg:flex-row">
        <div className="flex-grow overflow-y-auto bg-gray-50 border border-gray-300 rounded-lg shadow-inner space-y-2 mb-4 p-4">
          {currentMessages.length === 0 ? (
            <div
              className="text-md sm:text-md text-gray-800 italic"
              dangerouslySetInnerHTML={{ __html: welcomeMessage }}
            />
          ) : (
            currentMessages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`flex items-start space-x-4 mb-2 ${
                  message.fromUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs p-3 text-sm ${
                    message.fromUser
                      ? "bg-primary text-white rounded-tl-lg"
                      : "bg-gray-200 text-black rounded-tr-lg"
                  }`}
                  style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}
                >
                  {message.text}
                </div>
              </motion.div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="lg:ml-4 mt-4 lg:mt-0 lg:w-1/4 flex-shrink-0 hidden lg:block">
          <div className="bg-gray-100 rounded-lg border border-gray-300 p-4 lg:sticky lg:top-16">
            <h3 className="text-lg font-semibold mb-2">Class Tools</h3>
            <ul className="space-y-2">
              <li
                key="main"
                className={`border cursor-pointer px-4 py-3 rounded-lg ${
                  selectedTool === null ? "bg-primary text-white" : ""
                }`}
                onClick={() => setSelectedTool(null)}
              >
                Main Classroom
              </li>
              {tools.map((tool) => (
                <li
                  key={tool.tool_id}
                  className={`capitalize border cursor-pointer px-4 py-3 rounded-lg ${
                    selectedTool === tool.tool_name
                      ? "bg-primary text-white"
                      : ""
                  }`}
                  onClick={() => setSelectedTool(tool.tool_name)}
                >
                  {tool.tool_name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white  border-t lg:flex lg:w-[calc(100%-5rem)] lg:ml-[5rem] flex-col lg:flex-row">
        <div className="flex justify-between items-center gap-24 w-full">
          <div
            className="w-64 h-20 bg-cover bg-center relative hidden lg:block"
            style={{ backgroundImage: `url(${greyImg})` }}
          >
            <span className="absolute inset-0 flex items-center text-sm italic justify-center text-white text-lg font-bold bg-black bg-opacity-20">
              Powered By <span className="text-lg ml-1"> Zyra</span>
            </span>
          </div>

          <div className="relative p-2 lg:-ml-24 flex items-center w-full">
            <TextArea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-grow pr-16 px-3 py-2 border text-md rounded-lg"
            />
            <button
              onClick={handleSend}
              aria-label="Send Message"
              disabled={inputText.trim().length === 0}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-primary text-white rounded-full"
            >
              <FiSend className="w-5 h-5" />
            </button>
          </div>
        </div>

        <Button
          onClick={() => setIsDrawerOpen(true)}
          variant={"gradient"}
          className="flex items-center bg-white w-full rounded-md text-black lg:hidden mt-2 mx-auto"
        >
          View Tools
        </Button>
      </div>

      <Drawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        direction="bottom"
        className="lg:hidden"
      >
        <div className="p-4">
          <h3 className="text-xl font-semibold">Class Tools</h3>
          <ul className="space-y-4 mt-4">
            <li
              className={`cursor-pointer px-4 py-2 rounded-lg ${
                selectedTool === null ? "bg-primary text-white" : ""
              }`}
              onClick={() => setSelectedTool(null)}
            >
              Main Classroom
            </li>
            {tools.map((tool) => (
              <li
                key={tool.tool_id}
                className={`capitalize cursor-pointer px-4 py-2 rounded-lg ${
                  selectedTool === tool.tool_name ? "bg-primary text-white" : ""
                }`}
                onClick={() => setSelectedTool(tool.tool_name)}
              >
                {tool.tool_name}
              </li>
            ))}
          </ul>
        </div>
      </Drawer>
    </div>
  );
};

export default Classroom;
