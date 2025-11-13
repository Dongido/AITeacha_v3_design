// import React, { useState, useEffect } from "react";
// import { createColumnHelper } from "@tanstack/react-table";
// import Header from "../../../../../components/table/TableHeaderItem";
// import Actions from "../../../../../components/table/TableActions";
// import { useNavigate } from "react-router-dom";

// interface Test {
//   id: number;
//   author: string;
//   examination_id: number;
//   school_name: string;
//   description: string | null;
//   subject: string;
//   instruction: string;
//   duration: string;
//   grade: string;
//   thumbnail: string | null;
//   created_at: string;
//   submission_status: string;
//   submit_url?: string;
// }

// const testColumnHelper = createColumnHelper<Test>();

// export const testColumns = [
//   testColumnHelper.accessor("thumbnail", {
//     header: ({ column }) => <Header title="" column={column} />,
//     sortingFn: "text",
//     cell: (info) => {
//       const test = info.row.original;
//       const testThumbnail = test.thumbnail;

//       return testThumbnail ? (
//         <img
//           src={testThumbnail}
//           alt="Test Thumbnail"
//           className="w-8 h-8 rounded-full object-cover"
//         />
//       ) : (
//         <div className="flex capitalize items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#7a5ef8] to-[#5c3cbb] text-white font-semibold">
//           {"T"}
//         </div>
//       );
//     },
//   }),
//   testColumnHelper.accessor("school_name", {
//     header: ({ column }) => <Header title="School Name" column={column} />,
//     sortingFn: "text",
//     cell: (info) => {
//       const description = info.getValue();
//       const truncatedDescription =
//         description?.length > 20
//           ? `${description.slice(0, 20)}...`
//           : description;
//       return <span className="whitespace-nowrap">{info.getValue()}</span>;
//     },
//   }),
//   testColumnHelper.accessor("subject", {
//     header: ({ column }) => <Header title="Subject" column={column} />,
//     sortingFn: "text",
//     cell: (info) => (
//       <span className="capitalize whitespace-nowrap">{info.getValue()}</span>
//     ),
//   }),

//   testColumnHelper.accessor("grade", {
//     header: ({ column }) => <Header title="Grade" column={column} />,
//     sortingFn: "text",
//     cell: (info) => (
//       <span className="capitalize whitespace-nowrap">{info.getValue()}</span>
//     ),
//   }),
//   testColumnHelper.accessor("duration", {
//     header: ({ column }) => <Header title="Duration" column={column} />,
//     sortingFn: "text",
//     cell: (info) => (
//       <span className="capitalize whitespace-nowrap">{info.getValue()}</span>
//     ),
//   }),
//   testColumnHelper.accessor("submit_url", {
//     header: ({ column }) => <Header title="Actions" column={column} />,
//     sortingFn: "text",
//     cell: (info) => {
//       const navigate = useNavigate();
//       const test = info.row.original;
//       const userDetails = JSON.parse(
//         localStorage.getItem("ai-teacha-user") || "{}"
//       );
//       const isStudent = userDetails.role_id === 3 || userDetails.role === 3;

//       return (
//         <div className="flex items-center gap-2">
//           <Actions
//             attemptLink={
//               test.submission_status === "pending"
//                 ? isStudent
//                   ? `/examination/attempt/${test.examination_id}`
//                   : `/examination/attempt/${test.examination_id}`
//                 : undefined
//             }
//             viewLink={
//               test.submission_status === "submitted"
//                 ? isStudent
//                   ? `/student/test/submitted-details/${test.examination_id}`
//                   : `/dashboard/test/submitted-details/${test.examination_id}`
//                 : undefined
//             }
//           />
//         </div>
//       );
//     },
//   }),
// ];




import React, { useRef } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import Header from "../../../../../components/table/TableHeaderItem";
import Actions from "../../../../../components/table/TableActions";
import { useNavigate } from "react-router-dom";

interface Test {
  id: number;
  author: string;
  examination_id: number;
  school_name: string;
  description: string | null;
  subject: string;
  instruction: string;
  duration: string;
  grade: string;
  thumbnail: string | null;
  created_at: string;
  submission_status: string;
  submit_url?: string;
}

const testColumnHelper = createColumnHelper<Test>();

export const testColumns = [
  // 🧠 Thumbnail (hidden on mobile)
  testColumnHelper.accessor("thumbnail", {
    header: ({ column }) => (
      <Header
        title=""
        column={column}
        className="hidden md:table-cell"
      />
    ),
    sortingFn: "text",
    cell: (info) => {
      const test = info.row.original;
      const testThumbnail = test.thumbnail;

      return (
        <div className="hidden md:flex items-center justify-center">
          {testThumbnail ? (
            <img
              src={testThumbnail}
              alt="Test Thumbnail"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#7a5ef8] to-[#5c3cbb] text-white font-semibold">
              T
            </div>
          )}
        </div>
      );
    },
  }),


  // 🧠 Subject (always visible)
  testColumnHelper.accessor("subject", {
    header: ({ column }) => (
      <Header title="Subject" column={column} className="!block" />
    ),
    sortingFn: "text",
    cell: (info) => (
      <span className="capitalize whitespace-nowrap">{info.getValue()}</span>
    ),
  }),

  // 🧠 Grade (always visible)
  testColumnHelper.accessor("grade", {
    header: ({ column }) => (
      <Header title="Grade" column={column} className="!block" />
    ),
    sortingFn: "text",
    cell: (info) => (
      <span className="capitalize whitespace-nowrap">{info.getValue()}</span>
    ),
  }),

  

  // 🧠 School Name (hidden on mobile)
  testColumnHelper.accessor("school_name", {
    header: ({ column }) => (
      <Header
        title="School Name"
        column={column}
        className="hidden md:table-cell"
      />
    ),
    sortingFn: "text",
    cell: (info) => {
      const description = info.getValue();
      const truncatedDescription =
        description?.length > 20
          ? `${description.slice(0, 20)}...`
          : description;
      return (
        <span className="hidden md:table-cell whitespace-nowrap">
          {truncatedDescription}
        </span>
      );
    },
  }),

  // 🧠 Duration (hidden on mobile)
  testColumnHelper.accessor("duration", {
    header: ({ column }) => (
      <Header
        title="Duration"
        column={column}
        className="hidden md:table-cell"
      />
    ),
    sortingFn: "text",
    cell: (info) => (
      <span className="hidden md:table-cell capitalize whitespace-nowrap">
        {info.getValue()}
      </span>
    ),
  }),

  // 🧠 Actions (always visible)
  testColumnHelper.accessor("submit_url", {
    header: ({ column }) => <Header title="Actions" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      const navigate = useNavigate();
      const test = info.row.original;
      const userDetails = JSON.parse(
        localStorage.getItem("ai-teacha-user") || "{}"
      );
      const isStudent = userDetails.role_id === 3 || userDetails.role === 3;

      return (
        <div className="flex items-center gap-2">
          <Actions
            attemptLink={
              test.submission_status === "pending"
                ? isStudent
                  ? `/examination/attempt/${test.examination_id}`
                  : `/examination/attempt/${test.examination_id}`
                : undefined
            }
            viewLink={
              test.submission_status === "submitted"
                ? isStudent
                  ? `/student/test/submitted-details/${test.examination_id}`
                  : `/dashboard/test/submitted-details/${test.examination_id}`
                : undefined
            }
          />
        </div>
      );
    },
  }),
];
