import React, { useState } from "react";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";

const COLORS: Record<"Excellent" | "Good" | "Fail", string> = {
  Excellent: "#c6b6f5", // soft green
  Good: "#FFE5B4", // soft dim yellow
  Fail: "#FFB6B6", // soft red
};

const StudentPerformanceDashboardOne = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  const students = [
    {
      id: "ST001",
      name: "Alex Johnson",
      engagement: 8,
      assignment: 9,
      assessment: 9,
      understanding: 8.7,
    },
   
  ];

  const getCategory = (grade: number): keyof typeof COLORS => {
    if (grade <= 4) return "Fail";
    if (grade <= 8) return "Good";
    return "Excellent";
  };

  // Calculate pie chart data
  const categories = students.reduce(
    (acc: Record<keyof typeof COLORS, number>, student) => {
      const category = getCategory(student.assignment);
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    },
    { Excellent: 0, Good: 0, Fail: 0 }
  );

  const pieData = Object.entries(categories).map(([name, value]) => ({
    name: name as keyof typeof COLORS, // Explicit cast
    value,
  }));

  // Pagination
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );
  const totalPages = Math.ceil(students.length / studentsPerPage);

  const ColoredCell = ({ value }: { value: number }) => (
    <td
      className="p-2 border text-center"
      style={{
        backgroundColor: COLORS[getCategory(value)],
        color: value > 8 ? "black" : "black",
        fontWeight: "medium",
      }}
    >
      {value}
    </td>
  );

  return (
    <div className="p-6 space-y-8">
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">S/N</th>
              <th className="p-2 border">Student Name</th>
              <th className="p-2 border">Engagement</th>
              <th className="p-2 border">Assignment Performance</th>
              <th className="p-2 border">Assessment Response</th>
              <th className="p-2 border">Understanding</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.map((student, index) => (
              <tr key={student.id}>
                <td className="p-2 border text-center">
                  {indexOfFirstStudent + index + 1}
                </td>
                <td className="p-2 border">{student.name}</td>
                <ColoredCell value={student.engagement} />
                <ColoredCell value={student.assignment} />
                <ColoredCell value={student.assessment} />
                <ColoredCell value={student.understanding} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center gap-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 disabled:opacity-50"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="p-2 disabled:opacity-50"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default StudentPerformanceDashboardOne;
