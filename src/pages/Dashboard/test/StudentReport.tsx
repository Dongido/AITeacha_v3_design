import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  fetchTestDetails,
  selectTestDetails,
} from "../../../store/slices/testSlice";
import { useNavigate, useParams } from "react-router-dom";
import { fetchTestAnswerDetails } from "../../../api/test";
import { CheckCircle, XCircle, Download } from "lucide-react"; // Import Download icon
import { Button } from "../../../components/ui/Button";
import { cn } from "../../../lib/utils";
import { IoCheckbox, IoChevronBackOutline } from "react-icons/io5";
import { LiaTimesCircleSolid } from "react-icons/lia";

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
    const navigate = useNavigate();
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

      <button
                // onClick={() => window.history.back()}
                onClick={() => navigate(-1)}
                className="flex mb-[30px] items-center gap-2 text-sm text-gray-600 hover:text-gray-900 "
              >
                <IoChevronBackOutline className="w-5 h-5" />
                Back
              </button>


      <div className="bg-[#EFE6FD] p-5 rounded-2xl my-6">
          <p className="text-gray-700 text-sm w-fit p-1 px-4 rounded-full border border-purple-800 text-primary font-semibold">
            {testDetails?.examination_description || "Test Details"}
          </p>
          <h3 className="text-2xl font-bold text-gray-800">
            {testDetails?.subject || "Subject"}
          </h3>
          <div className="flex gap-4 flex-wrap">
            <button className="flex items-center gap-2 border border-gray-400  rounded-full py-1 px-4 whitespace-nowrap">
              School: {testDetails?.school_name || "N/A"}
            </button>
            <button className="flex items-center gap-2 border border-gray-400 rounded-full py-1 px-4 whitespace-nowrap">
              Duration: {testDetails?.duration || "N/A"} mins
            </button>
            <button className="flex items-center gap-2 border border-gray-400  rounded-full py-1 px-4 whitespace-nowrap">
              Grade: {testDetails?.grade}
            </button>
            <button className="flex items-center gap-2 border border-gray-400 rounded-full py-1 px-4 whitespace-nowrap">
              No of Questions: {testDetails?.questions?.length ?? 0}
            </button>

            {testDetails?.academic_session && (
              <button className="flex items-center gap-2 border border-gray-400  rounded-full py-1 px-4 whitespace-nowrap">
                Session: {testDetails.academic_session}
              </button>
            )}
          </div>
        </div>



        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-3 md:p-[25px] flex flex-col justify-center  bg-white rounded-2xl shadow-sm">
            <h1 className="text-2xl font-bold text-gray-700">
              {studentObjectiveScore} / {totalObjectiveMarks}
            </h1>
            <p className="text-gray-800 m-0 mt-3 font-semibold">
              Objective Score
            </p>
          </div>
          <div className="p-3 md:p-[25px] flex flex-col justify-center bg-white rounded-2xl shadow-sm">
            <h1 className="text-2xl font-bold text-gray-700">
              {studentTheoryScore} / {totalTheoryMarks}
            </h1>
            <p className="text-gray-800 m-0 mt-3 font-semibold">Theory Score</p>
          </div>
          <div className="p-3 md:p-[25px] flex flex-col justify-center  bg-white rounded-2xl shadow-sm">
            <h1 className="text-2xl font-bold text-gray-700">
              {studentObjectiveScore + studentTheoryScore} /{" "}
              {totalObjectiveMarks + totalTheoryMarks}
            </h1>
            <p className="text-gray-800 m-0 mt-3 font-semibold">Total Score</p>
          </div>
        </div>

        <Button
            variant="outline"
            onClick={downloadCSV}
            className={cn(
              "bg-green-500/20 text-green-600 hover:bg-green-500/30",
              "transition-colors duration-200",
              "flex items-center gap-2 mb-[30px]" // Added for icon spacing
            )}
          >
            <Download className="w-4 h-4" />
            Download as CSV
          </Button>


     


      <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          📄 Student Submission Review
        </h2>
        <div className="space-y-6">
          
          {testDetails.questions.map((q: Question, idx: number) => {
                    const answerDetails = fetchedTestDetails?.questions?.find(
                      (ans: any) =>
                        ans.examinationquestion_id === q.examinationquestions_id
                    );
          
                    const studentAnswer = answerDetails?.student_answer?.trim() || "";
                    const correctAnswer = answerDetails?.correct_answer?.trim() || "";
                    const isCorrect =
                      studentAnswer &&
                      correctAnswer &&
                      studentAnswer.toLowerCase() === correctAnswer.toLowerCase();
          
                    const options = q.examinationquestions_options
                      ? JSON.parse(q.examinationquestions_options)
                      : [];
          
                    return (
                      <div
                        key={q.examinationquestions_id}
                        className="border rounded-xl p-5 mb-7 bg-gray-50"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <p className="font-medium text-gray-800">
                            {idx + 1}. {q.examinationquestions_question}
                            {answerDetails?.score !== undefined &&
                              answerDetails?.score !== null && (
                                <span className="text-blue-600 font-semibold ml-2">
                                  ({answerDetails.score} / {answerDetails.mark ?? 1})
                                </span>
                              )}
                          </p>
                        </div>
          
                        <div className="space-y-2 mb-3">
                          {options.map((opt: string, i: number) => {
                            const optionLetter = String.fromCharCode(65 + i);
                            let borderColor = "border-gray-300"; // default
                            let icon = null; // to render check or cross
          
                            if (
                              optionLetter === studentAnswer &&
                              studentAnswer === correctAnswer
                            ) {
                              borderColor = "border-green-500";
                              icon = <IoCheckbox className="text-green-600 w-5 h-5" />;
                            } else if (
                              optionLetter === studentAnswer &&
                              studentAnswer !== correctAnswer
                            ) {
                              borderColor = "border-red-500";
                              icon = (
                                <LiaTimesCircleSolid className="text-red-600 w-5 h-5" />
                              );
                            } else if (
                              optionLetter === correctAnswer &&
                              studentAnswer !== correctAnswer
                            ) {
                              borderColor = "border-green-500";
                              icon = <IoCheckbox className="text-green-600 w-5 h-5" />;
                            }
          
                            return (
                              <div
                                key={i}
                                className={`flex justify-between items-center p-3 rounded-lg border ${borderColor} transition-all duration-200`}
                              >
                                <div className="flex gap-2 items-start">
                                  <span className="font-semibold">{optionLetter}.</span>
                                  <span>{opt}</span>
                                </div>
                                {icon && <div className="flex-shrink-0">{icon}</div>}
                              </div>
                            );
                          })}
                        </div>
          
                        <div className="text-sm text-gray-700 mt-3 space-y-1">
                          <p className="m-0 font-semibold text-base">
                            <strong>Your Answer:</strong>{" "}
                            <span
                              className={isCorrect ? "text-green-700" : "text-red-700"}
                            >
                              {studentAnswer || "Not answered"}
                            </span>
                          </p>
                          <p className="m-0 font-semibold text-base">
                            <strong>Correct Answer:</strong>{" "}
                            <span className="text-blue-700">
                              {correctAnswer || "Not available"}
                            </span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
        </div>
      </div>
    </div>
  );
};

export default StudentTestReport;
