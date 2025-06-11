import React, { useRef } from "react";
import BaseTable from "../../../components/table/BaseTable";
import { schoolStudentColumns } from "./components/column.schoolstudents";
import { Button } from "../../../components/ui/Button";
import { dummyStudents } from "./dummy-data";
import AddSchoolStudentsDialog from "./components/AddSchoolStudentDialog";
const SchoolStudents = () => {
  const addStudentsDialogRef = useRef<{ openDialog: () => void }>(null);
  const columns = React.useMemo(() => schoolStudentColumns(), []);

  const handleAddStudentsClick = () => {
    addStudentsDialogRef.current?.openDialog();
  };

  const handleStudentsAdded = () => {
    console.log("New students added, refreshing table data!");
  };
  const handleDownloadTemplate = () => {
    const csvContent =
      "firstname,lastname,phone,email,student_id\nJohn,Doe,1234567890,john.doe@example.com,STU001\nJane,Smith,0987654321,jane.smith@example.com,STU002";
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
      <h1 className="text-2xl font-bold mb-6">School Students</h1>
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
      <BaseTable data={dummyStudents} columns={columns} />
      <AddSchoolStudentsDialog
        ref={addStudentsDialogRef}
        onSuccess={handleStudentsAdded}
      />
    </div>
  );
};

export default SchoolStudents;
