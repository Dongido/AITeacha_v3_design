import { createColumnHelper } from "@tanstack/react-table";
import Header from "../../../../components/table/TableHeaderItem";
import Actions from "../../../../components/table/TableActions";
import { useNavigate } from "react-router-dom";
import RemoveStudentDialog from "./RemoveStudentDialog";
import { useRef } from "react";

const studentColumnHelper = createColumnHelper<any>();

export const schoolStudentColumns = () => [
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
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/400?text=Image+Unavailable";
          }}
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
    cell: (info) => (
      <span className="capitalize whitespace-nowrap">{info.getValue()}</span>
    ),
  }),

  studentColumnHelper.accessor("email", {
    header: ({ column }) => <Header title="Email" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      return <div className=" w-1/2 text-black">{info.getValue()}</div>;
    },
  }),

  studentColumnHelper.accessor("phone", {
    header: ({ column }) => <Header title="Phone" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      return <div className=" w-1/2 text-black">{info.getValue()}</div>;
    },
  }),
  studentColumnHelper.accessor("student_id", {
    header: ({ column }) => <Header title="Student ID" column={column} />,
    sortingFn: "datetime",
    cell: (info) => {
      const studentId = info.getValue();
      return <span>{studentId ? studentId : "N/A"}</span>;
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
            // viewLink={`/dashboard/school/students/${studentId}`}
            deleteFunction={() => {
              deleteDialogRef.current?.openDialog();
              return Promise.resolve();
            }}
          />

          <RemoveStudentDialog
            ref={deleteDialogRef}
            studentId={studentId}
            studentName={`${student.firstname} ${student.lastname}`}
          />
        </div>
      );
    },
  }),
];
