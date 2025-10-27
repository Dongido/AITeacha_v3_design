import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { Skeleton } from "../../../components/ui/Skeleton";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentsForAssignmentThunk } from "../../../store/slices/assignmentSlice";
import { RootState, AppDispatch } from "../../../store";
import BaseTable from "../../../components/table/BaseTable";
import { studentColumns } from "./components/column.student.assignment";
import { IoChevronBackOutline, IoTrashOutline } from "react-icons/io5";

import DeleteAssignmentDialog from "./components/DeleteAssignmentDialog";
import { DeleteIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "../../../components/ui/Input";
const AssignmentStudents = () => {
  const navigate = useNavigate();
  const deleteDialogRef = useRef<any>(null);
  const { id, assignmentId } = useParams<{
    id: string;
    assignmentId: string;
  }>();

  const openDeleteDialog = () => {
    deleteDialogRef.current?.openDialog();
  };

  const dispatch = useDispatch<AppDispatch>();

  const [searchTerm, setSearchTerm] = useState("");
  const students = useSelector((state: RootState) => state.classrooms.students);
  const fetchingStudents = useSelector(
    (state: RootState) => state.classrooms.fetchingStudents
  );

  const assignment = useSelector(
    (state: RootState) => state.assignments.selectedAssignment
  );
  const fetchingAssignment = useSelector(
    (state: RootState) => state.assignments.fetchingAssignment
  );


  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return students;
    return students.filter((student: any) => {
      const fullName = `${student.firstname || ""} ${student.lastname || ""}`.toLowerCase();
      return (
        fullName.includes(searchTerm.toLowerCase()) ||
        (student.email || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [students, searchTerm]);




  useEffect(() => {
    if (id && assignmentId) {
      dispatch(
        fetchStudentsForAssignmentThunk({
          classroomId: Number(id),
          assignmentId: Number(assignmentId),
        })
      );
    }
  }, [dispatch, id, assignmentId]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="p-[30px]">
      <div className="flex w-full  mb-6 items-center justify-between">
        <button
          className="flex items-center  text-black w-fit h-full mr-2 gap-3 py-2"
          onClick={() => navigate(-1)}
        >
          <IoChevronBackOutline size={"1.1rem"} color="black" />
          Back
        </button>
        <div className="flex gap-2"></div>
      </div>


      {fetchingAssignment ? (
              <div className="border rounded-3xl">
                <div className="bg-[#EFE6FD] text-white p-8 rounded-lg overflow-hidden">
                  <Skeleton className="h-6 w-1/4 mb-4" />
                  <Skeleton className="h-10 w-32 mt-4" />
                </div>
              </div>
            ) : (

              <div className="bg-[#EFE6FD]  p-8 rounded-lg overflow-hidden">
            <h2 className="text-2xl font-extrabold mt-2">
              {assignment?.assignment_name}
            </h2>
            <p className="text-lg mt-1">{assignment?.assignment_description}</p>
            <div className="flex items-center justify-between">
              <p className="px-2 text-green-600 rounded-full font-semibold border border-green-600 text-sm bg-green-50">
                Status: {assignment?.status}
              </p>
              <Button
                // variant={"destructive"}
                onClick={openDeleteDialog}
                className="flex items-center bg-transparent border rounded-full border-red-700 text-red-700 w-fit h-full gap-3 py-2"
              >
                <IoTrashOutline size={"1.1rem"} color="red" />
                Delete
              </Button>
            </div>

          </div>

            )}

      
        <div className="border rounded-3-xl">
          

          <div className="flex border-b-2 my-[30px] border-gray-300">
            
              <button 
              onClick={() => navigate(-1)}
               className="flex items-center w-full sm:w-fit font-semibold h-full gap-3 py-2 px-4 transition">
                Questions
              </button>{" "}
            

            <Link
              to={`/dashboard/assignments/${assignment?.classroom_id}/students/${assignment?.assignment_id}`}
              className="w-full sm:w-auto"
            >
              <button
               className="flex items-center w-full sm:w-fit font-semibold h-full gap-3 py-2 px-4 transition border-purple-900 hover:bg-gray-200  text-purple-900 border-b-2"
               >
                Students
              </button>
            </Link>
          </div>


{
  fetchingStudents ? (
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
    <div className="bg-white rounded-3xl p-4 mt-[30px]">
            <div className="flex items-center justify-between mb-4">
              <Input
                type="text"
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-3 max-w-full w-[300px] bg-gray-100"
              />
            </div>
            
            <BaseTable
              data={filteredStudents}
              columns={studentColumns(id, assignmentId)}
            />
          </div>
  )
}
          
        </div>
    
      <DeleteAssignmentDialog
        ref={deleteDialogRef}
        assignmentId={Number(id)}
        onSuccess={() => navigate("/dashboard/assignments")}
      />
    </div>
  );
};

export default AssignmentStudents;
