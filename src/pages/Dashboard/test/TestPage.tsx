import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  fetchTestDetails,
  selectTestDetails,
  selectTestDetailsLoading,
} from "../../../store/slices/testSlice";
import { submitExamination, fetchTestAnswerDetails } from "../../../api/test";

interface Question {
  examinationquestions_id: number;
  examinationquestions_question: string;
  examinationquestions_options?: string;
  question_type: "objective" | "theory";
}

const ExamPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const testDetailsArray = useAppSelector(selectTestDetails);
  const testDetails = testDetailsArray?.[0];
  const loading = useAppSelector(selectTestDetailsLoading);

  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [timer, setTimer] = useState<number>(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [viewingObjective, setViewingObjective] = useState(true);

  const userDetails = JSON.parse(
    localStorage.getItem("ai-teacha-user") || "{}"
  );

  const handleSubmit = useCallback(async () => {
    setSubmitLoading(true);

    const submission =
      testDetails?.questions?.map((q: any) => ({
        examination_question_id: q.examinationquestions_id,
        question_type: q.question_type,
        question: q.examinationquestions_question,
        student_answer: answers[q.examinationquestions_id] || "",
      })) || [];

    if (testDetails?.examination_id) {
      try {
        await submitExamination({
          examination_id: testDetails.examination_id,
          answers: submission,
        });
        localStorage.removeItem(
          `exam-timer-${testDetails.examination_id}-${userDetails.id}`
        );

        if (userDetails) {
          setTimeout(() => {
            navigate(
              isStudent
                ? "/student/test/submitted"
                : "/dashboard/test/submitted"
            );
          }, 2000);
        }
      } catch (err: any) {
        alert(err.message);
      } finally {
        setSubmitLoading(false);
      }
    }
  }, [answers, navigate, testDetails, userDetails]);

  const handleAutoSubmit = useCallback(() => {
    if (!submitLoading && !hasSubmitted && testDetails?.examination_id) {
      console.log("Automatically submitting exam due to tab switch.");
      handleSubmit();
    }
  }, [handleSubmit, submitLoading, hasSubmitted, testDetails]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleAutoSubmit();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleAutoSubmit]);

  useEffect(() => {
    if (id && userDetails.id) {
      dispatch(fetchTestDetails(Number(id)))
        .unwrap()
        .then(() => {
          fetchTestAnswerDetails(id, userDetails.id)
            .then((details) => {
              if (details && details.length > 0 && details[0].submitted) {
                setHasSubmitted(true);
              } else if (details && details.length > 0) {
                const initialAnswers: { [key: number]: string } = {};
                details[0]?.questions?.forEach((q: any) => {
                  initialAnswers[q.examinationquestion_id] =
                    q.student_answer || "";
                });
                setAnswers(initialAnswers);
              }
            })
            .catch((error) => {
              console.error("Error fetching test answer details:", error);
              setFetchFailed(true);
            });
        })
        .catch(() => setFetchFailed(true));
    }
  }, [id, dispatch, userDetails.id]);

  useEffect(() => {
    if (testDetails?.duration) {
      const examKey = `exam-timer-${testDetails.examination_id}-${userDetails.id}`;
      const savedStartTime = localStorage.getItem(examKey);

      const durationMinutes = parseInt(testDetails.duration.split(" ")[0]);
      const durationInSeconds = durationMinutes * 60;

      let startTime: number;

      if (savedStartTime) {
        startTime = parseInt(savedStartTime);
      } else {
        startTime = Math.floor(Date.now() / 1000);
        localStorage.setItem(examKey, String(startTime));
      }

      const currentTime = Math.floor(Date.now() / 1000);
      const elapsed = currentTime - startTime;
      const remainingTime = Math.max(durationInSeconds - elapsed, 0);

      setTimer(remainingTime);
    }
  }, [testDetails, userDetails.id]);

  useEffect(() => {
    if (!timer) return;

    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer, handleAutoSubmit]);

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const isStudent = userDetails.role_id === 3 || userDetails.role === 3;
  const hasObjective = testDetails?.questions?.some(
    (q: any) => q.question_type === "objective"
  );
  const hasTheory = testDetails?.questions?.some(
    (q: any) => q.question_type === "theory"
  );

  const objectiveQuestions = testDetails?.questions?.filter(
    (q: any) => q.question_type === "objective"
  );
  const theoryQuestions = testDetails?.questions?.filter(
    (q: any) => q.question_type === "theory"
  );

  const handleNextSection = () => {
    setViewingObjective(false);
  };

  const handlePreviousSection = () => {
    setViewingObjective(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <svg
          className="animate-spin h-10 w-10 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      </div>
    );
  }

  if (fetchFailed || !testDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-semibold text-lg">
        Failed to fetch test details. Please try again later.
      </div>
    );
  }

  if (hasSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center text-yellow-500 font-semibold text-lg">
        You have already submitted this test. You cannot take it again.
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-2xl p-6 mb-6 border border-gray-200">
        <h1 className="text-2xl text-gray-900  font-bold mb-1">
          School: {testDetails?.school_name}
        </h1>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Subject: {testDetails?.subject}
        </h2>
        <p className="text-gray-800 italic mb-4">
          <span className="font-bold text-black">Instruction:</span>{" "}
          {testDetails?.instruction}
        </p>

        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-200 border border-red-500 text-red-700 px-4 py-3 rounded-md shadow-lg z-50">
          <strong className="font-bold">Warning!</strong>
          <span className="block sm:inline">
            If you leave this tab, your exam will be automatically submitted
            after a short delay. Please stay focused.
          </span>
        </div>

        <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-inner mb-6">
          <p className="text-lg font-semibold text-gray-700">⏰ Time Left:</p>
          <p className="text-xl font-bold text-red-500">
            {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
          </p>
        </div>

        <div className="space-y-10">
          {hasObjective && viewingObjective && (
            <div>
              <h3 className="text-xl font-bold mb-4">
                Section A: Objective Questions
              </h3>
              <div className="space-y-8">
                {objectiveQuestions?.map((q: Question, idx: number) => (
                  <div
                    key={q.examinationquestions_id}
                    className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm"
                  >
                    <p className="text-lg font-medium mb-4">
                      {idx + 1}. {q.examinationquestions_question}
                    </p>

                    <div className="space-y-2">
                      {q.examinationquestions_options &&
                        JSON.parse(q.examinationquestions_options).map(
                          (opt: string, i: number) => {
                            const optionLetter = String.fromCharCode(65 + i);
                            return (
                              <label
                                key={i}
                                className="flex items-center space-x-3 p-2 bg-white border border-gray-300 rounded-md hover:bg-gray-100 cursor-pointer transition-all"
                              >
                                <input
                                  type="radio"
                                  name={`q_${q.examinationquestions_id}`}
                                  value={optionLetter}
                                  className="form-radio h-4 w-4 text-blue-600"
                                  checked={
                                    answers[q.examinationquestions_id] ===
                                    optionLetter
                                  }
                                  onChange={() =>
                                    handleAnswerChange(
                                      q.examinationquestions_id,
                                      optionLetter
                                    )
                                  }
                                />
                                <span className="text-gray-700">
                                  <strong>{optionLetter}.</strong> {opt}
                                </span>
                              </label>
                            );
                          }
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasTheory && (!hasObjective || !viewingObjective) && (
            <div>
              <h3 className="text-xl font-bold mb-4 mt-8">
                Section B: Theory Questions
              </h3>
              <div className="space-y-8">
                {theoryQuestions?.map((q: Question, idx: number) => (
                  <div
                    key={q.examinationquestions_id}
                    className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm"
                  >
                    <p className="text-lg font-medium mb-4">
                      {idx + 1}. {q.examinationquestions_question}
                    </p>
                    <textarea
                      rows={4}
                      placeholder="Type your answer here..."
                      className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={answers[q.examinationquestions_id] || ""}
                      onChange={(e) =>
                        handleAnswerChange(
                          q.examinationquestions_id,
                          e.target.value
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-between">
          {hasTheory && hasObjective && viewingObjective && (
            <button
              onClick={handleNextSection}
              className="bg-primary hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition-all"
            >
              Answer Theory Questions
            </button>
          )}
          {hasTheory && hasObjective && !viewingObjective && (
            <button
              onClick={handlePreviousSection}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-md transition-all"
            >
              Previous
            </button>
          )}

          {(hasObjective && !hasTheory) ||
          (!hasObjective && hasTheory) ||
          (!hasObjective && !hasTheory) ||
          (!viewingObjective && hasTheory) ||
          (viewingObjective && hasObjective && !hasTheory) ? (
            <button
              onClick={handleSubmit}
              disabled={submitLoading}
              className={`${
                submitLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-primary hover:bg-blue-700"
              } text-white font-semibold py-3 px-6 rounded-md transition-all flex items-center gap-2`}
            >
              {submitLoading && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              )}
              {submitLoading ? "Submitting..." : "Submit"}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ExamPage;
