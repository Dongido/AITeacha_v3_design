import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getExamReport } from "../../../api/test";
import { Skeleton } from "../../../components/ui/Skeleton";

interface ReportData {
  student_name: string;
  number_of_question: number;
  total_score: number;
  student_score: number;
  remark: string;
}

const TestReport: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const [reportData, setReportData] = useState<ReportData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (examId) {
          const data = await getExamReport(examId);
          setReportData(data);
        } else {
          setError("Exam ID is missing.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch exam report.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [examId]);

  const downloadCSV = () => {
    if (!reportData) {
      return;
    }

    const headers = Object.keys(reportData[0] || {}).join(",");
    const rows = reportData.map((report) => Object.values(report).join(","));
    const csvContent = [headers, ...rows].join("\n");

    const blob = new Blob([`\ufeff${csvContent}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `exam_report_${examId}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            Exam Report - Exam ID: {examId}
          </h2>
          <div>
            <Skeleton className="h-8 w-32 rounded" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                {[
                  "Student Name",
                  "Total Questions",
                  "Total Score",
                  "Student Score",
                  "Remark",
                ].map((header, index) => (
                  <th key={index} className="p-4 border-b">
                    <Skeleton className="h-4 w-24 rounded" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, rowIndex) => (
                <tr key={rowIndex} className="border-b">
                  {Array.from({ length: 5 }).map((_, colIndex) => (
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
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            Exam Report - Exam ID: {examId}
          </h2>
          {/* No button needed when there's an error */}
        </div>
        <h2 className="text-red-500">Error Loading Exam Report</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!reportData || reportData.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            Exam Report - Exam ID: {examId}
          </h2>
          {/* No button needed when there's no data */}
        </div>
        <h2>Exam Report</h2>
        <p>No report data available for this exam.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Exam Report - Exam ID: {examId}</h2>
        <button
          className="bg-primary text-white font-bold py-2 px-4 rounded focus:outline-none focus-shadow-outline"
          onClick={downloadCSV}
        >
          Download CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-md rounded-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b">Student Name</th>
              <th className="py-2 px-4 border-b">Total Questions</th>
              <th className="py-2 px-4 border-b">Total Score</th>
              <th className="py-2 px-4 border-b">Student Score</th>
              <th className="py-2 px-4 border-b">Remark</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((report, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="py-2 px-4 border-b">{report.student_name}</td>
                <td className="py-2 px-4 border-b text-center">
                  {report.number_of_question}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {report.total_score}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {report.student_score}
                </td>
                <td
                  className={`py-2 px-4 border-b text-center ${
                    report.remark.toLowerCase() === "failed"
                      ? "text-red-500"
                      : ""
                  }`}
                >
                  {report.remark}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded-md shadow-sm">
            <p className="text-blue-600 font-semibold">Total Students:</p>
            <p className="text-lg">{reportData.length}</p>
          </div>
          {reportData.length > 0 && (
            <>
              <div className="bg-green-100 p-4 rounded-md shadow-sm">
                <p className="text-green-600 font-semibold">Average Score:</p>
                <p className="text-lg">
                  {(
                    reportData.reduce(
                      (sum, report) => sum + report.student_score,
                      0
                    ) / reportData.length
                  ).toFixed(2)}
                </p>
              </div>
              <div className="bg-yellow-100 p-4 rounded-md shadow-sm">
                <p className="text-yellow-600 font-semibold">
                  Number of Failed Students:
                </p>
                <p className="text-lg">
                  {
                    reportData.filter(
                      (report) => report.remark.toLowerCase() === "failed"
                    ).length
                  }
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestReport;
