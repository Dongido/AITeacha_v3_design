import React, { useImperativeHandle, useState, forwardRef } from "react";
import { useDispatch } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/Dialogue";
import { Button } from "../../../components/ui/Button";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastViewport,
} from "../../../components/ui/Toast";
import { AppDispatch } from "../../../store";
import { updateWithdrawalStatus } from "../../../api/bankaccount";
import { Loader2 } from "lucide-react";
import { fetchAdminWithdrawals } from "../../../store/slices/adminWithdrawalSlice";

interface UpdateWithdrawalStatusDialogProps {
  withdrawalId: string;
  withdrawal: any;
  currentStatus: "pending" | "processing" | "completed" | "failed" | "paid";
  onSuccess?: () => void;
}

const UpdateWithdrawalStatusDialog = forwardRef(
  (
    {
      withdrawalId,
      withdrawal,
      currentStatus,
      onSuccess = () => {},
    }: UpdateWithdrawalStatusDialogProps,
    ref
  ) => {
    const dispatch = useDispatch<AppDispatch>();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
      "default"
    );
    const [selectedStatus, setSelectedStatus] = useState<"paid" | "declined">(
      "paid"
    );

    useImperativeHandle(ref, () => ({
      openDialog: () => setOpen(true),
    }));

    const handleUpdate = async () => {
      setLoading(true);
      try {
        await updateWithdrawalStatus(withdrawalId, withdrawal, selectedStatus);

        setToastMessage(`Withdrawal status updated to '${selectedStatus}'.`);
        setToastVariant("default");
        dispatch(fetchAdminWithdrawals());
        setToastOpen(true);
        setOpen(false);
        onSuccess();
      } catch (error: any) {
        console.error("Error updating withdrawal status:", error);
        setToastMessage(
          error.message ||
            "Failed to update withdrawal status. Please try again."
        );
        setToastVariant("destructive");
        setToastOpen(true);
      } finally {
        setLoading(false);
      }
    };

    return (
      <ToastProvider swipeDirection="right">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-[450px] text-gray-800">
            <DialogHeader>
              <DialogTitle>Update Withdrawal Status</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              You are about to change the status of this withdrawal request from
              "**{currentStatus}**". Please select the new status.
            </DialogDescription>
            <div className="py-4 flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="status-paid"
                  name="withdrawalStatus"
                  value="paid"
                  checked={selectedStatus === "paid"}
                  onChange={() => setSelectedStatus("paid")}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor="status-paid"
                  className="text-sm font-medium text-gray-700"
                >
                  Paid
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="status-declined"
                  name="withdrawalStatus"
                  value="declined"
                  checked={selectedStatus === "declined"}
                  onChange={() => setSelectedStatus("declined")}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor="status-declined"
                  className="text-sm font-medium text-gray-700"
                >
                  Declined
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleUpdate}
                variant="gradient"
                className="rounded-md"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Confirm Update"
                )}
              </Button>
              <Button
                onClick={() => setOpen(false)}
                variant="ghost"
                disabled={loading}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
  }
);

UpdateWithdrawalStatusDialog.displayName = "UpdateWithdrawalStatusDialog";

export default UpdateWithdrawalStatusDialog;
