import React, { useRef } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import Header from "../../../components/table/TableHeaderItem";
import Actions from "../../../components/table/TableActions";
import DeleteTeamMemberDialog from "./DeleteTeamMemberDialog";

export interface TeamMember {
  user_id: string;
  email: string;
  firstname: string;
  lastname: string;
  team_id: number;
}

const teamColumnHelper = createColumnHelper<TeamMember>();

export const teamColumns = [
  teamColumnHelper.accessor("user_id", {
    header: ({ column }) => <Header title="ID" column={column} />,
    sortingFn: "text",
    cell: (info) => <span>{info.getValue()}</span>,
  }),
  teamColumnHelper.accessor("email", {
    header: ({ column }) => <Header title="Email" column={column} />,
    sortingFn: "text",
    cell: (info) => (
      <span className="whitespace-nowrap">{info.getValue()}</span>
    ),
  }),
  teamColumnHelper.accessor("firstname", {
    header: ({ column }) => <Header title="First Name" column={column} />,
    sortingFn: "text",
    cell: (info) => <span>{info.getValue()}</span>,
  }),
  teamColumnHelper.accessor("lastname", {
    header: ({ column }) => <Header title="Last Name" column={column} />,
    sortingFn: "text",
    cell: (info) => <span>{info.getValue()}</span>,
  }),

  teamColumnHelper.accessor("email", {
    header: ({ column }) => <Header title="Actions" column={column} />,
    cell: (info) => {
      const teamMember = info.row.original;
      const deleteDialogRef = useRef<{ openDialog: () => void }>(null);

      return (
        <div className="flex items-center gap-2">
          <Actions
            ///   viewLink={`/dashboard/team/details/${teamMember.user_id}`}
            deleteFunction={() => {
              deleteDialogRef.current?.openDialog();
              return Promise.resolve();
            }}
          />
          <DeleteTeamMemberDialog
            ref={deleteDialogRef}
            email={teamMember.email}
            onSuccess={() => {
              // Refresh or handle success state after deletion
            }}
          />
        </div>
      );
    },
  }),
];
