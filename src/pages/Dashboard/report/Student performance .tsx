import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";

const StudentDashboardPerformance = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const studentsPerPage = 5;

  const students = [
    {
      id: "ST001",
      name: "Alex Johnson",
      performance: {
        assignment_grade: 90,
        engagement_grade: 80,
        assessment_response_grade: 90,
        understanding_grade: 80.7,
      },
    },
    {
      id: "ST002",
      name: "Maria Garcia",
      performance: {
        assignment_grade: 100,
        engagement_grade: 100,
        assessment_response_grade: 90,
        understanding_grade: 90.7,
      },
    },
  ];

  const getCategory = (grade: any) => {
    if (grade <= 40) return "Fail";
    if (grade <= 80) return "Good";
    return "Excellent";
  };

  const categoryData = students.reduce((acc: any, student: any) => {
    const category = getCategory(student.performance.assignment_grade);
    const percentage = (acc[category] || 0) + (1 / students.length) * 100;
    acc[category] = Math.round(percentage * 10) / 10; // Round to 1 decimal place
    return acc;
  }, {});

  const chartData = [
    {
      name: "Excellent",
      percentage: categoryData.Excellent || 0,
      color: "#98FB98",
    },
    { name: "Good", percentage: categoryData.Good || 0, color: "#F0E68C" },
    { name: "Fail", percentage: categoryData.Fail || 0, color: "#FFB6B6" },
  ];

  const getCellColor = (value: any) => {
    if (value <= 40) return "bg-red-100";
    if (value <= 80) return "bg-yellow-100";
    return "bg-green-100";
  };

  const totalPages = Math.ceil(students.length / studentsPerPage);
  const paginatedStudents = students.slice(
    currentPage * studentsPerPage,
    (currentPage + 1) * studentsPerPage
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">
          Student Performance Distribution (%)
        </h2>
        <BarChart width={600} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} />
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend />
          <Bar dataKey="percentage" fill="#8884d8">
            {chartData.map((entry, index) => (
              <Bar key={index} dataKey="percentage" fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Student Performance Details</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">S/N</th>
                <th className="p-3 text-left">Student Name</th>
                <th className="p-3 text-left">Engagement</th>
                <th className="p-3 text-left">Assignment Performance</th>
                <th className="p-3 text-left">Assessment Response</th>
                <th className="p-3 text-left">Understanding</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.map((student, index) => (
                <tr key={student.id} className="border-b">
                  <td className="p-3">
                    {currentPage * studentsPerPage + index + 1}
                  </td>
                  <td className="p-3">{student.name}</td>
                  <td
                    className={`p-3 ${getCellColor(
                      student.performance.engagement_grade
                    )}`}
                  >
                    {student.performance.engagement_grade}
                  </td>
                  <td
                    className={`p-3 ${getCellColor(
                      student.performance.assignment_grade
                    )}`}
                  >
                    {student.performance.assignment_grade}
                  </td>
                  <td
                    className={`p-3 ${getCellColor(
                      student.performance.assessment_response_grade
                    )}`}
                  >
                    {student.performance.assessment_response_grade}
                  </td>
                  <td
                    className={`p-3 ${getCellColor(
                      student.performance.understanding_grade
                    )}`}
                  >
                    {student.performance.understanding_grade}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </button>
          <span>
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
            }
            disabled={currentPage === totalPages - 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 flex items-center"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPerformance;
