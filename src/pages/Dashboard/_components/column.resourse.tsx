import { Resource } from "../../../api/tools";
import { createColumnHelper } from "@tanstack/react-table";
import Header from "../../../components/table/TableHeaderItem";
import Actions from "../../../components/table/TableActions";
import { useNavigate } from "react-router-dom";

const resourceColumnHelper = createColumnHelper<Resource>();

export const resourceColumns = [
  resourceColumnHelper.accessor("id", {
    header: ({ column }) => <Header title="Resource ID" column={column} />,
    sortingFn: "text",
    cell: (info) => <span>{info.getValue()}</span>,
  }),

  resourceColumnHelper.accessor("category", {
    header: ({ column }) => <Header title="Category" column={column} />,
    sortingFn: "text",
    cell: (info) => (
      <span className="capitalize whitespace-nowrap">{info.getValue()}</span>
    ),
  }),

  resourceColumnHelper.accessor("prompt", {
    header: ({ column }) => <Header title="Title" column={column} />,
    sortingFn: "text",
    cell: (info) => (
      <span className="capitalize whitespace-nowrap">{info.getValue()}</span>
    ),
  }),

  //   resourceColumnHelper.accessor("created_at", {
  //     header: ({ column }) => <Header title="Created At" column={column} />,
  //     sortingFn: "date",
  //     cell: (info) => {
  //       const date = new Date(info.getValue());
  //       return <span>{date.toLocaleDateString()}</span>;
  //     },
  //   }),
  resourceColumnHelper.accessor("id", {
    header: ({ column }) => <Header title="Actions" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      const navigate = useNavigate();
      const resourceId = info.getValue();
      const userDetails = JSON.parse(
        localStorage.getItem("ai-teacha-user") || "{}"
      );

      const getRedirectPath = () => {
        if (userDetails.role === 2) {
          return `/dashboard/history/${resourceId}`;
        } else if (userDetails.role === 3) {
          return `/student/history/${resourceId}`;
        }
        return `/dashboard/history/${resourceId}`;
      };

      return (
        <div className="flex items-center gap-2">
          <Actions viewLink={getRedirectPath()} />
        </div>
      );
    },
  }),
];
