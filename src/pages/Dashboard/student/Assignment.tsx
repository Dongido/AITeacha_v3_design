import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiSend } from "react-icons/fi";
// import { Undo2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { TextArea } from "../../../components/ui/TextArea";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAssignmentByIdThunk,
  loadStudentAssignments,
} from "../../../store/slices/studentAssignmentSlice";
import { IoChevronBackOutline } from "react-icons/io5";
import { RootState, AppDispatch } from "../../../store";
import { Skeleton } from "../../../components/ui/Skeleton";
import { submitAssignmentAnswer } from "../../../api/studentassignment";
import { submitAssignmentChatMessage } from "../../../api/studentassignment";
import MarkdownRenderer from "../_components/MarkdownRenderer";
interface ChatMessage {
  sender: "student" | "AI";
  message: string;
}

interface Assignment {
  assignment_description: string;
  questions: string[];
}

const StudentAssignment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [responses, setResponses] = useState<{ [key: string]: string }>({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [loadingAI, setLoadingAI] = useState<boolean>(false); // AI loading state
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  const { assignment, loading, error } = useSelector(
    (state: RootState) => state.studentAssignments
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchAssignmentByIdThunk(id));
    }
  }, [id, dispatch]);

  const handleResponseChange = (
    questionId: string,
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    const isAllAnswered =
      Object.keys(responses).length === assignment?.questions.length;
    if (isAllAnswered) {
      const answers = assignment.questions.map((question, index) => ({
        assignment_question: question.assignment_question,
        assignment_answer: responses[index] || "",
      }));

      setLoadingSubmit(true);

      try {
        const classroomId = assignment?.classroom_id || 0;
        const response = await submitAssignmentAnswer(
          Number(id),
          classroomId,
          answers
        );
        if (response.status === "success") {
          setShowSuccessMessage(true);
          setResponses({});
          setTimeout(() => setShowSuccessMessage(false), 3000);
        }
        await dispatch(loadStudentAssignments());
        navigate("/student/assignments");
      } catch (error) {
        console.error(error);
        alert("Failed to submit assignment. Please try again.");
      } finally {
        setLoadingSubmit(false);
      }
    } else {
      alert("Please answer all the questions.");
    }
  };

  const handleUndo = (questionId: string) => {
    setResponses((prevResponses) => {
      const newResponses = { ...prevResponses };
      delete newResponses[questionId];
      return newResponses;
    });
  };

  const handleChatMessageSubmit = async () => {
    if (currentMessage.trim()) {
      setChatMessages([
        ...chatMessages,
        { sender: "student", message: currentMessage },
      ]);
      setCurrentMessage("");

      setLoadingAI(true); // Start loading AI response

      if (!assignment) {
        alert("Assignment not found.");
        setLoadingAI(false); // Stop loading if no assignment found
        return;
      }

      try {
        const response = await submitAssignmentChatMessage(
          assignment.assignment_description,
          assignment.grade,
          assignment.classroom_id || 0,
          Number(id),
          currentMessage,
          "assignment",
          assignment.questions.map((q) => q.assignment_question)
        );

        setChatMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: "AI",
            message: response || "Sorry, I did not understand.",
          },
        ]);
      } catch (error) {
        setChatMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: "AI",
            message: "Failed to fetch AI response. Try again later.",
          },
        ]);
      } finally {
        setLoadingAI(false); // Stop loading when done
      }
    }
  };

  const handleChatMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMessage(e.target.value);
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-32 w-full mt-4" />
        <Skeleton className="h-10 w-24 mt-4" />
      </div>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!assignment) {
    return <p>No assignment found.</p>;
  }

  return (
    <div className="p-[30px]">
      <button
        className="flex items-center  rounded-md my-3 text-black w-fit h-full mr-2 gap-3 py-2"
        onClick={() => navigate(-1)}
      >
        <IoChevronBackOutline size={"1.1rem"} color="black" />
        Back
      </button>

      <div className="flex flex-col  lg:flex-row p-4 space-y-4 lg:space-x-8 lg:space-y-0">
        <div className="w-full bg-gradient-to-r from-[#6200EE1A] from-[10%] to-[#F133E11A] to-[90%] lg:w-2/3 h-[550px] p-4 border rounded-lg overflow-y-auto  space-y-4">
          <h2 className="text-xl font-bold">AI Assistant</h2>
          <div className="flex flex-col space-y-2 h-[420px] p-3 ax-h-[450px] overflow-y-auto">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "student" ? "justify-end" : "justify-start"
                } mb-2`}
              >
                <MarkdownRenderer
                  content={msg.message}
                  className={`p-3 text-sm ${
                    msg.sender === "student"
                      ? "bg-primary max-w-xs text-white rounded-tl-lg"
                      : "bg-gray-200 max-w-xl text-black rounded-tr-lg"
                  }`}
                  style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}
                />
              </div>
            ))}

            {loadingAI && (
              <div className="flex justify-start mb-2">
                <div className="p-3 rounded-lg max-w-[60%] bg-gray-200 text-black">
                  <p>AI is typing...</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 relative w-full ">
            <input
              type="text"
              value={currentMessage}
              onChange={handleChatMessageChange}
              className="w-full  p-3 pr-12 border rounded-full bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Ask the AI a question..."
            />
            <button
              onClick={handleChatMessageSubmit}
              // variant="gray"
              className="absolute bg-[#6200EE] right-2 top-1/2 -translate-y-1/2 rounded-full p-2 h-10 w-10 flex items-center justify-center"
            >
              <FiSend className="text-white" />
            </button>
          </div>

        </div>

        <div className="w-full bg-white lg:w-1/3 p-4 space-y-4 overflow-y-auto max-h-[550px]">
          <p className="text-gray-800 text-xl font-bold capitalize">
            Questions
          </p>

          {assignment.questions.map((question, index) => (
            <div key={index} className="space-y-4">
              <div>
                <p className="font-semibold">{question.assignment_question}</p>
                <TextArea
                  id={`response-${index}`}
                  required
                  placeholder="Write your answer here..."
                  value={responses[index] || ""}
                  onChange={(e) => handleResponseChange(index.toString(), e)}
                  rows={3}
                />
              </div>
            </div>
          ))}

          {showSuccessMessage && (
            <p className="text-green-600 mt-2">
              Responses submitted successfully!
            </p>
          )}

          <div className="flex justify-center">
            <Button
              onClick={handleSubmit}
              variant={"gradient"}
              className="py-2 px-4 rounded-md w-full"
              disabled={loadingSubmit}
            >
              {loadingSubmit ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                  <span>Submitting...</span>
                </div>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAssignment;
