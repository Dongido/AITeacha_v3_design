import { createColumnHelper } from "@tanstack/react-table";
import Header from "../../../../components/table/TableHeaderItem";
import Actions from "../../../../components/table/TableActions";
import Status from "../../_components/Status";
import { StatusType } from "../../../../lib/constants";
import { useNavigate } from "react-router-dom";

const adminResourceColumnHelper = createColumnHelper<any>();

export const adminResourceColumns = [
  adminResourceColumnHelper.accessor("title", {
    header: ({ column }) => <Header title="Resource Name" column={column} />,
    sortingFn: "text",
    cell: (info) => (
      <span className="capitalize text-primary whitespace-nowrap">
        {info.getValue()}
      </span>
    ),
  }),
  adminResourceColumnHelper.accessor("subject", {
    header: ({ column }) => <Header title="Subject" column={column} />,
    sortingFn: "text",
    cell: (info) => (
      <span className="capitalize whitespace-nowrap">{info.getValue()}</span>
    ),
  }),
  adminResourceColumnHelper.accessor("grade", {
    header: ({ column }) => <Header title="Grade" column={column} />,
    sortingFn: "text",
    cell: (info) => (
      <span className="capitalize whitespace-nowrap">{info.getValue()}</span>
    ),
  }),
  adminResourceColumnHelper.accessor("country", {
    header: ({ column }) => <Header title="Country" column={column} />,
    sortingFn: "text",
    cell: (info) => (
      <span className="capitalize whitespace-nowrap">{info.getValue()}</span>
    ),
  }),
  adminResourceColumnHelper.accessor("created_at", {
    header: ({ column }) => <Header title="Created At" column={column} />,
    sortingFn: "datetime",
    cell: (info) => {
      const date = new Date(info.getValue());
      return (
        <span className="whitespace-nowrap">{date.toLocaleDateString()}</span>
      );
    },
  }),
  //   adminResourceColumnHelper.accessor("id", {
  //     header: ({ column }) => <Header title="Actions" column={column} />,
  //     sortingFn: "text",
  //     cell: (info) => {
  //       const navigate = useNavigate();
  //       const resource = info.row.original;
  //       const resourceId = resource.id;
  //       const status = resource.status;

  //       return <div className="flex items-center gap-2"></div>;
  //     },
  //   }),
];
