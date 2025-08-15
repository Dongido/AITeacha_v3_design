import React, { useRef, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import Header from "../../../../components/table/TableHeaderItem";
import Actions from "../../../../components/table/TableActions";
import BranchDialog from "./BranchDialog";
import { Branch } from "../../../../store/slices/branchSlice";

interface BranchDialogRef {
  openDialog: () => void;
}

const branchColumnHelper = createColumnHelper<Branch>();

export const branchColumns = [
  branchColumnHelper.accessor("id", {
    header: ({ column }) => <Header title="Branch ID" column={column} />,
    sortingFn: "text",
    cell: (info) => (
      <span className="whitespace-nowrap">{info.getValue()}</span>
    ),
  }),

  branchColumnHelper.accessor("location", {
    header: ({ column }) => <Header title="Location" column={column} />,
    sortingFn: "text",
    cell: (info) => (
      <span className="capitalize whitespace-nowrap">{info.getValue()}</span>
    ),
  }),

  branchColumnHelper.accessor("branch_admin_id", {
    header: ({ column }) => <Header title="Branch Admin ID" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      const branchAdminId = info.getValue();
      return (
        <Link
          to={`/dashboard/user-profile/${branchAdminId}`}
          className="text-primary hover:underline whitespace-nowrap"
        >
          {branchAdminId}
        </Link>
      );
    },
  }),

  branchColumnHelper.accessor("id", {
    header: ({ column }) => <Header title="Actions" column={column} />,
    cell: (info) => {
      const [branchToEdit, setBranchToEdit] = useState<Branch | null>(null);
      const branchDialogRef = useRef<BranchDialogRef>(null);

      return (
        <div className="flex items-center gap-2">
          <Actions
            editFunction={async () => {
              setBranchToEdit(info.row.original);
              branchDialogRef.current?.openDialog();
              return Promise.resolve();
            }}
          />
          <BranchDialog
            ref={branchDialogRef}
            branch={branchToEdit}
            onSuccess={() => {
              setBranchToEdit(null);
            }}
          />
        </div>
      );
    },
  }),
];
