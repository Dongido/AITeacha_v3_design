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

import {
  deleteLiveClass,
  listLiveClassesByUser,
} from "../../../../api/liveclass";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastViewport,
} from "../../../../components/ui/Toast";

interface IProps {
  classroomId: any;
  meetingId: any;
  onSuccess?: () => void;
}

const DeleteMeetingDialog = forwardRef(
  ({ classroomId, meetingId, onSuccess = () => {} }: IProps, ref) => {
    const [open, setOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
      "default"
    );

    useImperativeHandle(ref, () => ({
      openDialog: () => setOpen(true),
    }));

    const onSubmit = async () => {
      setIsDeleting(true);
      try {
        await deleteLiveClass(meetingId);
        setToastMessage("Meeting deleted successfully!");
        setToastVariant("default");
        setToastOpen(true);
        setOpen(false);
        window.location.reload();

        onSuccess();
      } catch (error: any) {
        setToastMessage(error.message || "Failed to delete meeting.");
        setToastVariant("destructive");
        setToastOpen(true);
      } finally {
        setIsDeleting(false);
      }
    };

    return (
      <ToastProvider swipeDirection="right">
        <>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[450px] text-gray-800">
              <DialogHeader>
                <DialogTitle>Confirm Meeting Deletion</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                Are you sure you want to permanently delete this meeting?
                <br />
                <span className="font-bold my-2 text-gray-700">
                  All associated data, including transcripts, notes, and
                  assessments, will also be permanently deleted.
                </span>
              </DialogDescription>
              <DialogFooter>
                <Button
                  onClick={onSubmit}
                  variant="destructive"
                  className="rounded-md"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete"}
                </Button>
                <Button
                  onClick={() => setOpen(false)}
                  variant="ghost"
                  disabled={isDeleting}
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

export default DeleteMeetingDialog;
