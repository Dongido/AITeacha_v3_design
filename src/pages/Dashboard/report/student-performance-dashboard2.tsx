import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  PieChart,
  Pie,
  Cell as PieCell,
} from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useParams } from "react-router-dom";
import { fetchReport } from "../../../api/classrooms";
import { Skeleton } from "../../../components/ui/Skeleton";

const StudentDashboard = () => {
  const { id } = useParams<{ id?: string }>();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  useEffect(() => {
    if (!id) {
      console.error("No reportId provided!");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchReport(id);
        setStudents(data.students);
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const categories = students.reduce(
    (acc, student) => {
      const understandingGrade = student.performance.understanding_grade;
      if (understandingGrade >= 7.1) acc.Excellent++;
      else if (understandingGrade >= 4.1) acc.Good++;
      else acc.Fail++;
      return acc;
    },
    { Excellent: 0, Good: 0, Fail: 0 }
  );

  const engagementCategories = students.reduce(
    (acc, student) => {
      const engagementGrade = student.performance.engagement_grade;
      if (engagementGrade >= 7.1) acc.Excellent++;
      else if (engagementGrade >= 4.1) acc.Good++;
      else acc.Fail++;
      return acc;
    },
    { Excellent: 0, Good: 0, Fail: 0 }
  );

  const assignmentCategories = students.reduce(
    (acc, student) => {
      const assignmentGrade = student.performance.assignment_grade;
      if (assignmentGrade >= 7.1) acc.Excellent++;
      else if (assignmentGrade >= 4.1) acc.Good++;
      else acc.Fail++;
      return acc;
    },
    { Excellent: 0, Good: 0, Fail: 0 }
  );

  const assessmentCategories = students.reduce(
    (acc, student) => {
      const assessmentGrade = student.performance.assessment_response_grade;
      if (assessmentGrade >= 7.1) acc.Excellent++;
      else if (assessmentGrade >= 4.1) acc.Good++;
      else acc.Fail++;
      return acc;
    },
    { Excellent: 0, Good: 0, Fail: 0 }
  );

  const chartData = [
    { name: "Excellent", value: categories.Excellent, color: "#5B8FF9" },
    { name: "Good", value: categories.Good, color: "#9DBDFF" },
    { name: "Fail", value: categories.Fail, color: "#D6E4FF" },
  ];

  const engagementChartData = [
    {
      name: "Excellent",
      value: engagementCategories.Excellent,
      color: "#f87c7c",
    },
    { name: "Good", value: engagementCategories.Good, color: "#FFB6B6" },
    { name: "Fail", value: engagementCategories.Fail, color: "#f7e9e9" },
  ];

  const assignmentChartData = [
    {
      name: "Excellent",
      value: assignmentCategories.Excellent,
      color: "#1ac602",
    },
    { name: "Good", value: assignmentCategories.Good, color: "#cfc903" },
    { name: "Fail", value: assignmentCategories.Fail, color: "#cf4d03" },
  ];

  const assessmentChartData = [
    {
      name: "Excellent",
      value: assessmentCategories.Excellent,
      color: "#1ac602",
    },
    { name: "Good", value: assessmentCategories.Good, color: "#cfc903" },
    { name: "Fail", value: assessmentCategories.Fail, color: "#cf4d03" },
  ];

  const getColorForGrade = (grade: any) => {
    if (grade >= 8.1) return "bg-[#c6b6f5]";
    if (grade >= 4.1) return "bg-[#f7e9e9]";
    return "bg-[#FFB6B6]";
  };

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );
  const totalPages = Math.ceil(students.length / studentsPerPage);

  return (
    <div className="p-6 w-full mx-auto space-y-8">
      <div className="bg-white rounded-lg shadow p-6 flex space-x-8">
        <div className="w-1/2">
          <h2 className="text-2xl font-bold mb-4">
            Student Understanding Categories
          </h2>
          {loading ? (
            <Skeleton className="h-96 w-full" />
          ) : students.length === 0 ? (
            <p className="text-center text-gray-500">
              Oops, no analytics available
            </p>
          ) : (
            <BarChart
              width={600}
              height={300}
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          )}
        </div>

        <div className="w-1/2">
          <h2 className="text-2xl font-bold mb-4">
            Student Engagement Categories
          </h2>
          {loading ? (
            <Skeleton className="h-96 w-full" />
          ) : students.length === 0 ? (
            <p className="text-center text-gray-500">
              Oops, no analytics available
            </p>
          ) : (
            <BarChart
              width={600}
              height={300}
              data={engagementChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value">
                {engagementChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 flex space-x-8">
        <div className="w-1/2">
          <h2 className="text-2xl font-bold mb-4">
            Assignment Grade Distribution
          </h2>
          {loading ? (
            <Skeleton className="h-96 w-full" />
          ) : students.length === 0 ? (
            <p className="text-center text-gray-500">Oops, no data available</p>
          ) : (
            <PieChart width={400} height={400}>
              <Pie
                data={assignmentChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {assignmentChartData.map((entry, index) => (
                  <PieCell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          )}
        </div>

        <div className="w-1/2">
          <h2 className="text-2xl font-bold mb-4">
            Assessment Response Grade Distribution
          </h2>
          {loading ? (
            <Skeleton className="h-96 w-full" />
          ) : students.length === 0 ? (
            <p className="text-center text-gray-500">Oops, no data available</p>
          ) : (
            <PieChart width={400} height={400}>
              <Pie
                data={assessmentChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#82ca9d"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {assessmentChartData.map((entry, index) => (
                  <PieCell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          )}
        </div>
      </div>
      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y  text-center divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
                S/N
              </th>
              <th className="px-6 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student Name
              </th>
              <th className="px-6 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
                Engagement
              </th>
              <th className="px-6 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assignment Performance
              </th>
              <th className="px-6 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assessment Response
              </th>
              <th className="px-6 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
                Understanding
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y text-center divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6}>
                  <Skeleton className="h-96 w-full" />
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-gray-500">
                  Oops, no data available
                </td>
              </tr>
            ) : (
              currentStudents.map((student, index) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {indexOfFirstStudent + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`${getColorForGrade(
                        student.performance.engagement_grade
                      )} px-2 py-1 rounded-full text-xs`}
                    >
                      {student.performance.engagement_grade}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`${getColorForGrade(
                        student.performance.assignment_grade
                      )} px-2 py-1 rounded-full text-xs`}
                    >
                      {student.performance.assignment_grade}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`${getColorForGrade(
                        student.performance.assessment_response_grade
                      )} px-2 py-1 rounded-full text-xs`}
                    >
                      {student.performance.assessment_response_grade}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`${getColorForGrade(
                        student.performance.understanding_grade
                      )} px-2 py-1 rounded-full text-xs`}
                    >
                      {student.performance.understanding_grade}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-gray-500">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="text-gray-500 hover:text-gray-700"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default StudentDashboard;
