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
import { TextArea } from "../../../components/ui/TextArea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../../components/ui/Select";
import { Button } from "../../../components/ui/Button";
import { loadClassrooms } from "../../../store/slices/classroomSlice";
import { createAssignmentThunk } from "../../../store/slices/assignmentSlice";
import { RootState, AppDispatch } from "../../../store";
import GenerateQuestionsDialog from "./GenerateQuestionsDialog";

const formSchema = z.object({
  user_id: z.number(),
  classroom_id: z.number().min(1, "Please select a valid classroom"),
  description: z.string().nonempty("Description is required"),
  number_of_students: z.number(),
  grade: z.string(),
  questions: z.array(
    z.object({
      assignment_question: z.string().nonempty("Question cannot be empty"),
    })
  ),
});

const CreateOrEditAssignment: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [questionsCount, setQuestionsCount] = useState(1);
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
    },
  });

  const { handleSubmit, control, setValue, watch, getValues } = formMethods;

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

  const handleNextStep = () => {
    const values = getValues();
    if (values.classroom_id && values.description) {
      setStep(2);
    } else {
      /// alert("Please select a classroom and enter a description");
    }
  };

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
    try {
      console.log(data);
      await dispatch(createAssignmentThunk(data)).unwrap();
      navigate("/dashboard/assignment");
    } catch (error) {
      console.error("Failed to create assignment:", error);
    }
  };

  return (
    <div className="mt-12">
      <h1 className="text-2xl font-bold text-gray-900">
        {step === 1 ? "Step 1: Classroom & Description" : "Step 2: Questions"}
      </h1>

      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {step === 1 && (
            <div className="space-y-4">
              <FormField
                control={control}
                name="classroom_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Classroom</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleClassroomChange(value);
                        }}
                        value={field.value?.toString()}
                      >
                        <SelectTrigger>
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
                    <FormLabel>Description</FormLabel>
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
              <div className="flex justify-end mt-6">
                <Button
                  variant="gradient"
                  className="rounded-md"
                  onClick={handleNextStep}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>Number of Questions</FormLabel>
                <Input
                  type="number"
                  min={1}
                  value={questionsCount}
                  onChange={(e) => handleAddQuestions(Number(e.target.value))}
                />
              </div>

              <GenerateQuestionsDialog
                classroomId={selectedClassroom?.classroom_id || ""}
                grade={selectedClassroom?.grade || ""}
                description={getValues("description")}
                onQuestionsGenerated={handleQuestionsGenerated}
              />

              {Array.from({ length: questionsCount }, (_, index) => (
                <FormField
                  key={index}
                  control={control}
                  name={`questions.${index}.assignment_question`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question {index + 1}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={`Enter question ${index + 1}`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <div className="flex justify-between mt-6">
                <Button variant="default" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button variant="gradient" type="submit" className="rounded-md">
                  Submit Assignment
                </Button>
              </div>
            </div>
          )}
        </form>
      </FormProvider>
    </div>
  );
};

export default CreateOrEditAssignment;
