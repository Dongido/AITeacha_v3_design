import React, { useState, useImperativeHandle, forwardRef } from "react";
import { Toast, ToastProvider, ToastTitle, ToastViewport } from "../ui/Toast";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/Dialogue";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { changePasswordThunk } from "../../store/slices/profileSlice";
import { useAppDispatch } from "../../store/hooks";


interface ChangePasswordDialogProps {
  onChangePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const ChangePasswordDialog = forwardRef(({ onChangePassword }: ChangePasswordDialogProps, ref) => {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"default" | "destructive">("default");
   const dispatch = useAppDispatch();

  useImperativeHandle(ref, () => ({
    openDialog: () => setOpen(true),
  }));

  const showToast = (msg: string, variant: "default" | "destructive") => {
    setToastMessage(msg);
    setToastVariant(variant);
    setToastOpen(true);
  };

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast("All fields are required.", "destructive");
      return;
    }

    if (newPassword.length < 6) {
      showToast("New password must be at least 6 characters long.", "destructive");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match.", "destructive");
      return;
    }

    try {
      setLoading(true);
        await dispatch(changePasswordThunk({
        oldPassword: currentPassword,
        password: newPassword
        })).unwrap()
      showToast("Password changed successfully!", "default");
      setOpen(false);
    } catch (err: any) {
      showToast(err?.message || "Failed to change password.", "destructive");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToastProvider>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md text-gray-800">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Current Password</Label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
            </div>

            <div>
              <Label>New Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>

            <div>
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="gradient"className="border-2 border-purple-100"  onClick={handleSubmit} disabled={loading}>
              {loading ? "Changing..." : "Change Password"}
            </Button>
            <Button variant="default" onClick={() => setOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toast open={toastOpen} onOpenChange={setToastOpen} variant={toastVariant}>
        <ToastTitle>{toastMessage}</ToastTitle>
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
});

export default ChangePasswordDialog;
