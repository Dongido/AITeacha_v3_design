// import React, {
//   useImperativeHandle,
//   useState,
//   forwardRef,
//   useEffect,
// } from "react";
// import { Button } from "../../../../components/ui/Button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "../../../../components/ui/Dialogue";
// import {
//   ToastProvider,
//   Toast,
//   ToastTitle,
//   ToastViewport,
// } from "../../../../components/ui/Toast";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "../../../../store";
// import { Input } from "../../../../components/ui/Input";
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
// } from "../../../../components/ui/Form";
// import { useForm, FormProvider } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   joinClassroom,
//   checkIfStudentInClassroom,
//   fetchClassroomByJoinCode,
// } from "../../../../api/classrooms";
// import { loadStudentClassrooms } from "../../../../store/slices/studentClassroomSlice";
// import { verifyPayment } from "../../../../api/subscription";
// import { FLUTTERWAVE_PUBLIC } from "../../../../lib/utils";
// import { useNavigate } from "react-router-dom";
// interface IProps {
//   classId: number;
//   onSuccess?: () => void;
// }

// const formSchema = z.object({
//   code: z.string().min(1, { message: "Class code is required" }),
// });

// const JoinClassDialog = forwardRef(
//   ({ classId, onSuccess = () => {} }: IProps, ref) => {
//     const [open, setOpen] = useState(false);
//     const dispatch = useDispatch<AppDispatch>();
//     const [toastOpen, setToastOpen] = useState(false);
//     const navigate = useNavigate();
//     const [toastMessage, setToastMessage] = useState("");
//     const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
//       "default"
//     );
//     const [joining, setJoining] = useState(false);
//     const [classroom, setClassroom] = useState<any>(null);
//     const [isStudent, setIsStudent] = useState(false);

//     const formMethods = useForm<z.infer<typeof formSchema>>({
//       resolver: zodResolver(formSchema),
//       defaultValues: { code: "" },
//     });

//     const { handleSubmit, control, watch } = formMethods;
//     const classCode = watch("code");

//     useImperativeHandle(ref, () => ({ openDialog: () => setOpen(true) }));

//     useEffect(() => {
//       if (classCode) {
//         fetchClassroomData(classCode);
//       }
//     }, [classCode]);

//     const fetchClassroomData = async (code: string) => {
//       try {
//         const response = await fetchClassroomByJoinCode(code);
//         setClassroom(response);
//         const studentCheck = await checkIfStudentInClassroom(response.id);
//         setIsStudent(studentCheck);
//       } catch (error) {
//         setToastMessage("Invalid class code.");
//         setToastVariant("destructive");
//         setToastOpen(true);
//       }
//     };
//     const userDetails = JSON.parse(
//       localStorage.getItem("ai-teacha-user") || "{}"
//     );

//     const handlePayment = async () => {
//       if (!classroom) return;

//       const userEmail = userDetails.email || "default@email.com";
//       const userName = `${userDetails.firstName} ${userDetails.lastName}`;

//       const paymentConfig = {
//         public_key: FLUTTERWAVE_PUBLIC,
//         tx_ref: `classroom_${classroom.id}_${Date.now()}`,
//         amount: classroom.amount,
//         currency: classroom.currency || "USD",
//         payment_options: "card, mobilemoney, ussd",
//         customer: {
//           email: userEmail,
//           name: userName,
//         },
//         customizations: {
//           title: "Classroom Payment",
//           description: `Payment for ${classroom.name}`,
//         },
//       };

//       const flutterwaveWindow = window.open(
//         "",
//         "_blank",
//         "width=800,height=600"
//       );

//       if (!flutterwaveWindow) {
//         alert("Popup blocked! Please allow popups for this site.");
//         return;
//       }

//       flutterwaveWindow.document.write(`
//       <!DOCTYPE html>
//       <html lang="en">
//       <head>
//           <title>Flutterwave Payment</title>
//           <script src="https://checkout.flutterwave.com/v3.js"></script>
//       </head>
//       <body>
//           <script>
//               const config = ${JSON.stringify(paymentConfig)};
//               function makePayment() {
//                   FlutterwaveCheckout({
//                       ...config,
//                       callback: (response) => {
//                           window.opener.postMessage({ status: response.status, transaction_id: response.transaction_id }, "*");
//                           window.close();
//                       },
//                       onclose: () => {
//                           window.opener.postMessage({ status: "closed" }, "*");
//                           window.close();
//                       }
//                   });
//               }
//               makePayment();
//           </script>
//       </body>
//       </html>
//     `);

//       window.addEventListener("message", async (event) => {
//         if (event.origin !== window.location.origin) return;
//         const { status, transaction_id } = event.data;

//         if (status === "successful") {
//           await verifyPayment(
//             transaction_id,
//             classroom,
//             userDetails.id,
//             userDetails.email,
//             "classroom_payment"
//           );
//           await joinClassroom(classroom.join_url, classroom.join_code);
//           setToastMessage("Payment successful! You have joined the classroom.");
//           setToastVariant("default");
//           setToastOpen(true);

//           setTimeout(() => {
//             navigate(navigateToClassroom);
//           }, 2000);
//         } else {
//           setToastMessage("Payment failed.");
//           setToastVariant("destructive");
//           setToastOpen(true);
//         }
//       });
//     };

//     const onSubmit = async (data: z.infer<typeof formSchema>) => {
//       setJoining(true);
//       try {
//         const response = await fetchClassroomByJoinCode(classCode);
//         setClassroom(response);
//         console.log(response);
//         const studentCheck = await checkIfStudentInClassroom(response.id);
//         setIsStudent(studentCheck);

//         if (studentCheck) {
//           setToastMessage("You are already enrolled in this classroom!");
//           setToastVariant("default");
//           setToastOpen(true);
//           setOpen(false);
//           onSuccess();
//           setTimeout(() => {
//             navigate(navigateToClassroom);
//           }, 2000);
//           return;
//         }
//         if (response.class_type === "Paid") {
//           handlePayment();
//         } else {
//           const joinResponse = await joinClassroom(
//             response.join_url,
//             response.join_code
//           );

//           if (joinResponse.status === "success") {
//             setToastMessage("Successfully joined the class!");
//             setToastVariant("default");
//             dispatch(loadStudentClassrooms());
//             setToastOpen(true);
//             setOpen(false);
//             onSuccess();

//             setTimeout(() => {
//               navigate(navigateToClassroom);
//             }, 2000);
//           } else {
//             setToastMessage(
//               joinResponse.message || "Failed to join the class."
//             );
//             setToastVariant("destructive");
//             setToastOpen(true);
//           }
//         }
//       } catch (error: any) {
//         setToastMessage(error.message || "Invalid class code.");
//         setToastVariant("destructive");
//         setToastOpen(true);
//       } finally {
//         setJoining(false);
//       }
//     };

//     const navigateToClassroom =
//       userDetails.role === 3
//         ? `/class/classrooms/class-details/${classroom?.id}`
//         : `/class/classrooms/class-details/${classroom?.id}`;

//     return (
//       <ToastProvider swipeDirection="right">
//         <Dialog open={open} onOpenChange={setOpen}>
//           <DialogContent className="max-w-[450px] text-gray-800">
//             <DialogHeader>
//               <DialogTitle>Join A Classroom</DialogTitle>
//             </DialogHeader>
//             <DialogDescription>
//               Enter the class code to join the class.
//             </DialogDescription>
//             <FormProvider {...formMethods}>
//               <form onSubmit={handleSubmit(onSubmit)}>
//                 <FormField
//                   control={control}
//                   name="code"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Classroom Code</FormLabel>
//                       <FormControl>
//                         <Input
//                           type="text"
//                           placeholder="Enter class code"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage className="text-red-300" />
//                     </FormItem>
//                   )}
//                 />
//                 <DialogFooter className="mt-5">
//                   <Button
//                     variant="gradient"
//                     className="rounded-md"
//                     disabled={joining}
//                   >
//                     {joining ? "Joining..." : "Yes, Join"}
//                   </Button>
//                   <Button
//                     onClick={() => setOpen(false)}
//                     variant="ghost"
//                     disabled={joining}
//                   >
//                     Cancel
//                   </Button>
//                 </DialogFooter>
//               </form>
//             </FormProvider>
//           </DialogContent>
//         </Dialog>
//         <Toast
//           open={toastOpen}
//           onOpenChange={setToastOpen}
//           variant={toastVariant}
//         >
//           <ToastTitle>{toastMessage}</ToastTitle>
//         </Toast>
//         <ToastViewport />
//       </ToastProvider>
//     );
//   }
// );

// export default JoinClassDialog;



import React, {
  useImperativeHandle,
  useState,
  forwardRef,
  useEffect,
} from "react";
import { getPretestQuestions } from "../../../../api/classrooms";
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
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
      "default"
    );
    const [joining, setJoining] = useState(false);
    const [classroom, setClassroom] = useState<any>(null);
    const [isStudent, setIsStudent] = useState(false);

    const [testQuestions, setTestQuestions] = useState<any[]>([]);
    const [showTest, setShowTest] = useState(false);
    const [testAnswers, setTestAnswers] = useState<{ [key: string]: string }>(
      {}
    );
    const [submittingTest, setSubmittingTest] = useState(false);

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

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

    const navigateToClassroom =
      userDetails.role === 3
        ? `/class/classrooms/class-details/${classroom?.id}`
        : `/class/classrooms/class-details/${classroom?.id}`;

    // --- Fetch pretest questions ---
    const fetchPretest = async (classroomId: number) => {
      try {
        console.log("Fetching pretest for classroom:", classroomId);
        const data = await getPretestQuestions(classroomId);
        console.log("Pretest response data:", data);

        const questions = data.questions || data.data || data || [];
        if (!Array.isArray(questions)) {
          console.warn("Unexpected pretest format:", questions);
          setToastMessage("No valid pretest questions found.");
          setToastVariant("default");
          setToastOpen(true);
          setShowTest(true);
          return;
        }

        setTestQuestions(questions);
        setShowTest(true);
      } catch (error: any) {
        console.error("Error fetching pretest:", error);
        setToastMessage("Could not load pretest questions.");
        setToastVariant("destructive");
        setToastOpen(true);
      }
    };

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

          await fetchPretest(classroom.id);
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
        const studentCheck = await checkIfStudentInClassroom(response.id);
        setIsStudent(studentCheck);

        if (studentCheck) {
          setToastMessage("You are already enrolled in this classroom!");
          setToastVariant("default");
          setToastOpen(true);
          setOpen(false);
          onSuccess();
          setTimeout(() => navigate(navigateToClassroom), 2000);
          return;
        }

        if (response.class_type === "Paid") {
          handlePayment();
        } else {
          const joinResponse = await joinClassroom(
            response.join_url,
            response.join_code
          );

          if (joinResponse.status === "success") {
            // ✅ First show success message
            setToastMessage("Successfully joined the class!");
            setToastVariant("default");
            dispatch(loadStudentClassrooms());
            setToastOpen(true);
            setOpen(false);
            onSuccess();

            // 🕓 Wait briefly, then show the pretest notice
            setTimeout(() => {
              setToastMessage(
                "Please take this short pretest before continuing."
              );
              setToastVariant("default");
              setToastOpen(true);
            }, 1200);

            // 🚀 Fetch and display pretest after short delay
            setTimeout(async () => {
              await fetchPretest(response.id);
            }, 2200);

            return;
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

    return (
      <ToastProvider swipeDirection="right">
        {/* Join Dialog */}
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

        {/* Test Dialog */}
        {showTest && (
          <Dialog open={showTest} onOpenChange={setShowTest}>
            <DialogContent className="max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Short Placement Test</DialogTitle>
                <DialogDescription>
                  Please answer a few quick questions before entering the class.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5">
                {testQuestions.length === 0 ? (
                  <p>No pretest questions found.</p>
                ) : (
                  testQuestions.map((q: any, index: number) => (
                    <div key={q.id || index}>
                      <p className="font-semibold">{q.question}</p>
                      <div className="mt-2 space-y-2">
                        {q.options?.map((opt: string) => (
                          <label key={opt} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`question_${q.id}`}
                              value={opt}
                              checked={testAnswers[q.id] === opt}
                              onChange={(e) =>
                                setTestAnswers((prev) => ({
                                  ...prev,
                                  [q.id]: e.target.value,
                                }))
                              }
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <DialogFooter className="mt-6">
                <button
                  className="rounded-full bg-[#6200EE] text-white px-6 py-2"
                  disabled={submittingTest}
                  onClick={async () => {
                    setSubmittingTest(true);
                    setTimeout(() => {
                      setSubmittingTest(false);
                      setShowTest(false);
                      navigate(navigateToClassroom);
                    }, 1200);
                  }}
                >
                  {submittingTest ? "Submitting..." : "Submit Test"}
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Toasts */}
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