import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { Skeleton } from "../../../components/ui/Skeleton";
import { ArrowLeftIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentsForClassroomThunk } from "../../../store/slices/classroomSlice";
import { RootState, AppDispatch } from "../../../store";
import { Tool } from "../../../api/interface";
import BaseTable from "../../../components/table/BaseTable";
import { studentColumns } from "./components/column.student";
import AddStudentDialog from "./components/AddStudentManually";
const Students = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const students = useSelector((state: RootState) => state.classrooms.students);
  const fetchingStudents = useSelector(
    (state: RootState) => state.classrooms.fetchingStudents
  );

  const addStudentDialogRef = useRef<any>(null);

  const handleOpenAddStudentDialog = (classroomId?: string) => {
    if (addStudentDialogRef.current) {
      addStudentDialogRef.current.openDialog(classroomId);
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchStudentsForClassroomThunk(Number(id)));
    }
  }, [dispatch, id]);

  const handleStudentAddedSuccessfully = () => {
    dispatch(fetchStudentsForClassroomThunk(Number(id)));
  };
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="mt-12">
      <div className="flex items-center mb-4 justify-between flex-col sm:flex-row">
        <Button
          className="flex items-center bg-white rounded-md text-black w-fit h-full gap-3 py-2"
          onClick={handleBack}
        >
          Back
        </Button>

        <div className="mx-auto text-center mt-4 sm:mt-0">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Students
          </h2>
        </div>

        <Button
          onClick={() => handleOpenAddStudentDialog(id)}
          variant={"gradient"}
          className="rounded-md"
        >
          Add Student
        </Button>
      </div>

      {fetchingStudents ? (
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
        <BaseTable data={students} columns={studentColumns(id)} />
      )}

      <AddStudentDialog
        ref={addStudentDialogRef}
        onSuccess={handleStudentAddedSuccessfully}
        initialClassroomId={id}
      />
    </div>
  );
};

export default Students;
