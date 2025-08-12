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
  classroomColumnHelper.accessor("classroom_id", {
    header: ({ column }) => <Header title="" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      const classroom = info.row.original;
      const classroomThumbnail = classroom.classroom_thumbnail;
      const classroomName = classroom.classroom_name;

      return classroomThumbnail ? (
        <img
          src={classroomThumbnail}
          alt="Classroom Thumbnail"
          className="w-8 h-8 rounded-full object-cover"
        />
      ) : (
        <div className="flex capitalize items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#7a5ef8] to-[#5c3cbb] text-white font-semibold">
          {"C"}
        </div>
      );
    },
  }),
  classroomColumnHelper.accessor("classroom_name", {
    header: ({ column }) => <Header title="Classroom Name" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      const classroom = info.row.original;
      const classroomId = classroom.classroom_id;
      const status = classroom.status;

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
              className="capitalize text-primary whitespace-nowrap cursor-pointer"
              onClick={() => activateDeactivateDialogRef.current?.openDialog()}
            >
              {info.getValue()}
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
          className="capitalize text-primary whitespace-nowrap"
        >
          {info.getValue()}
        </Link>
      );
    },
  }),
  classroomColumnHelper.accessor("classroom_description", {
    header: ({ column }) => <Header title="Description" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      const description = info.getValue();
      const truncatedDescription =
        description && description.length > 50
          ? `${description.slice(0, 50)}...`
          : description;

      return <span className="whitespace-nowrap">{truncatedDescription}</span>;
    },
  }),
  classroomColumnHelper.accessor("grade", {
    header: ({ column }) => <Header title="Grade" column={column} />,
    sortingFn: "text",
    cell: (info) => (
      <span className="capitalize whitespace-nowrap">{info.getValue()}</span>
    ),
  }),
  classroomColumnHelper.accessor("class_type", {
    header: ({ column }) => <Header title="Type" column={column} />,
    sortingFn: "text",
    cell: (info) => (
      <span className="capitalize whitespace-nowrap">{info.getValue()}</span>
    ),
  }),
  classroomColumnHelper.accessor("status", {
    header: ({ column }) => <Header title="Status" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      const val = info.getValue()?.toString() as StatusType;
      return <Status value={val} />;
    },
  }),
  classroomColumnHelper.accessor("number_of_students_joined", {
    header: ({ column }) => <Header title="Students Joined" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      const studentsJoined = info.getValue();
      return (
        <span className="whitespace-nowrap">
          {studentsJoined !== null ? studentsJoined : "No students joined"}
        </span>
      );
    },
  }),

  classroomColumnHelper.accessor("join_url", {
    header: ({ column }) => <Header title="Actions" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      const navigate = useNavigate();
      const classroom = info.row.original;
      const classroomId = info.row.original.classroom_id;
      const status = classroom.status;

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
                : `/dashboard/classrooms/details/${classroomId}`
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
