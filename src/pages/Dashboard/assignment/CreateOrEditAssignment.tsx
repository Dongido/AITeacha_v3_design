// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm, FormProvider } from "react-hook-form";
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
// } from "../../../components/ui/Form";
// import { Input } from "../../../components/ui/Input";
// import {
//   Select,
//   SelectTrigger,
//   SelectContent,
//   SelectItem,
//   SelectValue,
// } from "../../../components/ui/Select";
// import { Button } from "../../../components/ui/Button";
// import { TextArea } from "../../../components/ui/TextArea";
// import { loadClassrooms } from "../../../store/slices/classroomSlice";
// import {
//   createAssignmentThunk,
//   loadAssignments,
// } from "../../../store/slices/assignmentSlice";
// import { RootState, AppDispatch } from "../../../store";
// import GenerateQuestionsDialog from "./GenerateQuestionsDialog";
// import {
//   ToastProvider,
//   Toast,
//   ToastViewport,
// } from "../../../components/ui/Toast";
// import { UploadCloud } from "lucide-react";
// import { IoCloseOutline } from "react-icons/io5";
// import { IoChevronBackOutline } from "react-icons/io5";

// const containsUrl = (text: string): boolean => {
//   if (!text) return false;
//   const urlRegex = /(https?:\/\/|www\.)[^\s]+/i;
//   return urlRegex.test(text);
// };

// const formSchema = z.object({
//   user_id: z.number(),
//   classroom_id: z.number().min(1, "Please select a valid classroom"),
//   description: z
//     .string()
//     .nonempty("Description is required")
//     .refine((val) => !containsUrl(val), {
//       message: "Description cannot contain URLs",
//     }),
//   number_of_students: z.number(),
//   grade: z.string(),
//   questions: z.array(
//     z.object({
//       assignment_question: z
//         .string()
//         .nonempty("Question cannot be empty")
//         .refine((val) => !containsUrl(val), {
//           message: "Question cannot contain URLs",
//         }),
//     })
//   ),
//   resources: z.array(z.any()).optional(), 
// });

// const CreateOrEditAssignment: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();

//   const [step, setStep] = useState(1);
//   const [questionsCount, setQuestionsCount] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [toastType, setToastType] = useState<"default" | "destructive">(
//     "default"
//   );
//   const { classrooms } = useSelector((state: RootState) => state.classrooms);
//   const storedUser = JSON.parse(localStorage.getItem("ai-teacha-user") || "{}");
//   const userId = storedUser.id;

//   const formMethods = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       user_id: userId,
//       classroom_id: 0,
//       number_of_students: 0,
//       grade: "",
//       description: "",
//       questions: [{ assignment_question: "" }],
//       resources: [],
//     },
//   });

//   const { handleSubmit,trigger, control, setValue, watch, getValues } = formMethods;

//   const handleNextStep = async () => {
//   // validate only Step 1 fields
//   const isValid = await trigger(["classroom_id", "description"]);

//   if (isValid) {
//     setStep(2);
//   } else {
//     // Focus on the first invalid field
//     await trigger(["classroom_id", "description"], { shouldFocus: true });
//   }
// };


//   const selectedClassroomId = watch("classroom_id");
//   const selectedClassroom = classrooms.find(
//     (classroom) => classroom.classroom_id === selectedClassroomId
//   );

//   useEffect(() => {
//     dispatch(loadClassrooms());
//   }, [dispatch]);

//   useEffect(() => {
//     if (selectedClassroom) {
//       setValue("number_of_students", selectedClassroom.number_of_students);
//       setValue("grade", selectedClassroom.grade);
//     }
//   }, [selectedClassroom, setValue]);

//   const handleClassroomChange = (classroomId: string) => {
//     setValue("classroom_id", Number(classroomId));
//   };

//   // const handleNextStep = () => {
//   //   const values = getValues();
//   //   if (values.classroom_id && values.description) {
//   //     setStep(2);
//   //   }
//   // };


  


  
//   const handleAddQuestions = (count: number) => {
//     const existingQuestions = getValues("questions");
//     const newQuestions = Array.from(
//       { length: count - existingQuestions.length },
//       () => ({ assignment_question: "" })
//     );
//     setValue("questions", [...existingQuestions, ...newQuestions]);
//     setQuestionsCount(count);
//   };

//   const handleQuestionsGenerated = (
//     assignment_question: { assignment_question: string }[]
//   ) => {
//     setValue("questions", assignment_question);
//     setQuestionsCount(assignment_question.length);
//   };

//   const onSubmit = async (data: z.infer<typeof formSchema>) => {
//     setLoading(true);
//     try {
//       console.log(data);
//       await dispatch(createAssignmentThunk(data)).unwrap();
//       await dispatch(loadAssignments());
//       setToastMessage("Assignment created successfully!");
//       setToastType("default");
//       navigate("/dashboard/assignment");
//     } catch (error) {
//       setToastMessage("Failed to create assignment. Please try again.");
//       setToastType("destructive");
//       console.error("Failed to create assignment:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

  

//   return (
//     <ToastProvider>
//       <div className="p-[30px] fixed inset-0 w-full min-h-screen overflow-y-auto bg-gray-100 z-[50]">


//         <button className="absolute top-[40px] left[20px] md:top-[80px] md:left-[100px]" onClick={() => navigate(-1)}>
//                       <IoCloseOutline size={25} />
//                 </button>
        

//     <h3 className="font-semibold text-center">Create New Assignments</h3>
//         {/* Step Indicator */}
// <div className="flex items-center justify-center mb-8">
//   {/* Step 1 */}
//   <div className="flex flex-col items-center">
//     <div
//       className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold ${
//         step >= 1 ? "bg-[#5900D9]" : "bg-gray-300"
//       }`}
//     >
//       1
//     </div>
//   </div>

//   {/* Line between steps */}
//   <div
//     className={`h-[2px] mx-4 transition-all duration-300 ${
//       step >= 2 ? "bg-[#5900D9]" : "bg-gray-300"
//     }`}
//     style={{ width: "90px" }}
//   />

//   {/* Step 2 */}
//   <div className="flex flex-col items-center">
//     <div
//       className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold ${
//         step === 2 ? "bg-[#5900D9]" : "bg-gray-300"
//       }`}
//     >
//       2
//     </div>
//   </div>
// </div>



//         <div className="bg-white p-4 md:p-[30px] mt-[30px] max-w-5xl mx-auto  rounded-3xl">
          

//         <FormProvider {...formMethods}>
//           <form onSubmit={handleSubmit(onSubmit)}>
//             {step === 1 && (
//               <div className="space-y-4 bg-white p-[40px] rounded-3xl">
//                 <h3 className="font-semibold">Assignments</h3>
//                 <FormField
//                   control={control}
//                   name="classroom_id"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="font-semibold">Classroom Name</FormLabel>
//                       <FormControl>
//                         <Select
//                           onValueChange={(value) => {
//                             field.onChange(value);
//                             handleClassroomChange(value);
//                           }}
//                           value={field.value?.toString()}
//                         >
//                           <SelectTrigger className="rounded-full">
//                             <SelectValue placeholder="Select a classroom" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {classrooms.map((classroom) => (
//                               <SelectItem
//                                 key={classroom.classroom_id}
//                                 value={classroom.classroom_id.toString()}
//                               >
//                                 {classroom.classroom_name}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </FormControl>
//                       <FormMessage className="text-red-500" />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={control}
//                   name="description"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="font-semibold">Description</FormLabel>
//                       <FormControl>
//                         <TextArea
//                           placeholder="Enter assignment description"
//                           {...field}

//                         />
//                       </FormControl>
//                       <FormMessage className="text-red-500" />
//                     </FormItem>
//                   )}
//                 />


//                 {/* Resources Upload */}
//     <div className="flex flex-col space-y-2">
//       <label className="font-semibold text-gray-700">Resources</label>

//       <div
//         className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-purple-500 transition-all cursor-pointer bg-gray-50"
//         onClick={() => document.getElementById("resource-upload")?.click()}
//         onDragOver={(e) => e.preventDefault()}
//         onDrop={(e) => {
//           e.preventDefault();
//           const files = Array.from(e.dataTransfer.files);
//           setValue("resources", files);
//         }}
//       >
//         <p className="text-gray-500 mb-2">Upload your teaching materials or resources (eg. lesson plan, syllables, curriculum)</p>
//         <p className="w-fit mx-auto flex items-center justify-center gap-3 text-sm border-2 p-2 px-5 rounded-full border-gray-300">
//           <UploadCloud className="w-5 h-5 text-muted-foreground" />
//           <span>Choose file</span>
//         </p>
//       </div>

//       <input
//         id="resource-upload"
//         type="file"
//         multiple
//         accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4"
//         className="hidden"
//         onChange={(e) => setValue("resources", Array.from(e.target.files || []))}
//       />

//       {/* Show selected files */}
//       {(getValues("resources")?.length ?? 0) > 0 && (
//         <ul className="mt-2 text-sm text-gray-600 bg-gray-100 rounded-lg p-3 max-h-32 overflow-auto">
//           {(getValues("resources") || []).map((file: File, index: number) => (
//             <li key={index} className="truncate">
//               📎 {file.name}
//             </li>
//           ))}
//         </ul>
//       )}

//     </div>


//                 {/* <div className="flex justify-end mt-6">
//                   <Button
//                     variant="gradient"
//                     className="rounded-md"
//                     onClick={handleNextStep}
//                   >
//                     Next
//                   </Button>
//                 </div> */}
//               </div>
//             )}




//             {step === 2 && (
//               <div className="space-y-4 p-[40px] bg-white rounded-3xl">
//                 <h3 className="font-semibold">Questions</h3>
//                 <div className="flex items-end gap-4 justify-between">

//                   <div className="flex-1">
//                   <FormLabel>Number of Questions</FormLabel>
//                   <Input
//                     type="number"
//                     min={1}
//                     value={questionsCount}
//                     className="rounded-full"
//                     onChange={(e) => handleAddQuestions(Number(e.target.value))}
//                   />

//                   </div>
//                   <GenerateQuestionsDialog
//                     classroomId={selectedClassroom?.classroom_id || ""}
//                     grade={selectedClassroom?.grade || ""}
//                     description={getValues("description")}
//                     onQuestionsGenerated={handleQuestionsGenerated}
//                     questionCount={questionsCount}
                  
//                   />

//                 </div>


//                 {Array.from({ length: questionsCount }, (_, index) => (
//                   <FormField
//                     key={index}
//                     control={control}
//                     name={`questions.${index}.assignment_question`}
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Question {index + 1}</FormLabel>
//                         <FormControl>
//                           <TextArea
//                             placeholder={`Enter question ${index + 1}`}
//                             {...field}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 ))}
//               </div>
//             )}
//           </form>
//         </FormProvider>
//         </div>


//             {/* Step Navigation Buttons (outside white area) */}
// <div className="flex justify-between max-w-5xl mx-auto mt-6">
//   {step === 1 && (
//     <button
//       className="flex items-center gap-2"
//       onClick={() => navigate(-1)}
//     >
//       <IoChevronBackOutline />
//       Back
//     </button>
//   )}

//   {step === 2 && (
//     <button
//       className="flex items-center gap-2"
//       onClick={() => setStep(1)}
//     >
//       <IoChevronBackOutline />
//       Back
//     </button>
//   )}

//   {step === 1 && (
//     <Button
//       variant="gradient"
//       className="rounded-md"
//       onClick={handleNextStep}
//     >
//       Next
//     </Button>
//   )}

//   {step === 2 && (
//     <Button
//       variant="gradient"
//       type="submit"
//       className="rounded-md"
//       disabled={loading}
//       onClick={handleSubmit(onSubmit)}
//     >
//       {loading ? "Submitting..." : "Submit Assignment"}
//     </Button>
//   )}
// </div>


//       </div>
//       <Toast
//         open={!!toastMessage}
//         onOpenChange={(open) => !open && setToastMessage("")}
//         variant={toastType}
//       >
//         {toastMessage}
//       </Toast>
//       <ToastViewport />
//     </ToastProvider>
//   );
// };

// export default CreateOrEditAssignment;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../../../components/ui/Form";
import { Input } from "../../../components/ui/Input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../../components/ui/Select";
import { Button } from "../../../components/ui/Button";
import { TextArea } from "../../../components/ui/TextArea";
import { loadClassrooms } from "../../../store/slices/classroomSlice";
import {
  createAssignmentThunk,
  loadAssignments,
} from "../../../store/slices/assignmentSlice";
import { RootState, AppDispatch } from "../../../store";
import GenerateQuestionsDialog from "./GenerateQuestionsDialog";
import {
  ToastProvider,
  Toast,
  ToastViewport,
} from "../../../components/ui/Toast";
import { UploadCloud } from "lucide-react";
import { IoCloseOutline } from "react-icons/io5";
import { IoChevronBackOutline } from "react-icons/io5";

const containsUrl = (text: string): boolean => {
  if (!text) return false;
  const urlRegex = /(https?:\/\/|www\.)[^\s]+/i;
  return urlRegex.test(text);
};

const formSchema = z.object({
  user_id: z.number(),
  classroom_id: z.number().min(1, "Please select a valid classroom"),
  description: z
    .string()
    .nonempty("Description is required")
    .refine((val) => !containsUrl(val), {
      message: "Description cannot contain URLs",
    }),
  number_of_students: z.number(),
  grade: z.string(),
  questions: z.array(
    z.object({
      assignment_question: z
        .string()
        .nonempty("Question cannot be empty")
        .refine((val) => !containsUrl(val), {
          message: "Question cannot contain URLs",
        }),
    })
  ),
  resources: z.array(z.any()).optional(), 
});

const CreateOrEditAssignment: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [questionsCount, setQuestionsCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"default" | "destructive">(
    "default"
  );
  const { classrooms } = useSelector((state: RootState) => state.classrooms);
  const storedUser = JSON.parse(localStorage.getItem("ai-teacha-user") || "{}");
  const userId = storedUser.id;

  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_id: userId,
      classroom_id: 0,
      number_of_students: 0,
      grade: "",
      description: "",
      questions: [{ assignment_question: "" }],
      resources: [],
    },
  });

  const { handleSubmit,trigger, control, setValue, watch, getValues } = formMethods;

  const handleNextStep = async () => {
  // validate only Step 1 fields
  const isValid = await trigger(["classroom_id", "description"]);

  if (isValid) {
    setStep(2);
  } else {
    // Focus on the first invalid field
    await trigger(["classroom_id", "description"], { shouldFocus: true });
  }
};


  const selectedClassroomId = watch("classroom_id");
  const selectedClassroom = classrooms.find(
    (classroom) => classroom.classroom_id === selectedClassroomId
  );

  useEffect(() => {
    dispatch(loadClassrooms());
  }, [dispatch]);

  useEffect(() => {
    if (selectedClassroom) {
      setValue("number_of_students", selectedClassroom.number_of_students);
      setValue("grade", selectedClassroom.grade);
    }
  }, [selectedClassroom, setValue]);

  const handleClassroomChange = (classroomId: string) => {
    setValue("classroom_id", Number(classroomId));
  };

  // const handleNextStep = () => {
  //   const values = getValues();
  //   if (values.classroom_id && values.description) {
  //     setStep(2);
  //   }
  // };


  


  
  const handleAddQuestions = (count: number) => {
    const existingQuestions = getValues("questions");
    const newQuestions = Array.from(
      { length: count - existingQuestions.length },
      () => ({ assignment_question: "" })
    );
    setValue("questions", [...existingQuestions, ...newQuestions]);
    setQuestionsCount(count);
  };

  const handleQuestionsGenerated = (
    assignment_question: { assignment_question: string }[]
  ) => {
    setValue("questions", assignment_question);
    setQuestionsCount(assignment_question.length);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      console.log(data);
      await dispatch(createAssignmentThunk(data)).unwrap();
      await dispatch(loadAssignments());
      setToastMessage("Assignment created successfully!");
      setToastType("default");
      navigate("/dashboard/assignment");
    } catch (error) {
      setToastMessage("Failed to create assignment. Please try again.");
      setToastType("destructive");
      console.error("Failed to create assignment:", error);
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <ToastProvider>
      <div className="p-[30px] fixed inset-0 w-full min-h-screen overflow-y-auto bg-gray-100 z-[50]">


        <button className="absolute top-[40px] left[20px] md:top-[80px] md:left-[100px]" onClick={() => navigate(-1)}>
                      <IoCloseOutline size={25} />
                </button>
        

    <h3 className="font-semibold text-center">Create New Assignments</h3>
        {/* Step Indicator */}
<div className="flex items-center justify-center mb-8">
  {/* Step 1 */}
  <div className="flex flex-col items-center">
    <div
      className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold ${
        step >= 1 ? "bg-[#5900D9]" : "bg-gray-300"
      }`}
    >
      1
    </div>
  </div>

  {/* Line between steps */}
  <div
    className={`h-[2px] mx-4 transition-all duration-300 ${
      step >= 2 ? "bg-[#5900D9]" : "bg-gray-300"
    }`}
    style={{ width: "90px" }}
  />

  {/* Step 2 */}
  <div className="flex flex-col items-center">
    <div
      className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold ${
        step === 2 ? "bg-[#5900D9]" : "bg-gray-300"
      }`}
    >
      2
    </div>
  </div>
</div>



        <div className="bg-white p-4 md:p-[30px] mt-[30px] max-w-5xl mx-auto  rounded-3xl">
          

        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {step === 1 && (
              <div className="space-y-4 bg-white md:p-[40px] rounded-3xl">
                <h3 className="font-semibold">Assignments</h3>
                <FormField
                  control={control}
                  name="classroom_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Classroom Name</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleClassroomChange(value);
                          }}
                          value={field.value?.toString()}
                        >
                          <SelectTrigger className="rounded-full">
                            <SelectValue placeholder="Select a classroom" />
                          </SelectTrigger>
                          <SelectContent>
                            {classrooms.map((classroom) => (
                              <SelectItem
                                key={classroom.classroom_id}
                                value={classroom.classroom_id.toString()}
                              >
                                {classroom.classroom_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Description</FormLabel>
                      <FormControl>
                        <TextArea
                          placeholder="Enter assignment description"
                          {...field}

                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />


                {/* Resources Upload */}
    <div className="flex flex-col space-y-2">
      <label className="font-semibold text-gray-700">Resources</label>

      <div
        className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-purple-500 transition-all cursor-pointer bg-gray-50"
        onClick={() => document.getElementById("resource-upload")?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const files = Array.from(e.dataTransfer.files);
          setValue("resources", files);
        }}
      >
        <p className="text-gray-500 mb-2">Upload your teaching materials or resources (eg. lesson plan, syllables, curriculum)</p>
        <p className="w-fit mx-auto flex items-center justify-center gap-3 text-sm border-2 p-2 px-5 rounded-full border-gray-300">
          <UploadCloud className="w-5 h-5 text-muted-foreground" />
          <span>Choose file</span>
        </p>
      </div>

      <input
        id="resource-upload"
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4"
        className="hidden"
        onChange={(e) => setValue("resources", Array.from(e.target.files || []))}
      />

      {/* Show selected files */}
      {(getValues("resources")?.length ?? 0) > 0 && (
        <ul className="mt-2 text-sm text-gray-600 bg-gray-100 rounded-lg p-3 max-h-32 overflow-auto">
          {(getValues("resources") || []).map((file: File, index: number) => (
            <li key={index} className="truncate">
              📎 {file.name}
            </li>
          ))}
        </ul>
      )}

    </div>


                {/* <div className="flex justify-end mt-6">
                  <Button
                    variant="gradient"
                    className="rounded-md"
                    onClick={handleNextStep}
                  >
                    Next
                  </Button>
                </div> */}
              </div>
            )}




            {step === 2 && (
              <div className="space-y-4 p-[40px] bg-white rounded-3xl">
                <h3 className="font-semibold">Questions</h3>
                <div className="flex items-end gap-4 justify-between">

                  <div className="flex-1">
                  <FormLabel>Number of Questions</FormLabel>
                  <Input
                    type="number"
                    min={1}
                    value={questionsCount}
                    className="rounded-full"
                    onChange={(e) => handleAddQuestions(Number(e.target.value))}
                  />

                  </div>
                  <GenerateQuestionsDialog
                    classroomId={selectedClassroom?.classroom_id || ""}
                    grade={selectedClassroom?.grade || ""}
                    description={getValues("description")}
                    onQuestionsGenerated={handleQuestionsGenerated}
                    questionCount={questionsCount}
                  
                  />

                </div>


                {Array.from({ length: questionsCount }, (_, index) => (
                  <FormField
                    key={index}
                    control={control}
                    name={`questions.${index}.assignment_question`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question {index + 1}</FormLabel>
                        <FormControl>
                          <TextArea
                            placeholder={`Enter question ${index + 1}`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            )}
          </form>
        </FormProvider>
        </div>


            {/* Step Navigation Buttons (outside white area) */}
<div className="flex justify-between max-w-5xl mx-auto mt-6">
  {step === 1 && (
    <button
      className="flex items-center gap-2"
      onClick={() => navigate(-1)}
    >
      <IoChevronBackOutline />
      Back
    </button>
  )}

  {step === 2 && (
    <button
      className="flex items-center gap-2"
      onClick={() => setStep(1)}
    >
      <IoChevronBackOutline />
      Back
    </button>
  )}

  {step === 1 && (
    <Button
      variant="gradient"
      className="rounded-md"
      onClick={handleNextStep}
    >
      Next
    </Button>
  )}

  {step === 2 && (
    <Button
      variant="gradient"
      type="submit"
      className="rounded-md"
      disabled={loading}
      onClick={handleSubmit(onSubmit)}
    >
      {loading ? "Submitting..." : "Submit Assignment"}
    </Button>
  )}
</div>


      </div>
      <Toast
        open={!!toastMessage}
        onOpenChange={(open) => !open && setToastMessage("")}
        variant={toastType}
      >
        {toastMessage}
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
};

export default CreateOrEditAssignment;
