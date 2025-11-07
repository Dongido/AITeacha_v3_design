import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/Dialogue";
import { Button } from "../../../../components/ui/Button";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../store";
import { toggleClassroomStatus } from "../../../../api/classrooms";
import { loadClassrooms, fetchClassroomByIdThunk } from "../../../../store/slices/classroomSlice";

interface ActivateDeactivateDialogProps {
  classroomId: number;
  status: string;
  onSuccess: () => void;
}

interface ActivateDeactivateDialogRef {
  openDialog: () => void;
}

const ActivateDeactivateDialog = forwardRef<
  ActivateDeactivateDialogRef,
  ActivateDeactivateDialogProps
>(({ classroomId, status, onSuccess }, ref) => {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    openDialog: () => setOpen(true),
  }));

  const isInactive = status?.toLowerCase() === "inactive";
  const actionVerb = isInactive ? "Activate" : "Deactivate";

  const handleToggleStatus = async () => {
    try {
      setIsLoading(true);

      // 🔁 Toggle status via API
      await toggleClassroomStatus(classroomId);

      // 🔁 Refresh both the list and the current classroom detail immediately
      await dispatch(loadClassrooms());
      await dispatch(fetchClassroomByIdThunk(classroomId));

      // 🔁 Trigger any parent onSuccess logic (optional)
      onSuccess?.();

      // Close the dialog
      setOpen(false);
    } catch (error) {
      console.error("Error toggling classroom status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`${actionVerb} Classroom`}</DialogTitle>
          <DialogDescription>
            Are you sure you want to {actionVerb.toLowerCase()} this classroom?
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <button
            onClick={handleToggleStatus}
            disabled={isLoading}
            className={
              isInactive
                ? "bg-[#6200EE] px-4 py-2 rounded-full hover:bg-[#4b00b8] text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
            }
          >
            {isLoading ? "Please wait..." : actionVerb}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

ActivateDeactivateDialog.displayName = "ActivateDeactivateDialog";
export default ActivateDeactivateDialog;
