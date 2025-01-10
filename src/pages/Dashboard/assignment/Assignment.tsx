import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadAssignments } from "../../../store/slices/assignmentSlice";
import { RootState, AppDispatch } from "../../../store";
import { Skeleton } from "../../../components/ui/Skeleton";
import BaseTable from "../../../components/table/BaseTable";
import { assignmentColumns } from "./components/column.assignment";
import { Plus, Search, Undo2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import RestrictedPage from "../classrooms/RestrictionPage";

const Assignment = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { assignments, loading, error } = useSelector(
    (state: RootState) => state.assignments
  );

  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isEmailVerified, setIsEmailVerified] = useState<number>(0);

  useEffect(() => {
    const userDetailsFromStorage = localStorage.getItem("ai-teacha-user");
    if (userDetailsFromStorage) {
      const parsedDetails = JSON.parse(userDetailsFromStorage);
      setUserDetails(parsedDetails);
      setIsEmailVerified(parsedDetails.is_email_verified);
    }
  }, []);

  useEffect(() => {
    dispatch(loadAssignments());
  }, [dispatch]);

  const handleLaunchNewAssignment = () => {
    navigate("/dashboard/assignments/create");
  };
  const handleViewAssignment = () => {
    navigate("/dashboard/assignments/joined");
  };

  const renderError = () => {
    if (error === "Permission restricted for unverified email") {
      return (
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

    return <p className="text-red-500">{error}</p>;
  };

  if (error) {
    return renderError();
  }

  return (
    <div className="mt-4">
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

      {loading ? (
        <div className="overflow-x-auto">
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
      ) : (
        <>
          <div className="flex w-full mt-12 mb-6 items-center justify-between flex-col sm:flex-row">
            <h2 className="text-2xl font-bold text-gray-900 sm:mb-0 mb-4">
              Your Assignments
            </h2>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                variant="gray"
                className="flex items-center w-full sm:w-fit h-full gap-3 rounded-md"
                onClick={handleViewAssignment}
              >
                View Your Assignments
              </Button>
              <Button
                variant="gradient"
                className="flex items-center w-full sm:w-fit h-full gap-3 rounded-md"
                onClick={handleLaunchNewAssignment}
              >
                <Plus size={"1.1rem"} />
                Create New Assignment
              </Button>
            </div>
          </div>
          <BaseTable data={assignments} columns={assignmentColumns} />
        </>
      )}
    </div>
  );
};

export default Assignment;
