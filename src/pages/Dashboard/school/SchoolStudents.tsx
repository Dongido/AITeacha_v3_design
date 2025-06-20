import React, { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../store";
import BaseTable from "../../../components/table/BaseTable";
import { schoolStudentColumns } from "./components/column.schoolstudents";
import { Button } from "../../../components/ui/Button";
import AddSchoolStudentsDialog from "./components/AddSchoolStudentDialog";

import { getSchoolStudents } from "../../../store/slices/schoolStudentSlice";
import { Skeleton } from "../../../components/ui/Skeleton";
const SchoolStudents = () => {
  const addStudentsDialogRef = useRef<{ openDialog: () => void }>(null);
  const columns = React.useMemo(() => schoolStudentColumns(), []);

  const dispatch: AppDispatch = useDispatch();
  const { students, loadingStudents, error } = useSelector(
    (state: RootState) => state.schoolStudent
  );

  useEffect(() => {
    dispatch(getSchoolStudents());
  }, [dispatch]);

  const handleAddStudentsClick = () => {
    addStudentsDialogRef.current?.openDialog();
  };

  const handleStudentsAdded = () => {
    dispatch(getSchoolStudents());
  };

  const handleDownloadTemplate = () => {
    const csvContent =
      "firstname,lastname,phone,email,gender,age,student_number,disability_details\n" +
      "John,Doe,1234567890,test.john@email.com,Male,12,STU001,Tumor\n" +
      "Jane,Smith,0987654321,test.jane@email.com,Female,14,STU002";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "student_template.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      window.open(
        `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`
      );
    }
  };
  return (
    <div className="mt-12">
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
      <div className="mb-4 flex justify-end gap-2">
        <Button
          onClick={handleDownloadTemplate}
          variant={"outline"}
          className="rounded-md hover:underline"
        >
          Download Example CSV Template
        </Button>
        <Button
          onClick={handleAddStudentsClick}
          variant={"gradient"}
          className="rounded-md"
        >
          Add Students By Uploading CSV
        </Button>
      </div>
      {loadingStudents ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-lg shadow-md border border-gray-200"
            >
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-1" />
              <Skeleton className="h-4 w-2/3 mb-1" />
              <Skeleton className="h-4 w-2/3 mb-1" />
              <Skeleton className="h-4 w-1/3 mt-3" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-lg font-medium text-red-600 mt-8">
          Error loading students: {error}
        </div>
      ) : (
        <BaseTable data={students} columns={columns} />
      )}

      <AddSchoolStudentsDialog
        ref={addStudentsDialogRef}
        onSuccess={handleStudentsAdded}
      />
    </div>
  );
};

export default SchoolStudents;
