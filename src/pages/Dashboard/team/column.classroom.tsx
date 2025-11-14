


// import React, { useRef } from "react";
// import { createColumnHelper } from "@tanstack/react-table";
// import Header from "../../../components/table/TableHeaderItem";
// import Actions from "../../../components/table/TableActions";
// import DeleteTeacherAssignedClassroomDialog from "./DeleteTeacherClassroomDialog";
// import ActivateDeactivateDialog from "../classrooms/components/ActivateDeactivateDialog";

// export interface Classroom {
//   id: string;
//   classroom_id: string;
//   classroom_name: string;
//   classroom_description: string;
//   grade: string;
//   status: string;
//   number_of_students: number;
//   number_of_students_joined: number;
//   classroom_thumbnail: string | null;
//   user_id: number;
//   email: string;
//   phone: string;
//   firstname: string;
//   lastname: string;
// }

// const classroomColumnHelper = createColumnHelper<Classroom>();

// export const teamClassroomColumns = [
//   classroomColumnHelper.accessor("classroom_id", {
//     header: ({ column }) => <Header title="Classroom ID" column={column} />,
//     sortingFn: "text",
//     cell: (info) => <span>{info.getValue()}</span>,
//   }),

//   classroomColumnHelper.accessor("classroom_name", {
//     header: ({ column }) => <Header title="Classroom Name" column={column} />,
//     sortingFn: "text",
//     cell: (info) => <span>{info.getValue()}</span>,
//   }),

//   classroomColumnHelper.accessor("classroom_description", {
//     header: ({ column }) => <Header title="Description" column={column} />,
//     sortingFn: "text",
//     cell: (info) => {
//       const description = info.getValue();
//       if (typeof description === "string" && description.length > 0) {
//         const words = description.split(" ");
//         const truncatedDescription = words.slice(0, 2).join(" ");
//         return (
//           <span title={description}>
//             {truncatedDescription}
//             {words.length > 2 && "..."}
//           </span>
//         );
//       }
//       return <span></span>;
//     },
//   }),

//   classroomColumnHelper.accessor("grade", {
//     header: ({ column }) => <Header title="Grade" column={column} />,
//     sortingFn: "text",
//     cell: (info) => <span>{info.getValue()}</span>,
//   }),

//   classroomColumnHelper.accessor("status", {
//     header: ({ column }) => <Header title="Status" column={column} />,
//     sortingFn: "text",
//     cell: (info) => (
//       <span
//         className={`px-2 py-1 rounded ${
//           info.getValue() === "active"
//             ? "bg-green-100 text-green-700"
//             : "bg-gray-200 text-gray-700"
//         }`}
//       >
//         {info.getValue()}
//       </span>
//     ),
//   }),

//   classroomColumnHelper.accessor("number_of_students", {
//     header: ({ column }) => <Header title="Total Students" column={column} />,
//     sortingFn: "basic",
//     cell: (info) => <span>{info.getValue()}</span>,
//   }),

//   classroomColumnHelper.accessor("number_of_students_joined", {
//     header: ({ column }) => <Header title="Joined Students" column={column} />,
//     sortingFn: "basic",
//     cell: (info) => <span>{info.getValue()}</span>,
//   }),

//   classroomColumnHelper.accessor("email", {
//     header: ({ column }) => <Header title="Teacher Email" column={column} />,
//     sortingFn: "text",
//     cell: (info) => (
//       <span className="whitespace-nowrap">{info.getValue()}</span>
//     ),
//   }),

//   classroomColumnHelper.accessor("phone", {
//     header: ({ column }) => <Header title="Teacher Phone" column={column} />,
//     sortingFn: "text",
//     cell: (info) => <span>{info.getValue()}</span>,
//   }),

//   classroomColumnHelper.accessor((row) => `${row.firstname} ${row.lastname}`, {
//     id: "full_name",
//     header: ({ column }) => <Header title="Teacher Full Name" column={column} />,
//     sortingFn: "text",
//     cell: (info) => <span>{info.getValue()}</span>,
//   }),

//   classroomColumnHelper.accessor("classroom_thumbnail", {
//     header: ({ column }) => <Header title="Thumbnail" column={column} />,
//     cell: (info) => {
//       const url = info.getValue();
//       return url ? (
//         <img src={url} alt="Classroom" className="w-10 h-10 rounded" />
//       ) : (
//         <span className="text-gray-400">No Image</span>
//       );
//     },
//   }),

//   classroomColumnHelper.accessor("id", {
//     header: ({ column }) => <Header title="Actions" column={column} />,
//     cell: (info) => {
//   const classroom = info.row.original;
//   const classroomId = classroom.classroom_id;
//   const status = classroom.status;
//   const deleteDialogRef = useRef<{ openDialog: () => void }>(null);
//   const activateDialogRef = useRef<{ openDialog: () => void }>(null);

//   return (
//     <div className="flex items-center gap-2">
//       <Actions
//         viewLink={
//           status?.toLowerCase() === "inactive"
//             ? undefined
//             : `/dashboard/classrooms/details/${classroomId}`
//         }
//         deleteFunction={() => {
//           deleteDialogRef.current?.openDialog();
//           return Promise.resolve();
//         }}
//         activateFunction={
//           status?.toLowerCase() === "inactive"
//             ? async () => {
//                 activateDialogRef.current?.openDialog();
//                 return Promise.resolve();
//               }
//             : undefined
//         }
//       />

//       <DeleteTeacherAssignedClassroomDialog
//         ref={deleteDialogRef}
//         classroomId={classroom.id}
//         onSuccess={() => {}}
//       />

//       <ActivateDeactivateDialog
//         ref={activateDialogRef}
//         classroomId={Number(classroomId)}
//         status={status}
//         onSuccess={() => {}}
//       />
//     </div>
//   );
// }

//   }),
// ];

import React, { useRef } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import Header from "../../../components/table/TableHeaderItem";
import Actions from "../../../components/table/TableActions";
import DeleteTeacherAssignedClassroomDialog from "./DeleteTeacherClassroomDialog";
import ActivateDeactivateDialog from "../classrooms/components/ActivateDeactivateDialog";

export interface Classroom {
  id: string;
  classroom_id: string;
  classroom_name: string;
  classroom_description: string;
  grade: string;
  status: string;
  number_of_students: number;
  number_of_students_joined: number;
  classroom_thumbnail: string | null;
  user_id: number;
  email: string;
  phone: string;
  firstname: string;
  lastname: string;
}

const classroomColumnHelper = createColumnHelper<Classroom>();

export const teamClassroomColumns = [
  // Classroom ID (hide on mobile)
  // classroomColumnHelper.accessor("classroom_id", {
  //   header: ({ column }) => (
  //     <Header title="Classroom ID" column={column} className="hidden sm:table-cell" />
  //   ),
  //   sortingFn: "text",
  //   cell: (info) => <span className="hidden sm:table-cell">{info.getValue()}</span>,
  // }),

  // Classroom Name (always visible)
  classroomColumnHelper.accessor("classroom_name", {
    header: ({ column }) => <Header title="Classroom Name" column={column} />,
    sortingFn: "text",
    cell: (info) => <span className="whitespace-nowrap">{info.getValue()}</span>,
  }),

  // Description (hide on mobile)
  // classroomColumnHelper.accessor("classroom_description", {
  //   header: ({ column }) => (
  //     <Header title="Description" column={column} className="hidden sm:table-cell" />
  //   ),
  //   sortingFn: "text",
  //   cell: (info) => {
  //     const description = info.getValue();
  //     if (typeof description === "string" && description.length > 0) {
  //       const words = description.split(" ");
  //       const truncatedDescription = words.slice(0, 2).join(" ");
  //       return (
  //         <span title={description} className="hidden sm:table-cell">
  //           {truncatedDescription}
  //           {words.length > 2 && "..."}
  //         </span>
  //       );
  //     }
  //     return <span className="hidden sm:table-cell"></span>;
  //   },
  // }),

  // Grade (hide on mobile)
  classroomColumnHelper.accessor("grade", {
    header: ({ column }) => (
      <Header title="Grade" column={column} className="hidden sm:table-cell" />
    ),
    sortingFn: "text",
    cell: (info) => <span className="hidden sm:table-cell">{info.getValue()}</span>,
  }),

  // Status (hide on mobile)
  classroomColumnHelper.accessor("status", {
    header: ({ column }) => (
      <Header title="Status" column={column} className="hidden sm:table-cell" />
    ),
    sortingFn: "text",
    cell: (info) => (
      <span
        className={`hidden sm:inline-block px-2 py-1 rounded ${
          info.getValue() === "active"
            ? "bg-green-100 text-green-700"
            : "bg-gray-200 text-gray-700"
        }`}
      >
        {info.getValue()}
      </span>
    ),
  }),

  // Total Students (hide on mobile)
  // classroomColumnHelper.accessor("number_of_students", {
  //   header: ({ column }) => (
  //     <Header title="Total Students" column={column} className="hidden sm:table-cell" />
  //   ),
  //   sortingFn: "basic",
  //   cell: (info) => <span className="hidden sm:table-cell">{info.getValue()}</span>,
  // }),

  // Joined Students (hide on mobile)
  // classroomColumnHelper.accessor("number_of_students_joined", {
  //   header: ({ column }) => (
  //     <Header title="Joined Students" column={column} className="hidden sm:table-cell" />
  //   ),
  //   sortingFn: "basic",
  //   cell: (info) => <span className="hidden sm:table-cell">{info.getValue()}</span>,
  // }),

  // Teacher Email (always visible)
  classroomColumnHelper.accessor("email", {
    header: ({ column }) => <Header title="Teacher Email" column={column} />,
    sortingFn: "text",
    cell: (info) => <span className="whitespace-nowrap">{info.getValue()}</span>,
  }),

  // Teacher Phone (hide on mobile)
  // classroomColumnHelper.accessor("phone", {
  //   header: ({ column }) => (
  //     <Header title="Teacher Phone" column={column} className="hidden sm:table-cell" />
  //   ),
  //   sortingFn: "text",
  //   cell: (info) => <span className="hidden sm:table-cell">{info.getValue()}</span>,
  // }),

  // Teacher Full Name (hide on mobile)
  classroomColumnHelper.accessor((row) => `${row.firstname} ${row.lastname}`, {
    id: "full_name",
    header: ({ column }) => (
      <Header title="Teacher Full Name" column={column} className="hidden sm:table-cell" />
    ),
    sortingFn: "text",
    cell: (info) => <span className="hidden sm:table-cell">{info.getValue()}</span>,
  }),

  // Thumbnail (hide on mobile)
  // classroomColumnHelper.accessor("classroom_thumbnail", {
  //   header: ({ column }) => (
  //     <Header title="Thumbnail" column={column} className="hidden sm:table-cell" />
  //   ),
  //   cell: (info) => {
  //     const url = info.getValue();
  //     return url ? (
  //       <img src={url} alt="Classroom" className="hidden sm:block w-10 h-10 rounded" />
  //     ) : (
  //       <span className="hidden sm:table-cell text-gray-400">No Image</span>
  //     );
  //   },
  // }),

  // Actions (always visible)
  classroomColumnHelper.accessor("id", {
    header: ({ column }) => <Header title="Actions" column={column} />,
    cell: (info) => {
      const classroom = info.row.original;
      const classroomId = classroom.classroom_id;
      const status = classroom.status;
      const deleteDialogRef = useRef<{ openDialog: () => void }>(null);
      const activateDialogRef = useRef<{ openDialog: () => void }>(null);

      return (
        <div className="flex items-center gap-2">
          <Actions
            viewLink={
              status?.toLowerCase() === "inactive"
                ? undefined
                : `/dashboard/classrooms/details/${classroomId}`
            }
            deleteFunction={() => {
              deleteDialogRef.current?.openDialog();
              return Promise.resolve();
            }}
            activateFunction={
              status?.toLowerCase() === "inactive"
                ? async () => {
                    activateDialogRef.current?.openDialog();
                    return Promise.resolve();
                  }
                : undefined
            }
          />

          <DeleteTeacherAssignedClassroomDialog
            ref={deleteDialogRef}
            classroomId={classroom.id}
            onSuccess={() => {}}
          />

          <ActivateDeactivateDialog
            ref={activateDialogRef}
            classroomId={Number(classroomId)}
            status={status}
            onSuccess={() => {}}
          />
        </div>
      );
    },
  }),
];
