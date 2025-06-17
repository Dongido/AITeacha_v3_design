import React, { useRef } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import Header from "../../../components/table/TableHeaderItem";
import Actions from "../../../components/table/TableActions";
import DeleteTeamMemberDialog from "./DeleteTeamMemberDialog";
import EditTeacherRoleDialog, {
  EditTeacherRoleDialogRef,
} from "./EditTeacherRoleDialog";

export interface TeamMember {
  user_id: string;
  email: string;
  firstname: string;
  lastname: string;
  team_id: number;
  member_role: string;
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
  teamColumnHelper.accessor("member_role", {
    header: ({ column }) => <Header title="Role" column={column} />,
    sortingFn: "text",
    cell: (info) => <span className="capitalize">{info.getValue()}</span>,
  }),
  teamColumnHelper.accessor("email", {
    header: ({ column }) => <Header title="Actions" column={column} />,
    cell: (info) => {
      const teamMember = info.row.original;
      const deleteDialogRef = useRef<{ openDialog: () => void }>(null);
      const editRoleDialogRef = useRef<EditTeacherRoleDialogRef>(null);

      return (
        <div className="flex items-center gap-2">
          <Actions
            editFunction={() => {
              editRoleDialogRef.current?.openDialog(
                teamMember.user_id,
                String(teamMember.team_id),
                teamMember.firstname,
                teamMember.lastname,
                teamMember.member_role
              );
              return Promise.resolve();
            }}
            deleteFunction={() => {
              deleteDialogRef.current?.openDialog();
              return Promise.resolve();
            }}
          />
          <DeleteTeamMemberDialog
            ref={deleteDialogRef}
            email={teamMember.email}
            onSuccess={() => {}}
          />
          <EditTeacherRoleDialog
            ref={editRoleDialogRef}
            userId={teamMember.user_id}
            teamId={String(teamMember.team_id)}
            firstname={teamMember.firstname}
            lastname={teamMember.lastname}
            currentTeamRole={teamMember.member_role}
            onSuccess={() => {}}
          />
        </div>
      );
    },
  }),
];
