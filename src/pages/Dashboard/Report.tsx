import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
import { fetchStudentsInClassroom } from "../../api/classrooms";
const Report = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { classrooms, loading, error } = useSelector(
    (state: any) => state.classrooms
  );

  const [openStudentDialog, setOpenStudentDialog] = useState(false);
  const [openClassroomDialog, setOpenClassroomDialog] = useState(false);
  const [selectedClassroomForStudents, setSelectedClassroomForStudents] =
    useState<string | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [studentError, setStudentError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  useEffect(() => {
    if (openClassroomDialog) {
      dispatch(loadClassrooms());
    }
  }, [dispatch, openClassroomDialog]);
  useEffect(() => {
    if (openStudentDialog) {
      dispatch(loadClassrooms());
    }
  }, [dispatch, openStudentDialog]);

  useEffect(() => {
    if (selectedClassroomForStudents) {
      setLoadingStudents(true);
      setStudentError(null);

      fetchStudentsInClassroom(Number(selectedClassroomForStudents))
        .then((data) => {
          setStudents(data);
          setLoadingStudents(false);
        })
        .catch((error) => {
          setStudentError(error.message);
          setLoadingStudents(false);
        });
    }
  }, [selectedClassroomForStudents]);

  useEffect(() => {
    if (selectedStudent && selectedClassroomForStudents) {
      navigate(
        `/dashboard/report/${selectedClassroomForStudents}/${selectedStudent}`
      );
    }
  }, [selectedStudent, selectedClassroomForStudents, navigate]);

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="flex flex-wrap justify-between items-center w-full h-screen gap-6">
        <div
          className="p-8 rounded-lg shadow-lg flex-1 cursor-pointer lg:max-w-[48%] min-h-[300px] bg-gradient-to-r from-teal-100 via-blue-100 to-indigo-100 hover:scale-105 transition-transform duration-300 flex justify-center items-center"
          onClick={() => setOpenClassroomDialog(true)}
        >
          <h2 className="text-gray-800 text-2xl font-extrabold text-center">
            🏫 Classroom Report
          </h2>
        </div>
        <div
          className="p-8 rounded-lg shadow-lg flex-1 cursor-pointer lg:max-w-[48%] min-h-[300px] bg-gradient-to-r from-green-100 via-yellow-100 to-orange-100 hover:scale-105 transition-transform duration-300 flex justify-center items-center"
          onClick={() => setOpenStudentDialog(true)}
        >
          <h2 className="text-gray-800 text-2xl font-extrabold text-center">
            👨‍🎓 Student Report
          </h2>
        </div>
      </div>
      <Dialog open={openStudentDialog} onOpenChange={setOpenStudentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Student Report</DialogTitle>
            <DialogDescription>
              Select a classroom and then a student to view their report:
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Select onValueChange={setSelectedClassroomForStudents}>
              <SelectTrigger className="h-12">
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

            <Select
              onValueChange={setSelectedStudent}
              disabled={!selectedClassroomForStudents || loadingStudents}
            >
              <SelectTrigger className="h-12">
                <SelectValue
                  placeholder={
                    loadingStudents ? "Loading students..." : "Select a student"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem
                    key={student.student_id}
                    value={student.student_id}
                  >
                    {student.firstname} {student.lastname}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {studentError && (
              <p className="text-red-500">Error: {studentError}</p>
            )}
            {!loadingStudents &&
              selectedClassroomForStudents &&
              students.length === 0 && (
                <p>No students found in this classroom.</p>
              )}
          </div>
        </DialogContent>
      </Dialog>

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
              <Select
                onValueChange={(value) =>
                  navigate(`/dashboard/report/classroom/${value}`)
                }
              >
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
