// import { createColumnHelper } from "@tanstack/react-table";
// import Header from "../../../components/table/TableHeaderItem";
// import Actions from "../../../components/table/TableActions";
// import { useNavigate } from "react-router-dom";

// export interface Resource {
//   id: string;
//   resource_id: string;
//   title: string;
//   answer: string;
//   shared_to: string;
//   email: string;
// }
// const resourceColumnHelper = createColumnHelper<Resource>();

// export const sharedResourceColumns = [
//   resourceColumnHelper.accessor("id", {
//     header: ({ column }) => <Header title="Resource ID" column={column} />,
//     sortingFn: "text",
//     cell: (info) => <span>{info.getValue()}</span>,
//   }),

//   resourceColumnHelper.accessor("title", {
//     header: ({ column }) => <Header title="Title" column={column} />,
//     sortingFn: "text",
//     cell: (info) => (
//       <span className="capitalize whitespace-nowrap">{info.getValue()}</span>
//     ),
//   }),

//   resourceColumnHelper.accessor("shared_to", {
//     header: ({ column }) => <Header title="Shared To" column={column} />,
//     sortingFn: "text",
//     cell: (info) => (
//       <span className="capitalize whitespace-nowrap">{info.getValue()}</span>
//     ),
//   }),
//   resourceColumnHelper.accessor("email", {
//     header: ({ column }) => <Header title="Email" column={column} />,
//     sortingFn: "text",
//     cell: (info) => (
//       <span className="capitalize whitespace-nowrap">{info.getValue()}</span>
//     ),
//   }),

//   //   resourceColumnHelper.accessor("created_at", {
//   //     header: ({ column }) => <Header title="Created At" column={column} />,
//   //     sortingFn: "date",
//   //     cell: (info) => {
//   //       const date = new Date(info.getValue());
//   //       return <span>{date.toLocaleDateString()}</span>;
//   //     },
//   //   }),
//   resourceColumnHelper.accessor("id", {
//     header: ({ column }) => <Header title="Actions" column={column} />,
//     sortingFn: "text",
//     cell: (info) => {
//       const navigate = useNavigate();
//       const resourceId = info.getValue();
//       const userDetails = JSON.parse(
//         localStorage.getItem("ai-teacha-user") || "{}"
//       );

//       const getRedirectPath = () => {
//         return `/dashboard/premium/resources/${resourceId}`;
//       };

//       return (
//         <div className="flex items-center gap-2">
//           <Actions viewLink={getRedirectPath()} />
//         </div>
//       );
//     },
//   }),
// ];



import { createColumnHelper } from "@tanstack/react-table";
import Header from "../../../components/table/TableHeaderItem";
import Actions from "../../../components/table/TableActions";
import { useNavigate } from "react-router-dom";

export interface Resource {
  id: string;
  resource_id: string;
  title: string;
  answer: string;
  shared_to: string;
  email: string;
}

const resourceColumnHelper = createColumnHelper<Resource>();

export const sharedResourceColumns = [
  // Resource ID (hide on mobile)
  resourceColumnHelper.accessor("id", {
    header: ({ column }) => (
      <Header title="Resource ID" column={column} className="hidden sm:table-cell" />
    ),
    sortingFn: "text",
    cell: (info) => <span className="hidden sm:table-cell">{info.getValue()}</span>,
  }),

  // Title (always visible, truncated to 20 chars)
  resourceColumnHelper.accessor("title", {
    header: ({ column }) => <Header title="Title" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      const title = info.getValue() || "";
      const truncated =
        title.length > 20 ? `${title.substring(0, 20)}...` : title;

      return (
        <span
          className="capitalize whitespace-nowrap block max-w-[200px] truncate"
          title={title}
        >
          {truncated}
        </span>
      );
    },
  }),

  // Shared To (hide on mobile)
  resourceColumnHelper.accessor("shared_to", {
    header: ({ column }) => (
      <Header title="Shared To" column={column} className="hidden sm:table-cell" />
    ),
    sortingFn: "text",
    cell: (info) => (
      <span className="capitalize whitespace-nowrap hidden sm:table-cell">
        {info.getValue()}
      </span>
    ),
  }),

  // Email (hide on mobile)
  resourceColumnHelper.accessor("email", {
    header: ({ column }) => (
      <Header title="Email" column={column} className="hidden sm:table-cell" />
    ),
    sortingFn: "text",
    cell: (info) => (
      <span className="capitalize whitespace-nowrap hidden sm:table-cell">
        {info.getValue()}
      </span>
    ),
  }),

  // Actions (always visible)
  resourceColumnHelper.accessor("id", {
    header: ({ column }) => <Header title="Actions" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      const navigate = useNavigate();
      const resourceId = info.getValue();

      const getRedirectPath = () => `/dashboard/premium/resources/${resourceId}`;

      return (
        <div className="flex items-center gap-2">
          <Actions viewLink={getRedirectPath()} />
        </div>
      );
    },
  }),
];
