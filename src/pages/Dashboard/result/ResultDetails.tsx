import React from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const ResultDetails = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center px-4 font-sans">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Results Details
        </h1>
        <p className="text-gray-500">Fill the details of your result</p>
      </div>

      {/* Form Card */}
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-sm border border-gray-100 p-8">
        <form className="flex flex-col gap-6">
          {/* Branch */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Branch
            </label>
            <input
              type="text"
              placeholder="Enter branch name"
              className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6200EE]"
            />
          </div>

          {/* Class */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Class
            </label>
            <input
              type="text"
              placeholder="Enter class (JSS 1)"
              className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6200EE]"
            />
          </div>

          {/* Session */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Session
            </label>
            <input
              type="text"
              placeholder="E.g 2025/2026"
              className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6200EE]"
            />
          </div>

          {/* Term */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Term
            </label>
            <select
              className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#6200EE]"
            >
              <option value="">Select terms</option>
              <option>First Term</option>
              <option>Second Term</option>
              <option>Third Term</option>
            </select>
          </div>

          {/* Brief Description */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Brief Description
            </label>
            <textarea
              rows={4}
              placeholder="Enter a short description about this result"
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#6200EE]"
            ></textarea>
          </div>
        </form>
      </div>

      {/* Navigation Buttons */}
      <div className="w-full max-w-2xl flex justify-between items-center mt-6">
        <button
          onClick={() => navigate(-1)}
          className="text-black text-sm flex items-center gap-1 hover:text-gray-700 transition"
        >
          <MdChevronLeft className="text-lg" />
          Back
        </button>

        <button
          onClick={() => navigate("/dashboard/result/nextstep")}
          className="bg-[#6200EE] hover:bg-[#5200cc] text-white text-sm font-medium rounded-full px-8 py-2 flex items-center gap-1 transition"
        >
          Next <MdChevronRight className="text-lg" />
        </button>
      </div>
    </div>
  );
};

export default ResultDetails;
