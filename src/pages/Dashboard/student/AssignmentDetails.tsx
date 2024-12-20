import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSubmittedAssignmentDetailsThunk } from "../../../store/slices/studentAssignmentSlice"; // Assuming the thunk is here
import { RootState } from "../../../store";
import { AppDispatch } from "../../../store";

interface Question {
  assignmentquestion_id: number;
  assignment_question: string;
  student_answer: string;
  status: string;
  submitted_date: string;
}

interface SubmittedAssignmentDetails {
  assignment_description: string;
  grade: string;
  author: string;
  submissionStatus: string;
  questions: Question[];
}

const AssignmentDetails = () => {
  const { id, assignmentId } = useParams<{
    id: string;
    assignmentId: string;
  }>();
  const dispatch = useDispatch<AppDispatch>();

  const [attemptLink, setAttemptLink] = useState<string | undefined>(undefined);

  const { submittedAssignmentDetails, loading, error } = useSelector(
    (state: RootState) => state.studentAssignments
  );

  useEffect(() => {
    if (id && assignmentId) {
      dispatch(
        getSubmittedAssignmentDetailsThunk({ studentId: id, assignmentId })
      );
    }
  }, [id, assignmentId, dispatch]);

  useEffect(() => {
    if (submittedAssignmentDetails) {
      const { submissionStatus } = submittedAssignmentDetails;
      if (submissionStatus === "submitted") {
        setAttemptLink(`/student/assignments/${id}/attempt/${assignmentId}`);
      }
    }
  }, [submittedAssignmentDetails, id, assignmentId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const renderAssignmentQuestions = () => {
    return submittedAssignmentDetails?.questions?.map(
      (question: Question, index: number) => (
        <div key={question.assignmentquestion_id} className="question">
          <h4 className="text-xl font-bold">Question {index + 1}:</h4>
          <p className="text-lg font-medium">{question.assignment_question}</p>

          <p>Answer : {question.student_answer}</p>
          <p>
            Submitted on: {new Date(question.submitted_date).toLocaleString()}
          </p>
        </div>
      )
    );
  };

  return (
    <div className="mt-6">
      <h1 className="text-xl font-bold">Assignment {assignmentId} - Details</h1>

      {submittedAssignmentDetails ? (
        <div>
          {/* <h2>
            Description: {submittedAssignmentDetails.assignment_description}
          </h2>
          <h3>Grade: {submittedAssignmentDetails.grade}</h3>
          <h4>Submitted by: {submittedAssignmentDetails.author}</h4>
          */}
          <div className="bg-white p-4 my-4">{renderAssignmentQuestions()}</div>
          <div className="bg-white p-4 rounded-md">
            <h2 className="text-lg font-bold">Teacher Feedback</h2>
            <p>
              {submittedAssignmentDetails.teacher_feedback || "No feedback yet"}
            </p>
          </div>
        </div>
      ) : (
        <p>No assignment details found.</p>
      )}
    </div>
  );
};

export default AssignmentDetails;
