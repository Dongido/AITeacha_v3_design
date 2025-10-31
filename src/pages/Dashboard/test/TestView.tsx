import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  fetchTestDetails,
  selectTestDetails,
} from "../../../store/slices/testSlice";
import { useNavigate, useParams } from "react-router-dom";
import { fetchTestAnswerDetails } from "../../../api/test";
import { CheckCircle, XCircle } from "lucide-react";
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

// const navigate = useNavigate

const TestView = () => {
  const navigate = useNavigate();
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

  // console.log("seenTheoryQuestionIds:", seenTheoryQuestionIds);
  // console.log(
  //   "Total Theory Marks (after removing duplicates):",
  //   totalTheoryMarks
  // );
  // console.log(
  //   "Student Theory Score (after removing duplicates):",
  //   studentTheoryScore
  // );

  console.log(testDetails);

  return (
    <div className="p-3 md:p-[30px]">
      <div className="mb-6">
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

        <div className="p-3 md:p-[25px] bg-white rounded-2xl shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-1">Instruction</h2>
          <p className="text-gray-600 m-0 mt-5">
            {testDetails?.instruction || "Attempt all questions carefully."}
          </p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Your Submission Review
        </h2>


        

        {objectiveQuestions.map((q: Question, idx: number) => {
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
                    isCorrect ? " bg-green-50" : " bg-red-50"
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
