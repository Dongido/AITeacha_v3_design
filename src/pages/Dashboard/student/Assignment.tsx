import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiSend } from "react-icons/fi";
import { Button } from "../../../components/ui/Button";
import { TextArea } from "../../../components/ui/TextArea";
import { useDispatch, useSelector } from "react-redux";
import { fetchAssignmentByIdThunk } from "../../../store/slices/studentAssignmentSlice";
import { RootState, AppDispatch } from "../../../store";
import { Skeleton } from "../../../components/ui/Skeleton";
import { submitAssignmentAnswer } from "../../../api/studentassignment";
import { submitAssignmentChatMessage } from "../../../api/studentassignment";

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
    <div className="flex p-4 space-x-8">
      <div className="w-2/3 h-[500px] p-4 border rounded-lg overflow-y-auto bg-gray-100 space-y-4">
        <div className="flex flex-col space-y-2 h-[370px] bg-white p-3 ax-h-[400px] overflow-y-auto">
          {chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "student" ? "justify-end" : "justify-start"
              } mb-2`}
            >
              <div
                className={`p-3 rounded-lg max-w-[60%] ${
                  msg.sender === "student"
                    ? "bg-primary text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                <p>{msg.message}</p>
              </div>
            </div>
          ))}

          {/* Show AI is typing message when waiting for AI response */}
          {loadingAI && (
            <div className="flex justify-start mb-2">
              <div className="p-3 rounded-lg max-w-[60%] bg-gray-200 text-black">
                <p>AI is typing...</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex">
          <input
            type="text"
            value={currentMessage}
            onChange={handleChatMessageChange}
            className="w-full p-2 border rounded-md"
            placeholder="Ask the AI a question..."
          />
          <Button onClick={handleChatMessageSubmit} className="ml-2">
            <FiSend />
          </Button>
        </div>
      </div>

      <div className="w-1/3 p-4 space-y-4 overflow-y-auto max-h-[500px]">
        <p className="text-gray-800 text-xl font-bold capitalize">
          {assignment.assignment_description}
        </p>

        {assignment.questions.map((question, index) => (
          <div key={index} className="space-y-4">
            <div>
              <p className="font-semibold">{question.assignment_question}</p>
              <TextArea
                id={`response-${index}`}
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

        <div className="flex ">
          <Button
            onClick={handleSubmit}
            variant={"gradient"}
            className="py-2 px-4 rounded-md"
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
  );
};

export default StudentAssignment;
