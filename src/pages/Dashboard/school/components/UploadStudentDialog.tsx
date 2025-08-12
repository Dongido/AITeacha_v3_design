import React, { useImperativeHandle, useState, forwardRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { uploadStudents } from "../../../../api/school";

import { Loader2 } from "lucide-react";
interface UploadStudentsCSVDialogProps {
  onSuccess?: () => void;
}

interface StudentData {
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  student_number?: string;
  age?: string;
  gender?: string;
  disability_details?: string;
}

const UploadStudentsCSVDialog = forwardRef(
  ({ onSuccess = () => {} }: UploadStudentsCSVDialogProps, ref) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
      "default"
    );

    useImperativeHandle(ref, () => ({
      openDialog: () => {
        setOpen(true);
        setFile(null); // Reset file input on open
      },
    }));

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        setFile(event.target.files[0]);
      } else {
        setFile(null);
      }
    };

    const parseCSV = (text: string): StudentData[] => {
      const lines = text.split("\n").filter((line) => line.trim() !== "");
      if (lines.length <= 1) {
        throw new Error("CSV file is empty or contains only headers.");
      }

      const data: StudentData[] = [];
      const errors: string[] = [];

      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === "") continue;

        const [
          firstname,
          lastname,
          phone,
          email,
          gender,
          age,
          student_number,
          disability_details,
        ] = lines[i].split(",").map((item) => item.trim());

        if (!firstname || !lastname || !phone || !email || !age || !gender) {
          errors.push(
            `Row ${
              i + 1
            }: Missing required fields (firstname, lastname, phone, email, age, or gender).`
          );
        } else if (!email.includes("@") || !email.includes(".")) {
          errors.push(`Row ${i + 1}: Invalid email format for '${email}'.`);
        } else {
          data.push({
            firstname,
            lastname,
            phone,
            email,
            age,
            gender,
            student_number: student_number || undefined,
            disability_details: disability_details || undefined,
          });
        }
      }

      if (errors.length > 0) {
        throw new Error(
          `Validation Error in CSV: Ensure all required fields are correctly inputted and formatted. Details: ${errors.join(
            " "
          )}`
        );
      }

      return data;
    };

    const handleUploadCSV = async () => {
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
          const students = parseCSV(text);

          console.log("Parsed Student Data:", students);

          const transformedStudents = students.map((student) => {
            const newStudent: any = { ...student };
            if (newStudent.student_number !== undefined) {
              newStudent.assigned_number = newStudent.student_number;
              delete newStudent.student_number;
            }
            return newStudent;
          });

          await uploadStudents(transformedStudents);
          setToastMessage("Students uploaded successfully!");
          setToastVariant("default");
          setToastOpen(true);
          setOpen(false);
          setFile(null);
          onSuccess();
        } catch (error: any) {
          setToastMessage(
            error.message ||
              "Failed to process CSV file. Ensure all fields are correctly inputted."
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
                <DialogTitle>Upload Students via CSV</DialogTitle>
                <DialogDescription className="text-gray-500">
                  Upload a **CSV document** containing student information. The
                  CSV should have columns in the order: <br />
                  <span className="font-bold">
                    firstname, lastname, phone, email, gender, age
                  </span>
                  , and optionally{" "}
                  <span className="font-bold">student_number</span> and{" "}
                  <span className="font-bold">disability_details</span>.
                  <br />
                  <br />
                  <span className="text-sm text-gray-500">
                    (e.g.,
                    John,Doe,1234567890,john.doe@example.com,Male,12,STU001,Wheelchair
                    user)
                  </span>
                  <br />
                  <span className="text-sm text-gray-500">
                    <span className="font-bold">
                      `student_number` and `disability_details`
                    </span>{" "}
                    are optional. Leave blank if not applicable.
                  </span>
                </DialogDescription>
              </DialogHeader>

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
                    className="col-span-3 rounded-full"
                    disabled={loading}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  onClick={handleUploadCSV}
                  disabled={loading || !file}
                  variant={"gradient"}
                  className="mt-4 w-full px-6 py-3 bg-primary text-white rounded-full hover:shadow-lg transition-all duration-300"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{" "}
                  {loading ? `Uploading...` : "Upload Students"}
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

export default UploadStudentsCSVDialog;
