// import { Classroom } from "../../../../api/studentclassroom";
// import { createColumnHelper } from "@tanstack/react-table";
// import Header from "../../../../components/table/TableHeaderItem";
// import Actions from "../../../../components/table/TableActions";
// import { StatusType } from "../../../../lib/constants";
// import Status from "../../_components/Status";
// import { useRef } from "react";
// import { useNavigate } from "react-router-dom";

// const classroomColumnHelper = createColumnHelper<Classroom>();

// export const classroomColumns = [
//   classroomColumnHelper.accessor("classroom_id", {
//     header: ({ column }) => <Header title="" column={column} />,
//     sortingFn: "text",
//     cell: (info) => {
//       const classroom = info.row.original;
//       const classroomThumbnail = classroom.thumbnail;
//       const classroomName = classroom.name;

//       // return classroomThumbnail ? (
//       //   <img
//       //     src={classroomThumbnail}
//       //     alt="Classroom Thumbnail"
//       //     className="w-8 h-8 rounded-full object-cover"
//       //   />
//       // ) : (
//       //   <div className="flex capitalize items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#7a5ef8] to-[#5c3cbb] text-white font-semibold">
//       //     {"C"}
//       //   </div>
//       // );
//     },
//   }),
//   classroomColumnHelper.accessor("name", {
//     header: ({ column }) => <Header title="Classroom Name" column={column} />,
//     sortingFn: "text",
//     cell: (info) => (
//       <span className="capitalize whitespace-nowrap">{info.getValue()}</span>
//     ),
//   }),

//   classroomColumnHelper.accessor("description", {
//     header: ({ column }) => <Header title="Description" column={column} />,
//     sortingFn: "text",
//     cell: (info) => {
//       const description = info.getValue();
//       const truncatedDescription =
//         description && description.length > 50
//           ? `${description.slice(0, 50)}...`
//           : description;

//       return <span className="whitespace-nowrap">{truncatedDescription}</span>;
//     },
//   }),
//   classroomColumnHelper.accessor("grade", {
//     header: ({ column }) => <Header title="Grade" column={column} />,
//     sortingFn: "text",
//     cell: (info) => (
//       <span className="capitalize whitespace-nowrap">{info.getValue()}</span>
//     ),
//   }),
//   classroomColumnHelper.accessor("status", {
//     header: ({ column }) => <Header title="Status" column={column} />,
//     sortingFn: "text",
//     cell: (info) => {
//       const val = info.getValue()?.toString() as StatusType;
//       return <Status value={val} />;
//     },
//   }),

//   classroomColumnHelper.accessor("join_url", {
//     header: ({ column }) => <Header title="Actions" column={column} />,
//     sortingFn: "text",
//     cell: (info) => {
//       const navigate = useNavigate();
//       const classroomId = info.row.original.classroom_id;
//       const userDetails = JSON.parse(
//         localStorage.getItem("ai-teacha-user") || "{}"
//       );

//       const getRedirectPath = () => {
//         if (userDetails.role === 2) {
//           return `/class/classrooms/class-details/${classroomId}`;
//         } else if (userDetails.role === 3 || userDetails.role_id === 3) {
//           return `/class/class-details/${classroomId}`;
//         }
//         return `/class/classrooms/class-details/${classroomId}`;
//       };

//       const getPerformanceRedirectPath = () => {
//         if (userDetails.role === 2) {
//           return `/dashbord/classrooms/performance/${classroomId}`;
//         } else if (userDetails.role === 3 || userDetails.role_id === 3) {
//           return `/student/classroom/performance/${classroomId}`;
//         }
//         return `/dashbord/classrooms/performance/${classroomId}`;
//       };
//       return (
//         <div className="flex items-center gap-2">
//           <Actions
//             viewLink={getRedirectPath()}
//             viewPerformanceLink={getPerformanceRedirectPath()}
//             viewParticipant={`/student/Classparticipant/${classroomId}`}
//           />
//         </div>
//       );
//     },
//   }),
// ];




// import { Classroom } from "../../../../api/studentclassroom";
// import { createColumnHelper } from "@tanstack/react-table";
// import Header from "../../../../components/table/TableHeaderItem";
// import Actions from "../../../../components/table/TableActions";
// import { StatusType } from "../../../../lib/constants";
// import Status from "../../_components/Status";
// import { useRef } from "react";
// import { useNavigate } from "react-router-dom";

// const classroomColumnHelper = createColumnHelper<Classroom>();

// export const classroomColumns = [
//   classroomColumnHelper.accessor("classroom_id", {
//     header: ({ column }) => <Header title="" column={column} />,
//     sortingFn: "text",
//     cell: (info) => {
//       const classroom = info.row.original;
//       const classroomThumbnail = classroom.thumbnail;
//       const classroomName = classroom.name;

    
//     },
//   }),
//   classroomColumnHelper.accessor("name", {
//     header: ({ column }) => <Header title="Classroom Name" column={column} />,
//     sortingFn: "text",
//     cell: (info) => (
//       <span className="capitalize whitespace-nowrap">{info.getValue()}</span>
//     ),
//   }),

//   classroomColumnHelper.accessor("description", {
//     header: ({ column }) => <Header title="Description" column={column} />,
//     sortingFn: "text",
//     cell: (info) => {
//       const description = info.getValue();
//       const truncatedDescription =
//         description && description.length > 50
//           ? `${description.slice(0, 50)}...`
//           : description;

//       return <span className="whitespace-nowrap">{truncatedDescription}</span>;
//     },
//   }),
//   classroomColumnHelper.accessor("grade", {
//     header: ({ column }) => <Header title="Grade" column={column} />,
//     sortingFn: "text",
//     cell: (info) => (
//       <span className="capitalize whitespace-nowrap">{info.getValue()}</span>
//     ),
//   }),
//   classroomColumnHelper.accessor("status", {
//     header: ({ column }) => <Header title="Status" column={column} />,
//     sortingFn: "text",
//     cell: (info) => {
//       const val = info.getValue()?.toString() as StatusType;
//       return <Status value={val} />;
//     },
//   }),

//   classroomColumnHelper.accessor("join_url", {
//     header: ({ column }) => <Header title="Actions" column={column} />,
//     sortingFn: "text",
//     cell: (info) => {
//       const navigate = useNavigate();
//       const classroomId = info.row.original.classroom_id;
//       const userDetails = JSON.parse(
//         localStorage.getItem("ai-teacha-user") || "{}"
//       );

//       const getRedirectPath = () => {
//         if (userDetails.role === 2) {
//           return `/class/classrooms/class-details/${classroomId}
// `;
//         } else if (userDetails.role === 3 || userDetails.role_id === 3) {
//           return `/class/classrooms/class-details/${classroomId}
// `;
//         }
//         return `/class/classrooms/class-details/${classroomId}`;
//       };

//       const getPerformanceRedirectPath = () => {
//         if (userDetails.role === 2) {
//           return `/dashbord/classrooms/performance/${classroomId}`;
//         } else if (userDetails.role === 3 || userDetails.role_id === 3) {
//           return `/student/classroom/performance/${classroomId}`;
//         }
//         return `/dashbord/classrooms/performance/${classroomId}`;
//       };
//       return (
//         <div className="flex items-center gap-2">
//           <Actions
//             viewLink={getRedirectPath()}
//             viewPerformanceLink={getPerformanceRedirectPath()}
//             viewParticipant={`/student/Classparticipant/${classroomId}`}
//           />
//         </div>
//       );
//     },
//   }),
// ];



import { Classroom } from "../../../../api/studentclassroom";
import { createColumnHelper } from "@tanstack/react-table";
import Header from "../../../../components/table/TableHeaderItem";
import Actions from "../../../../components/table/TableActions";
import { StatusType } from "../../../../lib/constants";
import Status from "../../_components/Status";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ✅ Hook for mobile detection
export const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
};

const classroomColumnHelper = createColumnHelper<Classroom>();

export const classroomColumns = [
  // ✅ Thumbnail (hidden on mobile)
  classroomColumnHelper.accessor("classroom_id", {
    header: ({ column }) => (
      <div className="hidden md:table-cell">
        <Header title="" column={column} />
      </div>
    ),
    sortingFn: "text",
    cell: (info) => {
      const classroom = info.row.original;
      const classroomThumbnail = classroom.thumbnail;
      const classroomName = classroom.name;

      return (
        <div className="hidden md:table-cell text-center">
          {classroomThumbnail ? (
            <img
              src={classroomThumbnail}
              alt={classroomName}
              className="w-8 h-8 rounded-full object-cover mx-auto"
            />
          ) : (
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-[#7a5ef8] to-[#5c3cbb] text-white font-semibold mx-auto">
              C
            </div>
          )}
        </div>
      );
    },
  }),

  // ✅ Classroom Name (always visible)
  classroomColumnHelper.accessor("name", {
    header: ({ column }) => <Header title="Classroom Name" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      const classroomName = info.getValue();
      const truncatedCN =
        classroomName.length > 25
          ? `${classroomName.slice(0, 25)}...`
          : classroomName;

      return (
        <span className="capitalize text-primary cursor-pointer w-[140px] md:w-auto truncate">
          {truncatedCN}
        </span>
      );
    },
  }),

  // ✅ Description (hidden on mobile)
  classroomColumnHelper.accessor("description", {
    header: ({ column }) => (
      <div className="hidden md:table-cell">
        <Header title="Description" column={column} />
      </div>
    ),
    sortingFn: "text",
    cell: (info) => {
      const description = info.getValue();
      const truncatedDescription =
        description && description.length > 50
          ? `${description.slice(0, 50)}...`
          : description;

      return (
        <div className="hidden md:table-cell">
          <span className="whitespace-nowrap">{truncatedDescription}</span>
        </div>
      );
    },
  }),

  // ✅ Grade (hidden on mobile)
  classroomColumnHelper.accessor("grade", {
    header: ({ column }) => (
      <div className="hidden md:table-cell">
        <Header title="Grade" column={column} />
      </div>
    ),
    sortingFn: "text",
    cell: (info) => (
      <div className="hidden md:table-cell">
        <span className="capitalize whitespace-nowrap">{info.getValue()}</span>
      </div>
    ),
  }),

  // ✅ Status (hidden on mobile)
  classroomColumnHelper.accessor("status", {
    header: ({ column }) => (
      <div className="hidden md:table-cell">
        <Header title="Status" column={column} />
      </div>
    ),
    sortingFn: "text",
    cell: (info) => {
      const val = info.getValue()?.toString() as StatusType;
      return (
        <div className="hidden md:table-cell">
          <Status value={val} />
        </div>
      );
    },
  }),

  // ✅ Actions (always visible)
  classroomColumnHelper.accessor("join_url", {
    header: ({ column }) => <Header title="Actions" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      const navigate = useNavigate();
      const classroomId = info.row.original.classroom_id;

      const userDetails = JSON.parse(
        localStorage.getItem("ai-teacha-user") || "{}"
      );

      const getRedirectPath = () => {
        if (userDetails.role === 2) {
          return `/class/classrooms/class-details/${classroomId}`;
        } else if (userDetails.role === 3 || userDetails.role_id === 3) {
          return `/class/classrooms/class-details/${classroomId}`;
        }
        return `/class/classrooms/class-details/${classroomId}`;
      };

      const getPerformanceRedirectPath = () => {
        if (userDetails.role === 2) {
          return `/dashbord/classrooms/performance/${classroomId}`;
        } else if (userDetails.role === 3 || userDetails.role_id === 3) {
          return `/student/classroom/performance/${classroomId}`;
        }
        return `/dashbord/classrooms/performance/${classroomId}`;
      };

      return (
        <div className="flex gap-2 ">
          <Actions
            viewLink={getRedirectPath()}
            viewPerformanceLink={getPerformanceRedirectPath()}
            viewParticipant={`/student/Classparticipant/${classroomId}`}
          />
        </div>
      );
    },
  }),
];
