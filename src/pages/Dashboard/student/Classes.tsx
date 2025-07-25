import { useEffect, useRef } from "react";
import { Button } from "../../../components/ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { loadStudentClassrooms } from "../../../store/slices/studentClassroomSlice";
import { RootState, AppDispatch } from "../../../store";
import JoinClassDialog from "./_components/JoinClassDialog";
import { classroomColumns } from "./_components/column.classroom";
import { Skeleton } from "../../../components/ui/Skeleton";
import BaseTable from "../../../components/table/BaseTable";
import { createClassroomSuggestion } from "../../../store/slices/classroomSlice";

const Classes = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { classrooms, loading, error } = useSelector(
    (state: RootState) => state.studentClassrooms
  );
 

  const joinClassDialogRef = useRef<any>(null);

  const openJoinClassDialog = () => {
    if (joinClassDialogRef.current) {
      joinClassDialogRef.current.openDialog();
    }
  };

  useEffect(() => {
    if (classrooms.length === 0) {
      dispatch(loadStudentClassrooms());
    }
  }, [dispatch, classrooms.length]);

  

 

  return (
    <div className="mt-12">
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Class Overview
        </h2>
        <Button
          variant={"gradient"}
          className="rounded-full flex px-6 capitalize"
          onClick={openJoinClassDialog}
        >
          Join a class
        </Button>
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
        <BaseTable data={classrooms} columns={classroomColumns} />
      )}
      <JoinClassDialog ref={joinClassDialogRef} classId={1} />
    </div>
  );
};

export default Classes;
