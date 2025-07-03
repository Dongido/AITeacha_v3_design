import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../store";
import { fetchAdminWithdrawals } from "../../../store/slices/adminWithdrawalSlice";
import BaseTable from "../../../components/table/BaseTable";
import { getAdminWithdrawalColumns } from "../_components/AdminWithdrawalColumns";
import { Skeleton } from "../../../components/ui/Skeleton";
import { Button } from "../../../components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/Select"; // Import Select components
import { updateBulkWithdrawalStatus } from "../../../api/bankaccount";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastViewport,
} from "../../../components/ui/Toast";

interface Withdrawal {
  email: string;
  firstname: string;
  lastname: string;
  id: string;
  amount: number;
  status: "pending" | "completed" | "failed" | "processing" | "paid";
  created_at: string;
  currency: string;
  user_id: string;
}

const AdminWithdrawalsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { withdrawals, loading, error } = useSelector(
    (state: RootState) => state.adminWithdrawals
  );

  const [selectedWithdrawals, setSelectedWithdrawals] = useState<Withdrawal[]>(
    []
  );
  const [loadingStatus, setLoadingStatus] = useState<
    "paid" | "declined" | null
  >(null);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
    "default"
  );

  // New state for filter status
  const [filterStatus, setFilterStatus] = useState<
    "all" | "processing" | "paid" | "declined"
  >("all");

  useEffect(() => {
    dispatch(fetchAdminWithdrawals());
  }, [dispatch]);

  const handleCheckboxChange = (withdrawal: Withdrawal, isChecked: boolean) => {
    if (isChecked) {
      setSelectedWithdrawals((prev) => [...prev, withdrawal]);
    } else {
      setSelectedWithdrawals((prev) =>
        prev.filter((item) => item.id !== withdrawal.id)
      );
    }
  };

  const formatSelectedWithdrawals = () => {
    return selectedWithdrawals.map((w) => ({ request_id: w.id }));
  };

  const handleUpdateStatus = async (status: "paid" | "declined") => {
    try {
      setLoadingStatus(status);
      const payload = {
        status,
        lists: formatSelectedWithdrawals(),
      };
      await updateBulkWithdrawalStatus(payload);

      setToastMessage(`Updated all selected withdrawal requests to ${status}.`);
      setToastVariant("default");
      setToastOpen(true);
      dispatch(fetchAdminWithdrawals()); // Re-fetch data to reflect changes
      setSelectedWithdrawals([]);
    } catch (error: any) {
      console.error("Bulk update error:", error.message);
      setToastMessage(
        error.message || "Failed to update withdrawal status. Please try again."
      );
      setToastVariant("destructive");
      setToastOpen(true);
    } finally {
      setLoadingStatus(null);
    }
  };

  const adminWithdrawalColumns = useMemo(
    () =>
      getAdminWithdrawalColumns({
        onCheckboxChange: handleCheckboxChange,
        selectedWithdrawalIds: selectedWithdrawals.map((w) => w.id),
      }),
    [selectedWithdrawals]
  );

  // Filtered withdrawals based on the selected status
  const filteredWithdrawals = useMemo(() => {
    if (filterStatus === "all") {
      return withdrawals;
    }
    return withdrawals.filter(
      (withdrawal) => withdrawal.status.toLowerCase() === filterStatus
    );
  }, [withdrawals, filterStatus]);

  if (loading) {
    return (
      <div className="p-2 md:p-6 lg:p-6 mt-6">
        <h1 className="text-3xl font-bold mb-6">Withdrawal Requests</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                {[...Array(6)].map((_, index) => (
                  <th key={index} className="p-4 border-b">
                    <Skeleton className="h-4 w-20 rounded" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(6)].map((_, rowIndex) => (
                <tr key={rowIndex} className="border-b">
                  {[...Array(6)].map((_, colIndex) => (
                    <td key={colIndex} className="p-4">
                      <Skeleton className="h-4 w-full rounded" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-2 md:p-6 lg:p-6 mt-6">
        <h1 className="text-3xl font-bold mb-6">Admin Withdrawal Requests</h1>
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <ToastProvider swipeDirection="right">
      <div className="p-2 md:p-6 lg:p-6 mt-6">
        <h1 className="text-3xl font-bold mb-6">Admin Withdrawal Requests</h1>

        <div className="mb-4 flex items-center gap-4">
          <h2 className="text-xl font-semibold">Filter by Status:</h2>
          <Select
            value={filterStatus}
            onValueChange={(
              value: "all" | "processing" | "paid" | "declined"
            ) => setFilterStatus(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {selectedWithdrawals.length > 0 && (
          <div className="mb-4 flex gap-4">
            <Button
              onClick={() => handleUpdateStatus("paid")}
              variant="gradient"
              className="text-white font-bold py-2 px-4 rounded"
              disabled={loadingStatus !== null}
            >
              {loadingStatus === "paid" ? (
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                "Mark as Paid"
              )}
              ({selectedWithdrawals.length})
            </Button>
            <Button
              onClick={() => handleUpdateStatus("declined")}
              variant="destructive"
              className="text-white font-bold py-2 px-4 rounded"
              disabled={loadingStatus !== null}
            >
              {loadingStatus === "declined" ? (
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                "Mark as Declined"
              )}
              ({selectedWithdrawals.length})
            </Button>
          </div>
        )}
        {filteredWithdrawals.length === 0 ? (
          <p className="text-gray-600">
            No withdrawal requests found for the selected status.
          </p>
        ) : (
          <BaseTable
            data={filteredWithdrawals}
            columns={adminWithdrawalColumns}
          />
        )}
      </div>
      <Toast
        open={toastOpen}
        onOpenChange={setToastOpen}
        variant={toastVariant}
      >
        <ToastTitle>{toastMessage}</ToastTitle>
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
};

export default AdminWithdrawalsPage;
