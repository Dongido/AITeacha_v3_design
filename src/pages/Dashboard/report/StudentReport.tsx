import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchStudentReport,
  fetchStudentsInClassroom,
} from "../../../api/classrooms";
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
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    studentId || null
  );
  const [studentReport, setStudentReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      if (!reportId) {
        setError("Invalid classroom ID.");
        return;
      }

      try {
        const studentList = await fetchStudentsInClassroom(Number(reportId));
        setStudents(studentList);
        if (studentList.length > 0 && !selectedStudentId) {
          setSelectedStudentId(studentList[0].id);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch the list of students.");
      }
    };

    fetchStudents();
  }, [reportId, selectedStudentId]);

  useEffect(() => {
    const fetchReport = async () => {
      if (!reportId || !selectedStudentId) return;

      setLoading(true);
      setError(null);

      try {
        const report = await fetchStudentReport(reportId, selectedStudentId);
        setStudentReport(report);
      } catch (err: any) {
        setError(err.message || "Failed to fetch the student report.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId, selectedStudentId]);

  const getCellColor = (grade: number) => {
    if (grade <= 40) return COLORS.Fail;
    if (grade <= 70.1) return COLORS.Good;
    return COLORS.Excellent;
  };

  const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStudentId = e.target.value;
    setSelectedStudentId(newStudentId);
    navigate(`/dashboard/report/${reportId}/${newStudentId}`); // Update the URL when the student is changed
  };

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
        <h2 className="text-2xl font-bold">{classroom?.name}</h2>
        <p className="text-gray-700 mt-2">{classroom?.description}</p>
      </div>

      <div className="space-y-4">
        <label htmlFor="studentSelect" className="text-lg font-semibold">
          Change Student:
        </label>
        <select
          id="studentSelect"
          className="border p-2 rounded"
          value={selectedStudentId || ""}
          onChange={handleStudentChange}
        >
          {students.map((student) => (
            <option key={student.student_id} value={student.student_id}>
              {student.firstname} {student.lastname}
            </option>
          ))}
        </select>
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
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
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
        <table className="w-full border-collapse ">
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
                <td
                  className="p-2 border text-center"
                  style={{
                    backgroundColor: getCellColor(metric.value),
                    color: "black",
                    fontWeight: "medium",
                  }}
                >
                  {metric.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="">
        <h1 className="text-2xl font-bold">Report Summary</h1>
        <p className="bg-white p-4 rounded-md">
          {student.performance.recommended_actions}
        </p>
      </div>
      <div className="">
        <h1 className="text-2xl font-bold">Recommended Actions</h1>
        <p className="bg-white p-4 rounded-md">
          {student.performance.suggested_areas_of_improvement}
        </p>
      </div>
    </div>
  );
};

export default StudentReport;
