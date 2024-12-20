import { Assignment } from "../../../../api/interface";
import { createColumnHelper } from "@tanstack/react-table";
import Header from "../../../../components/table/TableHeaderItem";
import Actions from "../../../../components/table/TableActions";
import { StatusType } from "../../../../lib/constants";
import Status from "../../_components/Status";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const assignmentColumnHelper = createColumnHelper<Assignment>();

export const assignmentColumns = [
  assignmentColumnHelper.accessor("thumbnail", {
    header: ({ column }) => <Header title="" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      const assignment = info.row.original;
      const assignmentThumbnail = assignment.assignment_thumbnail;
      const assignmentName = assignment.assignment_description;

      return assignmentThumbnail ? (
        <img
          src={assignmentThumbnail}
          alt="Assignment Thumbnail"
          className="w-8 h-8 rounded-full object-cover"
        />
      ) : (
        <div className="flex capitalise items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#7a5ef8] to-[#5c3cbb] text-white font-semibold">
          {assignmentName.charAt(0).toUpperCase() || ""}
        </div>
      );
    },
  }),
  assignmentColumnHelper.accessor("classroom_name", {
    header: ({ column }) => <Header title="Classroom Name" column={column} />,
    sortingFn: "text",
    cell: (info) => (
      <span className="capitalize whitespace-nowrap">{info.getValue()}</span>
    ),
  }),
  assignmentColumnHelper.accessor("assignment_description", {
    header: ({ column }) => <Header title="Description" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      const description = info.getValue();
      const truncatedDescription =
        description.length > 20
          ? `${description.slice(0, 20)}...`
          : description;
      return <span className="whitespace-nowrap">{truncatedDescription}</span>;
    },
  }),
  assignmentColumnHelper.accessor("grade", {
    header: ({ column }) => <Header title="Grade" column={column} />,
    sortingFn: "text",
    cell: (info) => (
      <span className="capitalize whitespace-nowrap">{info.getValue()}</span>
    ),
  }),

  assignmentColumnHelper.accessor("submit_url", {
    header: ({ column }) => <Header title="Actions" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      const navigate = useNavigate();
      const assignmentId = info.row.original.assignment_id;

      const deleteDialogRef = useRef<{ openDialog: () => void }>(null);

      return (
        <div className="flex items-center gap-2">
          <Actions
            viewLink={`/student/assignments/details/${assignmentId}`}
            //editLink={`/dashboard/assignments/edit/${assignmentId}`}

            // editFunction={async () => console.log("edited")}
          />
        </div>
      );
    },
  }),
];
