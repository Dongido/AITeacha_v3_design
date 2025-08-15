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
import { Loader2 } from "lucide-react";
import { uploadTeachers } from "../../../../api/school";
interface AddSchoolTeachersDialogProps {
  onSuccess?: () => void;
}

interface TeacherData {
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  country: string;
  city: string;
  gender?: string;
  age?: string;
  disability_details?: string;
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
      if (lines.length <= 1) {
        throw new Error(
          "CSV file is empty or only contains a header. Please check the format."
        );
      }

      const data: TeacherData[] = [];
      for (let i = 1; i < lines.length; i++) {
        const [
          firstname,
          lastname,
          phone,
          email,
          country,
          city,
          gender,
          age,
          disability_details,
        ] = lines[i].split(",").map((item) => item.trim());

        if (
          !firstname ||
          !lastname ||
          !phone ||
          !email ||
          !country ||
          !city ||
          !gender ||
          !age
        ) {
          throw new Error(
            `Row ${
              i + 1
            }: All fields (firstname, lastname, phone, email, country, city, gender, age) must be filled. Please check your CSV.`
          );
        }
        data.push({
          firstname,
          lastname,
          phone,
          email,
          country,
          city,
          gender,
          age,

          disability_details: disability_details || undefined,
        });
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
              "No valid teacher data found in the CSV file after parsing."
            );
            setToastVariant("destructive");
            setToastOpen(true);
            setLoading(false);
            return;
          }
          console.log("Parsed Teacher Data:", teachers);

          await uploadTeachers(teachers);

          setToastMessage("Teachers uploaded successfully!");
          setToastVariant("default");
          setToastOpen(true);
          setOpen(false);
          setFile(null);
          onSuccess();
        } catch (error: any) {
          setToastMessage(
            error.message || "Failed to process or upload teachers."
          );
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
            <DialogContent className="max-w-[700px] text-gray-800 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Teachers</DialogTitle>
              </DialogHeader>
              <DialogDescription className="mb-4">
                Upload a{" "}
                <strong className="block mb-2">
                  CSV (Comma Separated Values)
                </strong>{" "}
                file containing teacher information. The CSV should have columns
                in the order:
                <br />
                <span className="font-bold">
                  firstname, lastname, phone, email, country, city, gender, age,
                  disability_details.
                </span>
                <br />
                <span className="text-sm text-gray-500">
                  (e.g.,
                  Jane,Doe,09012345678,jane.doe@example.com,Nigeria,Lagos,Female,35,Wheelchair
                  user)
                </span>
                <br />
                <span className="text-sm text-gray-500">
                  <span className="font-bold">disability_details</span> is
                  optional. Leave blank if not applicable.
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
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{" "}
                  {loading ? `Uploading` : "Upload Teachers"}
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
