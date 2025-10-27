// import { Examination } from "../../../../api/interface";
import { createColumnHelper } from "@tanstack/react-table";
import Header from "../../../../components/table/TableHeaderItem";
import Actions from "../../../../components/table/TableActions";
import DeleteTestDialog from "./DeleteTestDialog";
import { StatusType } from "../../../../lib/constants";
import Status from "../../_components/Status";
import { useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
// import ActivateDeactivateDialog from "./ActivateDeactivateDialog";

const testColumnHelper = createColumnHelper<any>();

const getTestRedirectPath = (role: number, examinationId: number) => {
  if (role === 2) {
    return `/dashboard/test/details/${examinationId}`;
  } else if (role === 3) {
    return `/student/test/details/${examinationId}`;
  }
  return `/dashboard/test/details/${examinationId}`;
};

export const testColumns = [
  testColumnHelper.accessor("examination_id", {
    header: ({ column }) => <Header title="" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      const test = info.row.original;
      const testThumbnail = test.thumbnail;
      const testName = test.subject;

      return testThumbnail ? (
        <img
          src={testThumbnail}
          alt="Test Thumbnail"
          className="w-8 h-8 rounded-full object-cover"
        />
      ) : (
        <div className="flex capitalize items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#7a5ef8] to-[#5c3cbb] text-white font-semibold">
          {" "}
          {testName?.charAt(0).toUpperCase() || "T"}
        </div>
      );
    },
  }),
  testColumnHelper.accessor("school_name", {
    header: ({ column }) => <Header title="School Name" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      const examinationId = info.row.original.examination_id;
      const userDetails = JSON.parse(
        localStorage.getItem("ai-teacha-user") || "{}"
      );
      const role = userDetails.role;
      const redirectPath = getTestRedirectPath(role, examinationId);

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
  testColumnHelper.accessor("subject", {
    header: ({ column }) => <Header title="Subject" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      const examinationId = info.row.original.examination_id;
      const userDetails = JSON.parse(
        localStorage.getItem("ai-teacha-user") || "{}"
      );
      const role = userDetails.role;
      const redirectPath = getTestRedirectPath(role, examinationId);

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

  testColumnHelper.accessor("grade", {
    header: ({ column }) => <Header title="Grade" column={column} />,
    sortingFn: "text",
    cell: (info) => (
      <span className="capitalize whitespace-nowrap">{info.getValue()}</span>
    ),
  }),

  testColumnHelper.accessor("status", {
  header: ({ column }) => <Header title="Status" column={column} />,
  sortingFn: "text",
  cell: (info) => {
    const rawVal = info.getValue();
    const val = rawVal ? rawVal.toString() : "unknown"; // ✅ fallback value

    return <Status value={val as StatusType} />;
  },
}),

  // testColumnHelper.accessor("status", {
  //   header: ({ column }) => <Header title="Status" column={column} />,
  //   sortingFn: "text",
  //   cell: (info) => {
  //     const val = info.getValue()?.toString() as StatusType;
  //     return <Status value={val} />;
  //   },
  // }),
  testColumnHelper.accessor("questions", {
    header: ({ column }) => <Header title="No. of Questions" column={column} />,
    cell: (info) => {
      const numberOfQuestions = info.getValue()?.length || 0;
      return <span className="whitespace-nowrap">{numberOfQuestions}</span>;
    },
  }),
  testColumnHelper.accessor("join_url", {
    header: ({ column }) => <Header title="Actions" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      const navigate = useNavigate();
      const test = info.row.original;
      const examinationId = info.row.original.examination_id;
      const status = test.status;

      const deleteDialogRef = useRef<{ openDialog: () => void }>(null);
      const activateDeactivateDialogRef = useRef<{ openDialog: () => void }>(
        null
      );

      return (
        <div className="flex items-center gap-2">
          <Actions
            viewLink={
              status === "inactive"
                ? undefined
                : `/dashboard/test/details/${examinationId}`
            }
            deleteFunction={async () => {
              deleteDialogRef.current?.openDialog();
              return Promise.resolve();
            }}
            activateFunction={
              status === "inactive"
                ? async () => {
                    activateDeactivateDialogRef.current?.openDialog();
                    return Promise.resolve();
                  }
                : undefined
            }
          />

          <DeleteTestDialog
            ref={deleteDialogRef}
            testId={examinationId}
            onSuccess={() => {}}
          />
          {/*
          <ActivateDeactivateDialog
            ref={activateDeactivateDialogRef}
            entityId={examinationId} // Assuming ActivateDeactivateDialog can handle both classrooms and tests with a generic entityId prop
            status={status}
            onSuccess={() => {}}
            entityType="test" // Optionally pass entityType for specific handling in the dialog
          /> */}
        </div>
      );
    },
  }),
];
