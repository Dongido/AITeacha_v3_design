import React, { useImperativeHandle, useState, forwardRef } from "react";
import { Button } from "../../../components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/Dialogue";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import {
  deleteTeamMemberThunk,
  loadTeamMembers,
} from "../../../store/slices/teamSlice";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastViewport,
} from "../../../components/ui/Toast";

interface IProps {
  email: string;
  onSuccess?: () => void;
}

const DeleteTeamMemberDialog = forwardRef(
  ({ email, onSuccess = () => {} }: IProps, ref) => {
    const dispatch = useDispatch<AppDispatch>();
    const { deleting, deleteError } = useSelector(
      (state: RootState) => state.team
    );
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
        await dispatch(deleteTeamMemberThunk(email)).unwrap();
        setToastMessage("Team member deleted successfully!");
        await dispatch(loadTeamMembers());
        setToastVariant("default");
        setToastOpen(true);
        setOpen(false);
        onSuccess();
      } catch (error: any) {
        setToastMessage(error);
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
                <DialogTitle>Confirm Team Member Deletion</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                Are you sure you want to permanently delete this team member?
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

export default DeleteTeamMemberDialog;
