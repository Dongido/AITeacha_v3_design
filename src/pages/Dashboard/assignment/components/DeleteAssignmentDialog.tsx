import React, { useImperativeHandle, useState, forwardRef } from "react";
import { Button } from "../../../../components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/Dialogue";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
import { deleteAssignmentThunk } from "../../../../store/slices/assignmentSlice";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastViewport,
} from "../../../../components/ui/Toast";

interface IProps {
  assignmentId: number;
  onSuccess?: () => void;
}

const DeleteAssignmentDialog = forwardRef(
  ({ assignmentId, onSuccess = () => {} }: IProps, ref) => {
    const dispatch = useDispatch<AppDispatch>();
    const { deleting } = useSelector((state: RootState) => state.assignments);
    const [open, setOpen] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
      "default"
    );

    useImperativeHandle(ref, () => ({
      openDialog: () => setOpen(true),
    }));

    const onSubmit = async () => {
      try {
        await dispatch(deleteAssignmentThunk(assignmentId)).unwrap();
        setToastMessage("Assignment deleted successfully!");
        setToastVariant("default");
        setToastOpen(true);
        setOpen(false);
        onSuccess();
      } catch (error: any) {
        setToastMessage(error.message || "Failed to delete assignment.");
        setToastVariant("destructive");
        setToastOpen(true);
      }
    };

    return (
      <ToastProvider swipeDirection="right">
        <>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[450px] text-gray-800">
              <DialogHeader>
                <DialogTitle>Confirm Assignment Deletion</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                Are you sure you want to permanently delete this assignment?
              </DialogDescription>
              <DialogFooter>
                <Button
                  onClick={onSubmit}
                  variant="destructive"
                  className="rounded-md"
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Yes, Delete"}
                </Button>
                <Button
                  onClick={() => setOpen(false)}
                  variant="ghost"
                  disabled={deleting}
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

export default DeleteAssignmentDialog;
