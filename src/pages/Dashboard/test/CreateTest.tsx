import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {  X, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoCheckmark, IoChevronBackOutline, IoCloseOutline } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import { TbSparkles } from "react-icons/tb";

import { RootState, AppDispatch } from "../../../store";
import { Button } from "../../../components/ui/Button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../../../components/ui/Form";
import { TextArea } from "../../../components/ui/TextArea";
import { Input } from "../../../components/ui/Input";
import {
  loadClassrooms,
  loadTeamClassrooms,
} from "../../../store/slices/classroomSlice";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../../components/ui/Select";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastViewport,
} from "../../../components/ui/Toast";
import {
  suggestExaminationQuestions,
  suggestTheoryExaminationQuestions,
} from "../../../api/test";
import ContentExtractor from "./ContentExtractor";
import {
  createTest,
  fetchExamType,
  fetchSchoolSession,
  fetchSchoolTerm,
} from "../../../store/slices/testSlice";
import { QuestionInputs, EditableQuestion } from "./parsedInputs";
import { Label } from "../../../components/ui/Label";
import { useAppSelector } from "../../../store/hooks";

interface CreateOrEditClassroomProps {
  isEdit?: boolean;
}

interface ContentExtractionProps {
  onContentExtracted: (content: string) => void;
}

const containsUrl = (text: string): boolean => {
  if (!text) return false;
  const urlRegex = /(https?:\/\/|www\.)[^\s]+/i;
  return urlRegex.test(text);
};

const gradeOptions = [
  "Pre School",
  "Early Years",
  "Nursery 1",
  "Nursery 2",
  ...Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`),
  ...Array.from({ length: 5 }, (_, i) => `Higher Institution Year ${i + 1}`),
];

const CreateTest: React.FC<CreateOrEditClassroomProps> = ({ isEdit }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { examType, schoolSession, schoolTerm } = useAppSelector(
    (state: RootState) => state.tests
  );

  useEffect(() => {
    dispatch(fetchExamType());
    dispatch(fetchSchoolSession());
    dispatch(fetchSchoolTerm());
  }, [dispatch]);

  // console.log(selectedExamType, selectedTerm, selectedSession, "selected values");
  const { classrooms, teamClassrooms, loading, error } = useSelector(
    (state: any) => state.classrooms
  );

  const [isLoading, setIsLoading] = useState(false);
  const [storedType, setStoredType] = useState<string | null>(null);
  // console.log("storedType", storedType)

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
    "default"
  );
  const [classroomType, setClassroomType] = useState("my");
  const [selectedClassroom, setSelectedClassroom] = useState<any | null>(null);
  const [selectedClassroomObject, setSelectedClassroomObject] = useState<
    any | null
  >(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [enableClassroom, setEnableClassroom] = useState(false);

  const [currentQuestions, setCurrentQuestions] = useState<EditableQuestion[]>(
    []
  );
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(1);
  const [extractedText, setExtractedText] = useState("");
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);
  const storedUser = JSON.parse(localStorage.getItem("ai-teacha-user") || "{}");
  const userId = storedUser.id;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const filteredClassrooms =
    classroomType === "my" ? classrooms : teamClassrooms;
  const [questionType, setQuestionType] = useState<
    "objective" | "theory" | "both"
  >("objective");
  const [questionTopics, setQuestionTopics] = useState<string[]>([""]);
  const [topicErrors, setTopicErrors] = useState<string[]>([]);
  const [theoryQuestions, setTheoryQuestions] = useState<
    { question: string; correct_answer: string; mark: number }[]
  >([]);

  const stepOneSchema = z.object({
    user_id: z.number(),
    examtype: z.string().min(1, { message: "Exam type is required" }),
    academic_session_id: z.string().optional(),
    academic_term_id: z.string().optional(),
    name: z
      .string()
      .min(1, { message: "School name is required" })
      .refine((val) => !containsUrl(val), {
        message: "School name cannot contain URLs",
      }),
    grade: z.string(),
    duration: z
      .number({ required_error: "Duration is required" })
      .min(1, { message: "Duration must be at least 1" }),
  });

  const stepTwoSchema = z.object({
    instruction: z
      .string()
      .min(1, { message: "Test Instruction is required" })
      .refine((val) => !containsUrl(val), {
        message: "Test Instruction cannot contain URLs",
      }),
    subject: z
      .string()
      .min(1, { message: "Test subject is required" })
      .refine((val) => !containsUrl(val), {
        message: "Test subject cannot contain URLs",
      }),
  });

  const finalStepSchema = z.object({
    resources: z.array(z.instanceof(File)).optional(),
  });

  // const formSchema = stepOneSchema.merge(stepTwoSchema).merge(finalStepSchema);
  const formSchema = stepOneSchema
    .merge(stepTwoSchema)
    .merge(finalStepSchema)
    .superRefine((data, ctx) => {
      const selectedExam = examType?.find(
        (exam: any) => exam.name === data.examtype
      );

      if (selectedExam && selectedExam.name !== "General Assessment") {
        if (!data.academic_session_id) {
          ctx.addIssue({
            path: ["academic_session_id"],
            code: z.ZodIssueCode.custom,
            message: "Session is required",
          });
        }
        if (!data.academic_term_id) {
          ctx.addIssue({
            path: ["academic_term_id"],
            code: z.ZodIssueCode.custom,
            message: "Term is required",
          });
        }
      }
    });

  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_id: userId,
      name: "",
      instruction: "",
      grade: "Pre School",
      duration: 1,
      subject: "",
    },
  });
  const { handleSubmit, control, setValue, getValues, trigger, watch } =
    formMethods;

  const selectedTypeId = watch("examtype");

  const selectedType = examType?.find(
    (exam: any) => String(exam.name) === String(selectedTypeId)
  );

  useEffect(() => {
    dispatch(loadClassrooms());
    dispatch(loadTeamClassrooms());
  }, [dispatch]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const typeFromStorage = localStorage.getItem("selectedTestType");
      setStoredType(typeFromStorage);
    }
  }, []);

  // const onSubmit = async (data: z.infer<typeof formSchema>) => {
  //   setIsLoading(true);

  //   const objectiveQuestions = currentQuestions.map((q) => ({
  //     question_type: "objective",
  //     examination_question: q.title,
  //     examination_answer: q.correctOption,
  //     options: q.options,
  //     mark: q.mark,
  //   }));

  //   const theoryQuestionsData = theoryQuestions.map((q) => ({
  //     question_type: "theory",
  //     examination_question: q.question,
  //     examination_answer: q.correct_answer,
  //     mark: q.mark,
  //   }));
  //   const testData = {
  //     ...data,
  //     school_name: data.name,
  //     classroom_id: selectedClassroom ? parseInt(selectedClassroom, 10) : null,
  //     questions: [...objectiveQuestions, ...theoryQuestionsData],
  //   };

  //   // console.log(data.academic_session_id, data.academic_term_id, data.exam_type, "formdata");
  //   try {
  //     // console.log(testData, "test data to be sent", selectedExamType, selectedSession, selectedTerm);
  //     await dispatch(createTest(testData)).unwrap();
  //     setToastMessage("Test created successfully!");
  //     setToastVariant("default");
  //     setTimeout(() => navigate("/dashboard/test"), 1000);
  //   } catch (error) {
  //     setToastMessage("Failed to create test. Please try again.");
  //     setToastVariant("destructive");
  //   } finally {
  //     setToastOpen(true);
  //     setIsLoading(false);
  //   }
  // };


  const onSubmit = async (data: z.infer<typeof formSchema>) => {
  // ✅ Step 0: Ensure at least one question exists
  const totalQuestions = [...currentQuestions, ...theoryQuestions];
  if (totalQuestions.length === 0) {
    setToastMessage("Please add at least one question before finishing.");
    setToastVariant("destructive");
    setToastOpen(true);
    return;
  }

  // ✅ Step 1: Validate objective (manual) questions
  if (currentQuestions.length > 0) {
    for (let i = 0; i < currentQuestions.length; i++) {
      const q = currentQuestions[i];

      if (!q.title || q.title.trim() === "") {
        setToastMessage(`Question ${i + 1} is missing its question text.`);
        setToastVariant("destructive");
        setToastOpen(true);
        return;
      }

      if (!q.options || q.options.length < 2) {
        setToastMessage(`Question ${i + 1} must have at least two options.`);
        setToastVariant("destructive");
        setToastOpen(true);
        return;
      }

      const hasEmptyOption = q.options.some(
        (opt: string) => !opt || opt.trim() === ""
      );
      if (hasEmptyOption) {
        setToastMessage(`Question ${i + 1} has one or more empty options.`);
        setToastVariant("destructive");
        setToastOpen(true);
        return;
      }

      if (!q.correctOption || q.correctOption.trim() === "") {
        setToastMessage(`Question ${i + 1} has no correct answer selected.`);
        setToastVariant("destructive");
        setToastOpen(true);
        return;
      }

      if (!q.mark || Number(q.mark) <= 0) {
        setToastMessage(`Please assign a valid mark for Question ${i + 1}.`);
        setToastVariant("destructive");
        setToastOpen(true);
        return;
      }
    }
  }

  // ✅ Step 2: Validate theory questions
  if (theoryQuestions.length > 0) {
    for (let i = 0; i < theoryQuestions.length; i++) {
      const tq = theoryQuestions[i];
      if (!tq.question || tq.question.trim() === "") {
        setToastMessage(`Theory question ${i + 1} is missing text.`);
        setToastVariant("destructive");
        setToastOpen(true);
        return;
      }
      if (!tq.correct_answer || tq.correct_answer.trim() === "") {
        setToastMessage(`Theory question ${i + 1} has no correct answer.`);
        setToastVariant("destructive");
        setToastOpen(true);
        return;
      }
    }
  }

  // ✅ Step 3: Continue if all validation passes
  setIsLoading(true);

  const objectiveQuestions = currentQuestions.map((q) => ({
    question_type: "objective",
    examination_question: q.title,
    examination_answer: q.correctOption,
    options: q.options,
    mark: q.mark,
  }));

  const theoryQuestionsData = theoryQuestions.map((q) => ({
    question_type: "theory",
    examination_question: q.question,
    examination_answer: q.correct_answer,
    mark: q.mark,
  }));

  const testData = {
    ...data,
    school_name: data.name,
    classroom_id: selectedClassroom ? parseInt(selectedClassroom, 10) : null,
    questions: [...objectiveQuestions, ...theoryQuestionsData],
  };

  try {
    await dispatch(createTest(testData)).unwrap();
    setToastMessage("Test created successfully!");
    setToastVariant("default");
    setTimeout(() => navigate("/dashboard/test"), 1000);
  } catch (error) {
    setToastMessage("Failed to create test. Please try again.");
    setToastVariant("destructive");
  } finally {
    setToastOpen(true);
    setIsLoading(false);
  }
};



  const handleClassroomChange = (value: string) => {
    const classroomObj = JSON.parse(value);
    setSelectedClassroom(classroomObj?.classroom_id);

    setSelectedClassroomObject(classroomObj?.classroom_name);
  };
  const handleQuestionsChange = useCallback(
    (updatedQuestions: EditableQuestion[]) => {
      console.log(
        "Questions have been updated in the parent:",
        updatedQuestions
      );
      setCurrentQuestions(updatedQuestions);
    },
    []
  );

  const handleGenerateMoreQuestions = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    const { subject, grade } = getValues();

    if (!subject) {
      setToastMessage("Please enter a subject to generate questions.");
      setToastVariant("destructive");
      return;
    }
    if (!numberOfQuestions || numberOfQuestions < 1) {
      setToastMessage("Please enter a valid number of questions (1 or more).");
      setToastVariant("destructive");
      return;
    }

    setLoadingSuggestion(true);
    setSuggestionError(null);

    try {
      const suggestedQuestionsData = await suggestExaminationQuestions(
        subject,
        grade,
        numberOfQuestions,
        extractedText
      );
      if (suggestedQuestionsData && Array.isArray(suggestedQuestionsData)) {
        const formattedQuestions: EditableQuestion[] =
          suggestedQuestionsData.map((q: any) => {
            const options = q.options || {};
            const correctAnswerKey = q.correct_answer;

            return {
              title: q.question || "",
              options: [
                options.A || "",
                options.B || "",
                options.C || "",
                options.D || "",
              ],
              mark: 1,
              correctOption: ["A", "B", "C", "D", "E", "F", "G"].includes(
                correctAnswerKey
              )
                ? correctAnswerKey
                : undefined,
            };
          });
        setCurrentQuestions((prev) => [...prev, ...formattedQuestions]);
      } else {
        setSuggestionError(
          "Failed to generate questions: Invalid response format."
        );
      }
    } catch (error: any) {
      console.error("Error suggesting questions:", error);
      setSuggestionError(
        error.message || "Failed to generate questions. Please try again."
      );
    } finally {
      setLoadingSuggestion(false);
      setToastOpen(true);
    }
  };

  const handleGenerateTheoryQuestions = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    const { subject, grade } = getValues();

    if (!numberOfQuestions || numberOfQuestions < 1) {
      setToastMessage("Please enter a valid number of questions (1 or more).");
      setToastVariant("destructive");
      return;
    }

    if (
      questionTopics.length === 0 ||
      questionTopics.some((topic) => topic.trim() === "")
    ) {
      const errors = questionTopics.map((topic) =>
        topic.trim() === "" ? "Topic cannot be empty" : ""
      );
      setTopicErrors(errors);

      return;
    } else {
      setTopicErrors([]);
    }

    setLoadingSuggestion(true);
    setSuggestionError(null);

    try {
      const suggestedQuestionsData = await suggestTheoryExaminationQuestions(
        subject,
        grade,
        numberOfQuestions,
        extractedText,
        questionTopics.join(","),
        "theory"
      );

      if (suggestedQuestionsData && Array.isArray(suggestedQuestionsData)) {
        const formattedQuestions = suggestedQuestionsData.map((item: any) => ({
          question: item.question,
          correct_answer: "",
          mark: 1,
        }));
        setTheoryQuestions((prev) => [...prev, ...formattedQuestions]);
      } else {
        setSuggestionError(
          "Failed to generate theory questions: Invalid response format."
        );
      }
    } catch (error: any) {
      console.error("Error suggesting theory questions:", error);
      setSuggestionError(
        error.message ||
          "Failed to generate theory questions. Please try again."
      );

      setToastMessage(
        error.message ||
          "Failed to generate theory questions. Please try again."
      );
      setToastVariant("destructive");
    } finally {
      setLoadingSuggestion(false);
      setToastOpen(true);
    }
  };

  const nextStep = async () => {
    if (currentStep === 1) {
      const isValid = await trigger(stepOneSchema.keyof().options);
      if (isValid) setCurrentStep(2);
    } else if (currentStep === 2) {
      const isValid = await trigger(stepTwoSchema.keyof().options);
      if (isValid) {
        setCurrentStep(3);
      }
    } else if (currentStep === 3) {
      if (questionType === "both") {
        setCurrentStep(4);
      } else {
        setCurrentStep(5);
      }
    }
  };

  const handleContent = (content: string) => {
    setExtractedText(content);
    console.log("Content received in MyComponent:", content);
  };

  const handleTopicChange = (index: number, value: string) => {
    const updatedTopics = [...questionTopics];
    updatedTopics[index] = value;
    setQuestionTopics(updatedTopics);

    const updatedErrors = [...topicErrors];
    updatedErrors[index] = value.trim() === "" ? "Topic cannot be empty" : "";
    setTopicErrors(updatedErrors);
  };

  const handleAddTopic = () => {
    setQuestionTopics([...questionTopics, ""]);
  };

  const handleRemoveTopic = (index: number) => {
    const updatedTopics = questionTopics.filter((_, i) => i !== index);
    setQuestionTopics(updatedTopics);
  };
  const previousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  return (
    <ToastProvider swipeDirection="left">
      <div className="p-3 md:p-[30px] fixed inset-0 z-[50] bg-gray-100 border w-full overflow-auto  min-h-screen md:pb-[50px]">
        <h1 className="text-2xl text-center font-bold text-gray-900 capitalize">
          {isEdit ? `Edit ${storedType}` : `Create ${storedType}`}
        </h1>

        

        <div className="flex items-center justify-center ">
          {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                {/* Step circle */}
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 text-lg font-semibold transition-all duration-300 ${
                    currentStep === step
                      ? "bg-primary text-white scale-110 shadow"
                      : currentStep > step
                      ? "bg-primary text-white "
                      : "bg-gray-200 text-gray-500 border-gray-300"
                  }`}
                >
                  {step}
                </div>

                {/* Connecting line (except after last) */}
                {step < 3 && (
                  <div
                    className={`h-[2px] mx-4 transition-all duration-300 ${
                      currentStep > step  ? "bg-[#5900D9]" : "bg-gray-300"
                    }`}
                    style={{ width: "90px" }}
                  />
                  // <div
                  //   className={`h-[2px] w-12 items-center md:w-24 transition-all duration-300 ${
                  //     currentStep > step ? "bg-primary" : "bg-gray-300"
                  //   }`}
                  // ></div>
                )}
              </div>
          ))}
        </div>

        <div className="bg-white p-4 md:p-[30px] mt-[30px] max-w-5xl mx-auto  rounded-3xl">
          

          <FormProvider {...formMethods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {currentStep === 1 && (
                <div className="space-y-4">
                  {storedType === "test" ? (
                    <FormField
                      control={control}
                      name="examtype"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold ">
                            Exam Type
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="text-base text-gray-600 rounded-full">
                              <SelectValue placeholder="Select exam type" />
                            </SelectTrigger>
                            <SelectContent>
                              {examType
                                ?.filter(
                                  (exam: any) => exam.name !== "Examination"
                                )
                                .map((exam: any) => (
                                  <SelectItem
                                    key={exam.id}
                                    value={String(exam.name)}
                                  >
                                    {exam.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  ) : storedType === "exam" ? (
                    <>
                      {examType
                        ?.filter((exam: any) => exam.name === "Examination")
                        .map((exam: any) => (
                          <input
                            key={exam.id}
                            type="hidden"
                            {...formMethods.register("examtype")}
                            value={String(exam.name)}
                          />
                        ))}
                    </>
                  ) : null}

                  {selectedType &&
                    selectedType.name !== "General Assessment" && (
                      <div className="space-y-4">
                        <FormField
                          control={control}
                          name="academic_session_id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-lg font-semibold">
                                Session
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="text-base text-gray-600 rounded-full">
                                  <SelectValue placeholder="Select session" />
                                </SelectTrigger>
                                <SelectContent>
                                  {[...schoolSession]
                                    ?.reverse()
                                    .map((session: any) => (
                                      <SelectItem
                                        key={session.id}
                                        value={String(session.id)}
                                      >
                                        {session.name}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={control}
                          name="academic_term_id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-lg font-semibold">
                                Term
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="text-base text-gray-600 rounded-full">
                                  <SelectValue placeholder="Select term" />
                                </SelectTrigger>
                                <SelectContent>
                                  {schoolTerm?.map((term: any) => (
                                    <SelectItem
                                      key={term.id}
                                      value={String(term.id)}
                                    >
                                      {term.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                  <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold">
                          Enter School Name
                        </FormLabel>
                        <FormControl>
                          <TextArea
                            placeholder="eg. Mable Hills School"
                            {...field}
                            rows={4}
                            className="text-base"
                          />
                        </FormControl>
                        <FormMessage className="text-red-300" />
                      </FormItem>
                    )}
                  />

                  <div className="">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="enable-classroom"
                        className="h-5 w-5 text-blue-600 rounded-full border-gray-300 focus:ring-blue-500"
                        checked={enableClassroom}
                        onChange={(e) => setEnableClassroom(e.target.checked)}
                      />
                      <label
                        htmlFor="enable-classroom"
                        className="text-md font-medium text-gray-900"
                      >
                        Enable Classroom Selection
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 ml-7">
                      Allows you to create{" "}
                      <span className="capitalize">{storedType}</span>s within
                      the classroom.
                    </p>

                    {!loading && enableClassroom && (
                      <div className="flex flex-col space-y-4">
                        {loading && <p>Loading classrooms...</p>}
                        {error && (
                          <p className="text-red-500">Error: {error}</p>
                        )}

                        <div className="flex space-x-4">
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              value="my"
                              checked={classroomType === "my"}
                              onChange={() => setClassroomType("my")}
                            />
                            <span>My Classroom</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              value="team"
                              checked={classroomType === "team"}
                              onChange={() => setClassroomType("team")}
                            />
                            <span>Team Classroom</span>
                          </label>
                        </div>

                        {filteredClassrooms && filteredClassrooms.length > 0 ? (
                          <Select onValueChange={handleClassroomChange}>
                            <SelectTrigger className="h-12 rounded-full">
                              <SelectValue placeholder="Select Classroom">
                                {selectedClassroomObject
                                  ? selectedClassroomObject.classroom_name
                                  : "Select Classroom"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {filteredClassrooms.map((classroom: any) => (
                                <SelectItem
                                  key={classroom.classroom_id}
                                  value={JSON.stringify(classroom)}
                                >
                                  {classroom.classroom_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-red-900">No classrooms found.</p>
                        )}
                      </div>
                    )}
                  </div>

                  <FormField
                    control={control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold mt-4">
                          Duration of{" "}
                          <span className="capitalize">{storedType}</span>{" "}
                          (minutes)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value) || 0)
                            }
                            className="rounded-full"
                          />
                        </FormControl>
                        <FormMessage className="text-red-300" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold">
                          Grade
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="text-base rounded-full">
                            <SelectValue placeholder="Select  grade" />
                          </SelectTrigger>
                          <SelectContent>
                            {gradeOptions.map((grade) => (
                              <SelectItem key={grade} value={grade}>
                                {grade}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              {currentStep === 2 && (
                <div>
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">
                      {" "}
                      Upload Your Teaching Materials or Resources (eg. Lesson
                      plan, syllables, Curriculum)
                    </FormLabel>

                    <ContentExtractor onContentExtracted={handleContent} />
                  </FormItem>
                  <FormField
                    control={control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold mt-4">
                          Enter subject for the{" "}
                          <span className="capitalize">{storedType}</span>{" "}
                        </FormLabel>
                        <FormControl>
                          <TextArea
                            placeholder="e.g. physics,maths etc."
                            {...field}
                            required
                            className="text-base"
                          />
                        </FormControl>
                        <FormMessage className="text-red-300" />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-1 mt-4">
                    <p className="font-semibold text-lg">Select Question Type</p>
                    <div className="flex items-center flex-wrap gap-3">

                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="objective"
                        checked={questionType === "objective"}
                        onChange={() => setQuestionType("objective")}
                        className="accent-[#6200EE]"
                      />
                      Objective
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="theory"
                        checked={questionType === "theory"}
                        onChange={() => setQuestionType("theory")}
                        className="accent-[#6200EE]"
                      />
                      Theory
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="both"
                        checked={questionType === "both"}
                        onChange={() => setQuestionType("both")}
                        className="accent-[#6200EE]"
                      />
                      Objective and Theory
                    </label>
                    </div>
                  </div>

                  <FormField
                    control={control}
                    name="instruction"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold mt-4">
                          Enter a detailed instruction for the{" "}
                          <span className="capitalize">{storedType}</span>{" "}
                        </FormLabel>
                        <FormControl>
                          <TextArea
                            placeholder="e.g. answer all questions"
                            {...field}
                            required
                            className="text-base"
                          />
                        </FormControl>
                        <FormMessage className="text-red-300" />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              {currentStep === 3 && questionType !== "theory" && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Objective Questions</h3>
                  <div className="flex md:items-end flex-col md:flex-row gap-2">
                    <div className="md:flex-1">
                      <p className="font-medium m-0">

                      No of Question
                      </p>
                      <Input
                        type="number"
                        placeholder="Number of Questions"
                        className="rounded-full"
                        value={numberOfQuestions}
                        onChange={(e) =>
                          setNumberOfQuestions(Number(e.target.value))
                        }
                        min={1}
                        max={20}
                        
                      />
                    </div>
                    {currentQuestions.length === 0 && (
                      <button
                        // variant={"outline"}
                        onClick={handleGenerateMoreQuestions}
                        className="font-bold py-2 px-4 rounded-full md:ml-4 bg-black text-white"
                      >
                        {loadingSuggestion ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <span className="flex items-center gap-2">

                          <TbSparkles size={20}/>
                          Generate  Questions with A.I
                          </span>
                        )}
                      </button>
                    )}
                  </div>

                  {loadingSuggestion && (
                    <div className="mt-4 text-center">
                      Generating new questions...
                    </div>
                  )}
                  <h3>
                    {" "}
                    <span className="capitalize">{storedType}</span> Questions:
                  </h3>

                  <QuestionInputs
                    initialQuestions={currentQuestions}
                    grade={getValues("grade")}
                    onQuestionsChange={handleQuestionsChange}
                    onGenerateMoreQuestions={handleGenerateMoreQuestions}
                    isGeneratingMore={loadingSuggestion}
                  />
                
                  <div className=" p-4 bg-white rounded-xl shadow-md">
                    <ul className="space-y-4">
                      {currentQuestions.map((question, index) => (
                        <li key={index}>
                          <strong className="block text-lg text-gray-800 mb-2">
                            {question.title}
                          </strong>
                          <ul className="list-inside space-y-1 ml-4">
                            {question.options.map((option, optionIndex) => (
                              <li
                                key={optionIndex}
                                className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
                              >
                                <span className="font-medium">
                                  {String.fromCharCode(65 + optionIndex)}.
                                </span>{" "}
                                {option}
                              </li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {currentStep === 3 && questionType === "theory" && (
                <div className="space-y-6">
                  <h3 className="font-semibold text-lg">Theory Questions</h3>
                  <div className="flex items-end gap-4">
                    <div className="flex-1">
                      No of Questions
                      <Input
                        type="number"
                        placeholder="Number of Questions"
                        className=" rounded-full"
                        value={numberOfQuestions}
                        onChange={(e) =>
                          setNumberOfQuestions(Number(e.target.value))
                        }
                        min={1}
                        max={20}
                      />
                    </div>
                    <button
                      onClick={handleGenerateTheoryQuestions}
                      className="font-bold py-2 px-4 rounded-full ml-1 bg-black text-white"
                    >
                      {loadingSuggestion ? (
                        <span className="flex items-center gap-1">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </span>
                      ) : theoryQuestions.length > 0 ? (
                        <span className="flex items-center gap-2">
                          <TbSparkles size={20}/>
                          Generate More {storedType} Questions
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <TbSparkles size={20}/>
                          Generate  Questions with A.I
                        </span>
                      )}
                    </button>
                  </div>


                  <div className="space-y-2">
                    <h5 className="font-semibold">Question Topics (Theory)</h5>
                    {questionTopics.map((topic, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          type="text"
                          value={topic}
                          placeholder={`Topic ${index + 1}`}
                          onChange={(e) =>
                            handleTopicChange(index, e.target.value)
                          }
                          className={`w-full ${
                            topicErrors[index] ? "border-red-500" : ""
                          }`}
                        />
                        {topicErrors[index] && (
                          <p className="text-sm text-red-500 mt-1">
                            {topicErrors[index]}
                          </p>
                        )}
                        {questionTopics.length > 1 && (
                          <Button
                            variant={"destructive"}
                            className="px-2 py-1 rounded-md"
                            onClick={(e) => {
                              e.preventDefault();
                              const updatedTopics = questionTopics.filter(
                                (_, i) => i !== index
                              );
                              setQuestionTopics(updatedTopics);
                            }}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}

                    <Button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setQuestionTopics([...questionTopics, ""]);
                      }}
                      className="mt-2 bg-gray-200"
                    >
                      + Add Another Topic
                    </Button>

                    {theoryQuestions.length > 0 && (
                      <div className="space-y-4 mt-6">
                        <h4 className="font-semibold">
                          Generated Theory Questions
                        </h4>
                        <div className="bg-gray-100 space-y-4 p-[20px] ">
                          
                        
                        {theoryQuestions.map((q, index) => (
                          <div
                            key={index}
                            className="relative space-y-2 border p-4 rounded-md bg-white"
                          >
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                const updated = [...theoryQuestions];
                                updated.splice(index, 1);
                                setTheoryQuestions(updated);
                              }}
                              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            >
                              ✕
                            </button>

                            <div>
                              <div className="mb-2 flex items-center  justify-between gap-3">
                                <label className="font-medium">
                                  Question {index + 1}
                                </label>
                                <div className="flex items-center gap-1 bg-gray-100 p-1 px-3 rounded-md">
                                   <Label className="text-gray-700 flex items-center gap-1">
                                    <IoCheckmark size={20} color="green "/>
                                    Mark Allocated {" "}
                                  </Label>
                                  <Input
                                    type="number"
                                    placeholder="Mark"
                                    value={q.mark}
                                    min={1}
                                    onChange={(e) => {
                                      const updated = [...theoryQuestions];
                                      updated[index].mark = Number(e.target.value);
                                      setTheoryQuestions(updated);
                                    }}
                                    className="max-w-[50px]"
                                  />
                                </div>
                                
                              </div>
                              <Input
                                type="text"
                                placeholder="Enter Question"
                                value={q.question}
                                onChange={(e) => {
                                  const updated = [...theoryQuestions];
                                  updated[index].question = e.target.value;
                                  setTheoryQuestions(updated);
                                }}
                                className=""
                              />
                            </div>

                            <Input
                              type="text"
                              placeholder="Correct Answer"
                              value={q.correct_answer}
                              onChange={(e) => {
                                const updated = [...theoryQuestions];
                                updated[index].correct_answer = e.target.value;
                                setTheoryQuestions(updated);
                              }}
                            />

                           
                          </div>
                        ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">

                    <Button
                      variant="gradient"
                      className="rounded-md"
                      onClick={(event) => {
                        event.preventDefault();
                        setTheoryQuestions([
                          ...theoryQuestions,
                          { question: "", correct_answer: "", mark: 1 },
                        ]);
                      }}
                    >
                      Add Questions Manually 
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 4 && questionType === "both" && (
                <div className="space-y-6">
                  <h3 className="font-semibold text-lg">Theory Questions</h3>
                  <div className="flex items-end gap-4">
                    <div className="flex-1">
                      No of Questions
                      <Input
                        type="number"
                        placeholder="Number of Questions"
                        className=" rounded-full"
                        value={numberOfQuestions}
                        onChange={(e) =>
                          setNumberOfQuestions(Number(e.target.value))
                        }
                        min={1}
                        max={20}
                      />
                    </div>
                    <button
                      onClick={handleGenerateTheoryQuestions}
                      className="font-bold py-2 px-4 rounded-full ml-1 bg-black text-white"
                    >
                      {loadingSuggestion ? (
                        <span className="flex items-center gap-1">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </span>
                      ) : theoryQuestions.length > 0 ? (
                        <span className="flex items-center gap-2">
                          <TbSparkles size={20}/>
                          Generate More {storedType} Questions
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <TbSparkles size={20}/>
                          Generate Questions with A.I
                        </span>
                      )}
                    </button>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Question Topics (Theory)</h4>
                    {questionTopics.map((topic, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          type="text"
                          value={topic}
                          placeholder={`Topic ${index + 1}`}
                          onChange={(e) =>
                            handleTopicChange(index, e.target.value)
                          }
                          className={`w-full ${
                            topicErrors[index] ? "border-red-500" : ""
                          }`}
                        />
                        {topicErrors[index] && (
                          <p className="text-sm text-red-500 mt-1">
                            {topicErrors[index]}
                          </p>
                        )}
                        {questionTopics.length > 1 && (
                          <Button
                            variant="destructive"
                            className="px-2 py-1 rounded-md"
                            onClick={(e) => {
                              e.preventDefault();
                              const updatedTopics = questionTopics.filter(
                                (_, i) => i !== index
                              );
                              setQuestionTopics(updatedTopics);
                            }}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}

                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault();
                        setQuestionTopics([...questionTopics, ""]);
                      }}
                      className="mt-2 bg-gray-200"
                    >
                      + Add Another Topic
                    </Button>

                    {theoryQuestions.length > 0 && (
                      <div className="space-y-4 mt-6">
                        <h4 className="font-semibold">
                          Generated Theory Questions
                        </h4>
                        {theoryQuestions.map((q, index) => (
                          <div
                            key={index}
                            className="relative space-y-2 border p-4 rounded-md bg-gray-50"
                          >
                            {/* Remove Button */}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                const updated = [...theoryQuestions];
                                updated.splice(index, 1);
                                setTheoryQuestions(updated);
                              }}
                              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            >
                              ✕
                            </button>

                            <div>
                              <label className="font-medium">
                                Q{index + 1}
                              </label>
                              <Input
                                type="text"
                                placeholder="Question"
                                value={q.question}
                                onChange={(e) => {
                                  const updated = [...theoryQuestions];
                                  updated[index].question = e.target.value;
                                  setTheoryQuestions(updated);
                                }}
                              />
                            </div>

                            <Input
                              type="text"
                              placeholder="Correct Answer"
                              value={q.correct_answer}
                              onChange={(e) => {
                                const updated = [...theoryQuestions];
                                updated[index].correct_answer = e.target.value;
                                setTheoryQuestions(updated);
                              }}
                            />
                            <Label className="text-gray-700 mt-4">
                              Mark Allocated
                            </Label>
                            <Input
                              type="number"
                              placeholder="Mark"
                              value={q.mark}
                              min={1}
                              onChange={(e) => {
                                const updated = [...theoryQuestions];
                                updated[index].mark = Number(e.target.value);
                                setTheoryQuestions(updated);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  
                  <Button
                    variant="gradient"
                    className="mt-4 rounded-md"
                    onClick={(event) => {
                      event.preventDefault();
                      setTheoryQuestions([
                        ...theoryQuestions,
                        { question: "", correct_answer: "", mark: 1 },
                      ]);
                    }}
                  >
                     Add Questions manually
                  </Button>
                </div>
              )}
            </form>
          </FormProvider>
        </div>


        <button className="absolute top-[40px] left[20px] md:top-[80px] md:left-[100px]" onClick={() => navigate(-1)}>
              <IoCloseOutline size={25} />
        </button>


          <div className="flex max-w-5xl mx-auto w-full my-6 items-center justify-between">
  {/* Left side: Back or nothing */}
  <div>
    {currentStep === 1 && (
      <button
        className="flex items-center rounded-md text-black w-fit h-full gap-3"
        onClick={() => navigate(-1)}
      >
        <IoChevronBackOutline size={"1.1rem"} color="black" />
        Back
      </button>
    )}
    {currentStep === 2 && (
      <button
      onClick={previousStep}
      className="flex items-center gap-3 text-black "
      >
      <IoChevronBackOutline size={"1.1rem"} color="black" />
        Back
      </button>
    )}
     {currentStep > 2 && (
       <button
       onClick={previousStep}
       className="flex items-center gap-3 text-black "
       >
       <IoChevronBackOutline size={"1.1rem"} color="black" />
        Back
      </button>
    )}
  </div>

  {/* Right side: Previous / Next / Save */}
  <div className="flex gap-2">
    

   

    <Button
      variant="gradient"
      className="flex items-center w-fit h-full gap-3 py-2 px-5 rounded-full"
      onClick={
        currentStep === 1 ||
        currentStep === 2 ||
        (currentStep === 3 && questionType === "both")
        ? nextStep
        : handleSubmit(onSubmit)
      }
      disabled={isLoading}
    >
      {isLoading
        ? "Saving..."
        : currentStep === 1 || currentStep === 2
        ? "Next"
        : currentStep === 3 && questionType === "both"
        ? "Next"
        : "Finish"}
        {
          currentStep !== 3 && 
        <IoIosArrowForward size={"1.1rem"} color="white" />
        }
    </Button>
  </div>
</div>


        <Toast
          open={toastOpen}
          onOpenChange={setToastOpen}
          variant={toastVariant}
        >
          <ToastTitle>{toastMessage}</ToastTitle>
        </Toast>
        <ToastViewport />
      </div>
    </ToastProvider>
  );
};

export default CreateTest;
