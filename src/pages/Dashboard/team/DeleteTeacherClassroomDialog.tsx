import React, { useImperativeHandle, useState, forwardRef } from "react";
import { UseDispatch } from "react-redux";
import { AppDispatch } from "../../../store";
import { Button } from "../../../components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/Dialogue";
import { useDispatch } from "react-redux";

import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastViewport,
} from "../../../components/ui/Toast";
import { deleteTeacherAssignedClassroom } from "../../../api/teams";
import {
  getAssignedTeamClassrooms,
  getTeacherAssignedTeamClassrooms,
} from "../../../store/slices/teamClassroomSlice";
interface IProps {
  classroomId: string;
  onSuccess?: () => void;
}

const DeleteTeacherAssignedClassroomDialog = forwardRef(
  ({ classroomId, onSuccess = () => {} }: IProps, ref) => {
    const dispatch = useDispatch<AppDispatch>();
    const [open, setOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
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
        setDeleting(true);
        await deleteTeacherAssignedClassroom(classroomId);
        dispatch(getAssignedTeamClassrooms());
        dispatch(getTeacherAssignedTeamClassrooms());

        setToastMessage("Teacher's assigned classroom deleted successfully!");
        setToastVariant("default");
        setToastOpen(true);
        setOpen(false);
        onSuccess();
      } catch (error: any) {
        setToastMessage(
          error.message || "Failed to delete assigned classroom."
        );
        setToastVariant("destructive");
        setToastOpen(true);
      } finally {
        setDeleting(false);
      }
    };

    return (
      <ToastProvider swipeDirection="right">
        <>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[450px] text-gray-800">
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                Are you sure you want to remove this teacher from the assigned
                classroom?
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

export default DeleteTeacherAssignedClassroomDialog;
