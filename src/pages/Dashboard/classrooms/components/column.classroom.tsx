import { Classroom } from "../../../../api/interface";
import { createColumnHelper } from "@tanstack/react-table";
import Header from "../../../../components/table/TableHeaderItem";
import Actions from "../../../../components/table/TableActions";
import DeleteClassroomDialog from "./DeleteClassroomDialogue";
import { StatusType } from "../../../../lib/constants";
import Status from "../../_components/Status";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const classroomColumnHelper = createColumnHelper<Classroom>();

export const classroomColumns = [
  classroomColumnHelper.accessor("classroom_id", {
    header: ({ column }) => <Header title="" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      const classroom = info.row.original;
      const classroomThumbnail = classroom.classroom_thumbnail;
      const classroomName = classroom.classroom_name;

      return classroomThumbnail ? (
        <img
          src={classroomThumbnail}
          alt="Classroom Thumbnail"
          className="w-8 h-8 rounded-full object-cover"
        />
      ) : (
        <div className="flex capitalize items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#7a5ef8] to-[#5c3cbb] text-white font-semibold">
          {classroomName.charAt(0).toUpperCase() || ""}
        </div>
      );
    },
  }),
  classroomColumnHelper.accessor("classroom_name", {
    header: ({ column }) => <Header title="Classroom Name" column={column} />,
    sortingFn: "text",
    cell: (info) => (
      <span className="capitalize whitespace-nowrap">{info.getValue()}</span>
    ),
  }),
  classroomColumnHelper.accessor("classroom_description", {
    header: ({ column }) => <Header title="Description" column={column} />,
    sortingFn: "text",
    cell: (info) => (
      <span className="whitespace-nowrap">{info.getValue()}</span>
    ),
  }),

  classroomColumnHelper.accessor("grade", {
    header: ({ column }) => <Header title="Grade" column={column} />,
    sortingFn: "text",
    cell: (info) => (
      <span className="capitalize whitespace-nowrap">{info.getValue()}</span>
    ),
  }),
  classroomColumnHelper.accessor("status", {
    header: ({ column }) => <Header title="Status" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      const val = info.getValue()?.toString() as StatusType;
      return <Status value={val} />;
    },
  }),
  classroomColumnHelper.accessor("number_of_students_joined", {
    header: ({ column }) => <Header title="Students Joined" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      const studentsJoined = info.getValue();
      return (
        <span className="whitespace-nowrap">
          {studentsJoined !== null ? studentsJoined : "No students joined"}
        </span>
      );
    },
  }),

  classroomColumnHelper.accessor("join_url", {
    header: ({ column }) => <Header title="Actions" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      const navigate = useNavigate();
      const classroomId = info.row.original.classroom_id;

      // Set up a ref to the delete dialog for this row
      const deleteDialogRef = useRef<{ openDialog: () => void }>(null);

      return (
        <div className="flex items-center gap-2">
          <Actions
            viewLink={`/dashboard/classrooms/details/${classroomId}`}
            //  editLink={`/dashboard/classrooms/edit/${classroomId}`}
            deleteFunction={async () => {
              deleteDialogRef.current?.openDialog();
              return Promise.resolve();
            }}
            //  editFunction={async () => console.log("edited")}
          />

          <DeleteClassroomDialog
            ref={deleteDialogRef}
            classroomId={classroomId}
            onSuccess={() => {
              // Refresh or handle success state after deletion
            }}
          />
        </div>
      );
    },
  }),
];
