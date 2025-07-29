import { createColumnHelper } from "@tanstack/react-table";
import Header from "../../../../components/table/TableHeaderItem";

import { useNavigate } from "react-router-dom";
import Actions from "../../../../components/table/TableActions";
import Status from "../../_components/Status";

const notificationColumnHelper = createColumnHelper<any>();

export const notificationColumns = [
  notificationColumnHelper.accessor("title", {
    header: ({ column }) => <Header title="Title" column={column} />,
    sortingFn: "text",
    cell: (info) => (
      <span className="capitalize text-primary whitespace-nowrap">
        {info.getValue()}
      </span>
    ),
  }),

  notificationColumnHelper.accessor("expiry_date", {
    header: ({ column }) => <Header title="Expiry Date" column={column} />,
    sortingFn: "datetime",
    cell: (info) => {
      const date = new Date(info.getValue());
      return (
        <span className="whitespace-nowrap">{date.toLocaleDateString()}</span>
      );
    },
  }),

notificationColumnHelper.accessor("who_views", {
  header: ({ column }) => <Header title="Viewers" column={column} />,
  sortingFn: "text",
  cell: (info) => {
    const value = info.getValue() || "all";

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = e.target.value;
      console.log(`Viewers for row ${info.row.original.id}:`, newValue);
    };

    return (
      <select
        defaultValue={value}
        onChange={handleChange}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm capitalize focus:outline-none
         focus:ring-2 focus:ring-primary focus:border-primary bg-white shadow-sm"
      >
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
        <option value="all">All</option>
      </select>
    );
  },
}),

notificationColumnHelper.accessor("status", {
  header: ({ column }) => <Header title="Status" column={column} />,
  sortingFn: "text",
  cell: (info) => {
    const value = info.getValue() || "active"; 
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = e.target.value;
      console.log(`Status for row ${info.row.original.id}:`, newValue);
    };

    return (
      <select
        defaultValue={value}
        onChange={handleChange}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm capitalize focus:outline-none 
        focus:ring-2 focus:ring-primary focus:border-primary bg-white shadow-sm"
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    );
  },
}),


notificationColumnHelper.display({
  id: "actions",
  header: "Actions",
  cell: ({ row }) => (
    <Actions
      editFunction={async () => {
        console.log("Edit", row.original.id);
      }}
      deleteFunction={async () => {
        console.log("Delete", row.original.id);
      }}
    />
  ),
}),

];
