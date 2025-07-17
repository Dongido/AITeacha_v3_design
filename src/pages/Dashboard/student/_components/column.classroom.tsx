import { Classroom } from "../../../../api/studentclassroom";
import { createColumnHelper } from "@tanstack/react-table";
import Header from "../../../../components/table/TableHeaderItem";
import Actions from "../../../../components/table/TableActions";
import { StatusType } from "../../../../lib/constants";
import Status from "../../_components/Status";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const classroomColumnHelper = createColumnHelper<Classroom>();

export const classroomColumns = [
  classroomColumnHelper.accessor("classroom_id", {
    header: ({ column }) => <Header title="" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      const classroom = info.row.original;
      const classroomThumbnail = classroom.thumbnail;
      const classroomName = classroom.name;

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
  classroomColumnHelper.accessor("name", {
    header: ({ column }) => <Header title="Classroom Name" column={column} />,
    sortingFn: "text",
    cell: (info) => (
      <span className="capitalize whitespace-nowrap">{info.getValue()}</span>
    ),
  }),

  classroomColumnHelper.accessor("description", {
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
  classroomColumnHelper.accessor("status", {
    header: ({ column }) => <Header title="Status" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      const val = info.getValue()?.toString() as StatusType;
      return <Status value={val} />;
    },
  }),

  classroomColumnHelper.accessor("join_url", {
    header: ({ column }) => <Header title="Actions" column={column} />,
    sortingFn: "text",
    cell: (info) => {
      const navigate = useNavigate();
      const classroomId = info.row.original.classroom_id;
      const userDetails = JSON.parse(
        localStorage.getItem("ai-teacha-user") || "{}"
      );

      const getRedirectPath = () => {
        if (userDetails.role === 2) {
          return `/class/classrooms/class-details/${classroomId}`;
        } else if (userDetails.role === 3 || userDetails.role_id === 3) {
          return `/class/class-details/${classroomId}`;
        }
        return `/class/classrooms/class-details/${classroomId}`;
      };
      return (
        <div className="flex items-center gap-2">
          <Actions 
          viewLink={getRedirectPath()} 
          viewParticipant={`/student/Classparticipant/${classroomId}`}
          />
        </div>
      );
    },
  }),
];
