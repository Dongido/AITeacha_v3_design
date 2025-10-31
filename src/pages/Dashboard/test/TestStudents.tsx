import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store";
import {
  fetchTestDetails,
  fetchExamStudents,
  selectTestDetails,
  selectTestDetailsLoading,
  selectTestDetailsError,
  selectExamStudents as selectStudents,
  selectExamStudentsLoading as selectStudentsLoading,
  selectExamStudentsError as selectStudentsError,
} from "../../../store/slices/testSlice";
import { Skeleton } from "../../../components/ui/Skeleton";
import { AlertCircle } from "lucide-react";
import BaseTable from "../../../components/table/BaseTable";
import { studentColumns } from "./components/column.student";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
const TestStudentsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const students = useSelector(selectStudents);
  const loading = useSelector(selectStudentsLoading);
  const [searchTerm, setSearchTerm] = useState("");

  const error = useSelector(selectStudentsError);

  useEffect(() => {
    if (id) {
      dispatch(fetchExamStudents(parseInt(id, 10)));
    }
  }, [dispatch, id]);

  const handleBack = () => {
    navigate(-1);
  };


  const filteredStudents = React.useMemo(() => {
  if (!students) return [];
  if (!searchTerm.trim()) return students;

  const term = searchTerm.toLowerCase();

  return students.filter((item: any) => {
    const values = Object.values(item)
      .filter((v) => typeof v === "string")
      .map((v) => v.toLowerCase());
    return values.some((v) => v.includes(term));
  });
}, [students, searchTerm]);


  if (loading) {
    return (
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
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div
          style={{
            backgroundColor: "#f87171",
            color: "white",
            padding: "16px",
            borderRadius: "8px",
            border: "1px solid #b91c1c",
            display: "flex",
            alignItems: "center",
          }}
        >
          <AlertCircle className="h-4 w-4 mr-2" />
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", margin: 0 }}>
            Error
          </h2>
          <p style={{ margin: 0 }}>{error}</p>
        </div>
      </div>
    );
  }

  // if (!students || students.length === 0) {
  //   return <div className="p-4">No students found for this exam.</div>;
  // }

  return (
    <div className="">
      <div>
        <div className="flex mb-4 justify-between flex-col sm:flex-row">
          

          <div className=" mt-4 sm:mt-0">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Students
            </h2>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl">
          <Input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="py-3 my-4 w-full sm:w-[300px] bg-gray-100"
          />
        <BaseTable data={filteredStudents} columns={studentColumns(id)} />
        </div>
      </div>
    </div>
  );
};

export default TestStudentsPage;
