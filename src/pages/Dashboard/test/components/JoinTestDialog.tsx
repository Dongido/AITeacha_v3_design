  import React, {
    useImperativeHandle,
    useState,
    forwardRef,
    useEffect,
  } from "react";
  import { useDispatch } from "react-redux";
  import { AppDispatch } from "../../../../store";
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
  import { joinTest, validateByCode, checkStudent } from "../../../../api/test";
  import { useNavigate } from "react-router-dom";
  import { fetchStudentExaminations } from "../../../../store/slices/studentTestsSlice";
  const formSchema = z.object({
    code: z.string().min(1, { message: "Test code is required" }),
  });

  const JoinTestDialog = forwardRef((_, ref) => {
    const [open, setOpen] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
      "default"
    );
    const [joining, setJoining] = useState(false);
    const [testDetails, setTestDetails] = useState<any>(null);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const formMethods = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: { code: "" },
    });

    const { handleSubmit, control, watch, reset } = formMethods;
    const testCode = watch("code");

    useImperativeHandle(ref, () => ({ openDialog: () => setOpen(true) }));

    useEffect(() => {
      if (testCode) {
        validateTestCode(testCode);
      }
    }, [testCode]);

    const validateTestCode = async (code: string) => {
      try {
        const response = await validateByCode(code);
        setTestDetails(response[0]);
      } catch (error: any) {
        setToastMessage(error.message || "Invalid test code.");
        setToastVariant("destructive");
        setToastOpen(true);
        setTestDetails(null);
      }
    };
    const userDetails = JSON.parse(
      localStorage.getItem("ai-teacha-user") || "{}"
    );

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
      setJoining(true);
      try {
        if (!testDetails) {
          setToastMessage("Please enter a valid test code.");
          setToastVariant("destructive");
          setToastOpen(true);
          return;
        }
        console.log(testDetails);
        const response = await joinTest({
          join_url: testDetails.join_url,
          join_code: testDetails.join_code,
        });
        await checkStudent(testDetails.join_code);
        await dispatch(fetchStudentExaminations());
        if (userDetails) {
          if (userDetails.role_id === 3 || userDetails.role === 3) {
            setTimeout(() => {
              navigate("/student/test");
            }, 2000);
          } else {
            setTimeout(() => {
              // navigate("/");
              setOpen(false);
            }, 2000);
          }
        }
        setOpen(false);
        reset();
      } catch (error: any) {
        setToastMessage(error.message || "Failed to join test.");
        setToastVariant("destructive");
        setToastOpen(true);
      } finally {
        setJoining(false);
      }
    };

    return (
      <ToastProvider swipeDirection="right" >
        <Dialog open={open} onOpenChange={setOpen} >
          <DialogContent className="max-w-[450px] text-gray-800">
            <DialogHeader>
              <DialogTitle>Join a Test</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Enter the test code to join the exam session.
            </DialogDescription>
            <FormProvider {...formMethods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormField
                  control={control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Test Code</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter test code"
                          {...field}
                          className="rounded-full"
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
                    disabled={joining || !testDetails}
                  >
                    {joining ? "Joining..." : "Join Test"}
                  </Button>
                  <Button
                    onClick={() => {
                      setOpen(false);
                      reset();
                    }}
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
      </ToastProvider>
    );
  });

  export default JoinTestDialog;
