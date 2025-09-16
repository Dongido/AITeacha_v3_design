import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store";
import {
  fetchTestDetails,
  fetchExamStudents,
  selectTestDetails,
  selectTestDetailsLoading,
  selectTestDetailsError,
  selectExamStudents as selectStudents,
  selectExamStudentsLoading as selectStudentsLoading,
  selectExamStudentsError as selectStudentsError,
} from "../../../store/slices/testSlice";
import { Skeleton } from "../../../components/ui/Skeleton";

import { Undo2, CheckIcon, ArrowRightIcon, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";

const TestDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const testDetails = useSelector(selectTestDetails);
  const loading = useSelector(selectTestDetailsLoading);
  const error = useSelector(selectTestDetailsError);

  useEffect(() => {
    if (id) {
      dispatch(fetchTestDetails(parseInt(id, 10)));
    }
  }, [dispatch, id]);
  useEffect(() => {
    if (testDetails) {
      console.log("Test Details: ", testDetails);
    }
  }, [testDetails]);

  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(firstTest?.join_url || "")
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((error) => console.error("Failed to copy link:", error));
  };

  const handleCopyCode = () => {
    navigator.clipboard
      .writeText(firstTest?.join_code || "")
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((error) => console.error("Failed to copy link:", error));
  };

  if (loading) {
    return (
      <div className="p-4">
        <div
          style={{
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Skeleton className="h-6 w-1/2 mr-2" />
          </div>
          <Skeleton className="h-4 w-3/4" />
          <div style={{ marginTop: "16px" }}>
            <Skeleton className="h-8 w-full mb-4" />
            <Skeleton className="h-8 w-full mb-4" />
            <Skeleton className="h-8 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div
          style={{
            backgroundColor: "#f87171",
            color: "white",
            padding: "16px",
            borderRadius: "8px",
            border: "1px solid #b91c1c",
            display: "flex",
            alignItems: "center",
          }}
        >
          <AlertCircle className="h-4 w-4 mr-2" />
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", margin: 0 }}>
            Error
          </h2>
          <p style={{ margin: 0 }}>{error}</p>
        </div>
      </div>
    );
  }

  if (!testDetails || !Array.isArray(testDetails) || testDetails.length === 0) {
    return <div className="p-4">No test details found.</div>;
  }

  const firstTest = testDetails[0];

  return (
    <div className="p-4">
      <div className="flex w-full mt-12 mb-6 items-center justify-between">
        <Button
          className="flex items-center bg-white rounded-md text-black w-fit h-full mr-2 gap-3 py-2"
          onClick={() => navigate(-1)}
        >
          <Undo2 size={"1.1rem"} color="black" />
          Back
        </Button>
      </div>
      <div className="border rounded-lg">
        <div className="bg-[#5C3CBB] text-white p-8 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold">Test Details</p>
          </div>
          <h2 className="text-2xl font-bold mt-2">{firstTest.subject}</h2>
          <p className="text-lg mt-1">
            {firstTest.examination_description
              ? firstTest.examination_description.length > 270
                ? `${firstTest.examination_description.slice(0, 270)}...`
                : firstTest.examination_description
              : ""}
          </p>
          <p className="text-lg">Status: {firstTest.status}</p>
          <div className="flex flex-col sm:flex-row items-center mt-2 justify-between sm:space-x-4">
            <button
              onClick={() => {
                window.location.href = `/dashboard/test/students/${firstTest.examination_id}`;
              }}
              className="mt- sm:mt-0 flex hover:bg-gray-200 items-center bg-white text-[#5C3CBB] font-semibold py-2 px-4 rounded-full text-sm"
            >
              View Students
              <ArrowRightIcon className="h-5 w-5 ml-2" />
            </button>

            <div className="mt-4 sm:mt-0 flex flex-row gap-4 items-center">
              <button
                className="bg-[#e5dbff] text-[#5C3CBB] font-semibold py-2 px-4 rounded-full text-sm"
                onClick={() => {
                  navigator.clipboard.writeText(
                    firstTest?.join_url || "Link not available"
                  );
                  handleCopyLink();
                }}
              >
                Copy Link
              </button>

              <button
                className=" bg-[#e5dbff] text-[#5C3CBB] font-semibold py-2 px-4 rounded-full text-sm"
                onClick={() => {
                  navigator.clipboard.writeText(
                    firstTest?.join_code || "Code not available"
                  );
                  handleCopyCode();
                }}
              >
                Copy Code
              </button>

              <div className="flex items-center mt-2">
                {copied && (
                  <CheckIcon className="h-5 w-5 ml-2 text-green-400" />
                )}
              </div>
            </div>
          </div>
        </div>

      <div className="mt-8 flex justify-center">
  <div className="flex gap-4 overflow-x-auto">
    <button className="flex items-center gap-2 bg-purple-200 text-purple-800 rounded-full py-2 px-4 whitespace-nowrap">
      Grade: {firstTest?.grade}
    </button>
    <button className="flex items-center gap-2 bg-blue-200 text-blue-800 rounded-full py-2 px-4 whitespace-nowrap">
      No of Questions: {firstTest?.questions?.length ?? 0}
    </button>
    <button className="flex items-center gap-2 bg-green-200 text-green-800 rounded-full py-2 px-4 whitespace-nowrap">
      Exam Type: {firstTest?.exam_type || "N/A"}
    </button>

    {firstTest?.academic_session && (
      <button className="flex items-center gap-2 bg-yellow-200 text-yellow-800 rounded-full py-2 px-4 whitespace-nowrap">
        Session: {firstTest.academic_session}
      </button>
    )}
    {firstTest?.academic_term && (
      <button className="flex items-center gap-2 bg-pink-200 text-pink-800 rounded-full py-2 px-4 whitespace-nowrap">
        Term: {firstTest.academic_term}
      </button>
    )}
  </div>
</div>

        {/* <div className="p-6">
          <p>
            <strong>Grade:</strong> {firstTest.grade}
          </p>
          <p>
            <strong>Instructions:</strong> {firstTest.instruction}
          </p>
          <p>
            <strong>Duration:</strong> {firstTest.duration} minutes
          </p>
          {firstTest.questions && firstTest.questions.length > 0 && (
            <>
              <h3 className="mt-6 font-semibold">Questions:</h3>
              <ul>
                {firstTest.questions.map((question: any) => (
                  <li key={question.examinationquestions_id} className="mb-4">
                    <p>
                      <strong>Question:</strong>{" "}
                      {question.examinationquestions_question}
                    </p>
                    <p>
                      <strong>Type:</strong> {question.question_type}
                    </p>
                    <p>
                      <strong>Options:</strong>{" "}
                      {question.examinationquestions_options}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default TestDetailsPage;
