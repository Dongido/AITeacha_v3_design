import React, { forwardRef, useImperativeHandle } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/Dialogue";
import { Button } from "../../../../components/ui/Button";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../../store";
import { toggleClassroomStatus } from "../../../../api/classrooms";
import { StatusType } from "../../../../lib/constants";
import { loadClassrooms } from "../../../../store/slices/classroomSlice";
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

  const handleAction = async () => {
    setIsLoading(true);
    try {
      if (status === "inactive") {
        await toggleClassroomStatus(classroomId);
      } else {
        await toggleClassroomStatus(classroomId);
      }
      onSuccess();
      setOpen(false);
      dispatch(loadClassrooms());
    } catch (error) {
      console.error("Error performing action:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {status === "inactive"
              ? "Activate Classroom"
              : "Deactivate Classroom"}
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to{" "}
            {status === "inactive" ? "activate" : "deactivate"} this classroom?
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAction} disabled={isLoading}>
            {isLoading ? "Loading..." : "Confirm"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

ActivateDeactivateDialog.displayName = "ActivateDeactivateDialog";
export default ActivateDeactivateDialog;
