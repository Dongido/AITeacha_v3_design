import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  fetchTestDetails,
  selectTestDetails,
} from "../../../store/slices/testSlice";
import { useParams } from "react-router-dom";
import { fetchTestAnswerDetails } from "../../../api/test";
import { CheckCircle, XCircle, Download } from "lucide-react"; // Import Download icon
import { Button } from "../../../components/ui/Button";
import { cn } from "../../../lib/utils";

interface Question {
  examinationquestion_id: number;
  examinationquestions_id: number;
  examinationquestions_question: string;
  examinationquestions_options?: string;
  question_type: "objective" | "theory";
  student_answer?: string | null;
  correct_answer?: string | null;
  mark: number | null;
  score?: number | null;
}

const StudentTestReport = () => {
  const dispatch = useAppDispatch();
  const { testId, studentId } = useParams();
  const [fetchFailed, setFetchFailed] = useState(false);
  const [fetchedTestDetails, setFetchedTestDetails] = useState<any>(null);

  const userDetails = JSON.parse(
    localStorage.getItem("ai-teacha-user") || "{}"
  );

  useEffect(() => {
    if (testId) {
      dispatch(fetchTestDetails(Number(testId)))
        .unwrap()
        .then(() => {
          fetchTestAnswerDetails(testId, studentId)
            .then((details) => {
              setFetchedTestDetails(details[0]);
            })
            .catch((error) => {
              console.error("Error fetching test answer details:", error);
              setFetchFailed(true);
            });
        })
        .catch(() => setFetchFailed(true));
    }
  }, [testId, dispatch, studentId]);

  const testDetailsArray = useAppSelector(selectTestDetails);
  const testDetails = testDetailsArray?.[0];

  if (!testDetails) return <p>Loading...</p>;

  const deduplicatedQuestions = Array.from(
    new Map(
      (fetchedTestDetails?.questions || []).map((q: any) => [
        q.examinationquestion_id,
        q,
      ])
    ).values()
  );

  const totalQuestions = deduplicatedQuestions.length;
  const correctAnswersCount = deduplicatedQuestions.filter(
    (q: any) =>
      q.student_answer &&
      q.correct_answer &&
      q.student_answer.trim().toLowerCase() ===
        q.correct_answer.trim().toLowerCase()
  ).length;

  // Function to generate CSV data
  const generateCSVData = () => {
    if (!fetchedTestDetails) return "";

    const header =
      "Question ID,Question,Student Answer,Correct Answer,Is Correct,Score,Mark\n";
    const rows = fetchedTestDetails.questions
      .map((q: any) => {
        const studentAnswer = q.student_answer
          ? `"${q.student_answer}"`
          : "Not answered";
        const correctAnswer = q.correct_answer
          ? `"${q.correct_answer}"`
          : "Not available";
        const isCorrect =
          q.student_answer &&
          q.correct_answer &&
          q.student_answer.trim().toLowerCase() ===
            q.correct_answer.trim().toLowerCase()
            ? "true"
            : "false";
        const score =
          q.score !== undefined && q.score !== null ? q.score : "N/A";
        const mark = q.mark !== undefined && q.mark !== null ? q.mark : "N/A";
        const questionText = q.examinationquestions_question
          ? `"${q.examinationquestions_question.replace(/"/g, '""')}"`
          : "";

        return [
          q.examinationquestion_id,
          questionText, // Escape double quotes
          studentAnswer,
          correctAnswer,
          isCorrect,
          score,
          mark,
        ].join(",");
      })
      .join("\n");

    return header + rows;
  };

  // Function to download CSV
  const downloadCSV = () => {
    const csvData = generateCSVData();
    if (!csvData) return;

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `test_report_${testId}_${studentId}.csv`); // Filename
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Calculate total marks and student score for theory questions
  let totalMarks = 0;
  let studentTotalScore = 0;
  if (fetchedTestDetails) {
    fetchedTestDetails.questions.forEach((q: any) => {
      if (q.question_type === "theory" && q.mark !== null) {
        totalMarks += q.mark;
        studentTotalScore += q.score ?? 0; // Assuming score is 0 if null
      }
    });
  }

  const allQuestions: Question[] = testDetails.questions || [];

  const objectiveQuestions = allQuestions.filter(
    (q) => q.question_type === "objective"
  );
  const theoryQuestions = allQuestions.filter(
    (q) => q.question_type === "theory"
  );

  const fetchedObjectiveQuestions: Question[] =
    fetchedTestDetails?.questions?.filter(
      (q: Question) => q.question_type === "objective"
    ) || [];
  const fetchedTheoryQuestions: Question[] =
    fetchedTestDetails?.questions?.filter(
      (q: Question) => q.question_type === "theory"
    ) || [];

  const totalObjectiveQuestions = objectiveQuestions.length;
  const correctObjectiveAnswersCount = objectiveQuestions.filter((q) => {
    return (
      q.student_answer &&
      q.correct_answer &&
      q.student_answer.trim().toLowerCase() ===
        q.correct_answer.trim().toLowerCase()
    );
  }).length;

  let totalObjectiveMarks = 0;
  let studentObjectiveScore = 0;
  fetchedObjectiveQuestions.forEach((q: Question) => {
    if (q.mark !== null) {
      totalObjectiveMarks += q.mark;
      if (
        q.student_answer &&
        q.correct_answer &&
        q.student_answer.trim().toLowerCase() ===
          q.correct_answer.trim().toLowerCase()
      ) {
        studentObjectiveScore += q.mark;
      }
    }
  });
  let totalTheoryMarks = 0;
  let studentTheoryScore = 0;
  if (fetchedTestDetails && fetchedTestDetails.questions) {
    fetchedTestDetails.questions.forEach((q: Question) => {
      if (q.question_type === "theory" && q.mark !== null) {
        totalTheoryMarks += q.mark;
        studentTheoryScore += q.score ?? 0;
      }
    });
  }
  const uniqueTheoryQuestions: Question[] = [];
  const seenTheoryQuestionIds = new Set();

  console.log("seenTheoryQuestionIds:", seenTheoryQuestionIds);
  console.log(
    "Total Theory Marks (after removing duplicates):",
    totalTheoryMarks
  );
  console.log(
    "Student Theory Score (after removing duplicates):",
    studentTheoryScore
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          📘 {testDetails.subject}
        </h1>
        <p className="text-gray-600 italic mb-1">
          ⏳ Duration: {testDetails.duration}minutes
        </p>
        <p className="text-gray-600 italic mb-3">
          🏫 School: {testDetails.school_name}
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg text-gray-800 shadow">
          <strong>Instruction:</strong> {testDetails.instruction}
        </div>
      </div>

      {fetchedTestDetails && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-green-50 border-l-4 border-green-500 p-4 mb-8 rounded-lg text-gray-800 shadow">
          <div>
            {fetchedObjectiveQuestions.length > 0 && (
              <p className="text-lg font-semibold">
                🧮 Objective Score: {studentObjectiveScore} /{" "}
                {totalObjectiveMarks}
              </p>
            )}
            {fetchedTheoryQuestions.length > 0 && totalTheoryMarks >= 0 && (
              <p className="text-lg font-semibold">
                ✍️ Theory Score: {studentTheoryScore} / {totalTheoryMarks}
              </p>
            )}
            {(fetchedObjectiveQuestions.length > 0 ||
              fetchedTheoryQuestions.length > 0) && (
              <p className="text-xl font-bold mt-4">
                Total Score: {studentObjectiveScore + studentTheoryScore} /{" "}
                {totalObjectiveMarks + totalTheoryMarks}
              </p>
            )}
          </div>
          <Button
            variant="outline"
            onClick={downloadCSV}
            className={cn(
              "bg-green-500/20 text-green-600 hover:bg-green-500/30",
              "transition-colors duration-200",
              "flex items-center gap-2" // Added for icon spacing
            )}
          >
            <Download className="w-4 h-4" />
            Download as CSV
          </Button>
        </div>
      )}

      <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          📄 Student Submission Review
        </h2>
        <div className="space-y-6">
          {testDetails.questions.map((q: any, idx: number) => {
            const answerDetails = fetchedTestDetails?.questions?.find(
              (ans: any) =>
                ans.examinationquestion_id === q.examinationquestions_id
            );

            const studentAnswer =
              answerDetails?.student_answer || "Not answered";
            const correctAnswer =
              answerDetails?.correct_answer || "Not available";
            const isCorrect =
              studentAnswer &&
              correctAnswer &&
              studentAnswer.trim().toLowerCase() ===
                correctAnswer.trim().toLowerCase();

            const options =
              q.question_type === "objective"
                ? JSON.parse(q.examinationquestions_options)
                : [];

            return (
              <div
                key={q.examinationquestions_id}
                className={`border rounded-xl p-5 ${
                  isCorrect
                    ? "border-green-300 bg-green-50"
                    : "border-red-300 bg-red-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-800">
                    {idx + 1}. {q.examinationquestions_question}
                    {/* Show score if available */}
                    {answerDetails?.score !== undefined &&
                      answerDetails?.score !== null && (
                        <span className="text-blue-600 font-semibold ml-2">
                          ({answerDetails.score} / {answerDetails.mark ?? 1})
                        </span>
                      )}
                  </p>
                  {isCorrect ? (
                    <CheckCircle className="text-green-600 w-6 h-6" />
                  ) : (
                    <XCircle className="text-red-600 w-6 h-6" />
                  )}
                </div>

                {q.question_type === "objective" && (
                  <div className="space-y-2 mb-3 text-gray-700">
                    {options.map((opt: string, i: number) => (
                      <div key={i} className="flex gap-2 items-start">
                        <span className="font-semibold">
                          {String.fromCharCode(65 + i)}.
                        </span>
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                )}

                <p>
                  <strong className="text-gray-700">Your Answer:</strong>{" "}
                  <span
                    className={isCorrect ? "text-green-700" : "text-red-700"}
                  >
                    {studentAnswer}
                  </span>
                </p>

                <p>
                  <strong className="text-gray-700">Correct Answer:</strong>{" "}
                  <span className="text-blue-700">{correctAnswer}</span>
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentTestReport;
