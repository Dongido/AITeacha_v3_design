import { useEffect, useState } from "react";
import {
  fetchClassroomTools,
  fetchStudentAnalytics,
} from "../../../api/classrooms";
import { Button } from "../../../components/ui/Button";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Undo2 } from "lucide-react";
import { Skeleton } from "../../../components/ui/Skeleton";

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
        <div>
          <div className="mt-4 space-y-3">
            <div>
              <h3 className="font-bold">Time Spent in the Classroom</h3>
              <p>
                {analyticsData.data.includes("Time Spent")
                  ? analyticsData.data.split("\n\n")[0].split(": ")[1]
                  : "No Data Available"}
              </p>
            </div>

            <div>
              <h3 className="font-bold">Questions Answered Correctly</h3>
              <p>
                {analyticsData.data.includes("Number of Questions")
                  ? analyticsData.data.split("\n\n")[1].split(": ")[1]
                  : "No Data Available"}
              </p>
            </div>

            <div>
              <h3 className="font-bold">Understanding of the Concept</h3>
              <p>
                {analyticsData.data.includes("Understanding of the Concept")
                  ? analyticsData.data.split("\n\n")[2].split(": ")[1]
                  : "No Data Available"}
              </p>
            </div>
            <div>
              <h3 className="font-bold">Conceptual Understanding</h3>
              <p>
                {analyticsData.data.includes("Conceptual Understanding")
                  ? analyticsData.data.split("\n\n")[2].split(": ")[1]
                  : "No Data Available"}
              </p>
            </div>

            <div>
              <h3 className="font-bold">Areas for Improvement</h3>
              <p>
                {analyticsData.data.includes("Areas for Improvement")
                  ? analyticsData.data.split("\n\n")[2].split(": ")[1]
                  : "No Data Available"}
              </p>
            </div>
            <div>
              <h3 className="font-bold">Engagement with AI Tools</h3>
              <p>
                {analyticsData.data.includes("Engagement with AI Tools")
                  ? analyticsData.data.split("\n\n")[2].split(": ")[1]
                  : "No Data Available"}
              </p>
            </div>
            <div>
              <h3 className="font-bold">Active Participation</h3>
              <p>
                {analyticsData.data.includes("Active Participation")
                  ? analyticsData.data.split("\n\n")[2].split(": ")[1]
                  : "No Data Available"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p>No analytics available.</p>
      )}
    </div>
  );
};

export default Analytics;
