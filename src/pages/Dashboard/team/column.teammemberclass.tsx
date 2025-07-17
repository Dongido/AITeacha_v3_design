import React, { useRef } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import Header from "../../../components/table/TableHeaderItem";
import Actions from "../../../components/table/TableActions";
import DeleteTeacherAssignedClassroomDialog from "./DeleteTeacherClassroomDialog";
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

export const teamMemberClassroomColumns = [
  classroomColumnHelper.accessor("classroom_id", {
    header: ({ column }) => <Header title="Classroom ID" column={column} />,
    sortingFn: "text",
    cell: (info) => <span>{info.getValue()}</span>,
  }),
  classroomColumnHelper.accessor("classroom_name", {
    header: ({ column }) => <Header title="Classroom Name" column={column} />,
    sortingFn: "text",
    cell: (info) => <span>{info.getValue()}</span>,
  }),
  classroomColumnHelper.accessor("classroom_description", {
    header: ({ column }) => <Header title="Description" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      const description = info.getValue();
      if (typeof description === "string" && description.length > 0) {
        const words = description.split(" ");
        const truncatedDescription = words.slice(0, 2).join(" ");
        return (
          <span title={description}>
            {truncatedDescription}
            {words.length > 2 && "..."}
          </span>
        );
      }
      return <span></span>;
    },
  }),
  classroomColumnHelper.accessor("grade", {
    header: ({ column }) => <Header title="Grade" column={column} />,
    sortingFn: "text",
    cell: (info) => <span>{info.getValue()}</span>,
  }),
  classroomColumnHelper.accessor("status", {
    header: ({ column }) => <Header title="Status" column={column} />,
    sortingFn: "text",
    cell: (info) => (
      <span
        className={`px-2 py-1 rounded ${
          info.getValue() === "active"
            ? "bg-green-100 text-green-700"
            : "bg-gray-200 text-gray-700"
        }`}
      >
        {info.getValue()}
      </span>
    ),
  }),
  classroomColumnHelper.accessor("number_of_students", {
    header: ({ column }) => <Header title="Total Students" column={column} />,
    sortingFn: "basic",
    cell: (info) => <span>{info.getValue()}</span>,
  }),
  classroomColumnHelper.accessor("number_of_students_joined", {
    header: ({ column }) => <Header title="Joined Students" column={column} />,
    sortingFn: "basic",
    cell: (info) => <span>{info.getValue()}</span>,
  }),

  classroomColumnHelper.accessor("classroom_thumbnail", {
    header: ({ column }) => <Header title="Thumbnail" column={column} />,
    cell: (info) => {
      const url = info.getValue();
      return url ? (
        <img src={url} alt="Classroom" className="w-10 h-10 rounded" />
      ) : (
        <span className="text-gray-400">No Image</span>
      );
    },
  }),
  classroomColumnHelper.accessor("id", {
    header: ({ column }) => <Header title="Actions" column={column} />,
    cell: (info) => {
      const classroom = info.row.original;
      const deleteDialogRef = useRef<{ openDialog: () => void }>(null);

      return (
        <div className="flex items-center gap-2">
          <Actions
            deleteFunction={() => {
              deleteDialogRef.current?.openDialog();
              return Promise.resolve();
            }}
          />
          <DeleteTeacherAssignedClassroomDialog
            ref={deleteDialogRef}
            classroomId={classroom.id}
            onSuccess={() => {
              // Refresh or handle success state after deletion
            }}
          />
        </div>
      );
    },
  }),
];
