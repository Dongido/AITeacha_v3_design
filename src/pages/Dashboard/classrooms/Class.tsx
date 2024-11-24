import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadClassrooms } from "../../../store/slices/classroomSlice";
import { RootState, AppDispatch } from "../../../store";
import { Skeleton } from "../../../components/ui/Skeleton";
import BaseTable from "../../../components/table/BaseTable";
import { classroomColumns } from "./components/column.classroom";
import { Plus, Search, Undo2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { Classroom } from "../../../api/interface";
import { Link } from "react-router-dom";

const Classrooms = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { classrooms, loading, error } = useSelector(
    (state: RootState) => state.classrooms
  );

  useEffect(() => {
    if (classrooms.length === 0) {
      dispatch(loadClassrooms());
    }
  }, [dispatch, classrooms.length]);
  const navigate = useNavigate();

  const handleRowClick = (classroom: Classroom) => {
    // navigate(`/dashboard/classrooms/details/${classroom.classroom_id}`);
  };
  const handleLaunchNewClassroom = () => {
    navigate("/dashboard/classrooms/create");
  };

  return (
    <div className="mt-12 ">
      <div className="flex w-full mt-12 mb-6 items-center justify-between flex-col sm:flex-row">
        <h2 className="text-2xl font-bold text-gray-900 sm:mb-0 mb-4">
          Your Classrooms
        </h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Link
            to={"/dashboard/classrooms/joined"}
            className="w-full sm:w-auto"
          >
            <Button
              variant="ghost"
              className="flex items-center w-full sm:w-fit bg-gray-400 h-full gap-3 rounded-md"
            >
              View Joined Classrooms
            </Button>
          </Link>
          <Button
            variant="gradient"
            className="flex items-center w-full sm:w-fit h-full gap-3 rounded-md"
            onClick={handleLaunchNewClassroom}
          >
            <Plus size={"1.1rem"} />
            Launch New Classroom
          </Button>
        </div>
      </div>

      {loading ? (
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
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <BaseTable
          data={classrooms}
          columns={classroomColumns}
          onRowClick={handleRowClick}
        />
      )}
    </div>
  );
};

export default Classrooms;
