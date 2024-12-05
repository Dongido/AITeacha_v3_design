import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Undo2, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loadStudentTools } from "../../../store/slices/toolsSlice";
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
import {
  loadClassrooms,
  createClassroomThunk,
} from "../../../store/slices/classroomSlice";
import CustomizeDialog from "./components/CustomizeDialogue";
import { Checkbox } from "../../../components/ui/Checkbox";
import FileUpload from "../../../components/ui/FileUpload";
interface ToolData {
  id: number;
  name: string;
  customized_name?: string;
  customized_description?: string;
  additional_instruction?: string;
}

interface CreateOrEditClassroomProps {
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

const toolSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  customized_name: z.string().optional(),
  customized_description: z.string().optional(),
  additional_instruction: z.string().optional(),
});

const formSchema = z.object({
  user_id: z.number(),
  name: z.string().min(1, { message: "Classroom name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  grade: z.string(),
  status: z.string(),
  number_of_students: z
    .number({ required_error: "Number of students is required" })
    .min(1, { message: "Number of students must be at least 1" }),
  tools: z.array(toolSchema).optional(),
  scope_restriction: z.boolean(),
  resources: z.array(z.instanceof(File)).optional(),
});

const CreateOrEditClassroom: React.FC<CreateOrEditClassroomProps> = ({
  isEdit,
}) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { studentTools, studentLoading, studentError } = useSelector(
    (state: RootState) => state.tools
  );
  const [selectedTools, setSelectedTools] = useState<ToolData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
    "default"
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

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
      tools: [],
      resources: [],
      scope_restriction: true,
    },
  });

  const { handleSubmit, control, setValue } = formMethods;

  useEffect(() => {
    if (studentTools.length === 0) {
      dispatch(loadStudentTools());
    }
  }, [dispatch, studentTools.length]);

  const handleToolSelect = (tool: ToolData) => {
    const isSelected = selectedTools.find((t) => t.id === tool.id);
    if (isSelected) {
      setSelectedTools(selectedTools.filter((t) => t.id !== tool.id));
    } else {
      setSelectedTools([...selectedTools, tool]);
    }
  };

  const handleToolEdit = (toolId: number, field: string, value: string) => {
    setSelectedTools((prev) =>
      prev.map((tool) =>
        tool.id === toolId ? { ...tool, [field]: value } : tool
      )
    );
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const classroomData = {
      ...data,
      tools: selectedTools.map((tool) => ({
        tools_id: tool.id,
        customized_name: tool.customized_name || null,
        customized_description: tool.customized_description || null,
        additional_instruction: tool.additional_instruction || null,
      })),

      resources: uploadedFiles,
    };

    try {
      await dispatch(createClassroomThunk(classroomData)).unwrap();
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
      // setSelectedTools(selectedClassroom.tools || []);
      setUploadedFiles(selectedClassroom.resources || []);
    }
  }, [isEdit, selectedClassroom, setValue]);

  const nextStep = handleSubmit((data) => {
    setCurrentStep(2);
  });

  const previousStep = () => setCurrentStep(1);

  return (
    <ToastProvider swipeDirection="left">
      <div className="mt-12">
        <h1 className="text-2xl font-bold text-gray-900 ">
          {isEdit ? "Edit Classroom" : "Create Classroom"}
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
            {currentStep === 1 ? (
              <div>{""}</div>
            ) : (
              <Button
                onClick={previousStep}
                variant="outline"
                className="bg-gray-300 text-black rounded-md"
              >
                Previous
              </Button>
            )}
            <Button
              variant={"gradient"}
              className="flex items-center w-fit h-full gap-3 py-2 rounded-md"
              onClick={currentStep === 1 ? nextStep : handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : currentStep === 1 ? "Next" : "Save"}
            </Button>
          </div>
        </div>

        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {currentStep === 1 ? (
              <div className="space-y-4">
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Classroom Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel>Upload </FormLabel>
                  <FileUpload
                    onFilesChange={(files: File[]) => setUploadedFiles(files)}
                  />
                </FormItem>

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
            ) : (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900">
                  Select Tools Needed
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
                  {studentLoading ? (
                    <p>Loading tools...</p>
                  ) : (
                    studentTools.map((tool) => {
                      const isSelected = selectedTools.find(
                        (t) => t.id === tool.id
                      );
                      const selectedTool = selectedTools.find(
                        (t) => t.id === tool.id
                      );

                      return (
                        <div
                          key={tool.id}
                          className={`relative p-4 border rounded-lg cursor-pointer ${
                            isSelected ? "bg-[#e3def0]" : "bg-white"
                          }`}
                          onClick={() => {
                            if (!isSelected) handleToolSelect(tool);
                          }}
                        >
                          <h3 className="font-semibold">{tool.name}</h3>
                          <p className="text-sm text-gray-600">
                            {tool.description}
                          </p>

                          {isSelected && (
                            <div className="mt-2 space-y-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToolSelect(tool);
                                }}
                                className="absolute top-2 right-2 p-2 rounded-full bg-red-50 text-gray-500 hover:text-gray-700"
                                aria-label="Unselect Tool"
                              >
                                <X className="h-4 w-4 text-purple-700" />
                              </button>
                              <CustomizeDialog
                                toolName={tool.name}
                                customized_name={
                                  selectedTool?.customized_name || ""
                                }
                                customized_description={
                                  selectedTool?.customized_description || ""
                                }
                                additional_instruction={
                                  selectedTool?.additional_instruction || ""
                                }
                                onCustomizeChange={(field, value) =>
                                  handleToolEdit(tool.id, field, value)
                                }
                              />
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
                <Button
                  onClick={previousStep}
                  variant="outline"
                  className="bg-gray-300 text-black rounded-md mt-4"
                >
                  Previous
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

export default CreateOrEditClassroom;
