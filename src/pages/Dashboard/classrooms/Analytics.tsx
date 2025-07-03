import { useEffect, useState } from "react";
import {
  fetchClassroomTools,
  fetchStudentAnalytics,
} from "../../../api/classrooms";
import { Button } from "../../../components/ui/Button";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Undo2 } from "lucide-react";
import { Skeleton } from "../../../components/ui/Skeleton";
import MarkdownRenderer from "../_components/MarkdownRenderer";
const Analytics = () => {
  const navigate = useNavigate();
  const { id: classroomId, studentId } = useParams<{
    id: string;
    studentId: string;
  }>();

  const [tools, setTools] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const toolsData = await fetchClassroomTools(Number(classroomId));
        setTools(toolsData);
        const analytics = await fetchStudentAnalytics(
          Number(classroomId),
          Number(studentId),
          toolsData
        );
        setAnalyticsData(analytics);
      } catch (error: any) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (classroomId && studentId) loadData();
  }, [classroomId, studentId]);

  return (
    <div className="mt-12">
      <div className="flex items-center mb-4 justify-between flex-col sm:flex-row">
        <Button
          className="flex items-center bg-white rounded-md text-black w-fit h-full gap-3 py-2"
          onClick={() => navigate(-1)}
        >
          <Undo2 size={"1.1rem"} color="black" />
          Back
        </Button>

        <div className="mx-auto text-center mt-4 sm:mt-0">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Student Analytics
          </h2>
        </div>
      </div>
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-64 w-full mx-auto rounded-lg" />
        </div>
      ) : analyticsData ? (
        <div className="bg-white shadow-md rounded-lg p-2 lg:p-6 md:p-4">
          <div className="mt-4 space-y-3">
            <MarkdownRenderer content={analyticsData.data} />
          </div>
        </div>
      ) : (
        <p>No analytics available.</p>
      )}
    </div>
  );
};

export default Analytics;
