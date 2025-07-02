import { createColumnHelper } from "@tanstack/react-table";
import Header from "../../../../components/table/TableHeaderItem";
import Actions from "../../../../components/table/TableActions";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
// import RemoveStudentDialog from "./DeleteStudentDialog";
import { useRef } from "react";

interface StudentData {
  student_id: number;
  status: string;
  last_join: string;
  firstname: string;
  lastname: string;
  profile_image: string;
}

const studentColumnHelper = createColumnHelper<StudentData>();

export const studentColumns = (classroomId: string | undefined) => [
  studentColumnHelper.accessor("profile_image", {
    header: ({ column }) => <Header title="" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      const profileImage = info.getValue();
      const student = info.row.original;
      const displayText = `${student.firstname.charAt(
        0
      )}${student.lastname.charAt(0)}`.toUpperCase();

      return profileImage ? (
        <img
          src={profileImage}
          alt="Student Profile"
          className="w-8 h-8 rounded-full object-cover"
          onError={(e) => {}}
        />
      ) : (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#7a5ef8] to-[#5c3cbb] text-white font-semibold">
          {displayText || "A"}
        </div>
      );
    },
  }),
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
  studentColumnHelper.accessor("status", {
    header: ({ column }) => <Header title="Status" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      return (
        <div className="rounded-md p-2  border text-black border-gray-400">
          {info.getValue()}
        </div>
      );
    },
  }),
  studentColumnHelper.accessor("last_join", {
    header: ({ column }) => <Header title="Last Joined" column={column} />,
    sortingFn: "datetime",
    cell: (info) => {
      const lastJoin = new Date(info.getValue());
      return <span>{lastJoin.toLocaleDateString()}</span>;
    },
  }),
  studentColumnHelper.accessor("student_id", {
    header: ({ column }) => <Header title="Actions" column={column} />,
    cell: (info) => {
      const navigate = useNavigate();
      const studentId = info.getValue();
      const student = info.row.original;

      const deleteDialogRef = useRef<{ openDialog: () => void }>(null);

      return (
        <div className="flex items-center gap-2">
          <Actions
            viewLink={`/dashboard/test/${classroomId}/students/${studentId}`}
            // deleteFunction={() => {
            //   deleteDialogRef.current?.openDialog();
            //   return Promise.resolve();
            // }}
          />
          {/* 
          <RemoveStudentDialog
            ref={deleteDialogRef}
            classroomId={Number(classroomId)}
            studentId={studentId}
            studentName={`${student.firstname} ${student.lastname}`}
          /> */}
        </div>
      );
    },
  }),
];
