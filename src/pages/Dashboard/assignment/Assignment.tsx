import React, { useEffect } from "react";
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

const Assignment = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { assignments, loading, error } = useSelector(
    (state: RootState) => state.assignments
  );

  useEffect(() => {
    dispatch(loadAssignments());
  }, [dispatch]);

  const navigate = useNavigate();

  const handleLaunchNewAssignment = () => {
    navigate("/dashboard/assignments/create");
  };

  return (
    <div className="mt-12">
      <div className="flex w-full mt-12 mb-6 items-center justify-between flex-col sm:flex-row">
        <h2 className="text-2xl font-bold text-gray-900 sm:mb-0 mb-4">
          Your Assignments
        </h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {/* <Link
            to={"/dashboard/assignments/joined"}
            className="w-full sm:w-auto"
          >
            <Button
              variant="ghost"
              className="flex items-center w-full sm:w-fit bg-gray-400 h-full gap-3 rounded-md"
            >
              View Joined Assignments
            </Button>
          </Link> */}
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
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <BaseTable data={assignments} columns={assignmentColumns} />
      )}
    </div>
  );
};

export default Assignment;
