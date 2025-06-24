import React, { useEffect, useState } from "react";
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
import { AppDispatch } from "../../../store";
import { testColumns } from "./components/column.test";
import BaseTable from "../../../components/table/BaseTable";
import { Skeleton } from "../../../components/ui/Skeleton";
import { Button } from "../../../components/ui/Button";
import { useNavigate, Link } from "react-router-dom";
import { Plus, ClipboardList, PenBox } from "lucide-react";
import clsx from "clsx";
import RestrictedPage from "./RestrictedPage";
const TestPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const selectedType = useSelector(selectSelectedTestType);

  const tests = useSelector(selectTests);
  const loading = useSelector(selectTestsLoading);
  const error = useSelector(selectTestsError);
  const userDetails = useSelector((state: any) => state.auth.user);
  const isEmailVerified = userDetails?.isEmailVerified;
  const handleVerifyEmail = () => {
    console.log("Verify email clicked");
  };

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
    <div className="p-6 animate-fade-in">
      <div className="flex w-full mt-12 mb-6 items-center justify-between flex-col sm:flex-row">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <h2 className="text-3xl font-extrabold text-gray-800">
            {selectedType === "test" ? "Test Manager" : "Exam Manager"}
          </h2>
          <button
            onClick={() => dispatch(setSelectedTestType(null))}
            className="text-sm text-blue-500 hover:underline"
          >
            Change Type
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Link to={"/dashboard/test/joined"} className="w-full sm:w-auto">
            <Button
              variant="ghost"
              className="flex items-center w-full sm:w-fit bg-gray-100 hover:bg-gray-200 h-full gap-3 rounded-md transition"
            >
              Joined {selectedType === "test" ? "Tests" : "Exams"}
            </Button>
          </Link>
          <Button
            variant="gradient"
            className="flex items-center w-full sm:w-fit h-full gap-3 rounded-md  text-white shadow-md hover:scale-105 transition-transform"
            onClick={handleLaunchNew}
          >
            <Plus size={"1.1rem"} />
            Create {selectedType === "test" ? "Test" : "Exam"}
          </Button>
        </div>
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
        <BaseTable
          data={tests}
          columns={testColumns}
          onRowClick={handleRowClick}
        />
      )}
    </div>
  );
};

export default TestPage;
