import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../../../components/ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { loadStudentAssignments } from "../../../store/slices/studentAssignmentSlice";
import { RootState, AppDispatch } from "../../../store";
import JoinAssignment from "./_components/joinAssignmentDialog";
import AssignmentColumnsComponent from "./_components/column.assignment";
import { Skeleton } from "../../../components/ui/Skeleton";
import BaseTable from "../../../components/table/BaseTable";
import { Link } from "react-router-dom";
import { Plus, Search, Undo2 } from "lucide-react";
import { Input } from "../../../components/ui/Input";

const StudentAssignments = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { assignments, loading, error } = useSelector(
    (state: RootState) => state.studentAssignments
  );
  const joinClassDialogRef = useRef<any>(null);
  const columns = AssignmentColumnsComponent();
  const [searchTerm, setSearchTerm] = useState("");

   const { assignments: TeacherAssignments } = useSelector(
    (state: RootState) => state.assignments
  );

  useEffect(() => {
    if (assignments.length === 0) {
      dispatch(loadStudentAssignments());
    }
  }, [dispatch, assignments.length]);


  const filteredAssignments = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return assignments;

    return assignments.filter((assignment: any) => {
      // Adjust depending on your data structure
      const classroomName =
        assignment?.classroom?.name ||
        assignment?.classroom_name ||
        assignment?.classroomName ||
        ""; 

      return classroomName.toLowerCase().includes(term);
    });
  }, [assignments, searchTerm]);

  return (
    <div className="p-[30px]">
      <div className="">
        <div className="mb-[50px] ">
          <h2 className="text-2xl font-bold text-gray-900 sm:mb-0 my-4">
           Assignment Overview
          </h2>
        </div>

      </div>

      <div className="flex justify-between"></div>
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
        <div className="bg-white p-4 rounded-3xl">
          <div className="flex items-center my-4 justify-between">
            <Input
              type="text"
              placeholder="Search by classroom"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-3 max-w-full w-[300px] bg-gray-100"
            />
          </div>
          <BaseTable data={filteredAssignments} columns={columns} />
        </div>
      )}
      <JoinAssignment ref={joinClassDialogRef} classId={1} />
    </div>
  );
};

export default StudentAssignments;
