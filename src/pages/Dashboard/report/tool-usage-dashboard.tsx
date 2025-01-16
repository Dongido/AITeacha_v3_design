import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { fetchToolsReport } from "../../../api/tools";

const ToolUsageDashboard = () => {
  const [toolsData, setToolsData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchToolsReport();
        setToolsData(data);
      } catch (error: any) {
        setError(error.message || "Failed to fetch the tools report.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const sortedData = [...toolsData].sort((a, b) => a.count - b.count);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(toolsData.length / itemsPerPage);

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return toolsData.slice(startIndex, endIndex);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="">
      {/* Bar Chart */}
      <div className="h-96 my-6 mb-20">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={800}
            height={500}
            data={sortedData}
            layout="vertical"
            margin={{ top: 20, right: 30, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              domain={[0, "dataMax"]}
              ticks={Array.from({ length: 51 }, (_, i) => i * 20)}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={180}
              tick={{ fontSize: 12 }}
            />
            <Tooltip />
            <Bar dataKey="count" fill="#5c3cbb" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-[#7a5ef8] to-[#5c3cbb] text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide">
                {""}
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide">
                Tool Name
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold uppercase tracking-wide">
                Usage Count
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide">
                Last Used
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-50 divide-y divide-gray-200">
            {getCurrentPageData().map((tool, index) => (
              <tr
                key={tool.name}
                className={`hover:bg-indigo-50 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-100"
                }`}
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-700">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-800">
                  {tool.name}
                </td>
                <td className="px-4 py-3 text-sm font-bold text-indigo-600 text-right">
                  {tool.count.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {tool.last_used}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center gap-2">
        <button
          className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="py-2 px-4">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() =>
            setCurrentPage((prev) => Math.min(totalPages, prev + 1))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ToolUsageDashboard;
