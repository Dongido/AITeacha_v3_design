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

interface AddAdminResourceDialogProps {
  onSuccess?: () => void;
}

const AddAdminResourceDialog = forwardRef(
  ({ onSuccess = () => {} }: AddAdminResourceDialogProps, ref) => {
    const dispatch = useDispatch<AppDispatch>();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
      "default"
    );

    const [file, setFile] = useState<File | null>(null);
    const [subject, setSubject] = useState("");
    const [grade, setGrade] = useState("");
    const [country, setCountry] = useState("");
    const [title, setTitle] = useState("");

    useImperativeHandle(ref, () => ({
      openDialog: () => {
        setOpen(true);
        setFile(null);
        setSubject("");
        setGrade("");
        setCountry("");
        setTitle("");
      },
    }));

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
        setFile(event.target.files[0]);
      } else {
        setFile(null);
      }
    };

    const handleAdd = async (event: React.FormEvent) => {
      event.preventDefault();

      if (!file || !subject || !grade || !country || !title) {
        setToastMessage("Please fill all fields and select a file.");
        setToastVariant("destructive");
        setToastOpen(true);
        return;
      }

      setLoading(true);
      try {
        await dispatch(
          addAdminResource({
            file,
            subject,
            grade,
            country,
            title,
          })
        ).unwrap();
        setToastMessage("Admin resource added successfully!");
        setToastVariant("default");
        setToastOpen(true);
        setOpen(false);
        onSuccess();
        dispatch(fetchAdminResources());
      } catch (error: any) {
        setToastMessage(error || "Failed to add admin resource.");
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
                <DialogTitle>Add New Admin Resource</DialogTitle>
                <DialogDescription>
                  Upload a new resource file along with its details.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAdd} className="grid gap-4 py-4">
                {/* File Input */}
                <div className="flex flex-col gap-1">
                  <Label htmlFor="file">File</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    required
                  />
                </div>
                {/* Title Input */}
                <div className="flex flex-col gap-1">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                {/* Subject Input */}
                <div className="flex flex-col gap-1">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
                {/* Grade Input */}
                <div className="flex flex-col gap-1">
                  <Label htmlFor="grade">Grade</Label>
                  <Input
                    id="grade"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    required
                  />
                </div>
                {/* Country Input */}
                <div className="flex flex-col gap-1">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    className="rounded-md"
                    variant={"gradient"}
                    disabled={loading}
                  >
                    {loading ? "Adding..." : "Add Resource"}
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

export default AddAdminResourceDialog;
