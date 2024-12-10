import React from "react";

const AssignmentDetail = () => {
  return (
    <div>
      <div
        className="bg-[#e5dbff] mt-3 text-black p-4 rounded-md flex justify-center items-center"
        style={{
          background:
            "linear-gradient(143.6deg, rgba(192, 132, 252, 0) 20.79%, rgba(232, 121, 249, 0.26) 40.92%, rgba(204, 171, 238, 0) 70.35%)",
        }}
      >
        <span className="text-center text-xl font-bold">
          Teachers Are Heroes🎉
        </span>
      </div>
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <h1 className="text-4xl font-bold text-gray-900">
          Assignment In Test Mode
        </h1>
      </div>
    </div>
  );
};

export default AssignmentDetail;
