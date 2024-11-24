import React, { useImperativeHandle, useState, forwardRef } from "react";
import { useDispatch } from "react-redux";
import { removeStudentFromClassroomThunk } from "../../../../store/slices/classroomSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/Dialogue";
import { Button } from "../../../../components/ui/Button";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastViewport,
} from "../../../../components/ui/Toast";
import { AppDispatch } from "../../../../store";

interface RemoveStudentDialogProps {
  classroomId: number;
  studentId: number;
  studentName: string;
  onSuccess?: () => void;
}

const RemoveStudentDialog = forwardRef(
  (
    {
      classroomId,
      studentId,
      studentName,
      onSuccess = () => {},
    }: RemoveStudentDialogProps,
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

    useImperativeHandle(ref, () => ({
      openDialog: () => setOpen(true),
    }));

    const handleRemove = async () => {
      setLoading(true);
      try {
        await dispatch(
          removeStudentFromClassroomThunk({ classroomId, studentId })
        ).unwrap();
        setToastMessage("Student removed successfully!");
        setToastVariant("default");
        setToastOpen(true);
        setOpen(false);
        onSuccess();
      } catch (error: any) {
        setToastMessage(error.message || "Failed to remove student.");
        setToastVariant("destructive");
        setToastOpen(true);
      } finally {
        setLoading(false);
      }
    };

    return (
      <ToastProvider swipeDirection="right">
        <>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[450px] text-gray-800">
              <DialogHeader>
                <DialogTitle>Confirm Removal</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                Are you sure you want to remove <strong>{studentName}</strong>{" "}
                from this classroom? This action cannot be undone.
              </DialogDescription>
              <DialogFooter>
                <Button
                  onClick={handleRemove}
                  variant="destructive"
                  className="rounded-md"
                  disabled={loading}
                >
                  {loading ? "Removing..." : "Yes, Remove"}
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
        </>
      </ToastProvider>
    );
  }
);

export default RemoveStudentDialog;
