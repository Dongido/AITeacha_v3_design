import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStudentExaminations,
  selectStudentExaminations,
  selectStudentExaminationsLoading,
  selectStudentExaminationsError,
} from "../../../../store/slices/studentTestsSlice";
import { Button } from "../../../../components/ui/Button";
import { Skeleton } from "../../../../components/ui/Skeleton";
import { AlertCircle } from "lucide-react";
import { AppDispatch } from "../../../../store";
import JoinTestDialog from "../components/JoinTestDialog";
import BaseTable from "../../../../components/table/BaseTable";
import { testColumns } from "./_components/column.test";
const StudentExaminationsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const examinations = useSelector(selectStudentExaminations);
  const loading = useSelector(selectStudentExaminationsLoading);
  const error = useSelector(selectStudentExaminationsError);
  const joinTestDialogRef = useRef<{ openDialog: () => void }>(null);
  const fetched = useRef(false);

  useEffect(() => {
    if (!fetched.current) {
      dispatch(fetchStudentExaminations());
      fetched.current = true;
    }
  }, [dispatch]);

  const handleJoinClick = () => {
    joinTestDialogRef.current?.openDialog();
  };

  if (loading === "pending") {
    return (
      <div className="p-4">
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

  return (
    <div className="p-4">
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">My Tests & Examinations</h2>
            <p className="text-gray-700">
              List of examinations assigned to you.
            </p>
          </div>
          <Button
            onClick={handleJoinClick}
            variant={"gray"}
            className="rounded-md"
          >
            Join Test
          </Button>
        </div>
        <BaseTable data={examinations} columns={testColumns} />
      </div>

      <JoinTestDialog ref={joinTestDialogRef} />
    </div>
  );
};

export default StudentExaminationsPage;
