import React from "react";
import { FaBrain } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const TeachersResult = () => {
  const navigate = useNavigate();

  const resultDetails = () => {
    {
      navigate("/dashboard/result/resultdetails");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 font-sans">
      {/* Back button */}
      <div className="w-full mb-6">
        <button
          className="text-black text-sm flex items-center gap-1"
          onClick={() => navigate(-1)}
        >
          <MdChevronLeft className="mt-1" />
          Back
        </button>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Choose Result Type
        </h1>
        <p className="text-gray-500">
          Choose how you want to create your result
        </p>
      </div>

      {/* Options */}
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl justify-center">
        {/* A.I Teacha Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center p-8 w-full md:w-1/2">
          <div className="bg-[#CFF7E7] text-[#00A56F] p-4 rounded-full mb-4">
            <FaBrain className="text-2xl" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Create with A.I Teacha
          </h2>
          <p className="text-sm text-[#3B3A3A] mb-6">
            Generate student results automatically using the test and exam
            scores already set on A.I Teacha. No file upload needed, the system
            will compile and calculate everything for you.
          </p>
          <button
            className="bg-[#6200EE] hover:bg-[#5200cc] text-white rounded-full py-3 text-sm font-medium transition w-full"
            onClick={resultDetails}
          >
            Select & Proceed
          </button>
        </div>

        {/* Manual Upload Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center p-8 w-full md:w-1/2">
          <div className="bg-[#E5F0FF] text-[#0075FF] p-4 rounded-full mb-4">
            <FiUpload className="text-2xl" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Manual Result Upload
          </h2>
          <p className="text-sm text-[#3B3A3A] mb-6">
            Upload your result file (CSV or Excel) or add student scores one by
            one manually. Enjoy full control over your result entry and editing
            process.
          </p>
          <div className="flex gap-4 mt-5">
            <button className="bg-[#6200EE] hover:bg-[#5200cc] text-white rounded-full px-6 py-3 text-sm font-medium transition">
              Upload File
            </button>
            <button className="text-[#6200EE] hover:bg-[#F3E8FF] rounded-full px-6 py-2 text-sm font-medium transition">
              Manually Add
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 text-center text-gray-400 text-sm">
        © 2025{" "}
        <a href="#" className="text-[#6200EE] font-medium hover:underline">
          AITeacha
        </a>
        . All Rights Reserved.
      </div>
    </div>
  );
};

export default TeachersResult;
