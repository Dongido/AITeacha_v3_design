import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
    const [email, setEmail] = useState("");
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
        if (!email || !classroomId) {
          setErrorMessage("Email and Classroom ID are required.");
          return;
        }

        const response = await manuallyAddStudentToClassroom({
          email,
          classroom_id: classroomId,
        });

        setSuccessMessage(response.message || "Student added successfully!");
        setToastMessage("Classroom deleted successfully!");
        setToastVariant("default");
        setToastOpen(true);
        setOpen(false);
        setEmail("");
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
      setEmail("");
      if (!initialClassroomId) {
        setClassroomId("");
      }
      setErrorMessage(null);
      setSuccessMessage(null);
    };

    return (
      <ToastProvider swipeDirection="right">
        <Dialog open={open} onOpenChange={handleClose}>
          <DialogContent className="sm:max-w-[425px] p-6 rounded-lg shadow-xl bg-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800">
                Add Student to Classroom
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Student Email     
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="p-2 rounded-md"
                  placeholder="student@example.com"
                />
              </div>
              {errorMessage && (
                <p className="text-red-600 text-sm mt-2">{errorMessage}</p>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button
                onClick={handleAddStudent}
                disabled={isLoading || !email || !classroomId}
                variant="gradient"
                className="px-4 py-2 rounded-md  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Adding..." : "Add Student"}
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
