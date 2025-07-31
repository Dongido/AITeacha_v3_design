import React, {
  useImperativeHandle,
  useState,
  forwardRef,
  useEffect,
} from "react";
import { useDispatch } from "react-redux";
import {
  fetchAdminResources,
} from "../../../../store/slices/adminResourceSlice";
import { AppDispatch, RootState } from "../../../../store";
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
import {
  getNotificationbyId,
  updateNofication,
} from "../../../../store/slices/notificationsSlice";
import { useAppSelector } from "../../../../store/hooks";

interface AddAdminResourceDialogProps {
  onSuccess?: () => void;
  id: string;
}

const viewersList = ["all", "teacher", "student"];
const statusOptions = ["active", "deactivated"];

const AddAdminNotificationDialog = forwardRef(
  ({ onSuccess = () => {}, id }: AddAdminResourceDialogProps, ref) => {
    const dispatch = useDispatch<AppDispatch>();
    const [open, setOpen] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState<
      "default" | "destructive"
    >("default");

    const { notification, notificationloading } = useAppSelector(
      (state: RootState) => state.notifications
    );
    //  console.log("notificationloading", notificationloading)

    const [title, setTitle] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [whoViews, setWhoViews] = useState("");
    const [status, setStatus] = useState("");

    useImperativeHandle(ref, () => ({
      openDialog: () => {
        setOpen(true);
        if (id) {
          dispatch(getNotificationbyId(id));
        } else {
          setTitle("");
          setExpiryDate("");
          setWhoViews("");
          setStatus("");
        }
      },
    }));

    useEffect(() => {
      if (notification && !notificationloading) {
        setTitle(notification.title || "");
        setExpiryDate(notification.expiry_date?.split("T")[0] || "");
        setWhoViews(notification.who_views || "");
        setStatus(notification.status || "");
      }
    }, [notification, notificationloading, open]);

    const handleAdd = async (event: React.FormEvent) => {
      event.preventDefault();

      if (!title || !expiryDate || !whoViews || !status) {
        setToastMessage("Please fill all fields.");
        setToastVariant("destructive");
        setToastOpen(true);
        return;
      }
       console.log("status", status, whoViews)

      setSubmitting(true);
      try {
        await dispatch(
          updateNofication({
            id,
            title,
            expiry_date: expiryDate,
            who_views: whoViews,
            status:status,
          })
        ).unwrap();

        setToastMessage("Notification updated successfully!");
        setToastVariant("default");
        setToastOpen(true);
        setOpen(false);
        onSuccess();
        dispatch(fetchAdminResources());
      } catch (error: any) {
        setToastMessage(error?.message || "Failed to update notification.");
        setToastVariant("destructive");
        setToastOpen(true);
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <ToastProvider swipeDirection="right">
        <>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[500px] text-gray-800">
              <DialogHeader>
                <DialogTitle>Edit Notification</DialogTitle>
                <DialogDescription>
                  Update the fields below.
                </DialogDescription>
              </DialogHeader>

              {/* LOADING STATE */}
              {notificationloading ? (
                <div className="py-8 text-center text-gray-500">Loading...</div>
              ) : (
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

                  <DialogFooter>
                    <Button
                      type="submit"
                      className="rounded-md"
                      variant={"gradient"}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Save Notification"}
                    </Button>
                    <Button
                      onClick={() => setOpen(false)}
                      variant="ghost"
                      disabled={isSubmitting}
                      type="button"
                    >
                      Cancel
                    </Button>
                  </DialogFooter>
                </form>
              )}
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
