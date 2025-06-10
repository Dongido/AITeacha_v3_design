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
import {
  loadClassrooms,
  loadTeamClassrooms,
} from "../../store/slices/classroomSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/Select";
import { fetchStudentsInClassroom } from "../../api/classrooms";
import {
  fetchTests,
  selectTests,
  selectTestsLoading,
  selectTestsError,
} from "../../store/slices/testSlice";

const Report = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    classrooms,
    teamClassrooms,
    loading: classroomLoading,
    error: classroomError,
  } = useSelector((state: any) => state.classrooms);
  const tests = useSelector(selectTests);
  const loadingTests = useSelector(selectTestsLoading);
  const errorTests = useSelector(selectTestsError);

  const [openStudentDialog, setOpenStudentDialog] = useState(false);
  const [openClassroomDialog, setOpenClassroomDialog] = useState(false);
  const [openTestDialog, setOpenTestDialog] = useState(false);

  const [classroomType, setClassroomType] = useState("my"); // "my" or "team"
  const [selectedClassroom, setSelectedClassroom] = useState<string | null>(
    null
  );
  const [students, setStudents] = useState<any[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [studentError, setStudentError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [selectedTest, setSelectedTest] = useState<string | null>(null);

  useEffect(() => {
    if (openClassroomDialog || openStudentDialog || openTestDialog) {
      dispatch(loadClassrooms());
      dispatch(loadTeamClassrooms());
      dispatch(fetchTests());
    }
  }, [dispatch, openClassroomDialog, openStudentDialog, openTestDialog]);

  useEffect(() => {
    if (selectedClassroom) {
      setLoadingStudents(true);
      setStudentError(null);

      fetchStudentsInClassroom(Number(selectedClassroom))
        .then((data) => {
          setStudents(data);
          setLoadingStudents(false);
        })
        .catch((error) => {
          setStudentError(error.message);
          setLoadingStudents(false);
        });
    }
  }, [selectedClassroom]);

  useEffect(() => {
    if (selectedStudent && selectedClassroom) {
      navigate(`/dashboard/report/${selectedClassroom}/${selectedStudent}`);
    }
  }, [selectedStudent, selectedClassroom, navigate]);

  useEffect(() => {
    if (selectedTest) {
      navigate(`/dashboard/test-report/${selectedTest}`);
    }
  }, [selectedTest, navigate]);

  const filteredClassrooms =
    classroomType === "my" ? classrooms : teamClassrooms;

  return (
    <div className="mt-4">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="flex flex-col md:flex-row items-center w-full gap-6">
          <div
            className="p-8 rounded-lg shadow-lg w-full md:w-1/3 max-w-md cursor-pointer min-h-[250px] bg-gradient-to-r from-teal-100 via-blue-100 to-indigo-100 hover:scale-105 transition-transform duration-300 flex justify-center items-center"
            onClick={() => setOpenClassroomDialog(true)}
          >
            <h2 className="text-gray-800 text-2xl font-extrabold text-center">
              🏫 Classroom Report
            </h2>
          </div>
          <div
            className="p-8 rounded-lg shadow-lg w-full md:w-1/3 max-w-md cursor-pointer min-h-[250px] bg-gradient-to-r from-green-100 via-yellow-100 to-orange-100 hover:scale-105 transition-transform duration-300 flex justify-center items-center"
            onClick={() => setOpenStudentDialog(true)}
          >
            <h2 className="text-gray-800 text-2xl font-extrabold text-center">
              👨‍🎓 Student Report
            </h2>
          </div>
          <div
            className="p-8 rounded-lg shadow-lg w-full md:w-1/3 max-w-md cursor-pointer min-h-[250px] bg-gradient-to-r from-purple-100 via-pink-100 to-red-100 hover:scale-105 transition-transform duration-300 flex justify-center items-center"
            onClick={() => setOpenTestDialog(true)}
          >
            <h2 className="text-gray-800 text-2xl font-extrabold text-center">
              📝 Test Report
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
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="my"
                    checked={classroomType === "my"}
                    onChange={() => setClassroomType("my")}
                  />
                  <span>My Classroom</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="team"
                    checked={classroomType === "team"}
                    onChange={() => setClassroomType("team")}
                  />
                  <span>Team Classroom</span>
                </label>
              </div>

              {classroomLoading && <p>Loading classrooms...</p>}
              {classroomError && (
                <p className="text-red-500">Error: {classroomError}</p>
              )}
              {!classroomLoading && filteredClassrooms.length > 0 && (
                <Select onValueChange={setSelectedClassroom}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select a classroom" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredClassrooms.map((classroom: any) => (
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

              <Select
                onValueChange={setSelectedStudent}
                disabled={!selectedClassroom || loadingStudents}
              >
                <SelectTrigger className="h-12">
                  <SelectValue
                    placeholder={
                      loadingStudents
                        ? "Loading students..."
                        : "Select a student"
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
                selectedClassroom &&
                students.length === 0 && (
                  <p>No students found in this classroom.</p>
                )}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog
          open={openClassroomDialog}
          onOpenChange={setOpenClassroomDialog}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Classroom Report</DialogTitle>
              <DialogDescription>
                Select a classroom to view its Analytics:
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="my"
                    checked={classroomType === "my"}
                    onChange={() => setClassroomType("my")}
                  />
                  <span>My Classroom</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="team"
                    checked={classroomType === "team"}
                    onChange={() => setClassroomType("team")}
                  />
                  <span>Team Classroom</span>
                </label>
              </div>
              {classroomLoading && <p>Loading classrooms...</p>}
              {classroomError && (
                <p className="text-red-500">Error: {classroomError}</p>
              )}
              {!classroomLoading && filteredClassrooms.length > 0 && (
                <Select
                  onValueChange={(value) =>
                    navigate(`/dashboard/report/classroom/${value}`)
                  }
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select a classroom" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredClassrooms.map((classroom: any) => (
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
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={openTestDialog} onOpenChange={setOpenTestDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Test Report</DialogTitle>
              <DialogDescription>
                Select a test to view its report:
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {loadingTests && <p>Loading tests...</p>}
              {errorTests && (
                <p className="text-red-500">Error: {errorTests}</p>
              )}
              {!loadingTests && tests.length > 0 && (
                <Select onValueChange={setSelectedTest}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select a test" />
                  </SelectTrigger>
                  <SelectContent>
                    {tests.map((test: any) => (
                      <SelectItem
                        key={test.examination_id}
                        value={test.examination_id}
                      >
                        {test.school_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {!loadingTests && tests.length === 0 && (
                <p>No tests available.</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Report;
