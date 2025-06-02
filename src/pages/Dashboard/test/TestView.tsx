import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  fetchTestDetails,
  selectTestDetails,
} from "../../../store/slices/testSlice";
import { useParams } from "react-router-dom";
import { fetchTestAnswerDetails } from "../../../api/test";
import { CheckCircle, XCircle } from "lucide-react";

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

const TestView = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const [fetchFailed, setFetchFailed] = useState(false);
  const [fetchedTestDetails, setFetchedTestDetails] = useState<any>(null);

  const userDetails = JSON.parse(
    localStorage.getItem("ai-teacha-user") || "{}"
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchTestDetails(Number(id)))
        .unwrap()
        .then(() => {
          fetchTestAnswerDetails(id, userDetails.id)
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
  }, [id, dispatch]);

  const testDetailsArray = useAppSelector(selectTestDetails);
  const testDetails = testDetailsArray?.[0];

  if (!testDetails) return <p>Loading...</p>;

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
          ⏳ Duration: {testDetails.duration} minutes
        </p>
        <p className="text-gray-600 italic mb-3">
          🏫 School: {testDetails.school_name}
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg text-gray-800 shadow">
          <strong>Instruction:</strong> {testDetails.instruction}
        </div>
      </div>

      {fetchedTestDetails && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-8 rounded-lg text-gray-800 shadow">
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
      )}

      <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          📄 Your Submission Review
        </h2>

        {objectiveQuestions.length > 0 && (
          <div className="space-y-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Objective Questions
            </h3>
            {objectiveQuestions.map((q: Question, idx: number) => {
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

              const options = q.examinationquestions_options
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
        )}

        {objectiveQuestions.length > 0 && theoryQuestions.length > 0 && (
          <div className="border-t border-gray-300 my-8" />
        )}

        {theoryQuestions.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Theory Questions
            </h3>
            {theoryQuestions.map((q: Question, idx: number) => {
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
                      {objectiveQuestions.length + idx + 1}.{" "}
                      {q.examinationquestions_question}
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

                  <p>
                    <strong className="text-gray-700">Your Answer:</strong>{" "}
                    <span className="text-gray-700">{studentAnswer}</span>
                  </p>

                  {correctAnswer !== "Not available" && (
                    <p>
                      <strong className="text-gray-700">Correct Answer:</strong>{" "}
                      <span className="text-blue-700">{correctAnswer}</span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {objectiveQuestions.length === 0 && theoryQuestions.length === 0 && (
          <p className="text-gray-600">No questions found in this test.</p>
        )}
      </div>
    </div>
  );
};

export default TestView;
