import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchStudentPerformance } from "../../../api/classrooms";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { Skeleton } from "../../../components/ui/Skeleton";
const COLORS = {
  Excellent: "#1ac602",
  Good: "#cfc903",
  Fail: "#cf4d03",
};

const StudentPerformance = () => {
  const { classroomId } = useParams();
  const [studentReport, setStudentReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (!classroomId) {
        setError("Missing classroom ID in the URL.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const report = await fetchStudentPerformance(classroomId);
        setStudentReport(report);
      } catch (err: any) {
        setError(err.message || "Failed to fetch your student report.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [classroomId]);

  const getCellColor = (grade: number) => {
    if (grade <= 40) return COLORS.Fail;
    if (grade <= 70.1) return COLORS.Good;
    return COLORS.Excellent;
  };

  if (loading) {
    return (
      <div className="p-6 space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-md h-24">
          <Skeleton className="h-20" />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md h-24">
          <Skeleton className="h-22" />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md h-96">
          <Skeleton className="h-72" />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md h-48">
          <Skeleton className="h-32" />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md h-32">
          <Skeleton className="h-28" />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md h-32">
          <Skeleton className="h-28" />
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 p-6">{error}</p>;
  }

  if (!studentReport) {
    return (
      <p className="p-6">
        No performance report found for you in this classroom.
      </p>
    );
  }

  const { classroom, student } = studentReport;
  const metrics = [
    { name: "Engagement", value: student.performance.engagement_grade },
    {
      name: "Assignment Performance",
      value: student.performance.assignment_grade,
    },
    {
      name: "Assessment Response",
      value: student.performance.assessment_response_grade,
    },
    { name: "Understanding", value: student.performance.understanding_grade },
  ];

  return (
    <div className="p-6 space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          My Performance in{" "}
          <span className="text-indigo-600">{classroom?.name}</span>
        </h2>
        <p className="text-gray-600">
          This report provides a detailed overview of your progress and
          achievements in the "
          <span className="font-semibold">{classroom?.name}</span>" classroom.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Your Performance Metrics
        </h3>
        <p className="text-gray-600 mb-6">
          Here’s how you're performing across key areas:
        </p>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={metrics}
              margin={{
                top: 20,
                right: 30,
                left: 40,
                bottom: 50,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                label={{
                  value: "Performance Areas",
                  position: "bottom",
                  offset: 20,
                  fill: "#4B5563",
                }}
                angle={-45}
                textAnchor="end"
                height={80}
                stroke="#6B7280"
              />
              <YAxis
                label={{
                  value: "Grade Point (out of 100)",
                  angle: -90,
                  position: "insideLeft",
                  offset: -10,
                  fill: "#4B5563",
                }}
                domain={[0, 100]}
                ticks={[0, 20, 40, 60, 80, 100]}
                stroke="#6B7280"
              />
              <Tooltip cursor={{ fill: "rgba(0,0,0,0.05)" }} />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Bar dataKey="value" name="Your Grade">
                {metrics.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getCellColor(entry.value)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Detailed Breakdown
        </h3>
        <p className="text-gray-600 mb-6">
          A closer look at your grades in each area:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border border-gray-200 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Metric
                </th>
                <th className="p-3 border border-gray-200 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Your Grade
                </th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="p-3 border border-gray-200 text-gray-700">
                    {metric.name}
                  </td>
                  <td
                    className="p-3 border border-gray-200 text-center text-lg font-bold"
                    style={{
                      backgroundColor: getCellColor(metric.value),
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    {metric.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Summary Card */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Summary of Your Report
        </h3>
        <p className="text-gray-700 leading-relaxed">
          {student.performance.performance_summary ||
            "No specific summary available at this time."}
        </p>
      </div>

      {/* Suggested Areas for Improvement Card */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Suggested Areas for Your Improvement
        </h3>
        <p className="text-gray-700 leading-relaxed">
          {student.performance.suggested_areas_of_improvement ||
            "No specific suggestions for improvement available at this time."}
        </p>
      </div>
    </div>
  );
};

export default StudentPerformance;
