import { Classroom } from "../../../../api/interface";
import { createColumnHelper } from "@tanstack/react-table";
import Header from "../../../../components/table/TableHeaderItem";
import Actions from "../../../../components/table/TableActions";
import DeleteClassroomDialog from "./DeleteClassroomDialogue";
import { StatusType } from "../../../../lib/constants";
import Status from "../../_components/Status";
import { useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import ActivateDeactivateDialog from "./ActivateDeactivateDialog";

const classroomColumnHelper = createColumnHelper<Classroom>();

const getRedirectPath = (role: number, classroomId: number) => {
  if (role === 2) {
    return `/dashboard/classrooms/details/${classroomId}`;
  } else if (role === 3) {
    return `/student/class/details/${classroomId}`;
  }
  return `/dashboard/classrooms/details/${classroomId}`;
};

export const classroomColumns = [
  // 🖼 Thumbnail (hidden on mobile)
  classroomColumnHelper.accessor("classroom_id", {
    header: ({ column }) => (
      <div className="hidden md:table-cell">
        <Header title="" column={column} />
      </div>
    ),
    sortingFn: "text",
    cell: (info) => {
      const classroom = info.row.original;
      const classroomThumbnail = classroom.classroom_thumbnail;

      return (
        <div className="hidden md:table-cell text-center">
          {classroomThumbnail ? (
            <img
              src={classroomThumbnail}
              alt="Classroom Thumbnail"
              className="w-8 h-8 rounded-full object-cover mx-auto"
            />
          ) : (
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-[#7a5ef8] to-[#5c3cbb] text-white font-semibold">
              C
            </div>
          )}
        </div>
      );
    },
  }),

  // 🏫 Classroom name (always visible)
  classroomColumnHelper.accessor("classroom_name", {
    header: ({ column }) => <Header title="Classroom Name" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      const classroom = info.row.original;
      const classroomId = classroom.classroom_id;
      const status = classroom.status;
      const classroomName = info.getValue();
      const truncatedCN =
        classroomName.length > 25
          ? `${classroomName.slice(0, 25)}...`
          : classroomName;

      const userDetails = JSON.parse(
        localStorage.getItem("ai-teacha-user") || "{}"
      );
      const role = userDetails.role;
      const redirectPath = getRedirectPath(role, classroomId);
      const activateDeactivateDialogRef = useRef<{ openDialog: () => void }>(
        null
      );

      if (status === "inactive") {
        return (
          <>
            <div
              className="capitalize text-primary cursor-pointer w-[140px] md:w-auto truncate"
              onClick={() => activateDeactivateDialogRef.current?.openDialog()}
            >
              {truncatedCN}
            </div>
            <ActivateDeactivateDialog
              ref={activateDeactivateDialogRef}
              classroomId={classroomId}
              status={status}
              onSuccess={() => {}}
            />
          </>
        );
      }

      return (
        <Link
          to={redirectPath}
          className="capitalize text-primary w-[140px] md:w-auto truncate"
        >
          {truncatedCN}
        </Link>
      );
    },
  }),

  // 🏷 Grade (hidden on mobile)
  classroomColumnHelper.accessor("grade", {
    header: ({ column }) => (
      <div className="hidden md:table-cell">
        <Header title="Grade" column={column} />
      </div>
    ),
    sortingFn: "text",
    cell: (info) => (
      <div className="hidden md:table-cell">
        <span className="capitalize">{info.getValue()}</span>
      </div>
    ),
  }),

  // 🧾 Type (hidden on mobile)
  classroomColumnHelper.accessor("class_type", {
    header: ({ column }) => (
      <div className="hidden md:table-cell">
        <Header title="Type" column={column} />
      </div>
    ),
    sortingFn: "text",
    cell: (info) => (
      <div className="hidden md:table-cell">
        <span className="capitalize">{info.getValue()}</span>
      </div>
    ),
  }),

  // ✅ Status (hidden on mobile)
  classroomColumnHelper.accessor("status", {
    header: ({ column }) => (
      <div className="hidden md:table-cell">
        <Header title="Status" column={column} />
      </div>
    ),
    sortingFn: "text",
    cell: (info) => {
      const val = info.getValue()?.toString() as StatusType;
      return (
        <div className="hidden md:table-cell">
          <Status value={val} />
        </div>
      );
    },
  }),

  // 👥 Students Joined (hidden on mobile)
  classroomColumnHelper.accessor("number_of_students_joined", {
    header: ({ column }) => (
      <div className="hidden md:table-cell">
        <Header title="Students Joined" column={column} />
      </div>
    ),
    sortingFn: "text",
    cell: (info) => (
      <div className="hidden md:table-cell text-center">
        <span>
          {info.getValue() !== null ? info.getValue() : "No students joined"}
        </span>
      </div>
    ),
  }),

  // ⚙️ Actions (always visible)
  classroomColumnHelper.accessor("join_url", {
    header: ({ column }) => <Header title="Actions" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      const navigate = useNavigate();
      const classroom = info.row.original;
      const classroomId = classroom.classroom_id;
      const status = classroom.status;

      const deleteDialogRef = useRef<{ openDialog: () => void }>(null);
      const activateDeactivateDialogRef = useRef<{ openDialog: () => void }>(
        null
      );

      return (
        <div className="flex  gap-2 ">
          <Actions
  viewLink={
    status === "inactive"
      ? undefined // Prevent navigation for inactive classes
      : `/dashboard/classrooms/details/${classroomId}`
  }
  deleteFunction={async (e?: React.MouseEvent) => {
  e?.preventDefault();
  e?.stopPropagation(); // ✅ extra safety in case table row has a link
  deleteDialogRef.current?.openDialog();
  return Promise.resolve();
}}

  activateFunction={
    status !== "active"
      ? async () => {
          activateDeactivateDialogRef.current?.openDialog();
          return Promise.resolve();
        }
      : undefined
  }
  deactivateFunction={undefined}
/>


          <DeleteClassroomDialog
            ref={deleteDialogRef}
            classroomId={classroomId}
            onSuccess={() => {}}
          />

          <ActivateDeactivateDialog
            ref={activateDeactivateDialogRef}
            classroomId={classroomId}
            status={status}
            onSuccess={() => {}}
          />
        </div>
      );
    },
  }),
];


