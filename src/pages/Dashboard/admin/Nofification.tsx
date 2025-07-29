import React, { useRef } from "react";
import { Button } from "../../../components/ui/Button";
import BaseTable from "../../../components/table/BaseTable";
import { notificationColumns } from "./components/column.admin.notification";
import AddAdminNotificationDialog from "./components/AddNotificationDialog";

const dummyResources = [
  {
    id: "1",
    title: "Admin Guide",
    description: "This is a dummy admin guide.",
    createdAt: "2025-07-29",
    expiry_date: "2025-08-10",
    who_views: "teacher",
    status: "active",
  },
  {
    id: "2",
    title: "Policy Document",
    description: "Dummy policy details here.",
    createdAt: "2025-07-28",
    expiry_date: "2025-08-05",
    who_views: "student",
    status: "inactive",
  },
  {
    id: "3",
    title: "Team Contacts",
    description: "List of team members and roles.",
    createdAt: "2025-07-27",
    expiry_date: "2025-08-12",
    who_views: "all",
    status: "active",
  },
];


const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 bg-gray-200 rounded"></div>
      <div className="h-10 bg-gray-200 rounded w-5/6"></div>
      <div className="h-10 bg-gray-200 rounded w-4/6"></div>
      <div className="h-10 bg-gray-200 rounded w-3/6"></div>
      <div className="h-10 bg-gray-200 rounded w-5/6"></div>
      <div className="h-10 bg-gray-200 rounded w-4/6"></div>
    </div>
  );
};

const Notification: React.FC = () => {
  const addResourceDialogRef = useRef<{ openDialog: () => void }>(null);

  const handleAddResourceClick = () => {
    addResourceDialogRef.current?.openDialog();
  };

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Admin Notification</h1>
        <Button
          onClick={handleAddResourceClick}
          variant={"gradient"}
          className="rounded-full px-4 py-2  focus:ring-opacity-50"
        >
          Add New Notification
        </Button>
      </div>

      {dummyResources.length > 0 ? (
        <BaseTable columns={notificationColumns} data={dummyResources} />
      ) : (
        <p className="text-gray-600 text-lg text-center mt-8">
          No admin resources found. Click "Add New Resource" to add one.
        </p>
      )}

      <AddAdminNotificationDialog
        ref={addResourceDialogRef}
        onSuccess={() => {}}
      />
    </div>
  );
};

export default Notification;
