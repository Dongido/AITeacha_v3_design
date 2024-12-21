import React, { useState, useEffect } from "react";
import {
  fetchStudentAssignmentAnalytics,
  submitAssignmentFeedback,
  updateAssignmentFeedback,
} from "../../../api/assignment";
import { Button } from "../../../components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import { Undo2 } from "lucide-react";
import { Skeleton } from "../../../components/ui/Skeleton";
import ReactMarkdown from "react-markdown";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../../../components/ui/Dialogue";
import { Editor, EditorState, RichUtils, ContentState } from "draft-js";
import "draft-js/dist/Draft.css";

const StudentAnalytics = () => {
  const navigate = useNavigate();
  const { id: assignmentId, studentId } = useParams<{
    id: string;
    studentId: string;
  }>();

  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [teachersFeedback, setTeachersFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingFeedback, setLoadingFeedback] = useState<boolean>(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditingFeedback, setIsEditingFeedback] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const analytics = await fetchStudentAssignmentAnalytics(
          Number(assignmentId),
          Number(studentId)
        );
        setAnalyticsData(analytics.data.response);
        setTeachersFeedback(analytics.data.feedback);
      } catch (error: any) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (assignmentId && studentId) loadData();
  }, [assignmentId, studentId]);

  const handleSubmitFeedback = async () => {
    const feedback = editorState.getCurrentContent().getPlainText();
    setLoadingFeedback(true);
    try {
      await submitAssignmentFeedback(
        Number(studentId),
        Number(assignmentId),
        feedback,
        analyticsData
      );
      await fetchStudentAssignmentAnalytics(
        Number(assignmentId),
        Number(studentId)
      );
      setOpenDialog(false);
      setTeachersFeedback(feedback);
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLoadingFeedback(false);
    }
  };

  const handleEditFeedback = async () => {
    const feedback = editorState.getCurrentContent().getPlainText();
    setLoadingFeedback(true);
    try {
      await updateAssignmentFeedback(
        Number(studentId),
        Number(assignmentId),
        feedback
      );
      setOpenDialog(false);
      setTeachersFeedback(feedback);
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLoadingFeedback(false);
    }
  };

  const handleToggle = (style: string) => {
    const newState = RichUtils.toggleInlineStyle(editorState, style);
    setEditorState(newState);
  };

  const openFeedbackDialog = () => {
    if (teachersFeedback) {
      const contentState = ContentState.createFromText(teachersFeedback);
      setEditorState(EditorState.createWithContent(contentState));
      setIsEditingFeedback(true);
    } else {
      setEditorState(EditorState.createEmpty());
      setIsEditingFeedback(false);
    }
    setOpenDialog(true);
  };

  return (
    <div className="mt-12">
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
            Student Analytics
          </h2>
        </div>
      </div>
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-64 w-full mx-auto rounded-lg" />
        </div>
      ) : analyticsData ? (
        <div>
          <div className="mt-4">
            <ReactMarkdown className="w-full p-4 border border-gray-300 bg-white rounded-md resize-none markdown overflow-auto max-h-[600px]">
              {analyticsData}
            </ReactMarkdown>
          </div>

          <div className="mt-4">
            <div className="mb-4 p-4 border rounded-md bg-gray-50">
              <h3 className="font-semibold text-gray-900">
                Teacher's Feedback
              </h3>
              <p>{teachersFeedback || "No feedback provided yet."}</p>
            </div>

            <Button
              className="rounded-md"
              variant="gradient"
              onClick={openFeedbackDialog}
            >
              {teachersFeedback ? "Edit Feedback" : "Give Feedback"}
            </Button>
          </div>
        </div>
      ) : (
        <p>No analytics available.</p>
      )}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditingFeedback ? "Edit Feedback" : "Provide Feedback"}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => handleToggle("BOLD")}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                <strong>B</strong>
              </button>
              <button
                onClick={() => handleToggle("ITALIC")}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                <em>I</em>
              </button>
              <button
                onClick={() => handleToggle("UNDERLINE")}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                <u>U</u>
              </button>
              <button
                onClick={() => handleToggle("STRIKETHROUGH")}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                <del>S</del>
              </button>

              <button
                onClick={() => handleToggle("CODE")}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                <code>C</code>
              </button>
              <button
                onClick={() => handleToggle("BLOCKQUOTE")}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                <q>“</q>
              </button>
              <button
                onClick={() => handleToggle("unordered-list-item")}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                <ul>
                  <li>•</li>
                </ul>
              </button>
              <button
                onClick={() => handleToggle("ordered-list-item")}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                <ol>
                  <li>1.</li>
                </ol>
              </button>
            </div>

            <div className="border border-gray-300 rounded-md p-4 max-w-full h-400px max-h-[400px] overflow-auto bg-gray-50 shadow-xs">
              <Editor
                editorState={editorState}
                onChange={setEditorState}
                placeholder="Write your feedback here..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="gradient"
              className="rounded-md"
              onClick={
                isEditingFeedback ? handleEditFeedback : handleSubmitFeedback
              }
              disabled={loadingFeedback}
            >
              {loadingFeedback
                ? "Submitting..."
                : isEditingFeedback
                ? "Update Feedback"
                : "Submit Feedback"}
            </Button>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentAnalytics;
