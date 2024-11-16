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
import { deleteClassroomThunk } from "../../../../store/slices/classroomSlice";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastViewport,
} from "../../../../components/ui/Toast";

interface IProps {
  classroomId: number;
  onSuccess?: () => void;
}

const DeleteClassroomDialog = forwardRef(
  ({ classroomId, onSuccess = () => {} }: IProps, ref) => {
    const dispatch = useDispatch<AppDispatch>();
    const { deleting } = useSelector((state: RootState) => state.classrooms);
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
        await dispatch(deleteClassroomThunk(classroomId)).unwrap();
        setToastMessage("Classroom deleted successfully!");
        setToastVariant("default");
        setToastOpen(true); // Open toast on success
        setOpen(false); // Close dialog on success
        onSuccess();
      } catch (error: any) {
        setToastMessage(error.message || "Failed to delete classroom.");
        setToastVariant("destructive");
        setToastOpen(true); // Open toast on failure
      }
    };

    return (
      <ToastProvider swipeDirection="right">
        <>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[450px] text-gray-800">
              <DialogHeader>
                <DialogTitle>Confirm Classroom Deletion</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                Are you sure you want to permanently delete this classroom?
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
            onOpenChange={setToastOpen} // Ensure toast can be manually closed by the user
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

export default DeleteClassroomDialog;
