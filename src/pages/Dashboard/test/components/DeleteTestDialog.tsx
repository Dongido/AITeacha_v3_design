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
import {
  deleteTest,
  selectIsDeletingTest,
  fetchTests,
} from "../../../../store/slices/testSlice"; // Import the action and the selector
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastViewport,
} from "../../../../components/ui/Toast";

interface IProps {
  testId: any;
  onSuccess?: () => void;
}

const DeleteTestDialog = forwardRef(
  ({ testId, onSuccess = () => {} }: IProps, ref) => {
    const dispatch = useDispatch<AppDispatch>();
    const deleting = useSelector(selectIsDeletingTest);
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
      dispatch(deleteTest(testId))
        .unwrap()
        .then(() => {
          setToastMessage("Test deleted successfully!");
          setToastVariant("default");
          dispatch(fetchTests());
          setToastOpen(true);
          setOpen(false);
          onSuccess();
        })
        .catch((error) => {
          setToastMessage(error || "Failed to delete test.");
          setToastVariant("destructive");
          setToastOpen(true);
        });
    };

    return (
      <ToastProvider swipeDirection="right">
        <>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[450px] text-gray-800">
              <DialogHeader>
                <DialogTitle>Confirm Exam Deletion</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                Are you sure you want to permanently delete this exam?
              </DialogDescription>
              <DialogFooter>
                <Button
                  onClick={onSubmit}
                  variant="destructive"
                  className="rounded-md"
                  disabled={deleting} // Now correctly using the deleting state from the store
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

export default DeleteTestDialog;
