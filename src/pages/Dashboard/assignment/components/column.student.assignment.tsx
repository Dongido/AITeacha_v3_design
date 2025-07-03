import { createColumnHelper } from "@tanstack/react-table";
import Header from "../../../../components/table/TableHeaderItem";
import Actions from "../../../../components/table/TableActions";
import { Link } from "react-router-dom";
import { Student } from "../../../../api/interface";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

const studentColumnHelper = createColumnHelper<Student>();

export const studentColumns = (
  classroomId: string | undefined,
  assignmentId: string | undefined
) => [
  studentColumnHelper.accessor("profile_image", {
    header: ({ column }) => <Header title="" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      const profileImage = info.getValue();
      const student = info.row.original;

      return profileImage ? (
        <img
          src={profileImage}
          alt="Student Profile"
          className="w-8 h-8 rounded-full object-cover"
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/400?text=Image+Unavailable";
          }}
        />
      ) : (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#7a5ef8] to-[#5c3cbb] text-white font-semibold">
          {"A"}
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
  studentColumnHelper.accessor("submission_status", {
    header: ({ column }) => (
      <Header title="Submission Status" column={column} />
    ),
    sortingFn: "text",
    cell: (info) => {
      return (
        <div className="rounded-full p-2  w-1/2 border text-black border-gray-400">
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
            viewLink={`/dashboard/assignments/report/${assignmentId}/students/${studentId}`}
          />
        </div>
      );
    },
  }),
];
