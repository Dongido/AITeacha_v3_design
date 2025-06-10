import { createColumnHelper } from "@tanstack/react-table";
import Header from "../../../../components/table/TableHeaderItem";
import Actions from "../../../../components/table/TableActions";
import { useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import DeleteMeetingDialog from "./DeleteMeetingDialog";
export interface Meeting {
  id: number;
  user_id: number;
  name: string;
  classroom_id: any;
  title: string | null;
  description: string | null;
  meeting_code: string;
  meeting_url: string;
  meeting_timezone: string | null;
  meeting_location: string | null;
  participant: string | null;
  meeting_type: string;
  created_at: string;
  updated_at: string;
}
const meetingColumnHelper = createColumnHelper<Meeting>();

export const meetingColumns = [
  meetingColumnHelper.accessor("id", {
    header: ({ column }) => <Header title="ID" column={column} />,
    sortingFn: "text",
    cell: (info) => (
      <span className="whitespace-nowrap">{info.getValue()}</span>
    ),
  }),
  meetingColumnHelper.accessor("title", {
    header: ({ column }) => <Header title="Title" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      const meetingId = info.row.original.id;
      const redirectPath = `/dashboard/liveclass/details/${meetingId}`;

      return (
        <Link
          to={redirectPath}
          className="capitalize text-primary whitespace-nowrap"
        >
          {info.getValue() || "N/A"}
        </Link>
      );
    },
  }),
  meetingColumnHelper.accessor("description", {
    header: ({ column }) => <Header title="Description" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      const description = info.getValue();
      const truncatedDescription =
        description && description.length > 50
          ? `${description.slice(0, 50)}...`
          : description || "N/A";

      return <span className="whitespace-nowrap">{truncatedDescription}</span>;
    },
  }),

  meetingColumnHelper.accessor("created_at", {
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
  meetingColumnHelper.accessor("id", {
    header: ({ column }) => <Header title="Actions" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      const navigate = useNavigate();
      const meeting = info.row.original;
      const meetingId = meeting.id;
      const classroomId = meeting.classroom_id;

      const deleteMeetingDialogRef = useRef<{ openDialog: () => void }>(null);
      const activateDeactivateMeetingDialogRef = useRef<{
        openDialog: () => void;
      }>(null);

      return (
        <div className="flex items-center gap-2">
          <Actions
            viewLink={`/dashboard/liveclass/details/${meetingId}`}
            deleteFunction={async () => {
              deleteMeetingDialogRef.current?.openDialog();
              return Promise.resolve();
            }}
            // activateFunction={async () => {
            //   activateDeactivateMeetingDialogRef.current?.openDialog();
            //   return Promise.resolve();
            // }}
          />

          <DeleteMeetingDialog
            ref={deleteMeetingDialogRef}
            classroomId={classroomId}
            meetingId={meetingId}
            onSuccess={() => {}}
          />
        </div>
      );
    },
  }),
];
