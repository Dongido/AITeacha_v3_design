import { createColumnHelper } from "@tanstack/react-table";
import Header from "../../../components/table/TableHeaderItem";
import Actions from "../../../components/table/TableActions";
import { useNavigate } from "react-router-dom";

interface Withdrawal {
  id: string;
  amount: number;
  status: "pending" | "completed" | "failed" | "processing";
  created_at: string;
  currency: string;
}

const withdrawalColumnHelper = createColumnHelper<Withdrawal>();

export const withdrawalColumns = [
  withdrawalColumnHelper.accessor("id", {
    header: ({ column }) => <Header title="Withdrawal ID" column={column} />,
    sortingFn: "text",
    cell: (info) => <span>{info.getValue()}</span>,
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

  // withdrawalColumnHelper.accessor("id", {
  //   id: "actions",
  //   header: ({ column }) => <Header title="Actions" column={column} />,
  //   cell: (info) => {
  //     const navigate = useNavigate();
  //     const withdrawalId = info.getValue();

  //     const userDetails = JSON.parse(
  //       localStorage.getItem("ai-teacha-user") || "{}"
  //     );

  //     const getRedirectPath = () => {
  //       if (userDetails.role === 2) {
  //         return `/dashboard/withdrawals/${withdrawalId}`;
  //       } else if (userDetails.role === 3) {
  //         return `/student/withdrawals/${withdrawalId}`;
  //       }
  //       return `/dashboard/withdrawals/${withdrawalId}`;
  //     };

  //     return (
  //       <div className="flex items-center gap-2">
  //         <Actions viewLink={getRedirectPath()} />
  //       </div>
  //     );
  //   },
  // }),
];
