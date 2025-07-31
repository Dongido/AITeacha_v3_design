import { createColumnHelper } from "@tanstack/react-table";
import Header from "../../../../components/table/TableHeaderItem";

import { useNavigate } from "react-router-dom";
import Actions from "../../../../components/table/TableActions";
import Status from "../../_components/Status";
import { delectNotification, updateNotificationStatus, updateNotificationViews } from "../../../../store/slices/notificationsSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../store";
import { useRef, useState } from "react";
import RemoveStudentDialog from "../../classrooms/components/DeleteStudentDialog";
import AddNotificationEditDialog from "./AddNotificationEditModal";


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
      const dispatch = useDispatch<AppDispatch>();

      const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value;
        console.log(`Viewers for row ${info.row.original.id}:`, newValue);
        const payload = {
          id: info.row.original.id,
          who_views: newValue
        }
        await dispatch(updateNotificationViews(payload));
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
      const dispatch = useDispatch<AppDispatch>();
      const value = info.getValue() || "active";
      const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const status = e.target.value;

        const payload = {
          id: info.row.original.id,
          status
        }
        console.log(`Status for row ${info.row.original.id}:`, status);
        await dispatch(updateNotificationStatus(payload));
      };

      return (
        <select
          defaultValue={value}
          onChange={handleChange}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm capitalize focus:outline-none 
        focus:ring-2 focus:ring-primary focus:border-primary bg-white shadow-sm"
        >
          <option value="active">Active</option>
          <option value="deactivated">deactivated</option>
        </select>
      );
    },
  }),


  notificationColumnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const dispatch = useDispatch<AppDispatch>();
      const editDialogRef = useRef<{ openDialog: () => void }>(null);
      const [selectedId, setSelectedId] = useState<string | null>(null);

      const handleEdit = async () => {
        console.log("Edit", row.original.id);
        setSelectedId(row.original.id)
        // editDialogRef.current?.openDialog();
        // return Promise.resolve();

        setTimeout(() => {
          editDialogRef.current?.openDialog();
        }, 0);


      };

      const handleDelete = async () => {
        await dispatch(delectNotification(row.original.id));
      };

      return (
        <>
          <Actions
            editFunction={handleEdit}
            deleteFunction={handleDelete}
          />
          {selectedId && (
            <AddNotificationEditDialog
              ref={editDialogRef}
              id={selectedId}
            />
          )}
        </>
      );
    },
  }),


];
