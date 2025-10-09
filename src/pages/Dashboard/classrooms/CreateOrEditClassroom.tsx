import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Undo2, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  useForm,
  FormProvider,
  useFieldArray,
  useWatch,
} from "react-hook-form";
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
import { Label } from "../../../components/ui/Label";
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
import { suggestClassroomTopics } from "../../../api/classrooms";
import { FaHeart } from "react-icons/fa";
import { Switch } from "../../../components/ui/Switch";
import { suggestClassroomOutlines } from "../../../api/classrooms";
import {
  parseOutlines,
  OutlineInputs,
  AssessmentQuestion,
  Question,
  QuestionOption,
} from "./parsedInputs";
import { Chip } from "../../../components/ui/Chip";
import { DateTimePicker } from "../../../components/ui/DatePicker";
import { Country } from "country-state-city";
import { fetchCurriculumByCountry } from "../../../api/tools";
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

const toolSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  customized_name: z
    .string()
    .optional()
    .refine((val) => !containsUrl(val || ""), {
      message: "Customized name cannot contain URLs",
    }),
  customized_description: z
    .string()
    .optional()
    .refine((val) => !containsUrl(val || ""), {
      message: "Customized description cannot contain URLs",
    }),
  additional_instruction: z
    .string()
    .optional()
    .refine((val) => !containsUrl(val || ""), {
      message: "Additional instructions cannot contain URLs",
    }),
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
  const [selectedDateTime, setSelectedDateTime] = React.useState<
    any | undefined
  >(undefined);
  const [countries, setCountries] = useState<
    { name: string; isoCode: string }[]
  >([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [curriculums, setCurriculums] = useState<any[]>([]);
  const [isCurriculumLoading, setIsCurriculumLoading] =
    useState<boolean>(false);
  const [selectedTools, setSelectedTools] = useState<ToolData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
    "default"
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [suggestedDescriptions, setSuggestedDescriptions] = useState<string[]>(
    []
  );
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const [isLoadingOutline, setIsLoadingOutline] = useState<boolean>(false);
  const [generatedOutline, setGeneratedOutline] = useState<any>(null);
  const [savedOutlines, setSavedOutlines] = useState<string[]>([]);
  const [parsedOutlines, setParsedOutlines] = useState<
    { title: string; items?: string[]; assessment?: AssessmentQuestion[] }[]
  >([]);
  const [selectedOutlines, setSelectedOutlines] = useState<
    { title: string; items?: string[]; assessment?: AssessmentQuestion[] }[]
  >([]);
   console.log("outline", selectedOutlines)

  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [outlines, setOutlines] = useState<
    { title: string; assessment?: string }[]
  >([]);
  const storedUser = JSON.parse(localStorage.getItem("ai-teacha-user") || "{}");
  const [isAgreed, setIsAgreed] = React.useState(false);
  const userId = storedUser.id;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const stepOneSchema = z.object({
    user_id: z.number(),
    name: z
      .string()
      .min(1, { message: "Classroom name is required" })
      .refine((val) => !containsUrl(val), {
        message: "Classroom name cannot contain URLs",
      }),
    grade: z.string(),
    status: z.string(),
    country: z.string().min(1, { message: "Country is required" }),
    curriculum_type: z
      .string()
      .min(1, { message: "Curriculum type is required" }),
    number_of_students: z
      .number({ required_error: "Number of students is required" })
      .min(1, { message: "Number of students must be at least 1" }),
    tools: z.array(toolSchema).optional(),
    scope_restriction: z.boolean(),
    amount: z.number().optional(),
    currency: z.string().optional(),
  });

  const stepTwoSchema = z.object({
    description: z
      .string()
      .min(1, { message: "Classroom Description is required" }),
    resource_links: z
      .array(
        z.object({
          url: z.string().url("Must be a valid URL"),
        })
      )
      .default([]),
    resource_accessibility: z.boolean(),
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
      description: "",
      grade: "Pre School",
      status: "inactive",
      number_of_students: 1,
      resource_links: [],
      country: "",
      curriculum_type: "",
      tools: [],
      resources: [],
      scope_restriction: true,
      resource_accessibility: true,
      amount: 0,
      currency: "USD",
    },
  });
  const { handleSubmit, control, setValue, getValues, trigger } = formMethods;

  const {
    fields: resourceLinksFields,
    append: appendResourceLink,
    remove: removeResourceLink,
  } = useFieldArray({
    control,
    name: "resource_links",
  });
  const resourceLinks = useWatch({ control, name: "resource_links" });
  const [inputValue, setInputValue] = useState<string | null>(null);
  useEffect(() => {
    try {
      const allCountries = Country.getAllCountries().map((country) => ({
        name: country.name,
        isoCode: country.isoCode,
      }));
      setCountries(allCountries);
    } catch (error) {
      console.error("Error fetching countries from country-state-city:", error);
    }
  }, []);

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

  const handleCountryChange = async (countryName: any) => {
    setSelectedCountry(countryName);
    setValue("curriculum_type", "");
    const selectedCountry = countries.find((c) => c.name === countryName);
    const countryCode = selectedCountry?.isoCode;

    if (countryCode) {
      setIsCurriculumLoading(true);
      setCurriculums([]);
      try {
        const fetchedCurriculums = await fetchCurriculumByCountry(countryCode);
        setCurriculums(fetchedCurriculums);
        console.log(
          `Fetched Curriculums for ${countryName} (${countryCode}):`,
          fetchedCurriculums
        );
      } catch (error) {
        console.error("Error fetching curriculum:", error);
        setCurriculums([]);
      } finally {
        setIsCurriculumLoading(false);
      }
    } else {
      console.warn(`No ISO code found for: ${countryName}`);
      setCurriculums([]);
    }
  };

  const generateOutline = async () => {
    setIsLoadingOutline(true);
    try {
      const { description, grade } = getValues();
      const response = await suggestClassroomOutlines(description, grade);

      const parsed = parseOutlines(response);
      setParsedOutlines(parsed);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoadingOutline(false);
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
    const transformedResourceLinks = data.resource_links.map(
      (link) => link.url
    );
    const classroomData = {
      ...data,

      tools: selectedTools.map((tool) => ({
        tools_id: tool.id,
        customized_name: tool.customized_name || null,
        customized_description: tool.customized_description || null,
        additional_instruction: tool.additional_instruction || null,
      })),

      class_type: isChecked ? "Paid" : "Free",
      resources: uploadedFiles,
      outlines: selectedOutlines.map(({ title, assessment }) => ({
        title,
        assessments: assessment
          ? assessment.map((assessmentQuestion) => ({
              type: "objective",
              title: assessmentQuestion.title,
              options: assessmentQuestion.options || [],
            }))
          : [],
      })),
      currency: data.currency || "USD",
      amount: data.amount || "0",
      end_date: selectedDateTime ? selectedDateTime.toISOString() : null,
      resource_accessibility: data.resource_accessibility,
      resource_links: transformedResourceLinks,
    };
    try {
      console.log(classroomData);
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

  const handleSwitchChange = (checked: boolean) => {
    setIsChecked(checked);
    console.log("Switch is:", checked);
  };

  const handleOutlinesChange = (
    updatedOutlines: {
      title: string;
      items?: string[];
      assessment?: AssessmentQuestion[];
    }[]
  ) => {
    setParsedOutlines(updatedOutlines);
  };

  const handleSelectedOutlinesChange = (
    selected: {
      title: string;
      items?: string[];
      assessment?: AssessmentQuestion[];
    }[]
  ) => {
    setSelectedOutlines((prevSelectedOutlines) => {
      const selectedMap = new Map(
        prevSelectedOutlines.map((outline) => [outline.title, outline])
      );

      selected.forEach((newOutline) => {
        selectedMap.set(newOutline.title, {
          ...selectedMap.get(newOutline.title),
          ...newOutline,
          items:
            newOutline.items || selectedMap.get(newOutline.title)?.items || [],
          assessment:
            newOutline.assessment ||
            selectedMap.get(newOutline.title)?.assessment ||
            [],
        });
      });

      return Array.from(selectedMap.values());
    });
  };
  const handleRemoveSelectedOutline = (
    titleToRemove: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    setSelectedOutlines((prevSelected) => {
      const outlineToRemove = prevSelected.find(
        (outline) => outline.title === titleToRemove
      );

      console.log("Removing Outline:", outlineToRemove);

      const updatedSelectedOutlines = prevSelected.filter(
        (outline) => outline.title !== titleToRemove
      );

      handleSelectedOutlinesChange(updatedSelectedOutlines);

      return updatedSelectedOutlines;
    });
  };

  const nextStep = async () => {
    if (currentStep === 1) {
      const isValid = await trigger(stepOneSchema.keyof().options);
      if (isValid) {
        const stepOneData = getValues();
        if (isChecked && !isAgreed) {
          setToastMessage("Please agree for the service fee charge");
          setToastVariant("destructive");
          setToastOpen(true);
        } else {
          setIsLoadingSuggestions(true);
          suggestClassroomTopics(stepOneData.name, stepOneData.grade)
            .then((topics) => {
              const formattedTopics = topics
                .split("\n")
                .map((topic: string) => topic.trim().replace(/^\d+\.\s*/, ""));
              setSuggestedDescriptions(formattedTopics);
            })
            .catch((error) => {
              console.error(
                "Error fetching suggested descriptions:",
                error.message
              );
              setToastMessage("Failed to fetch suggestions. Please try again.");
              setToastVariant("destructive");
              setToastOpen(true);
            })
            .finally(() => {
              setIsLoadingSuggestions(false);
            });
          setCurrentStep(2);
        }
      }
    } else if (currentStep === 2) {
      const isValid = await trigger(stepTwoSchema.keyof().options);
      if (isValid) {
        setCurrentStep(3);
      }
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };
  const handleAgreedChange = (checked: boolean) => {
    setIsAgreed(checked);
  };

  const previousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleAddResourceLink = () => {
    if (inputValue) {
      try {
        z.string().url().parse(inputValue);
        appendResourceLink({ url: inputValue });
        setInputValue("");
        setErrorMessage(null);
      } catch (error: any) {
        setErrorMessage("Please enter a valid URL.");
        console.error("Invalid URL:", error.message);
      }
    }
  };

  const handleDateTimeChange = (selectedDateTime: Date | undefined) => {
    if (selectedDateTime) {
      setSelectedDateTime(selectedDateTime);
    } else {
      console.log("No date and time selected");
    }
  };

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
            {currentStep > 1 && (
              <Button
                onClick={previousStep}
                variant="outline"
                className="bg-gray-300 text-black rounded-md"
              >
                Previous
              </Button>
            )}

            {currentStep === 3 && (
              <Button
                onClick={() => {
                  if (currentStep < 4) {
                    nextStep();
                  }
                }}
                variant="outline"
                className="bg-gray-300 text-black rounded-md"
              >
                Skip
              </Button>
            )}
            <Button
              variant="gradient"
              className="flex items-center w-fit h-full gap-3 py-2 rounded-md"
              onClick={currentStep < 4 ? nextStep : handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : currentStep < 4 ? "Next" : "Save"}
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
                        Enter Classroom Name
                      </FormLabel>
                      <FormControl>
                        <TextArea
                          placeholder="eg. Intro to web design for begginers"
                          {...field}
                          rows={4}
                          className="text-xl"
                        />
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />

                <div>
                  <div className="flex gap-2">
                    <label className="flex items-center space-x-2 my-2">
                      <Switch
                        id="my-switch"
                        checked={isChecked}
                        onCheckedChange={handleSwitchChange}
                      />
                      <span className="font-bold">
                        {isChecked ? "Paid Classroom" : "Free Classroom"}
                      </span>
                    </label>
                  </div>

                  {isChecked && (
                    <>
                      <FormField
                        control={control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xl lg:text-2xl mt-4">
                              Amount
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
                      <label className="flex items-center space-x-2 my-2">
                        <Checkbox
                          id="agree-checkbox"
                          checked={isAgreed}
                          onCheckedChange={handleAgreedChange}
                        />
                        <span>
                          The service fee would be deducted from the amount.
                        </span>
                      </label>
                      <FormField
                        control={control}
                        name="currency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg lg:text-xl mt-4">
                              Currency
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger className="text-lg">
                                <SelectValue placeholder="Select Currency" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="NGN">
                                  Nigerian Naira (NGN)
                                </SelectItem>
                                <SelectItem value="USD">
                                  US Dollar (USD)
                                </SelectItem>
                                <SelectItem value="GBP">
                                  Pounds Sterling (GBG)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>

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

                <FormField
                  control={control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xl lg:text-2xl">
                        Country
                      </FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleCountryChange(value);
                        }}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="text-xl">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem
                              key={country.isoCode}
                              value={country.name}
                            >
                              {country.name}
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
                  name="curriculum_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xl lg:text-2xl">
                        Curriculum Type
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!selectedCountry || isCurriculumLoading}
                      >
                        <SelectTrigger className="text-xl">
                          <SelectValue
                            placeholder={
                              isCurriculumLoading
                                ? "Loading curriculums..."
                                : selectedCountry
                                ? "Select curriculum type"
                                : "Select a country first"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {curriculums.length > 0 ? (
                            curriculums.map((curriculumName: string) => (
                              <SelectItem
                                key={curriculumName}
                                value={curriculumName}
                              >
                                {curriculumName}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-value" disabled>
                              No curriculums available for this country
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400" />
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

                  <FileUpload
                    onFilesChange={(files: File[]) => setUploadedFiles(files)}
                    multiple={true}
                    maxFiles={10}
                  />
                </FormItem>

                <FormField
                  control={control}
                  name="resource_accessibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center gap-2 my-6 mt-10">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            name="resource_accessibility"
                          />
                          <FormLabel className="text-xl lg:text-2xl">
                            Allow Students to download resources
                          </FormLabel>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xl lg:text-2xl mt-4">
                        Enter a detailed description on what this classroom is
                        all about
                      </FormLabel>
                      <FormControl>
                        <TextArea
                          placeholder="e.g. This course offers an introduction to web design concepts, tools, and techniques, tailored for beginners with no prior experience in designing websites"
                          {...field}
                          required
                          className="text-lg lg:text-xl"
                        />
                      </FormControl>
                      <FormMessage className="text-red-300" />
                      {isLoadingSuggestions ? (
                        <p className="text-gray-500 mt-2">
                          Loading suggested descriptions...
                        </p>
                      ) : (
                        <div>
                          <center className="font-medium">
                            {" "}
                            Suggested Discriptions
                          </center>
                          <div className="mt-4 flex flex-wrap gap-2 mx-auto px-6">
                            {suggestedDescriptions.map((description, index) => (
                              <div
                                key={index}
                                className="p-2 border rounded-md bg-gray-50 text-sm lg:text-md hover:bg-gray-200 cursor-pointer"
                                onClick={() => field.onChange(description)}
                              >
                                {description}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="scope_restriction"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center gap-2 my-6 mt-10">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            name="scope_restriction"
                          />
                          <FormLabel className="text-xl lg:text-2xl">
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
                  name="resource_links"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-xl lg:text-2xl mt-4">
                        Resource Links
                        <p className="text-gray-500 text-sm mt-1">
                          Enter valid URLs (e.g., https://www.example.com,
                          http://subdomain.domain.net).
                        </p>
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="url"
                            placeholder="New resource link..."
                            value={inputValue || ""}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddResourceLink();
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAddResourceLink}
                          >
                            Add
                          </Button>
                        </div>
                      </FormControl>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {resourceLinks &&
                          resourceLinks.length > 0 &&
                          resourceLinks.map((link, index) => (
                            <Chip
                              key={resourceLinksFields[index]?.id || index}
                              onDismiss={() => removeResourceLink(index)}
                              dismissIcon={<X className="h-4 w-4" />}
                            >
                              {link?.url}
                            </Chip>
                          ))}
                      </div>
                      {errorMessage && (
                        <p className="text-red-500 text-sm mt-1">
                          {errorMessage}
                        </p>
                      )}
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />
                <div className="my-2">
                  <Label className="text-xl lg:text-2xl mt-4 mb-2 block">
                    Classroom End Date
                  </Label>
                  <DateTimePicker
                    onChange={handleDateTimeChange}
                    placeholder="Select end date"
                  />
                </div>

                <FormField
                  control={control}
                  name="number_of_students"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xl lg:text-2xl mt-4">
                        Number of Students
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
              </div>
            )}
            {currentStep === 3 && (
              <div className="space-y-4">
                {parsedOutlines.length === 0 && (
                  <Button
                    onClick={handleSubmit(generateOutline)}
                    variant={"outline"}
                    className="font-bold py-2 px-4 rounded-full ml-4 bg-gray-300"
                  >
                    {"Click to Generate Classroom Outline"}
                  </Button>
                )}

                {isLoadingOutline && (
                  <div className="mt-4 text-center">
                    Generating new outlines...
                  </div>
                )}
                {parsedOutlines.length > 0 && !isLoadingOutline && (
                  <div>
                    <h3>Classroom Outlines:</h3>
                    <OutlineInputs
                      initialOutlines={parsedOutlines}
                      grade={getValues("grade")}
                      onOutlinesChange={handleOutlinesChange}
                      onSelectedOutlinesChange={handleSelectedOutlinesChange}
                      onGenerateMoreOutlines={generateOutline}
                    />
                  </div>
                )}

                {selectedOutlines.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">
                      Selected Outlines:
                    </h3>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Assessment
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedOutlines.map((outline, index) => (
                          <tr key={index}>
                            <td className="px-2 py-4 ">
                              <Button
                                onClick={(event) =>
                                  handleRemoveSelectedOutline(
                                    outline.title,
                                    event
                                  )
                                }
                                className="rounded-full bg-red-50 text-gray-500 hover:text-gray-700"
                                aria-label="Unselect Tool"
                              >
                                <X className="h-4 w-4 text-purple-700" />
                              </Button>
                            </td>

                            <td className="px-6 py-4 ">{outline.title}</td>
                            <td className="px-6 py-4">
                              {outline.assessment &&
                                outline.assessment.map((question, qIndex) => (
                                  <div key={qIndex} className="mb-4">
                                    <p className="font-semibold">
                                      {question.title}
                                    </p>
                                  </div>
                                ))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
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
                          <div className="flex ">
                            <div className="text-primary text-2xl mr-4">
                              {tool.thumbnail ? (
                                <img
                                  src={
                                    tool.thumbnail.startsWith("http")
                                      ? tool.thumbnail
                                      : `https://${tool.thumbnail}`
                                  }
                                  alt={tool.name || "Tool Thumbnail"}
                                  className="w-16 h-20 object-cover rounded-lg"
                                />
                              ) : (
                                <FaHeart className="text-purple-500 w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center" />
                              )}
                            </div>
                            <div className="">
                              <h3 className="font-semibold">{tool.name}</h3>
                              <p className="text-sm text-gray-600">
                                {tool.description}
                              </p>
                            </div>
                          </div>

                          {isSelected && (
                            <div className="mt-2 space-y-2">
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToolSelect(tool);
                                }}
                                className="absolute top-2 right-2 p-2 rounded-full bg-red-50 text-gray-500 hover:text-gray-700"
                                aria-label="Unselect Tool"
                              >
                                <X className="h-4 w-4 text-purple-700" />
                              </Button>

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
