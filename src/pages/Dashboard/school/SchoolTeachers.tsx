import React, { useRef } from "react";
import BaseTable from "../../../components/table/BaseTable";
import { dummyStudents } from "./dummy-data";

import { schoolTeacherColumns } from "./components/column.schoolteachers";
import { Button } from "../../../components/ui/Button";
import AddSchoolTeachersDialog from "./components/AddSchoolTeachersDialog";

const SchoolTeachers = () => {
  const addTeachersDialogRef = useRef<{ openDialog: () => void }>(null);
  const columns = React.useMemo(() => schoolTeacherColumns(), []);

  const handleAddStudentsClick = () => {
    addTeachersDialogRef.current?.openDialog();
  };

  const handleTeachersAdded = () => {
    console.log("New Teachers added, refreshing table data!");
  };
  return (
    <div className="mt-12">
      <h1 className="text-2xl font-bold mb-6">School Teachers</h1>
      <div className="mb-4 flex justify-end">
        <Button
          onClick={handleAddStudentsClick}
          variant={"gradient"}
          className="rounded-md"
        >
          Add Teachers (CSV)
        </Button>
      </div>
      <BaseTable data={dummyStudents} columns={columns} />
      <AddSchoolTeachersDialog
        ref={addTeachersDialogRef}
        onSuccess={handleTeachersAdded}
      />
    </div>
  );
};

export default SchoolTeachers;
