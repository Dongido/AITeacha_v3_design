import React from "react";
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
  Excellent: "#90EE90",
  Good: "#FFE5B4",
  Fail: "#FFB6B6",
};

const StudentMetricsDashboard = () => {
  const student = {
    id: "ST001",
    name: "Alex Johnson",
    metrics: [
      { name: "Engagement", value: 8, color: "#FF9966" },
      { name: "Assignment Performance", value: 9, color: "#66B2FF" },
      { name: "Assessment Response", value: 9, color: "#99FF99" },
      { name: "Understanding", value: 8.7, color: "#FF99CC" },
    ],
  };

  const getCellColor = (grade: any) => {
    if (grade <= 4) return COLORS.Fail;
    if (grade <= 8) return COLORS.Good;
    return COLORS.Excellent;
  };

  const ColoredCell = ({ value }: any) => (
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

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-xl font-bold mb-4">
        Performance Metrics for {student.name}
      </h2>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={student.metrics}
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
            <Bar dataKey="value" fill="#8884d8">
              {student.metrics.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto mt-8">
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
            <tr>
              <td className="p-2 border text-center">1</td>
              <td className="p-2 border">{student.name}</td>
              <ColoredCell value={student.metrics[0].value} />
              <ColoredCell value={student.metrics[1].value} />
              <ColoredCell value={student.metrics[2].value} />
              <ColoredCell value={student.metrics[3].value} />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentMetricsDashboard;
