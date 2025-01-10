import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchStudentReport } from "../../../api/classrooms";
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

const COLORS = {
  Excellent: "#1ac602",
  Good: "#cfc903",
  Fail: "#cf4d03",
};

const StudentReport = () => {
  const { reportId, studentId } = useParams();
  const [studentReport, setStudentReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (!reportId || !studentId) {
        setError("Invalid report or student ID.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const report = await fetchStudentReport(reportId, studentId);
        setStudentReport(report);
      } catch (err: any) {
        setError(err.message || "Failed to fetch the student report.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId, studentId]);

  const getCellColor = (grade: number) => {
    if (grade <= 4) return COLORS.Fail;
    if (grade <= 7.1) return COLORS.Good;
    return COLORS.Excellent;
  };

  const ColoredCell = ({ value }: { value: number }) => (
    <td
      className="p-2 border text-center"
      style={{
        backgroundColor: getCellColor(value),
        color: "black",
        fontWeight: "medium",
      }}
    >
      {value}
    </td>
  );

  if (loading) {
    return <p>Loading student report...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!studentReport) {
    return <p>No report found for this student.</p>;
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
      <div>
        <h2 className="text-2xl font-bold">{classroom.name}</h2>
        <p className="text-gray-700 mt-2">{classroom.description}</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold">
          Performance Metrics for {student.name}
        </h3>
        <p className="text-gray-600">Student ID: {student.id}</p>
      </div>

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
                value: "Metrics",
                position: "bottom",
                offset: 20,
              }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              label={{
                value: "Grade Point",
                angle: -90,
                position: "insideLeft",
                offset: -10,
              }}
              domain={[0, 10]}
              ticks={[0, 2, 4, 6, 8, 10]}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="value">
              {metrics.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getCellColor(entry.value)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto mt-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Metric</th>
              <th className="p-2 border">Grade</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric, index) => (
              <tr key={index}>
                <td className="p-2 border">{metric.name}</td>
                <ColoredCell value={metric.value} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentReport;
