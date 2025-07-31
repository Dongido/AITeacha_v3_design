import React, { useImperativeHandle, useState, forwardRef } from "react";
import { useDispatch } from "react-redux";
import {
  addAdminResource,
  fetchAdminResources,
} from "../../../../store/slices/adminResourceSlice";
import { AppDispatch } from "../../../../store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/Dialogue";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { Label } from "../../../../components/ui/Label";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastViewport,
} from "../../../../components/ui/Toast";
import { createNotification } from "../../../../store/slices/notificationsSlice";

interface AddAdminResourceDialogProps {
  onSuccess?: () => void;
}

const viewersList = ["all", "teachers", "student"];
const statusOptions = ["active", "deactivated"];

const AddAdminNotificationDialog = forwardRef(
  ({ onSuccess = () => {} }: AddAdminResourceDialogProps, ref) => {
    const dispatch = useDispatch<AppDispatch>();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
      "default"
    );
   
    const [title, setTitle] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [whoViews, setWhoViews] = useState("");
    const [status, setStatus] = useState("");

    useImperativeHandle(ref, () => ({
      openDialog: () => {
        setOpen(true);
        setTitle("");
        setExpiryDate("");
        setWhoViews("");
        setStatus("");
      },
    }));

    const handleAdd = async (event: React.FormEvent) => {
      event.preventDefault();

      if (!title || !expiryDate || !whoViews || !status) {
        setToastMessage("Please fill all fields.");
        setToastVariant("destructive");
        setToastOpen(true);
        return;
      }
       

      setLoading(true);
      try {
        await dispatch(
          createNotification({
            title,
            expiry_date: expiryDate,
            who_views: whoViews,
            status,
          })
        ).unwrap();

        setToastMessage("Notification added successfully!");
        setToastVariant("default");
        setToastOpen(true);
        setOpen(false);
        onSuccess();
        dispatch(fetchAdminResources());
      } catch (error: any) {
        setToastMessage(error || "Failed to add notification.");
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
            <DialogContent className="max-w-[500px] text-gray-800">
              <DialogHeader>
                <DialogTitle>Add New Notification</DialogTitle>
                <DialogDescription>
                  Enter notification details below.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleAdd} className="grid gap-4 py-4">
                {/* Title */}
                <div className="flex flex-col gap-1">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Expiry Date */}
                <div className="flex flex-col gap-1">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    required
                  />
                </div>

                {/* Viewer Dropdown */}
                <div className="flex flex-col gap-1">
                  <Label htmlFor="whoViews">Who Views</Label>
                  <select
                    id="whoViews"
                    value={whoViews}
                    onChange={(e) => setWhoViews(e.target.value)}
                    required
                    className="border rounded px-3 py-2"
                  >
                    <option value="" disabled>Select Viewer</option>
                    {viewersList.map((viewer) => (
                      <option key={viewer} value={viewer}>
                        {viewer}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Dropdown */}
                <div className="flex flex-col gap-1">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                    className="border rounded px-3 py-2"
                  >
                    <option value="" disabled>Select Status</option>
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Actions */}
                <DialogFooter>
                  <Button
                    type="submit"
                    className="rounded-md"
                    variant={"gradient"}
                    disabled={loading}
                  >
                    {loading ? "Adding..." : "Add Notification"}
                  </Button>
                  <Button
                    onClick={() => setOpen(false)}
                    variant="ghost"
                    disabled={loading}
                    type="button"
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </form>
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

export default AddAdminNotificationDialog;
