import React, { useState } from "react";
import { FaBrain } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { MdChevronLeft, MdClose } from "react-icons/md";

const TeachersResult = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(false); // ✅ controls when to show result creation types

  const resultDetails = () => navigate("/dashboard/result/resultdetails");

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/pdf",
      ];

      if (!allowedTypes.includes(file.type)) {
        setUploadMessage("❌ Please upload only CSV, Excel, or PDF files.");
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
      setUploadMessage("✅ File uploaded successfully!");
      localStorage.setItem(
        "uploadedResultFile",
        JSON.stringify({
          name: file.name,
          size: file.size,
          type: file.type,
        })
      );
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

      {/* Step 1: Show Create Result intro */}
      {!showOptions && (
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Create Result
          </h1>
          <p className="text-gray-500 mb-6 max-w-md">
            Get started with your preferred method to generate or upload student results.
          </p>
          <button
            onClick={() => setShowOptions(true)}
            className="bg-[#6200EE] hover:bg-[#5200cc] text-white rounded-full px-8 py-3 text-sm font-medium transition"
          >
            Start
          </button>
        </div>
      )}

      {/* Step 2: Show Result Type Options */}
      {showOptions && (
        <>
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
                scores already set on A.I Teacha. No file upload needed; the system
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
                Upload your result file (CSV, Excel, or PDF) or add student scores
                manually. Enjoy full control over your result entry and editing
                process.
              </p>

              {/* Upload & Manual Buttons */}
              <div className="flex flex-row items-center justify-center gap-4 mt-4 w-full">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#6200EE] hover:bg-[#5200cc] text-white rounded-full px-6 py-3 text-sm font-medium transition w-full"
                >
                  Upload File
                </button>

                <button className="text-[#6200EE] hover:bg-[#F3E8FF] rounded-full px-6 py-3 text-sm font-medium transition w-full">
                  Manually Add
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Footer */}
      <div className="mt-16 text-center text-gray-400 text-sm">
        © 2025{" "}
        <a href="#" className="text-[#6200EE] font-medium hover:underline">
          AITeacha
        </a>
        . All Rights Reserved.
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-md rounded-2xl shadow-lg p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              <MdClose size={22} />
            </button>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
              Upload Result File
            </h3>
            <p className="text-sm text-gray-500 text-center mb-5">
              Accepted formats: CSV, Excel, or PDF.
            </p>

            <div className="flex flex-col items-center gap-4">
              <input
                type="file"
                id="resultFile"
                accept=".csv, .xls, .xlsx, .pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="resultFile"
                className="cursor-pointer bg-[#6200EE] hover:bg-[#5200cc] text-white rounded-full px-6 py-3 text-sm font-medium transition w-full text-center"
              >
                Choose File
              </label>

              {selectedFile && (
                <div className="text-center text-gray-700 mt-3 text-sm">
                  <p>
                    <strong>Uploaded:</strong> {selectedFile.name}
                  </p>
                  <p>{(selectedFile.size / 1024).toFixed(2)} KB</p>
                </div>
              )}

              {uploadMessage && (
                <p
                  className={`text-sm mt-2 ${
                    uploadMessage.startsWith("✅")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {uploadMessage}
                </p>
              )}

              <button
                onClick={() => setIsModalOpen(false)}
                className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full px-6 py-2 text-sm font-medium transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeachersResult;
