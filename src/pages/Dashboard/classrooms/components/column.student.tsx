// import { createColumnHelper } from "@tanstack/react-table";
// import Header from "../../../../components/table/TableHeaderItem";
// import Actions from "../../../../components/table/TableActions";
// import { StatusType } from "../../../../lib/constants";
// import Status from "../../_components/Status";
// import { Student } from "../../../../api/interface";
// import { useNavigate } from "react-router-dom";
// import RemoveStudentDialog from "./DeleteStudentDialog";
// import { useRef } from "react";
// import { Link } from "react-router-dom";
// const studentColumnHelper = createColumnHelper<Student>();

// export const studentColumns = (classroomId: string | undefined) => [
//   studentColumnHelper.accessor("profile_image", {
//     header: ({ column }) => <Header title="" column={column} />,
//     sortingFn: "text",
//     cell: (info) => {
//       const profileImage =  info.getValue();
//       const student = info.row.original;
//       const displayText = `${student.firstname.charAt(
//         0
//       )}${student.lastname.charAt(0)}`.toUpperCase();

//       return profileImage ? (
//         <img
//           src={`https://${profileImage}`}
//           alt="Student Profile"
//           className="w-8 h-8 rounded-full object-cover"
//           // onError={(e) => {
//           //   e.currentTarget.src =
//           //     "https://via.placeholder.com/400?text=Image+Unavailable";
//           // }}
//         />
//       ) : (
//         <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#7a5ef8] to-[#5c3cbb] text-white font-semibold">
//           {displayText || "A"}
//         </div>
//       );
//     },
//   }),
//   studentColumnHelper.accessor((row) => `${row.firstname} ${row.lastname}`, {
//     id: "full_name",
//     header: ({ column }) => <Header title="Full Name" column={column} />,
//     sortingFn: "text",
//     cell: (info) => {
//       const studentId = info.row.original.student_id;
//       return (
//         <Link
//           to={`/dashboard/user-profile/${studentId}`}
//           className="text-primary hover:underline capitalize whitespace-nowrap"
//         >
//           {info.getValue()}
//         </Link>
//       );
//     },
//   }),
//   studentColumnHelper.accessor("student_id", {
//     header: ({ column }) => <Header title="Analytics" column={column} />,
//     sortingFn: "text",
//     cell: (info) => {
//       return (
//         <Link
//           to={`/dashboard/classrooms/${classroomId}/students/${info.getValue()}`}
//           className="text-blue-600 hover:underline"
//         >
//           View Analytics
//         </Link>
//       );
//     },
//   }),
//   studentColumnHelper.accessor("status", {
//     header: ({ column }) => <Header title="Status" column={column} />,
//     sortingFn: "text",
//     cell: (info) => {
//       return (
//         <div className="rounded-full p-2 w-1/2 border text-black border-gray-400">
//           {info.getValue()}
//         </div>
//       );
//     },
//   }),
//   studentColumnHelper.accessor("last_join", {
//     header: ({ column }) => <Header title="Last Joined" column={column} />,
//     sortingFn: "datetime",
//     cell: (info) => {
//       const lastJoin = new Date(info.getValue());
//       return <span>{lastJoin.toLocaleDateString()}</span>;
//     },
//   }),
//   studentColumnHelper.accessor("student_id", {
//     header: ({ column }) => <Header title="Actions" column={column} />,
//     cell: (info) => {
//       const navigate = useNavigate();
//       const studentId = info.getValue();
//       const student = info.row.original;

//       const deleteDialogRef = useRef<{ openDialog: () => void }>(null);

//       return (
//         <div className="flex items-center gap-2">
//           <Actions
//             viewLink={`/dashboard/classrooms/${classroomId}/students/${studentId}`}
//             deleteFunction={() => {
//               deleteDialogRef.current?.openDialog();
//               return Promise.resolve();
//             }}
//           />

//           <RemoveStudentDialog
//             ref={deleteDialogRef}
//             classroomId={Number(classroomId)}
//             studentId={studentId}
//             studentName={`${student.firstname} ${student.lastname}`}
//           />
//         </div>
//       );
//     },
//   }),
// ];



import { createColumnHelper } from "@tanstack/react-table";
import Header from "../../../../components/table/TableHeaderItem";
import Actions from "../../../../components/table/TableActions";
import RemoveStudentDialog from "./DeleteStudentDialog";
import { Student } from "../../../../api/interface";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const studentColumnHelper = createColumnHelper<Student>();

export const studentColumns = (classroomId: string | undefined) => [
  // 🧑‍🎓 Profile Image (hidden on mobile)
  studentColumnHelper.accessor("profile_image", {
    header: ({ column }) => (
      <div className="hidden md:table-cell">
        <Header title="" column={column} />
      </div>
    ),
    sortingFn: "text",
    cell: (info) => {
      const profileImage = info.getValue();
      const student = info.row.original;
      const displayText = `${student.firstname.charAt(0)}${student.lastname.charAt(0)}`.toUpperCase();

      return (
        <div className="hidden md:table-cell text-center">
          {profileImage ? (
            <img
              src={`https://${profileImage}`}
              alt="Student Profile"
              className="w-8 h-8 rounded-full object-cover mx-auto"
            />
          ) : (
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#7a5ef8] to-[#5c3cbb] text-white font-semibold mx-auto">
              {displayText || "A"}
            </div>
          )}
        </div>
      );
    },
  }),

  // 🏷 Full Name (always visible)
  studentColumnHelper.accessor((row) => `${row.firstname} ${row.lastname}`, {
    id: "full_name",
    header: ({ column }) => <Header title="Full Name" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      const studentId = info.row.original.student_id;
      return (
        <Link
          to={`/dashboard/user-profile/${studentId}`}
          className="text-primary hover:underline capitalize whitespace-nowrap"
        >
          {info.getValue()}
        </Link>
      );
    },
  }),

  // 📊 Status (hidden on mobile)
  studentColumnHelper.accessor("status", {
    header: ({ column }) => (
      <div className="hidden md:table-cell">
        <Header title="Status" column={column} />
      </div>
    ),
    sortingFn: "text",
    cell: (info) => (
      <div className="hidden md:table-cell">
        <div className="rounded-full p-2 w-1/2 border text-black border-gray-400 text-center mx-auto">
          {info.getValue()}
        </div>
      </div>
    ),
  }),

  // ⏰ Last Joined (hidden on mobile)
  studentColumnHelper.accessor("last_join", {
    header: ({ column }) => (
      <div className="hidden md:table-cell">
        <Header title="Last Joined" column={column} />
      </div>
    ),
    sortingFn: "datetime",
    cell: (info) => {
      const dateValue = info.getValue();
      if (!dateValue) return <div className="hidden md:table-cell">N/A</div>;

      const lastJoin = new Date(dateValue);
      return (
        <div className="hidden md:table-cell">
          <span>{lastJoin.toLocaleDateString()}</span>
        </div>
      );
    },
  }),

  // 📈 Analytics (hidden on mobile)
  studentColumnHelper.accessor("student_id", {
    header: ({ column }) => (
      <div className="hidden md:table-cell">
        <Header title="Analytics" column={column} />
      </div>
    ),
    sortingFn: "text",
    cell: (info) => (
      <div className="hidden md:table-cell text-center">
        <Link
          to={`/dashboard/classrooms/${classroomId}/students/${info.getValue()}`}
          className="text-blue-600 hover:underline"
        >
          View Analytics
        </Link>
      </div>
    ),
  }),

  // ⚙️ Actions (always visible)
  studentColumnHelper.accessor("student_id", {
    header: ({ column }) => <Header title="Actions" column={column} />,
    cell: (info) => {
      const navigate = useNavigate();
      const studentId = info.getValue();
      const student = info.row.original;
      const deleteDialogRef = useRef<{ openDialog: () => void }>(null);

      return (
        <div className="flex items-center justify-center gap-2">
          <Actions
            viewLink={`/dashboard/classrooms/${classroomId}/students/${studentId}`}
            deleteFunction={() => {
              deleteDialogRef.current?.openDialog();
              return Promise.resolve();
            }}
          />

          <RemoveStudentDialog
            ref={deleteDialogRef}
            classroomId={Number(classroomId)}
            studentId={studentId}
            studentName={`${student.firstname} ${student.lastname}`}
          />
        </div>
      );
    },
  }),
];
