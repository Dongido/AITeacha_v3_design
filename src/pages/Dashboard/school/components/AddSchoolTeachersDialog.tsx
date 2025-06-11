import React, { useImperativeHandle, useState, forwardRef } from "react";
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

interface AddSchoolTeachersDialogProps {
  onSuccess?: () => void;
}

interface TeacherData {
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
}

const AddSchoolTeachersDialog = forwardRef(
  ({ onSuccess = () => {} }: AddSchoolTeachersDialogProps, ref) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
      "default"
    );

    useImperativeHandle(ref, () => ({
      openDialog: () => setOpen(true),
    }));

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        setFile(event.target.files[0]);
      } else {
        setFile(null);
      }
    };

    const parseCSV = (text: string): TeacherData[] => {
      const lines = text.split("\n").filter((line) => line.trim() !== "");
      if (lines.length === 0) return [];

      const data: TeacherData[] = [];
      for (let i = 1; i < lines.length; i++) {
        const [firstname, lastname, phone, email] = lines[i]
          .split(",")
          .map((item) => item.trim());

        if (firstname && lastname && phone && email) {
          data.push({ firstname, lastname, phone, email });
        }
      }
      return data;
    };

    const handleUpload = async () => {
      if (!file) {
        setToastMessage("Please select a CSV file to upload.");
        setToastVariant("destructive");
        setToastOpen(true);
        return;
      }

      if (file.type !== "text/csv") {
        setToastMessage("Please upload a valid CSV file.");
        setToastVariant("destructive");
        setToastOpen(true);
        return;
      }

      setLoading(true);
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const text = e.target?.result as string;
          const teachers = parseCSV(text);

          if (teachers.length === 0) {
            setToastMessage(
              "CSV file is empty or malformed. Please check the format."
            );
            setToastVariant("destructive");
            setToastOpen(true);
            setLoading(false);
            return;
          }

          console.log("Parsed Teacher Data:", teachers);

          setToastMessage("Teachers uploaded successfully!");
          setToastVariant("default");
          setToastOpen(true);
          setOpen(false);
          setFile(null);
          onSuccess();
        } catch (error: any) {
          setToastMessage(error.message || "Failed to process CSV file.");
          setToastVariant("destructive");
          setToastOpen(true);
        } finally {
          setLoading(false);
        }
      };

      reader.onerror = () => {
        setToastMessage("Error reading file.");
        setToastVariant("destructive");
        setToastOpen(true);
        setLoading(false);
      };

      reader.readAsText(file);
    };

    return (
      <ToastProvider swipeDirection="right">
        <>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[500px] text-gray-800">
              <DialogHeader>
                <DialogTitle>Add New Teachers</DialogTitle>
              </DialogHeader>
              <DialogDescription className="mb-4">
                Upload a **CSV document** containing teacher information. The
                CSV should have columns in the order: <br />
                <span className="font-bold">
                  firstname, lastname, phone, email, and employee ID.
                </span>
                <br />
                <span className="text-sm text-gray-500">
                  (e.g., Jane,Doe,09012345678,jane.doe@example.com,EMP001)
                </span>
              </DialogDescription>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="csvFile" className="text-right">
                    CSV File
                  </Label>
                  <Input
                    id="csvFile"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="col-span-3"
                    disabled={loading}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleUpload}
                  disabled={loading || !file}
                  className="rounded-md"
                  variant={"gradient"}
                >
                  {loading ? "Uploading..." : "Upload Teachers"}
                </Button>
                <Button
                  onClick={() => {
                    setOpen(false);
                    setFile(null);
                  }}
                  variant="ghost"
                  disabled={loading}
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

export default AddSchoolTeachersDialog;
