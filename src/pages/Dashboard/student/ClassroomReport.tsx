import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getOutlineAssessmentReport } from "../../../api/studentassignment";
import { Skeleton } from "../../../components/ui/Skeleton";
interface ReportData {
  assessments: any[];
  overallStatus: string;
}

const OutlineAssessmentReportPage: React.FC = () => {
  const { id: classroomId } = useParams<{ id: string }>();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError(null);
      try {
        if (classroomId) {
          const data = await getOutlineAssessmentReport(classroomId);
          setReportData(data);
        } else {
          setError("Classroom ID not provided in the URL.");
        }
      } catch (err: any) {
        setError(err.message);
        setReportData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [classroomId]);

  if (loading) {
    return <Skeleton />;
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (reportData) {
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">
          Outline Assessment Report for Classroom ID: {classroomId}
        </h2>
        {reportData.assessments && reportData.assessments.length > 0 ? (
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Assessment Details:</h3>
            <ul className="list-disc pl-5">
              {reportData.assessments.map((assessment, index) => (
                <li key={index} className="mb-2">
                  <p className="text-gray-700">
                    <span className="font-semibold">Question:</span>{" "}
                    {assessment.question}
                  </p>
                  <p className="text-gray-600 text-sm">
                    <span className="font-semibold">Status:</span>{" "}
                    {assessment.status}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-700">
            No assessment data found for this outline.
          </p>
        )}
        {reportData.overallStatus && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold">Overall Status:</h3>
            <p className="text-gray-700">{reportData.overallStatus}</p>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default OutlineAssessmentReportPage;
