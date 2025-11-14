import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../store";
import BaseTable from "../../../components/table/BaseTable";
import { schoolStudentColumns } from "./components/column.schoolstudents";
import { Button } from "../../../components/ui/Button";
import AddSingleStudentDialog from "./components/AddSchoolStudentDialog";
import UploadStudentsCSVDialog from "./components/UploadStudentDialog";
import { getSchoolStudents } from "../../../store/slices/schoolStudentSlice";
import { Skeleton } from "../../../components/ui/Skeleton";
import { Input } from "../../../components/ui/Input";
import { IoAddOutline } from "react-icons/io5";

const SchoolStudents = () => {
  const addSingleStudentDialogRef = useRef<{ openDialog: () => void }>(null);
  const uploadStudentsCSVDialogRef = useRef<{ openDialog: () => void }>(null);
   const [searchTerm, setSearchTerm] = useState("");

  const columns = React.useMemo(() => schoolStudentColumns(), []);

  const dispatch: AppDispatch = useDispatch();
  const { students, loadingStudents, error } = useSelector(
    (state: RootState) => state.schoolStudent
  );

  // console.log(students)
 
  console.log("student", students)
  useEffect(() => {
    dispatch(getSchoolStudents());
  }, [dispatch]);

  const handleAddSingleStudentClick = () => {
    addSingleStudentDialogRef.current?.openDialog();
  };

  const handleUploadCSVClick = () => {
    uploadStudentsCSVDialogRef.current?.openDialog();
  };

  const handleStudentsAdded = () => {
    dispatch(getSchoolStudents());
  };

  const handleDownloadTemplate = () => {
    const csvContent =
      "firstname,lastname,phone,email,gender,grade,age,student_number,disability_details\n" +
      "John,Doe,1234567890,test.john@email.com,Male,grade 5,12,STU001,Tumor\n" +
      "Jane,Smith,0987654321,test.jane@email.com,Female,grade 6,14,STU002";

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


  const filteredStudents = students.filter((student : any) => {
    if (!searchTerm.trim()) return true;
    const fullName = `${student.firstname || ""} ${student.lastname || ""}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });


  return (
    <div className="p-4 md:p-[30px]">
     
      <div className="mb-[30px] flex flex-col sm:flex-row sm:justify-between gap-2 md:items-center">
        <div>
          <h1 className="text-xl font-semibold m-0">Students</h1>
          <p className="text-gray-800 text-sm">View all students</p>
        </div>
        <Button
          onClick={handleAddSingleStudentClick}
          variant={"gradient"}
          className="w-full flex gap-3 items-center sm:w-auto rounded-md bg-gray-300"
        >
          <IoAddOutline size={22} />
          Add Single Student
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
        <div className="bg-white rounded-2xl p-4">

        <div className="mb-5 flex flex-col sm:flex-row sm:justify-between gap-2 items-center">
        {/* search student */}
          <div>
            <Input
              type="text"
              placeholder="Search student by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-3 max-w-full bg-gray-100 w-[300px]"
            />
          </div>
          <div>

            <Button
              onClick={handleDownloadTemplate}
              // variant={"outline"}
              className="w-full sm:w-auto "
            >
              Sample Template
            </Button>
            <Button
              onClick={handleUploadCSVClick}
              variant={"dark"}
              className="w-full sm:w-auto bg-black rounded-md"
            >
              Upload CSV
            </Button>
          </div>
      </div>

        
        <BaseTable data={filteredStudents} columns={columns} />
        </div>
      )}

      <AddSingleStudentDialog
        ref={addSingleStudentDialogRef}
        onSuccess={handleStudentsAdded}
      />

      <UploadStudentsCSVDialog
        ref={uploadStudentsCSVDialogRef}
        onSuccess={handleStudentsAdded}
      />
    </div>
  );
};

export default SchoolStudents;
