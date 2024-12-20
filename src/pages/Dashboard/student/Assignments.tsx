import { useEffect, useRef } from "react";
import { Button } from "../../../components/ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { loadStudentAssignments } from "../../../store/slices/studentAssignmentSlice";
import { RootState, AppDispatch } from "../../../store";
import JoinAssignment from "./_components/joinAssignmentDialog";
import { assignmentColumns } from "./_components/column.assignment";
import { Skeleton } from "../../../components/ui/Skeleton";
import BaseTable from "../../../components/table/BaseTable";

const StudentAssignments = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { assignments, loading, error } = useSelector(
    (state: RootState) => state.studentAssignments
  );
  const joinClassDialogRef = useRef<any>(null);

  useEffect(() => {
    if (assignments.length === 0) {
      dispatch(loadStudentAssignments());
    }
    console.log(assignments);
  }, [dispatch, assignments.length]);

  return (
    <div className="mt-12">
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Assignment Overview
        </h2>
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
      <JoinAssignment ref={joinClassDialogRef} classId={1} />
    </div>
  );
};

export default StudentAssignments;
