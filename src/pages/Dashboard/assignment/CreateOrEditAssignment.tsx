import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Undo2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loadClassrooms } from "../../../store/slices/classroomSlice";
import { RootState, AppDispatch } from "../../../store";
import { Button } from "../../../components/ui/Button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../../../components/ui/Form";
import { TextArea } from "../../../components/ui/TextArea";
import { Input } from "../../../components/ui/Input";
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
import { createAssignmentThunk } from "../../../store/slices/assignmentSlice";
import { Checkbox } from "../../../components/ui/Checkbox";

interface CreateOrEditAssignmentProps {
  isEdit?: boolean;
}

const gradeOptions = [
  "Pre School",
  "Early Years",
  "Nursery 1",
  "Nursery 2",
  ...Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`),
  "University",
];

const formSchema = z.object({
  user_id: z.number(),
  name: z.string().min(1, { message: "Classroom name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  grade: z.string(),
  status: z.string(),
  number_of_students: z
    .number({ required_error: "Number of students is required" })
    .min(1, { message: "Number of students must be at least 1" }),
  scope_restriction: z.boolean(),
});

const CreateOrEditAssignment: React.FC<CreateOrEditAssignmentProps> = ({
  isEdit,
}) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
    "default"
  );

  const storedUser = JSON.parse(localStorage.getItem("ai-teacha-user") || "{}");
  const userId = storedUser.id;

  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_id: userId,
      name: "",
      description: "",
      grade: "University",
      status: "active",
      number_of_students: 1,
      scope_restriction: true,
    },
  });

  const { handleSubmit, control, setValue } = formMethods;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const assignmentData = {
      ...data,
    };

    try {
      await dispatch(createAssignmentThunk(assignmentData)).unwrap();
      setToastMessage("Classroom created successfully!");
      setToastVariant("default");
      await dispatch(loadClassrooms());
      setTimeout(() => navigate("/dashboard/classrooms"), 1000);
    } catch (error) {
      setToastMessage("Failed to create classroom. Please try again.");
      setToastVariant("destructive");
    } finally {
      setToastOpen(true);
      setIsLoading(false);
    }
  };

  const selectedClassroom = useSelector(
    (state: RootState) => state.classrooms.selectedClassroom
  );

  useEffect(() => {
    if (isEdit && selectedClassroom) {
      setValue("name", selectedClassroom.classroom_name);
      setValue("description", selectedClassroom.classroom_description || "");
      setValue("grade", selectedClassroom.grade);
      setValue("status", selectedClassroom.status);
      setValue("number_of_students", selectedClassroom.number_of_students);
    }
  }, [isEdit, selectedClassroom, setValue]);

  return (
    <ToastProvider swipeDirection="left">
      <div className="mt-12">
        <h1 className="text-2xl font-bold text-gray-900 ">
          {isEdit ? "Edit Assignment" : "Create Assignment"}
        </h1>

        <div className="flex w-full my-6 items-center justify-between">
          <Button
            className="flex items-center bg-white rounded-md text-black w-fit h-full gap-3 py-2"
            onClick={() => navigate(-1)}
          >
            <Undo2 size={"1.1rem"} color="black" />
            Back
          </Button>
          <Button
            variant={"gradient"}
            className="flex items-center w-fit h-full gap-3 py-2 rounded-md"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>

        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignment Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter name" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-300" />
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
                      <TextArea placeholder="Enter description" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="scope_restriction"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          name="scope_restriction"
                        />
                        <FormLabel>
                          Limit student to stay within the scope
                        </FormLabel>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
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

              <FormField
                control={control}
                name="number_of_students"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Students</FormLabel>
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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

export default CreateOrEditAssignment;
