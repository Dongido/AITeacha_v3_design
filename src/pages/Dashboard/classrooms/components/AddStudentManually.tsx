import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/Dialogue";
import { Button } from "../../../../components/ui/Button";
import { manuallyAddStudentToClassroom } from "../../../../api/studentclassroom";
import { Input } from "../../../../components/ui/Input";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastViewport,
} from "../../../../components/ui/Toast";

interface AddStudentDialogProps {
  onSuccess?: () => void;
  initialClassroomId?: string;
}

interface AddStudentDialogRef {
  openDialog: (classroomId?: string) => void;
}

const AddStudentDialog = forwardRef<AddStudentDialogRef, AddStudentDialogProps>(
  ({ onSuccess, initialClassroomId }, ref) => {
    const [open, setOpen] = useState(false);

    // multiple emails state
    const [emails, setEmails] = useState<string[]>([""]);

    const [classroomId, setClassroomId] = useState(initialClassroomId || "");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
      "default"
    );

    useImperativeHandle(ref, () => ({
      openDialog: (id?: string) => {
        setOpen(true);
        if (id) {
          setClassroomId(id);
        }
        setErrorMessage(null);
        setSuccessMessage(null);
        setIsLoading(false);
      },
    }));

    const handleAddStudent = async () => {
      setErrorMessage(null);
      setSuccessMessage(null);
      setIsLoading(true);

      try {
        const email = emails;
        console.log("email", email);

        if (!email || !classroomId) {
          setErrorMessage("Email and Classroom ID are required.");
          return;
        }
        const response = await manuallyAddStudentToClassroom({
          email,
          classroom_id: classroomId,
        });
        setSuccessMessage(response.message || "Student added successfully!");
        setToastMessage("Classroom added successfully!");
        setToastVariant("default");
        setToastOpen(true);
        setOpen(false);
        setEmails([""]);
        if (onSuccess) {
          onSuccess();
          setOpen(false);
        }
      } catch (error: any) {
        console.error("Error adding student:", error);
        setErrorMessage(
          error.message || "Failed to add student. Please try again."
        );
        setToastMessage(error.message || "Failed to delete classroom.");
        setToastVariant("destructive");
        setToastOpen(true);
      } finally {
        setOpen(false);
        setIsLoading(false);
      }
    };

    const handleClose = () => {
      setOpen(false);
      setEmails([""]);
      if (!initialClassroomId) {
        setClassroomId("");
      }
      setErrorMessage(null);
      setSuccessMessage(null);
    };

    return (
      <ToastProvider swipeDirection="right">
        <Dialog open={open} onOpenChange={handleClose}>
          <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto p-6 rounded-lg shadow-xl bg-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800">
                Add Student to Classroom
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {emails.map((email, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <label
                    htmlFor={`email-${index}`}
                    className="text-sm font-medium text-gray-700"
                  >
                    Student Email {index + 1}
                  </label>
                  <Input
                    id={`email-${index}`}
                    type="email"
                    value={email}
                    onChange={(e) => {
                      const newEmails = [...emails];
                      newEmails[index] = e.target.value;
                      setEmails(newEmails);
                    }}
                    className="p-2 rounded-md"
                    placeholder="student@example.com"
                  />
                </div>
              ))}

              {/* Plus button to add more inputs */}
              <Button
                type="button"
                variant="outline"
                onClick={() => setEmails([...emails, ""])}
                className="mt-2 flex items-center justify-center gap-2 border border-dashed border-gray-400 text-purple-600 hover:bg-gray-100 rounded-md"
              >
                + Add
              </Button>

              {errorMessage && (
                <p className="text-red-600 text-sm mt-2">{errorMessage}</p>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button
                onClick={handleAddStudent}
                disabled={isLoading || !emails[0] || !classroomId}
                variant="gradient"
                className="px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Adding..." : "Submit"}
              </Button>
              <Button
                variant="outline"
                onClick={handleClose}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-200"
              >
                Cancel
              </Button>
            </div>
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
      </ToastProvider>
    );
  }
);

AddStudentDialog.displayName = "AddStudentDialog";

export default AddStudentDialog;
