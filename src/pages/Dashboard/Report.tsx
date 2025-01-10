import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/Dialogue";
import { useAppDispatch } from "../../store/hooks";
import { loadClassrooms } from "../../store/slices/classroomSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/Select";

const Report = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate(); // Initialize navigate
  const { classrooms, loading, error } = useSelector(
    (state: any) => state.classrooms
  );

  const [openAssignmentDialog, setOpenAssignmentDialog] = useState(false);
  const [openClassroomDialog, setOpenClassroomDialog] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(
    null
  );
  const [selectedClassroom, setSelectedClassroom] = useState<string | null>(
    null
  );

  const assignments = [
    { id: "1", name: "Math Assignment 1" },
    { id: "2", name: "History Essay" },
    { id: "3", name: "Science Project" },
  ];

  useEffect(() => {
    if (openClassroomDialog) {
      dispatch(loadClassrooms());
    }
  }, [dispatch, openClassroomDialog]);

  useEffect(() => {
    if (selectedClassroom) {
      navigate(`/dashboard/report/classroom/${selectedClassroom}`);
    }
  }, [selectedClassroom, navigate]);

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="flex flex-wrap justify-between items-center w-full h-screen gap-6">
        {/* Assignment Report */}
        <div
          className="p-8 rounded-lg shadow-lg flex-1 cursor-pointer lg:max-w-[48%] min-h-[300px] bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 hover:scale-105 transition-transform duration-300 flex justify-center items-center"
          onClick={() => setOpenAssignmentDialog(true)}
        >
          <h2 className="text-gray-800 text-2xl font-extrabold text-center">
            📘 Assignment Report
          </h2>
        </div>

        {/* Classroom Report */}
        <div
          className="p-8 rounded-lg shadow-lg flex-1 cursor-pointer lg:max-w-[48%] min-h-[300px] bg-gradient-to-r from-teal-100 via-blue-100 to-indigo-100 hover:scale-105 transition-transform duration-300 flex justify-center items-center"
          onClick={() => setOpenClassroomDialog(true)}
        >
          <h2 className="text-gray-800 text-2xl font-extrabold text-center">
            🏫 Classroom Report
          </h2>
        </div>
      </div>

      <Dialog
        open={openAssignmentDialog}
        onOpenChange={setOpenAssignmentDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assignment Report</DialogTitle>
            <DialogDescription>
              Select an assignment to view its report:
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Select onValueChange={setSelectedAssignment}>
              <SelectTrigger>
                <SelectValue placeholder="Select an assignment" />
              </SelectTrigger>
              <SelectContent>
                {assignments.map((assignment) => (
                  <SelectItem key={assignment.id} value={assignment.id}>
                    {assignment.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedAssignment && (
              <div className="mt-4 p-4 bg-gray-100 rounded-md shadow-md">
                <p>
                  Selected Assignment:{" "}
                  <span className="font-semibold">
                    {
                      assignments.find(
                        (assignment) => assignment.id === selectedAssignment
                      )?.name
                    }
                  </span>
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Classroom Dialog */}
      <Dialog open={openClassroomDialog} onOpenChange={setOpenClassroomDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Classroom Report</DialogTitle>
            <DialogDescription>
              Select a classroom to view its Analytics:
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {loading && <p>Loading classrooms...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            {!loading && classrooms.length > 0 && (
              <Select onValueChange={setSelectedClassroom}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a classroom" />
                </SelectTrigger>
                <SelectContent>
                  {classrooms.map((classroom: any) => (
                    <SelectItem
                      key={classroom.classroom_id}
                      value={classroom.classroom_id}
                    >
                      {classroom.classroom_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {!loading && classrooms.length === 0 && <p>No classrooms found.</p>}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Report;
