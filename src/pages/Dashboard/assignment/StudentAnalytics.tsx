import { useEffect, useState } from "react";
import { fetchStudentAssignmentAnalytics } from "../../../api/assignment";
import { Button } from "../../../components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import { Undo2 } from "lucide-react";
import { Skeleton } from "../../../components/ui/Skeleton";
import ReactMarkdown from "react-markdown";

const StudentAnalytics = () => {
  const navigate = useNavigate();
  const { id: assignmentId, studentId } = useParams<{
    id: string;
    studentId: string;
  }>();

  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Define the structure of the parsed data object
  type ParsedData = {
    timeSpent: string;
    questionsAnswered: string;
    understanding: string;
    areasForImprovement: string;
    engagementWithAI: string;
    activeParticipation: string;
    conceptualUnderstanding: string;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const analytics = await fetchStudentAssignmentAnalytics(
          Number(assignmentId),
          Number(studentId)
        );
        // Parse the analytics data
        const parsedData: ParsedData = {
          timeSpent: "No Data Available",
          questionsAnswered: "No Data Available",
          understanding: "No Data Available",
          areasForImprovement: "No Data Available",
          engagementWithAI: "No Data Available",
          activeParticipation: "No Data Available",
          conceptualUnderstanding: "No Data Available",
        };

        // Example: Assuming `analytics.data` is a string with section titles and values
        const data = analytics.data;
        console.log(data);
        const sections = {
          timeSpent: "Time Spent",
          questionsAnswered: "Questions Answered",
          understanding: "Understanding of the Concept",
          areasForImprovement: "Areas for Improvement",
          engagementWithAI: "Engagement with AI Tools",
          activeParticipation: "Active Participation",
          conceptualUnderstanding: "Conceptual Understanding",
        };

        // Parse data into a structured object
        Object.keys(sections).forEach((key) => {
          // Type the key as one of the specific keys of the ParsedData type
          const sectionTitle = sections[key as keyof typeof sections];
          const regex = new RegExp(
            `(?<=\\b${sectionTitle}\\b)[^\\n]*:\\s?([^\\n]+)`,
            "g"
          );
          const match = regex.exec(data);

          // Update parsedData with the matched value
          if (key in parsedData) {
            parsedData[key as keyof ParsedData] = match
              ? match[1]
              : "No Data Available";
          }
        });

        setAnalyticsData(analytics.data);
      } catch (error: any) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (assignmentId && studentId) loadData();
  }, [assignmentId, studentId]);

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
          <div className="mt-4">
            <ReactMarkdown className="w-full p-4 border border-gray-300 bg-white rounded-md resize-none markdown overflow-auto max-h-96">
              {analyticsData}
            </ReactMarkdown>
          </div>
        </div>
      ) : (
        <p>No analytics available.</p>
      )}
    </div>
  );
};

export default StudentAnalytics;
