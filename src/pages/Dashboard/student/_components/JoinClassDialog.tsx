import React, {
  useImperativeHandle,
  useState,
  forwardRef,
  useEffect,
} from "react";
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
import {
  joinClassroom,
  checkIfStudentInClassroom,
  fetchClassroomByJoinCode,
} from "../../../../api/classrooms";
import { loadStudentClassrooms } from "../../../../store/slices/studentClassroomSlice";
import { verifyPayment } from "../../../../api/subscription";
import { FLUTTERWAVE_PUBLIC } from "../../../../lib/utils";
import { useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
      "default"
    );
    const [joining, setJoining] = useState(false);
    const [classroom, setClassroom] = useState<any>(null);
    const [isStudent, setIsStudent] = useState(false);

    const formMethods = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: { code: "" },
    });

    const { handleSubmit, control, watch } = formMethods;
    const classCode = watch("code");

    useImperativeHandle(ref, () => ({ openDialog: () => setOpen(true) }));

    useEffect(() => {
      if (classCode) {
        fetchClassroomData(classCode);
      }
    }, [classCode]);

    const fetchClassroomData = async (code: string) => {
      try {
        const response = await fetchClassroomByJoinCode(code);
        setClassroom(response);
        const studentCheck = await checkIfStudentInClassroom(response.id);
        setIsStudent(studentCheck);
      } catch (error) {
        setToastMessage("Invalid class code.");
        setToastVariant("destructive");
        setToastOpen(true);
      }
    };
    const userDetails = JSON.parse(
      localStorage.getItem("ai-teacha-user") || "{}"
    );

    const handlePayment = async () => {
      if (!classroom) return;

      const userEmail = userDetails.email || "default@email.com";
      const userName = `${userDetails.firstName} ${userDetails.lastName}`;

      const paymentConfig = {
        public_key: FLUTTERWAVE_PUBLIC,
        tx_ref: `classroom_${classroom.id}_${Date.now()}`,
        amount: classroom.amount,
        currency: classroom.currency || "USD",
        payment_options: "card, mobilemoney, ussd",
        customer: {
          email: userEmail,
          name: userName,
        },
        customizations: {
          title: "Classroom Payment",
          description: `Payment for ${classroom.name}`,
        },
      };

      const flutterwaveWindow = window.open(
        "",
        "_blank",
        "width=800,height=600"
      );

      if (!flutterwaveWindow) {
        alert("Popup blocked! Please allow popups for this site.");
        return;
      }

      flutterwaveWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <title>Flutterwave Payment</title>
          <script src="https://checkout.flutterwave.com/v3.js"></script>
      </head>
      <body>
          <script>
              const config = ${JSON.stringify(paymentConfig)};
              function makePayment() {
                  FlutterwaveCheckout({
                      ...config,
                      callback: (response) => {
                          window.opener.postMessage({ status: response.status, transaction_id: response.transaction_id }, "*");
                          window.close();
                      },
                      onclose: () => {
                          window.opener.postMessage({ status: "closed" }, "*");
                          window.close();
                      }
                  });
              }
              makePayment();
          </script>
      </body>
      </html>
    `);

      window.addEventListener("message", async (event) => {
        if (event.origin !== window.location.origin) return;
        const { status, transaction_id } = event.data;

        if (status === "successful") {
          await verifyPayment(
            transaction_id,
            classroom,
            userDetails.id,
            userDetails.email,
            "classroom_payment"
          );
          await joinClassroom(classroom.join_url, classroom.join_code);
          setToastMessage("Payment successful! You have joined the classroom.");
          setToastVariant("default");
          setToastOpen(true);

          setTimeout(() => {
            navigate(navigateToClassroom);
          }, 2000);
        } else {
          setToastMessage("Payment failed.");
          setToastVariant("destructive");
          setToastOpen(true);
        }
      });
    };

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
      setJoining(true);
      try {
        const response = await fetchClassroomByJoinCode(classCode);
        setClassroom(response);
        console.log(response);
        const studentCheck = await checkIfStudentInClassroom(response.id);
        setIsStudent(studentCheck);

        if (response.class_type === "Paid") {
          handlePayment();
        } else {
          const joinResponse = await joinClassroom(
            response.join_url,
            response.join_code
          );

          if (joinResponse.status === "success") {
            setToastMessage("Successfully joined the class!");
            setToastVariant("default");
            dispatch(loadStudentClassrooms());
            setToastOpen(true);
            setOpen(false);
            onSuccess();

            setTimeout(() => {
              navigate(navigateToClassroom);
            }, 2000);
          } else {
            setToastMessage(
              joinResponse.message || "Failed to join the class."
            );
            setToastVariant("destructive");
            setToastOpen(true);
          }
        }
      } catch (error: any) {
        setToastMessage(error.message || "Invalid class code.");
        setToastVariant("destructive");
        setToastOpen(true);
      } finally {
        setJoining(false);
      }
    };

    const navigateToClassroom =
      userDetails.role === 3
        ? `/class/classrooms/class-details/${classroom?.id}`
        : `/class/classrooms/class-details/${classroom?.id}`;

    return (
      <ToastProvider swipeDirection="right">
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
      </ToastProvider>
    );
  }
);

export default JoinClassDialog;
