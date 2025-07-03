import { createColumnHelper } from "@tanstack/react-table";
import Header from "../../../components/table/TableHeaderItem";
import { Button } from "../../../components/ui/Button";
import { Link } from "react-router-dom";
import { useRef } from "react";
import UpdateWithdrawalStatusDialog from "./UpdateWithdrawalStatusDialog";
import { Checkbox } from "../../../components/ui/Checkbox";

interface Withdrawal {
  email: string;
  firstname: string;
  lastname: string;
  id: string;
  amount: number;
  status: "pending" | "completed" | "failed" | "processing" | "paid";
  created_at: string;
  updated_at: string;
  currency: string;
  user_id: string;
  phone: string;
  account_number: number;
  bank_name: string;
  account_name: string;
  bank_branch: string;
  bank_code: string;
  bank_id: string;

  country_code: string;
}

const withdrawalColumnHelper = createColumnHelper<Withdrawal>();

interface AdminWithdrawalColumnsProps {
  onCheckboxChange: (withdrawal: Withdrawal, isChecked: boolean) => void;
  selectedWithdrawalIds: string[];
}

export const getAdminWithdrawalColumns = ({
  onCheckboxChange,
  selectedWithdrawalIds,
}: AdminWithdrawalColumnsProps) => [
  withdrawalColumnHelper.accessor("id", {
    id: "select",
    header: ({ column }) => "",
    cell: (info) => {
      const withdrawal = info.row.original;
      const isChecked = selectedWithdrawalIds.includes(withdrawal.id);
      const isPaid = withdrawal.status === "paid";

      return (
        <Checkbox
          checked={isChecked || isPaid}
          onCheckedChange={(checked) =>
            onCheckboxChange(withdrawal, Boolean(checked))
          }
          disabled={isPaid}
          aria-label={`Select withdrawal ${withdrawal.id}`}
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  }),
  withdrawalColumnHelper.accessor("firstname", {
    header: ({ column }) => <Header title="User" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      const { firstname, lastname, user_id } = info.row.original;
      const avatarLetters = `${firstname ? firstname[0] : ""}${
        lastname ? lastname[0] : ""
      }`.toUpperCase();
      return (
        <Link
          to={`/dashboard/admin/user/${user_id}`}
          className="flex items-center gap-2 text-primary hover:underline"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-semibold flex-shrink-0">
            {avatarLetters || "N/A"}
          </div>
          <span className="whitespace-nowrap capitalize font-semibold text-lg">
            {firstname} {lastname}
          </span>
        </Link>
      );
    },
  }),
  withdrawalColumnHelper.accessor("email", {
    header: ({ column }) => <Header title="User Email" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      return <span>{info.getValue()}</span>;
    },
  }),

  withdrawalColumnHelper.accessor("amount", {
    header: ({ column }) => <Header title="Amount" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      const currency = info.row.original.currency;
      const amount = info.getValue();

      let currencySymbol = "";
      switch (currency) {
        case "NGN":
          currencySymbol = "₦";
          break;
        case "USD":
          currencySymbol = "$";
          break;
        case "GBP":
          currencySymbol = "£";
          break;
        case "JPY":
          currencySymbol = "¥";
          break;
        default:
          currencySymbol = "";
          break;
      }

      return (
        <span>
          {currencySymbol}
          {amount.toLocaleString()}
        </span>
      );
    },
  }),

  withdrawalColumnHelper.accessor("status", {
    header: ({ column }) => <Header title="Status" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      const status = info.getValue();
      let statusClasses =
        "px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap";

      switch (status) {
        case "completed":
          statusClasses += " bg-green-100 text-green-800";
          break;
        case "pending":
          statusClasses += " bg-yellow-100 text-yellow-800";
          break;
        case "processing":
          statusClasses += " bg-blue-100 text-blue-800 animate-pulse";
          break;
        case "failed":
          statusClasses += " bg-red-100 text-red-800";
          break;
        default:
          statusClasses += " bg-gray-100 text-gray-800";
          break;
      }

      return <span className={statusClasses}>{status}</span>;
    },
  }),

  withdrawalColumnHelper.accessor("created_at", {
    header: ({ column }) => <Header title="Created At" column={column} />,
    sortingFn: "datetime",
    cell: (info) => {
      const date = new Date(info.getValue());
      return <span>{date.toLocaleDateString()}</span>;
    },
  }),

  withdrawalColumnHelper.accessor("id", {
    id: "actions",
    header: ({ column }) => <Header title="Actions" column={column} />,
    cell: (info) => {
      const withdrawal = info.row.original;
      const withdrawalId = withdrawal.id;
      const status = withdrawal.status;

      const updateStatusDialogRef = useRef<{ openDialog: () => void }>(null);

      const handleSuccess = () => {
        console.log("Withdrawal status updated, refetching data...");
      };

      return (
        <div className="flex items-center gap-2">
          {status === "pending" || status === "processing" ? (
            <Button
              onClick={() => updateStatusDialogRef.current?.openDialog()}
              variant={"outline"}
              className="text-white px-3 py-1 bg-black rounded-full text-sm transition-colors"
              style={{ color: "white" }}
            >
              Change Status
            </Button>
          ) : (
            <span className="text-gray-500 text-sm">Paid</span>
          )}
          <UpdateWithdrawalStatusDialog
            ref={updateStatusDialogRef}
            withdrawalId={withdrawalId}
            withdrawal={withdrawal}
            currentStatus={status}
            onSuccess={handleSuccess}
          />
        </div>
      );
    },
  }),
];
