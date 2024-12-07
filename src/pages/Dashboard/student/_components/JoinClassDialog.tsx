import React, { useImperativeHandle, useState, forwardRef } from "react";
import { Button } from "../../../../components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/Dialogue";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastViewport,
} from "../../../../components/ui/Toast";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../store";
import { Input } from "../../../../components/ui/Input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../../../../components/ui/Form";
import { useForm, FormProvider } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { joinClassroom } from "../../../../api/studentclassroom";
import { addStudentToClassroom } from "../../../../api/classrooms";
import { loadStudentClassrooms } from "../../../../store/slices/studentClassroomSlice";

interface IProps {
  classId: number;
  onSuccess?: () => void;
}

const formSchema = z.object({
  code: z.string().min(1, { message: "Class code is required" }),
});

const JoinClassDialog = forwardRef(
  ({ classId, onSuccess = () => {} }: IProps, ref) => {
    const [open, setOpen] = useState(false);

    const dispatch = useDispatch<AppDispatch>();
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
      "default"
    );
    const [joining, setJoining] = useState(false);

    const formMethods = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        code: "",
      },
    });

    const { handleSubmit, control } = formMethods;

    useImperativeHandle(ref, () => ({
      openDialog: () => setOpen(true),
    }));

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
      setJoining(true);

      try {
        const response = await joinClassroom(data.code);
        if (response.status === "success") {
          setToastMessage("Successfully joined the class!");
          setToastVariant("default");
          dispatch(loadStudentClassrooms());
          setToastOpen(true);
          setOpen(false);
          onSuccess();
        } else {
          setToastMessage(response.message || "Failed to join the class.");
          setToastVariant("destructive");
          setToastOpen(true);
        }
      } catch (error: any) {
        setToastMessage(error.message || "Failed to join the class.");
        setToastVariant("destructive");
        setToastOpen(true);
      } finally {
        setJoining(false);
      }
    };

    return (
      <ToastProvider swipeDirection="right">
        <>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[450px] text-gray-800">
              <DialogHeader>
                <DialogTitle>Join A Classroom</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                Enter the class code to join the class.
              </DialogDescription>

              <FormProvider {...formMethods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <FormField
                    control={control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Classroom Code</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter class code"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-300" />
                      </FormItem>
                    )}
                  />

                  <DialogFooter className="mt-5">
                    <Button
                      variant="gradient"
                      className="rounded-md"
                      disabled={joining}
                    >
                      {joining ? "Joining..." : "Yes, Join"}
                    </Button>
                    <Button
                      onClick={() => setOpen(false)}
                      variant="ghost"
                      disabled={joining}
                    >
                      Cancel
                    </Button>
                  </DialogFooter>
                </form>
              </FormProvider>
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

export default JoinClassDialog;
