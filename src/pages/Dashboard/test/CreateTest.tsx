import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Undo2, X, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { createTest } from "../../../store/slices/testSlice";
import { QuestionInputs, EditableQuestion } from "./parsedInputs";
import { Label } from "../../../components/ui/Label";

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
  const { classrooms, teamClassrooms, loading, error } = useSelector(
    (state: any) => state.classrooms
  );

  const [isLoading, setIsLoading] = useState(false);
  const [storedType, setStoredType] = useState<string | null>(null);

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

  const formSchema = stepOneSchema.merge(stepTwoSchema).merge(finalStepSchema);
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
  const { handleSubmit, control, setValue, getValues, trigger } = formMethods;

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

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
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
      console.log(testData);
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
      <div className="mt-12">
        <h1 className="text-2xl font-bold text-gray-900 capitalize">
          {isEdit ? `Edit ${storedType}` : `Create ${storedType}`}
        </h1>

        <div className="flex w-full my-6 items-center justify-between">
          <Button
            className="flex items-center bg-white rounded-md text-black w-fit h-full gap-3 py-2"
            onClick={() => navigate(-1)}
          >
            <Undo2 size={"1.1rem"} color="black" />
            Back
          </Button>

          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button
                onClick={previousStep}
                variant="outline"
                className="bg-gray-300 text-black rounded-md"
              >
                Previous
              </Button>
            )}

            <Button
              variant="gradient"
              className="flex items-center w-fit h-full gap-3 py-2 rounded-md"
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
                : "Save"}
            </Button>
          </div>
        </div>

        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {currentStep === 1 && (
              <div className="space-y-4">
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xl lg:text-2xl">
                        Enter School Name
                      </FormLabel>
                      <FormControl>
                        <TextArea
                          placeholder="eg. Mable Hills School"
                          {...field}
                          rows={4}
                          className="text-xl"
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
                      className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
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
                    <span className="capitalize">{storedType}</span>s within the
                    classroom.
                  </p>

                  {!loading && enableClassroom && (
                    <div className="flex flex-col space-y-4">
                      {loading && <p>Loading classrooms...</p>}
                      {error && <p className="text-red-500">Error: {error}</p>}

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
                          <SelectTrigger className="h-12">
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
                      <FormLabel className="text-xl lg:text-2xl mt-4">
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
                      <FormLabel className="text-xl lg:text-2xl">
                        Grade
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="text-xl">
                          <SelectValue placeholder="Select grade" />
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
                  <FormLabel className="text-xl lg:text-2xl">
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
                      <FormLabel className="text-xl lg:text-2xl mt-4">
                        Enter subject for the{" "}
                        <span className="capitalize">{storedType}</span>{" "}
                      </FormLabel>
                      <FormControl>
                        <TextArea
                          placeholder="e.g. physics,maths etc."
                          {...field}
                          required
                          className="text-lg lg:text-xl"
                        />
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />

                <div className="space-y-1 mt-4">
                  <p className="font-medium text-xl">Select Question Type</p>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="objective"
                      checked={questionType === "objective"}
                      onChange={() => setQuestionType("objective")}
                    />
                    Objective
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="theory"
                      checked={questionType === "theory"}
                      onChange={() => setQuestionType("theory")}
                    />
                    Theory
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="both"
                      checked={questionType === "both"}
                      onChange={() => setQuestionType("both")}
                    />
                    Objective and Theory
                  </label>
                </div>

                <FormField
                  control={control}
                  name="instruction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xl lg:text-2xl mt-4">
                        Enter a detailed instruction for the{" "}
                        <span className="capitalize">{storedType}</span>{" "}
                      </FormLabel>
                      <FormControl>
                        <TextArea
                          placeholder="e.g. answer all questions"
                          {...field}
                          required
                          className="text-lg lg:text-xl"
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
                <div className="flex items-center gap-4">
                  <div>
                    No of Question (Objective)
                    <Input
                      type="number"
                      placeholder="Number of Questions"
                      className="w-40"
                      value={numberOfQuestions}
                      onChange={(e) =>
                        setNumberOfQuestions(Number(e.target.value))
                      }
                      min={1}
                      max={20}
                    />
                  </div>
                  {currentQuestions.length === 0 && (
                    <Button
                      variant={"outline"}
                      onClick={handleGenerateMoreQuestions}
                      className="font-bold py-2 px-4 rounded-full ml-4 bg-gray-300"
                    >
                      {loadingSuggestion ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        `Click to Generate ${storedType} Questions`
                      )}
                    </Button>
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
                <div className="max-h-96 overflow-y-auto p-4 bg-white rounded-xl shadow-md">
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
                <div className="flex items-center gap-4">
                  <div>
                    No of Questions (Theory)
                    <Input
                      type="number"
                      placeholder="Number of Questions"
                      className="w-40"
                      value={numberOfQuestions}
                      onChange={(e) =>
                        setNumberOfQuestions(Number(e.target.value))
                      }
                      min={1}
                      max={20}
                    />
                  </div>
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
                      {theoryQuestions.map((q, index) => (
                        <div
                          key={index}
                          className="relative space-y-2 border p-4 rounded-md bg-gray-50"
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
                            <label className="font-medium">Q{index + 1}</label>
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

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleGenerateTheoryQuestions}
                    className="font-bold py-2 px-4 rounded-full ml-1 bg-gray-300"
                  >
                    {loadingSuggestion ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : theoryQuestions.length > 0 ? (
                      `Generate More ${storedType} Questions`
                    ) : (
                      `Click to Generate ${storedType} Questions`
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    className=""
                    onClick={(event) => {
                      event.preventDefault();
                      setTheoryQuestions([
                        ...theoryQuestions,
                        { question: "", correct_answer: "", mark: 1 },
                      ]);
                    }}
                  >
                    + Add New Theory Question
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 4 && questionType === "both" && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div>
                    No of Questions (Theory)
                    <Input
                      type="number"
                      placeholder="Number of Questions"
                      className={`w-40`}
                      value={numberOfQuestions}
                      onChange={(e) =>
                        setNumberOfQuestions(Number(e.target.value))
                      }
                      min={1}
                      max={20}
                    />
                  </div>
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
                            <label className="font-medium">Q{index + 1}</label>
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
                  variant="outline"
                  onClick={handleGenerateTheoryQuestions}
                  className="font-bold py-2 px-4 rounded-full ml-1 bg-gray-300"
                >
                  {loadingSuggestion ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : theoryQuestions.length > 0 ? (
                    `Generate More ${storedType} Questions`
                  ) : (
                    `Click to Generate ${storedType} Questions`
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={(event) => {
                    event.preventDefault();
                    setTheoryQuestions([
                      ...theoryQuestions,
                      { question: "", correct_answer: "", mark: 1 },
                    ]);
                  }}
                >
                  + Add New Theory Question
                </Button>
              </div>
            )}
          </form>
        </FormProvider>

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
