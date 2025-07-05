import React, { useRef, useEffect } from "react";
import { Button } from "../../../components/ui/Button";
import AddAdminResourceDialog from "./components/AddResourceDialog";
import { adminResourceColumns } from "./components/column.admin.resource";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../store";
import { fetchAdminResources } from "../../../store/slices/adminResourceSlice";
import BaseTable from "../../../components/table/BaseTable";
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

const AdminResourcesPage: React.FC = () => {
  const addResourceDialogRef = useRef<{ openDialog: () => void }>(null);
  const dispatch = useDispatch<AppDispatch>();

  const { resources, loading, error } = useSelector(
    (state: RootState) => state.adminResources
  );

  useEffect(() => {
    dispatch(fetchAdminResources());
  }, [dispatch]);

  const handleAddResourceClick = () => {
    addResourceDialogRef.current?.openDialog();
  };

  const handleResourceAdded = () => {
    dispatch(fetchAdminResources());
  };

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Admin Resources</h1>
        <Button
          onClick={handleAddResourceClick}
          variant={"gradient"}
          className="rounded-full px-4 py-2  focus:ring-opacity-50"
        >
          Add New Resource
        </Button>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <p className="text-red-600 text-lg">Error: {error}</p>
      ) : resources.length > 0 ? (
        <BaseTable columns={adminResourceColumns} data={resources} />
      ) : (
        <p className="text-gray-600 text-lg text-center mt-8">
          No admin resources found. Click "Add New Resource" to add one.
        </p>
      )}

      <AddAdminResourceDialog
        ref={addResourceDialogRef}
        onSuccess={handleResourceAdded}
      />
    </div>
  );
};

export default AdminResourcesPage;
