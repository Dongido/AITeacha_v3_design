import { createColumnHelper } from "@tanstack/react-table";
import Header from "../../../../components/table/TableHeaderItem";
import Actions from "../../../../components/table/TableActions";
import { useRef } from "react";
import { useNavigate, Link } from "react-router-dom";

export interface Transcript {
  id: number;
  liveclassroom_id: number;
  content: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const transcriptColumnHelper = createColumnHelper<Transcript>();

export const transcriptColumns = [
  transcriptColumnHelper.accessor("id", {
    header: ({ column }) => <Header title="ID" column={column} />,
    sortingFn: "text",
    cell: (info) => (
      <span className="whitespace-nowrap">{info.getValue()}</span>
    ),
  }),
  transcriptColumnHelper.accessor("content", {
    header: ({ column }) => <Header title="Content" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      let content = info.getValue();

      if (content) {
        content = content.replace(/\*\*/g, "");
        content = content.replace(/#/g, "");
        content = content.replace(/---/g, "");
        content = content.replace(/\[.*?\]/g, "");
      }

      const truncatedContent =
        content && content.length > 100
          ? `${content.slice(0, 100)}...`
          : content || "N/A";

      return <span className="whitespace-nowrap">{truncatedContent}</span>;
    },
  }),
  transcriptColumnHelper.accessor("created_at", {
    header: ({ column }) => <Header title="Created At" column={column} />,
    sortingFn: "datetime",
    cell: (info) => {
      const date = info.getValue();
      return (
        <span className="whitespace-nowrap">
          {date ? new Date(date).toLocaleString() : "N/A"}
        </span>
      );
    },
  }),
  transcriptColumnHelper.accessor("id", {
    header: ({ column }) => <Header title="Actions" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      const transcript = info.row.original;
      const transcriptId = transcript.id;
      const liveClassroomId = transcript.liveclassroom_id;
      // You can define a redirect path for transcript details if needed
      const redirectPath = `/dashboard/transcripts/details/${liveClassroomId}/${transcriptId}`;

      return (
        <div className="flex items-center gap-2">
          <Actions
            viewLink={redirectPath}
            // Add delete or other actions specific to transcripts if required
          />
        </div>
      );
    },
  }),
];
