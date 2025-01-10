import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Undo2, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  fetchClassroomByIdThunk,
  editClassroomToolsThunk,
} from "../../../store/slices/classroomSlice";
import { loadStudentTools } from "../../../store/slices/toolsSlice";
import { RootState, AppDispatch } from "../../../store";
import { Button } from "../../../components/ui/Button";
import CustomizeDialog from "./components/CustomizeDialogue";

const formSchema = z.object({
  classroom_id: z.string().min(1, { message: "Classroom ID is required" }),
  tools: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    })
  ),
});

const EditClassroomTools: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { selectedClassroom, loading: classroomLoading } = useSelector(
    (state: RootState) => state.classrooms
  );
  const { studentTools, loading: toolsLoading } = useSelector(
    (state: RootState) => state.tools
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // New isEditing state
  const [selectedTools, setSelectedTools] = useState<any[]>([]);

  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      classroom_id: id,
      tools: [],
    },
  });

  const { handleSubmit, setValue } = formMethods;

  useEffect(() => {
    if (id) {
      dispatch(fetchClassroomByIdThunk(Number(id)));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedClassroom && !classroomLoading) {
      const classroomTools = selectedClassroom.tools || [];
      const preSelectedTools = classroomTools
        .map((classroomTool: any) => {
          const matchingTool = studentTools.find(
            (tool: any) => tool.id === classroomTool.tool_id
          );
          if (matchingTool) {
            return {
              ...matchingTool,
              customized_name: classroomTool.customized_name || null,
              customized_description:
                classroomTool.customized_description || null,
              additional_instruction:
                classroomTool.additional_instruction || null,
            };
          }
          return null;
        })
        .filter(Boolean); // Filter out null values
      setSelectedTools(preSelectedTools);
    }
  }, [selectedClassroom, studentTools, classroomLoading, setValue]);

  useEffect(() => {
    dispatch(loadStudentTools());
  }, [dispatch]);

  const handleToolSelect = (tool: any) => {
    const isSelected = selectedTools.some((t) => t.id === tool.id);
    if (isSelected) {
      setSelectedTools((prev) => prev.filter((t) => t.id !== tool.id));
    } else {
      setSelectedTools((prev) => [...prev, tool]);
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
    // setIsLoading(true);
    setIsEditing(true);

    const toolsData = {
      classroom_id: data.classroom_id,
      tools: selectedTools.map((tool) => ({
        tools_id: tool.id,
        // name: tool.name,
        customized_name: tool.customized_name || null,
        customized_description: tool.customized_description || null,
        additional_instruction: tool.additional_instruction || null,
      })),
    };

    try {
      console.log("Classroom Data:", toolsData);
      await dispatch(editClassroomToolsThunk(toolsData));
      //navigate("/dashboard/classrooms");
    } catch (error) {
      console.error("Failed to update classroom:", error);
    } finally {
      setIsLoading(false);
      setIsEditing(false);
    }
  };

  return (
    <div className="mt-12">
      <h1 className="text-2xl font-bold">Edit Classroom Tools</h1>
      <div className="flex w-full my-6 items-center justify-between">
        <Button
          onClick={() => navigate(-1)}
          className="flex items-center gap-3"
        >
          <Undo2 size="1.1rem" />
          Back
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant={"gradient"}
          disabled={isLoading || classroomLoading || toolsLoading || isEditing}
          className="rounded-md"
        >
          {isEditing ? "Saving..." : "Save"}
        </Button>
      </div>

      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">
              Select Tools Needed
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
              {toolsLoading ? (
                <p>Loading tools...</p>
              ) : (
                studentTools.map((tool) => {
                  const isSelected = selectedTools.find(
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
                            customized_name={isSelected?.customized_name || ""}
                            customized_description={
                              isSelected?.customized_description || ""
                            }
                            additional_instruction={
                              isSelected?.additional_instruction || ""
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
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default EditClassroomTools;
