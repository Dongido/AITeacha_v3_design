import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { fetchBranchesThunk } from "../../../store/slices/branchSlice";
import { Button } from "../../../components/ui/Button";
import BaseTable from "../../../components/table/BaseTable";
import BranchDialog from "./components/BranchDialog";
import { branchColumns } from "./components/branch.columns";
import { Skeleton } from "../../../components/ui/Skeleton";

interface BranchDialogRef {
  openDialog: () => void;
}

const BranchPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { branches, loading, error } = useSelector(
    (state: RootState) => state.branches
  );

  const [branchToEdit, setBranchToEdit] = useState(null);

  const branchDialogRef = useRef<BranchDialogRef>(null);

  useEffect(() => {
    dispatch(fetchBranchesThunk());
  }, [dispatch]);

  const handleCreateBranchClick = () => {
    setBranchToEdit(null);
    branchDialogRef.current?.openDialog();
  };

  const TableSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden mt-6 lg:mt-12">
      <div className="flex items-center justify-between mb-4 p-4">
        <h1 className="text-2xl font-bold">Branches</h1>
        <Button
          onClick={handleCreateBranchClick}
          className="rounded-md"
          variant={"gradient"}
          disabled={loading}
        >
          Create New Branch
        </Button>
      </div>

      <div className="p-4 flex-grow overflow-auto">
        {loading && <TableSkeleton />}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!loading && !error && (
          <BaseTable data={branches} columns={branchColumns} />
        )}
      </div>

      <BranchDialog
        ref={branchDialogRef}
        branch={branchToEdit}
        onSuccess={() => {
          dispatch(fetchBranchesThunk());
        }}
      />
    </div>
  );
};

export default BranchPage;
