import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useParams and useNavigate
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../components/ui/Dialogue";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/Select";
import { Skeleton } from "../../../components/ui/Skeleton";
import BaseTable from "../../../components/table/BaseTable";
import { meetingColumns } from "./components/column.liveclass";
import { listLiveClassesByUser } from "../../../api/liveclass";
import { Button } from "../../../components/ui/Button";

const LiveClass = () => {
  const { classroomId } = useParams<{ classroomId: string }>();
  const navigate = useNavigate();

  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchLiveClasses = async (id: any) => {
    setLoading(true);
    setError("");
    try {
      if (id) {
        const data = await listLiveClassesByUser(id);
        console.log(data);
        setLiveClasses(data.data);
      } else {
        setError("Classroom ID is missing. Cannot load live classes.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load live classes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveClasses(classroomId);
  }, [classroomId]);

  const handleCreateLiveClass = () => {
    if (classroomId) {
      navigate(`/dashboard/liveclass/create/${classroomId}`);
    } else {
      setError("Cannot create class: Classroom ID is missing from the URL.");
    }
  };

  return (
    <div className="p-6 min-h-screen rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Live Classes for Classroom ID: {classroomId || "N/A"}
      </h1>

      {liveClasses.length === 0 && !loading && !error && (
        <div className="mb-8 flex justify-center">
          <Button
            onClick={handleCreateLiveClass}
            disabled={!classroomId}
            className="text-white font-semibold justify-end py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            variant={"gradient"}
          >
            Create Live Class
          </Button>
        </div>
      )}

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Your Live Classes
      </h2>
      {loading ? (
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
      ) : (
        <>
          <BaseTable data={liveClasses} columns={meetingColumns} />
        </>
      )}
    </div>
  );
};

export default LiveClass;
