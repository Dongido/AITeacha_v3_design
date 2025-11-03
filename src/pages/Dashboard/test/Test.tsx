import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTests,
  selectTests,
  selectTestsLoading,
  selectTestsError,
} from "../../../store/slices/testSlice";
import {
  setSelectedTestType,
  selectSelectedTestType,
  SelectedTestType,
} from "../../../store/slices/uiSlice";

import JoinTestDialog from "./components/JoinTestDialog";
import { AppDispatch } from "../../../store";
import { testColumns } from "./components/column.test";
import { testColumns as studentColumn } from "./student/_components/column.test";
import BaseTable from "../../../components/table/BaseTable";
import { Skeleton } from "../../../components/ui/Skeleton";
import { Button } from "../../../components/ui/Button";
import { useNavigate, Link } from "react-router-dom";
import { Plus, ClipboardList, PenBox } from "lucide-react";
import clsx from "clsx";
import RestrictedPage from "./RestrictedPage";
import { Input } from "../../../components/ui/Input";
import {
  fetchStudentExaminations,
  selectStudentExaminations,
} from "../../../store/slices/studentTestsSlice";
const TestPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const joinTestDialogRef = useRef<{ openDialog: () => void }>(null);
  const selectedType = useSelector(selectSelectedTestType);

  const examinations = useSelector(selectStudentExaminations);
  const tests = useSelector(selectTests);
  const loading = useSelector(selectTestsLoading);
  const error = useSelector(selectTestsError);
  const userDetails = useSelector((state: any) => state.auth.user);
  const isEmailVerified = userDetails?.isEmailVerified;
  const handleVerifyEmail = () => {
    console.log("Verify email clicked");
  };
  const fetched = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (selectedType) {
        localStorage.setItem("selectedTestType", selectedType);
        dispatch(fetchTests());
      }
    }
  }, [dispatch, selectedType]);

  const handleRowClick = (test: any) => {
    // navigate(`/dashboard/classrooms/details/${test.id}`);
  };

  const handleLaunchNew = () => {
    if (selectedType === "exam") {
      navigate("/dashboard/create-exam");
    } else {
      navigate("/dashboard/create-test");
    }
  };

  useEffect(() => {
    if (!fetched.current) {
      dispatch(fetchStudentExaminations());
      fetched.current = true;
    }
  }, [dispatch]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (selectedType) {
        localStorage.setItem("selectedTestType", selectedType);
        dispatch(fetchTests());
      }
    }
  }, [dispatch, selectedType]);

  const [activeTab, setActiveTab] = useState<"created" | "joined">("created");

  // Filter data safely
  const filteredTests = React.useMemo(() => {
    if (!tests) return [];
    if (!searchTerm.trim()) return tests;

    const term = searchTerm.toLowerCase();
    return tests.filter((item: any) => {
      const values = Object.values(item)
        .filter((v) => typeof v === "string")
        .map((v) => v.toLowerCase());
      return values.some((v) => v.includes(term));
    });
  }, [tests, searchTerm]);
  const filteredExam = React.useMemo(() => {
    if (!examinations) return [];
    if (!searchTerm.trim()) return examinations;

    const term = searchTerm.toLowerCase();
    return examinations.filter((item: any) => {
      const values = Object.values(item)
        .filter((v) => typeof v === "string")
        .map((v) => v.toLowerCase());
      return values.some((v) => v.includes(term));
    });
  }, [examinations, searchTerm]);

  const handleJoinClick = () => {
    joinTestDialogRef.current?.openDialog();
  };

  if (error === "Permission restricted for unverified email") {
    return (
      <div>
        <div
          className="bg-[#ffe6e6] mt-3 mb-4 text-black p-4 rounded-md flex justify-center items-center"
          style={{
            background:
              "linear-gradient(143.6deg, rgba(255, 132, 132, 0) 20.79%, rgba(255, 121, 121, 0.26) 40.92%, rgba(255, 171, 171, 0) 70.35%)",
          }}
        >
          <span className="text-center text-xl font-bold">
            Please verify your email to continue!
          </span>
        </div>
      </div>
    );
  }

  if (error === "Permission restricted: for free account") {
    return (
      <div>
        {userDetails && isEmailVerified === 1 && (
          <div
            className="bg-[#e5dbff] mt-3 mb-4 text-black p-4 rounded-md flex justify-center items-center"
            style={{
              background:
                "linear-gradient(143.6deg, rgba(192, 132, 252, 0) 20.79%, rgba(232, 121, 249, 0.26) 40.92%, rgba(204, 171, 238, 0) 70.35%)",
            }}
          >
            <span className="text-center text-xl font-bold">
              Teachers Are Heroes🎉
            </span>
          </div>
        )}
        <RestrictedPage error={error} />
      </div>
    );
  }

  if (
    error &&
    error !== "Permission restricted for unverified email" &&
    error !== "Permission restricted: for free account"
  ) {
    return (
      <div>
        {userDetails && isEmailVerified === 1 && (
          <div
            className="bg-[#e5dbff] mt-3 mb-4 text-black p-4 rounded-md flex justify-center items-center"
            style={{
              background:
                "linear-gradient(143.6deg, rgba(192, 132, 252, 0) 20.79%, rgba(232, 121, 249, 0.26) 40.92%, rgba(204, 171, 238, 0) 70.35%)",
            }}
          >
            <button
              onClick={handleVerifyEmail}
              className="text-primary hover:underline"
            >
              Verify Email
            </button>
          </div>
        )}
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!selectedType) {
    return (
      <div className="flex flex-col items-center justify-center mt-6 lg:mt-12 min-h-[70vh] bg-gradient-to-br from-blue-100 via-white to-green-100 p-8 rounded-md shadow-lg transition-all">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-6 animate-fade-in">
          Choose What You Want to Manage
        </h2>
        <div className="flex flex-wrap gap-8 items-center justify-center">
          <button
            onClick={() => dispatch(setSelectedTestType("test"))}
            className="bg-white hover:bg-blue-50 transition-all duration-300 text-blue-600 font-semibold px-8 py-5 rounded-2xl shadow-md border border-blue-200 flex flex-col items-center gap-2 w-40 h-40"
          >
            <ClipboardList size={36} />
            <span>Test</span>
          </button>
          <button
            onClick={() => dispatch(setSelectedTestType("exam"))}
            className="bg-white hover:bg-green-50 transition-all duration-300 text-green-600 font-semibold px-8 py-5 rounded-2xl shadow-md border border-green-200 flex flex-col items-center gap-2 w-40 h-40"
          >
            <PenBox size={36} />
            <span>Exam</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-0 md:p-[30px]  animate-fade-in">
      <div>
        <h2 className="text-lg font-bold m-0">Test & Exams</h2>
        <p className="text-sm text-gray-800 m-0">
          Manage all your tests & exams
        </p>
      </div>

      {/* Test / Exam toggle */}
      <div className="flex items-center gap-3 mt-[40px]">
        <button
          onClick={() => dispatch(setSelectedTestType("test"))}
          className={`rounded-md p-3 px-4 ${
            selectedType === "test"
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-transparent text-gray-700 hover:text-gray-900"
          }`}
        >
          Test Manager
        </button>
        <button
          onClick={() => dispatch(setSelectedTestType("exam"))}
          className={`rounded-md p-3 px-4 ${
            selectedType === "exam"
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-transparent text-gray-700 hover:text-gray-900"
          }`}
        >
          Exam Manager
        </button>
      </div>




 <div className="flex border-b-2 my-[30px] border-gray-300">
  <Button
    variant="ghost"
    onClick={() => setActiveTab("created")}
    className={`flex items-center w-full sm:w-fit h-full gap-3  transition font-semibold ${
      activeTab === "created"
        ? "border-b-4 border-purple-900 text-purple-900"
        : "text-gray-600"
    }`}
  >
    Created
  </Button>

  <Button
    variant="ghost"
    onClick={() => setActiveTab("joined")}
    className={`flex items-center w-full sm:w-fit h-full gap-3  transition font-semibold ${
      activeTab === "joined"
        ? "border-b-4 border-purple-900 text-purple-900"
        : "text-gray-600"
    }`}
  >
    Joined
  </Button>
</div>





      {loading && (
        <div className="overflow-x-auto animate-pulse">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                {[...Array(5)].map((_, index) => (
                  <th key={index} className="p-4 border-b">
                    <Skeleton className="h-4 w-16 rounded" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(6)].map((_, rowIndex) => (
                <tr key={rowIndex} className="border-b">
                  {[...Array(5)].map((_, colIndex) => (
                    <td key={colIndex} className="p-4">
                      <Skeleton className="h-4 w-full rounded" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white p-4 rounded-3xl">
          <div className="flex  items-center flex-wrap justify-between gap-3 my-5">
            <Input
              type="text"
              placeholder={
                selectedType === "exam"
                  ? "Search by exam title"
                  : "Search by test title"
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-3 max-w-full w-[300px] bg-gray-100"
            />

            {activeTab === "created" ? (
              <button
                className="flex rounded-full items-center justify-center w-fit h-full gap-3  text-purple-900 px-4 p-2 bg-white border-2 border-purple-900 hover:scale-105 transition-transform"
                onClick={handleLaunchNew}
              >
                <Plus size={"1.1rem"} />
                Create {selectedType === "test" ? "Test" : "Exam"}
              </button>
            ) : (
              <button
                onClick={handleJoinClick}
                className="flex rounded-full items-center justify-center w-fit h-full gap-3  text-purple-900 px-4 p-2 bg-white border-2 border-purple-900 hover:scale-105 transition-transform"
              >
                <Plus size={"1.1rem"} />
                Join {selectedType === "test" ? "Test" : "Exam"}
              </button>
            )}
          </div>

          {activeTab === "created" ? (
            <BaseTable
              // data={filteredTests}
              data={filteredTests || []}
              columns={testColumns}
              onRowClick={handleRowClick}
            />
          ) : (
            <BaseTable data={filteredExam} columns={studentColumn} />
          )}
        </div>
      )}

      <JoinTestDialog ref={joinTestDialogRef} />
    </div>
  );
};

export default TestPage;
