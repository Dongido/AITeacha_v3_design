// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Undo2, X } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   useForm,
//   FormProvider,
//   useFieldArray,
//   useWatch,
// } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { loadStudentTools } from "../../../store/slices/toolsSlice";
// import { RootState, AppDispatch } from "../../../store";
// import { Button } from "../../../components/ui/Button";
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
// } from "../../../components/ui/Form";
// import { TextArea } from "../../../components/ui/TextArea";
// import { Input } from "../../../components/ui/Input";
// import { Label } from "../../../components/ui/Label";
// import {
//   Select,
//   SelectTrigger,
//   SelectContent,
//   SelectItem,
//   SelectValue,
// } from "../../../components/ui/Select";
// import {
//   ToastProvider,
//   Toast,
//   ToastTitle,
//   ToastViewport,
// } from "../../../components/ui/Toast";
// import {
//   loadClassrooms,
//   createClassroomThunk,
// } from "../../../store/slices/classroomSlice";
// import CustomizeDialog from "./components/CustomizeDialogue";
// import { Checkbox } from "../../../components/ui/Checkbox";
// import FileUpload from "../../../components/ui/FileUpload";
// import { suggestClassroomTopics } from "../../../api/classrooms";
// import { FaHeart } from "react-icons/fa";
// import { Switch } from "../../../components/ui/Switch";
// import { suggestClassroomOutlines } from "../../../api/classrooms";
// import {
//   parseOutlines,
//   OutlineInputs,
//   AssessmentQuestion,
//   Question,
//   QuestionOption,
// } from "./parsedInputs";
// import { Chip } from "../../../components/ui/Chip";
// import { DateTimePicker } from "../../../components/ui/DatePicker";
// import { Country } from "country-state-city";
// import { fetchCurriculumByCountry } from "../../../api/tools";
// interface ToolData {
//   id: number;
//   name: string;
//   customized_name?: string;
//   customized_description?: string;
//   additional_instruction?: string;
// }

// interface CreateOrEditClassroomProps {
//   isEdit?: boolean;
// }
// const containsUrl = (text: string): boolean => {
//   if (!text) return false;
//   const urlRegex = /(https?:\/\/|www\.)[^\s]+/i;
//   return urlRegex.test(text);
// };

// const gradeOptions = [
//   "Pre School",
//   "Early Years",
//   "Nursery 1",
//   "Nursery 2",
//   ...Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`),
//   ...Array.from({ length: 5 }, (_, i) => `Higher Institution Year ${i + 1}`),
// ];

// const toolSchema = z.object({
//   id: z.number(),
//   name: z.string(),
//   description: z.string(),
//   customized_name: z
//     .string()
//     .optional()
//     .refine((val) => !containsUrl(val || ""), {
//       message: "Customized name cannot contain URLs",
//     }),
//   customized_description: z
//     .string()
//     .optional()
//     .refine((val) => !containsUrl(val || ""), {
//       message: "Customized description cannot contain URLs",
//     }),
//   additional_instruction: z
//     .string()
//     .optional()
//     .refine((val) => !containsUrl(val || ""), {
//       message: "Additional instructions cannot contain URLs",
//     }),
// });

// const CreateOrEditClassroom: React.FC<CreateOrEditClassroomProps> = ({
//   isEdit,
// }) => {
//   const navigate = useNavigate();
//   const { id } = useParams<{ id?: string }>();
//   const dispatch = useDispatch<AppDispatch>();
//   const { studentTools, studentLoading, studentError } = useSelector(
//     (state: RootState) => state.tools
//   );
//   const [selectedDateTime, setSelectedDateTime] = React.useState<
//     any | undefined
//   >(undefined);
//   const [countries, setCountries] = useState<
//     { name: string; isoCode: string }[]
//   >([]);
//   const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
//   const [curriculums, setCurriculums] = useState<any[]>([]);
//   const [isCurriculumLoading, setIsCurriculumLoading] =
//     useState<boolean>(false);
//   const [selectedTools, setSelectedTools] = useState<ToolData[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [toastOpen, setToastOpen] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
//     "default"
//   );
//   const [currentStep, setCurrentStep] = useState(1);
//   const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
//   const [suggestedDescriptions, setSuggestedDescriptions] = useState<string[]>(
//     []
//   );
//   const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

//   const [isLoadingOutline, setIsLoadingOutline] = useState<boolean>(false);
//   const [generatedOutline, setGeneratedOutline] = useState<any>(null);
//   const [savedOutlines, setSavedOutlines] = useState<string[]>([]);
//   const [parsedOutlines, setParsedOutlines] = useState<
//     { title: string; items?: string[]; assessment?: AssessmentQuestion[] }[]
//   >([]);
//   const [selectedOutlines, setSelectedOutlines] = useState<
//     { title: string; items?: string[]; assessment?: AssessmentQuestion[] }[]
//   >([]);
//    console.log("outline", selectedOutlines)

//   const [isChecked, setIsChecked] = useState<boolean>(false);
//   const [outlines, setOutlines] = useState<
//     { title: string; assessment?: string }[]
//   >([]);
//   const storedUser = JSON.parse(localStorage.getItem("ai-teacha-user") || "{}");
//   const [isAgreed, setIsAgreed] = React.useState(false);
//   const userId = storedUser.id;
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);

//   const stepOneSchema = z.object({
//     user_id: z.number(),
//     name: z
//       .string()
//       .min(1, { message: "Classroom name is required" })
//       .refine((val) => !containsUrl(val), {
//         message: "Classroom name cannot contain URLs",
//       }),
//     grade: z.string(),
//     status: z.string(),
//     country: z.string().min(1, { message: "Country is required" }),
//     curriculum_type: z
//       .string()
//       .min(1, { message: "Curriculum type is required" }),
//     number_of_students: z
//       .number({ required_error: "Number of students is required" })
//       .min(1, { message: "Number of students must be at least 1" }),
//     tools: z.array(toolSchema).optional(),
//     scope_restriction: z.boolean(),
//     amount: z.number().optional(),
//     currency: z.string().optional(),
//   });

//   const stepTwoSchema = z.object({
//     description: z
//       .string()
//       .min(1, { message: "Classroom Description is required" }),
//     resource_links: z
//       .array(
//         z.object({
//           url: z.string().url("Must be a valid URL"),
//         })
//       )
//       .default([]),
//     resource_accessibility: z.boolean(),
//   });

//   const finalStepSchema = z.object({
//     resources: z.array(z.instanceof(File)).optional(),
//   });

//   const formSchema = stepOneSchema.merge(stepTwoSchema).merge(finalStepSchema);
//   const formMethods = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       user_id: userId,
//       name: "",
//       description: "",
//       grade: "Pre School",
//       status: "inactive",
//       number_of_students: 1,
//       resource_links: [],
//       country: "",
//       curriculum_type: "",
//       tools: [],
//       resources: [],
//       scope_restriction: true,
//       resource_accessibility: true,
//       amount: 0,
//       currency: "USD",
//     },
//   });
//   const { handleSubmit, control, setValue, getValues, trigger } = formMethods;

//   const {
//     fields: resourceLinksFields,
//     append: appendResourceLink,
//     remove: removeResourceLink,
//   } = useFieldArray({
//     control,
//     name: "resource_links",
//   });
//   const resourceLinks = useWatch({ control, name: "resource_links" });
//   const [inputValue, setInputValue] = useState<string | null>(null);
//   useEffect(() => {
//     try {
//       const allCountries = Country.getAllCountries().map((country) => ({
//         name: country.name,
//         isoCode: country.isoCode,
//       }));
//       setCountries(allCountries);
//     } catch (error) {
//       console.error("Error fetching countries from country-state-city:", error);
//     }
//   }, []);

//   useEffect(() => {
//     if (studentTools.length === 0) {
//       dispatch(loadStudentTools());
//     }
//   }, [dispatch, studentTools.length]);

//   const handleToolSelect = (tool: ToolData) => {
//     const isSelected = selectedTools.find((t) => t.id === tool.id);
//     if (isSelected) {
//       setSelectedTools(selectedTools.filter((t) => t.id !== tool.id));
//     } else {
//       setSelectedTools([...selectedTools, tool]);
//     }
//   };

//   const handleCountryChange = async (countryName: any) => {
//     setSelectedCountry(countryName);
//     setValue("curriculum_type", "");
//     const selectedCountry = countries.find((c) => c.name === countryName);
//     const countryCode = selectedCountry?.isoCode;

//     if (countryCode) {
//       setIsCurriculumLoading(true);
//       setCurriculums([]);
//       try {
//         const fetchedCurriculums = await fetchCurriculumByCountry(countryCode);
//         setCurriculums(fetchedCurriculums);
//         console.log(
//           `Fetched Curriculums for ${countryName} (${countryCode}):`,
//           fetchedCurriculums
//         );
//       } catch (error) {
//         console.error("Error fetching curriculum:", error);
//         setCurriculums([]);
//       } finally {
//         setIsCurriculumLoading(false);
//       }
//     } else {
//       console.warn(`No ISO code found for: ${countryName}`);
//       setCurriculums([]);
//     }
//   };

//   const generateOutline = async () => {
//     setIsLoadingOutline(true);
//     try {
//       const { description, grade } = getValues();
//       const response = await suggestClassroomOutlines(description, grade);

//       const parsed = parseOutlines(response);
//       setParsedOutlines(parsed);
//     } catch (error: any) {
//       alert(error.message);
//     } finally {
//       setIsLoadingOutline(false);
//     }
//   };

//   const handleToolEdit = (toolId: number, field: string, value: string) => {
//     setSelectedTools((prev) =>
//       prev.map((tool) =>
//         tool.id === toolId ? { ...tool, [field]: value } : tool
//       )
//     );
//   };

//   const onSubmit = async (data: z.infer<typeof formSchema>) => {
//     setIsLoading(true);
//     const transformedResourceLinks = data.resource_links.map(
//       (link) => link.url
//     );
//     const classroomData = {
//       ...data,

//       tools: selectedTools.map((tool) => ({
//         tools_id: tool.id,
//         customized_name: tool.customized_name || null,
//         customized_description: tool.customized_description || null,
//         additional_instruction: tool.additional_instruction || null,
//       })),

//       class_type: isChecked ? "Paid" : "Free",
//       resources: uploadedFiles,
//       outlines: selectedOutlines.map(({ title, assessment }) => ({
//         title,
//         assessments: assessment
//           ? assessment.map((assessmentQuestion) => ({
//               type: "objective",
//               title: assessmentQuestion.title,
//               options: assessmentQuestion.options || [],
//             }))
//           : [],
//       })),
//       currency: data.currency || "USD",
//       amount: data.amount || "0",
//       end_date: selectedDateTime ? selectedDateTime.toISOString() : null,
//       resource_accessibility: data.resource_accessibility,
//       resource_links: transformedResourceLinks,
//     };
//     try {
//       console.log(classroomData);
//       await dispatch(createClassroomThunk(classroomData)).unwrap();
//       setToastMessage("Classroom created successfully!");
//       setToastVariant("default");
//       await dispatch(loadClassrooms());
//       setTimeout(() => navigate("/dashboard/classrooms"), 1000);
//     } catch (error) {
//       setToastMessage("Failed to create classroom. Please try again.");
//       setToastVariant("destructive");
//     } finally {
//       setToastOpen(true);
//       setIsLoading(false);
//     }
//   };

//   const selectedClassroom = useSelector(
//     (state: RootState) => state.classrooms.selectedClassroom
//   );

//   const handleSwitchChange = (checked: boolean) => {
//     setIsChecked(checked);
//     console.log("Switch is:", checked);
//   };

//   const handleOutlinesChange = (
//     updatedOutlines: {
//       title: string;
//       items?: string[];
//       assessment?: AssessmentQuestion[];
//     }[]
//   ) => {
//     setParsedOutlines(updatedOutlines);
//   };

//   const handleSelectedOutlinesChange = (
//     selected: {
//       title: string;
//       items?: string[];
//       assessment?: AssessmentQuestion[];
//     }[]
//   ) => {
//     setSelectedOutlines((prevSelectedOutlines) => {
//       const selectedMap = new Map(
//         prevSelectedOutlines.map((outline) => [outline.title, outline])
//       );

//       selected.forEach((newOutline) => {
//         selectedMap.set(newOutline.title, {
//           ...selectedMap.get(newOutline.title),
//           ...newOutline,
//           items:
//             newOutline.items || selectedMap.get(newOutline.title)?.items || [],
//           assessment:
//             newOutline.assessment ||
//             selectedMap.get(newOutline.title)?.assessment ||
//             [],
//         });
//       });

//       return Array.from(selectedMap.values());
//     });
//   };
//   const handleRemoveSelectedOutline = (
//     titleToRemove: string,
//     event: React.MouseEvent<HTMLButtonElement>
//   ) => {
//     event.preventDefault();

//     setSelectedOutlines((prevSelected) => {
//       const outlineToRemove = prevSelected.find(
//         (outline) => outline.title === titleToRemove
//       );

//       console.log("Removing Outline:", outlineToRemove);

//       const updatedSelectedOutlines = prevSelected.filter(
//         (outline) => outline.title !== titleToRemove
//       );

//       handleSelectedOutlinesChange(updatedSelectedOutlines);

//       return updatedSelectedOutlines;
//     });
//   };

//   const nextStep = async () => {
//     if (currentStep === 1) {
//       const isValid = await trigger(stepOneSchema.keyof().options);
//       if (isValid) {
//         const stepOneData = getValues();
//         if (isChecked && !isAgreed) {
//           setToastMessage("Please agree for the service fee charge");
//           setToastVariant("destructive");
//           setToastOpen(true);
//         } else {
//           setIsLoadingSuggestions(true);
//           suggestClassroomTopics(stepOneData.name, stepOneData.grade)
//             .then((topics) => {
//               const formattedTopics = topics
//                 .split("\n")
//                 .map((topic: string) => topic.trim().replace(/^\d+\.\s*/, ""));
//               setSuggestedDescriptions(formattedTopics);
//             })
//             .catch((error) => {
//               console.error(
//                 "Error fetching suggested descriptions:",
//                 error.message
//               );
//               setToastMessage("Failed to fetch suggestions. Please try again.");
//               setToastVariant("destructive");
//               setToastOpen(true);
//             })
//             .finally(() => {
//               setIsLoadingSuggestions(false);
//             });
//           setCurrentStep(2);
//         }
//       }
//     } else if (currentStep === 2) {
//       const isValid = await trigger(stepTwoSchema.keyof().options);
//       if (isValid) {
//         setCurrentStep(3);
//       }
//     } else if (currentStep === 3) {
//       setCurrentStep(4);
//     }
//   };
//   const handleAgreedChange = (checked: boolean) => {
//     setIsAgreed(checked);
//   };

//   const previousStep = () => {
//     setCurrentStep((prevStep) => prevStep - 1);
//   };

//   const handleAddResourceLink = () => {
//     if (inputValue) {
//       try {
//         z.string().url().parse(inputValue);
//         appendResourceLink({ url: inputValue });
//         setInputValue("");
//         setErrorMessage(null);
//       } catch (error: any) {
//         setErrorMessage("Please enter a valid URL.");
//         console.error("Invalid URL:", error.message);
//       }
//     }
//   };

//   const handleDateTimeChange = (selectedDateTime: Date | undefined) => {
//     if (selectedDateTime) {
//       setSelectedDateTime(selectedDateTime);
//     } else {
//       console.log("No date and time selected");
//     }
//   };

//   return (
//     <ToastProvider swipeDirection="left">
//       <div className="mt-12">
//         <h1 className="text-2xl font-bold text-gray-900 ">
//           {isEdit ? "Edit Classroom" : "Create Classroom"}
//         </h1>

//         <div className="flex w-full my-6 items-center justify-between">
//           <Button
//             className="flex items-center bg-white rounded-md text-black w-fit h-full gap-3 py-2"
//             onClick={() => navigate(-1)}
//           >
//             <Undo2 size={"1.1rem"} color="black" />
//             Back
//           </Button>
//           <div className="flex gap-2">
//             {currentStep > 1 && (
//               <Button
//                 onClick={previousStep}
//                 variant="outline"
//                 className="bg-gray-300 text-black rounded-md"
//               >
//                 Previous
//               </Button>
//             )}

//             {currentStep === 3 && (
//               <Button
//                 onClick={() => {
//                   if (currentStep < 4) {
//                     nextStep();
//                   }
//                 }}
//                 variant="outline"
//                 className="bg-gray-300 text-black rounded-md"
//               >
//                 Skip
//               </Button>
//             )}
//             <Button
//               variant="gradient"
//               className="flex items-center w-fit h-full gap-3 py-2 rounded-md"
//               onClick={currentStep < 4 ? nextStep : handleSubmit(onSubmit)}
//               disabled={isLoading}
//             >
//               {isLoading ? "Saving..." : currentStep < 4 ? "Next" : "Save"}
//             </Button>
//           </div>
//         </div>

//         <FormProvider {...formMethods}>
//           <form onSubmit={handleSubmit(onSubmit)}>
//             {currentStep === 1 && (
//               <div className="space-y-4">
//                 <FormField
//                   control={control}
//                   name="name"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-xl lg:text-2xl">
//                         Enter Classroom Name
//                       </FormLabel>
//                       <FormControl>
//                         <TextArea
//                           placeholder="eg. Intro to web design for begginers"
//                           {...field}
//                           rows={4}
//                           className="text-xl"
//                         />
//                       </FormControl>
//                       <FormMessage className="text-red-300" />
//                     </FormItem>
//                   )}
//                 />

//                 <div>
//                   <div className="flex gap-2">
//                     <label className="flex items-center space-x-2 my-2">
//                       <Switch
//                         id="my-switch"
//                         checked={isChecked}
//                         onCheckedChange={handleSwitchChange}
//                       />
//                       <span className="font-bold">
//                         {isChecked ? "Paid Classroom" : "Free Classroom"}
//                       </span>
//                     </label>
//                   </div>

//                   {isChecked && (
//                     <>
//                       <FormField
//                         control={control}
//                         name="amount"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel className="text-xl lg:text-2xl mt-4">
//                               Amount
//                             </FormLabel>
//                             <FormControl>
//                               <Input
//                                 type="number"
//                                 placeholder="Enter number"
//                                 {...field}
//                                 onChange={(e) =>
//                                   field.onChange(Number(e.target.value) || 0)
//                                 }
//                               />
//                             </FormControl>
//                             <FormMessage className="text-red-300" />
//                           </FormItem>
//                         )}
//                       />
//                       <label className="flex items-center space-x-2 my-2">
//                         <Checkbox
//                           id="agree-checkbox"
//                           checked={isAgreed}
//                           onCheckedChange={handleAgreedChange}
//                         />
//                         <span>
//                           The service fee would be deducted from the amount.
//                         </span>
//                       </label>
//                       <FormField
//                         control={control}
//                         name="currency"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel className="text-lg lg:text-xl mt-4">
//                               Currency
//                             </FormLabel>
//                             <Select
//                               onValueChange={field.onChange}
//                               defaultValue={field.value}
//                             >
//                               <SelectTrigger className="text-lg">
//                                 <SelectValue placeholder="Select Currency" />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 <SelectItem value="NGN">
//                                   Nigerian Naira (NGN)
//                                 </SelectItem>
//                                 <SelectItem value="USD">
//                                   US Dollar (USD)
//                                 </SelectItem>
//                                 <SelectItem value="GBP">
//                                   Pounds Sterling (GBG)
//                                 </SelectItem>
//                               </SelectContent>
//                             </Select>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     </>
//                   )}
//                 </div>

//                 <FormField
//                   control={control}
//                   name="grade"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-xl lg:text-2xl">
//                         Grade
//                       </FormLabel>
//                       <Select
//                         onValueChange={field.onChange}
//                         defaultValue={field.value}
//                       >
//                         <SelectTrigger className="text-xl">
//                           <SelectValue placeholder="Select grade" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {gradeOptions.map((grade) => (
//                             <SelectItem key={grade} value={grade}>
//                               {grade}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={control}
//                   name="country"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-xl lg:text-2xl">
//                         Country
//                       </FormLabel>
//                       <Select
//                         onValueChange={(value) => {
//                           field.onChange(value);
//                           handleCountryChange(value);
//                         }}
//                         defaultValue={field.value}
//                       >
//                         <SelectTrigger className="text-xl">
//                           <SelectValue placeholder="Select country" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {countries.map((country) => (
//                             <SelectItem
//                               key={country.isoCode}
//                               value={country.name}
//                             >
//                               {country.name}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={control}
//                   name="curriculum_type"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-xl lg:text-2xl">
//                         Curriculum Type
//                       </FormLabel>
//                       <Select
//                         onValueChange={field.onChange}
//                         defaultValue={field.value}
//                         disabled={!selectedCountry || isCurriculumLoading}
//                       >
//                         <SelectTrigger className="text-xl">
//                           <SelectValue
//                             placeholder={
//                               isCurriculumLoading
//                                 ? "Loading curriculums..."
//                                 : selectedCountry
//                                 ? "Select curriculum type"
//                                 : "Select a country first"
//                             }
//                           />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {curriculums.length > 0 ? (
//                             curriculums.map((curriculumName: string) => (
//                               <SelectItem
//                                 key={curriculumName}
//                                 value={curriculumName}
//                               >
//                                 {curriculumName}
//                               </SelectItem>
//                             ))
//                           ) : (
//                             <SelectItem value="no-value" disabled>
//                               No curriculums available for this country
//                             </SelectItem>
//                           )}
//                         </SelectContent>
//                       </Select>
//                       <FormMessage className="text-red-400" />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             )}
//             {currentStep === 2 && (
//               <div>
//                 <FormItem>
//                   <FormLabel className="text-xl lg:text-2xl">
//                     {" "}
//                     Upload Your Teaching Materials or Resources (eg. Lesson
//                     plan, syllables, Curriculum)
//                   </FormLabel>

//                   <FileUpload
//                     onFilesChange={(files: File[]) => setUploadedFiles(files)}
//                     multiple={true}
//                     maxFiles={10}
//                   />
//                 </FormItem>

//                 <FormField
//                   control={control}
//                   name="resource_accessibility"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormControl>
//                         <div className="flex items-center gap-2 my-6 mt-10">
//                           <Checkbox
//                             checked={field.value}
//                             onCheckedChange={field.onChange}
//                             name="resource_accessibility"
//                           />
//                           <FormLabel className="text-xl lg:text-2xl">
//                             Allow Students to download resources
//                           </FormLabel>
//                         </div>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={control}
//                   name="description"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-xl lg:text-2xl mt-4">
//                         Enter a detailed description on what this classroom is
//                         all about
//                       </FormLabel>
//                       <FormControl>
//                         <TextArea
//                           placeholder="e.g. This course offers an introduction to web design concepts, tools, and techniques, tailored for beginners with no prior experience in designing websites"
//                           {...field}
//                           required
//                           className="text-lg lg:text-xl"
//                         />
//                       </FormControl>
//                       <FormMessage className="text-red-300" />
//                       {isLoadingSuggestions ? (
//                         <p className="text-gray-500 mt-2">
//                           Loading suggested descriptions...
//                         </p>
//                       ) : (
//                         <div>
//                           <center className="font-medium">
//                             {" "}
//                             Suggested Discriptions
//                           </center>
//                           <div className="mt-4 flex flex-wrap gap-2 mx-auto px-6">
//                             {suggestedDescriptions.map((description, index) => (
//                               <div
//                                 key={index}
//                                 className="p-2 border rounded-md bg-gray-50 text-sm lg:text-md hover:bg-gray-200 cursor-pointer"
//                                 onClick={() => field.onChange(description)}
//                               >
//                                 {description}
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={control}
//                   name="scope_restriction"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormControl>
//                         <div className="flex items-center gap-2 my-6 mt-10">
//                           <Checkbox
//                             checked={field.value}
//                             onCheckedChange={field.onChange}
//                             name="scope_restriction"
//                           />
//                           <FormLabel className="text-xl lg:text-2xl">
//                             Limit student to stay within the scope
//                           </FormLabel>
//                         </div>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={control}
//                   name="resource_links"
//                   render={() => (
//                     <FormItem>
//                       <FormLabel className="text-xl lg:text-2xl mt-4">
//                         Resource Links
//                         <p className="text-gray-500 text-sm mt-1">
//                           Enter valid URLs (e.g., https://www.example.com,
//                           http://subdomain.domain.net).
//                         </p>
//                       </FormLabel>
//                       <FormControl>
//                         <div className="flex items-center space-x-2">
//                           <Input
//                             type="url"
//                             placeholder="New resource link..."
//                             value={inputValue || ""}
//                             onChange={(e) => setInputValue(e.target.value)}
//                             onKeyDown={(e) => {
//                               if (e.key === "Enter") {
//                                 e.preventDefault();
//                                 handleAddResourceLink();
//                               }
//                             }}
//                           />
//                           <Button
//                             type="button"
//                             variant="outline"
//                             size="sm"
//                             onClick={handleAddResourceLink}
//                           >
//                             Add
//                           </Button>
//                         </div>
//                       </FormControl>
//                       <div className="flex flex-wrap gap-2 mt-2">
//                         {resourceLinks &&
//                           resourceLinks.length > 0 &&
//                           resourceLinks.map((link, index) => (
//                             <Chip
//                               key={resourceLinksFields[index]?.id || index}
//                               onDismiss={() => removeResourceLink(index)}
//                               dismissIcon={<X className="h-4 w-4" />}
//                             >
//                               {link?.url}
//                             </Chip>
//                           ))}
//                       </div>
//                       {errorMessage && (
//                         <p className="text-red-500 text-sm mt-1">
//                           {errorMessage}
//                         </p>
//                       )}
//                       <FormMessage className="text-red-300" />
//                     </FormItem>
//                   )}
//                 />
//                 <div className="my-2">
//                   <Label className="text-xl lg:text-2xl mt-4 mb-2 block">
//                     Classroom End Date
//                   </Label>
//                   <DateTimePicker
//                     onChange={handleDateTimeChange}
//                     placeholder="Select end date"
//                   />
//                 </div>

//                 <FormField
//                   control={control}
//                   name="number_of_students"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-xl lg:text-2xl mt-4">
//                         Number of Students
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           type="number"
//                           placeholder="Enter number"
//                           {...field}
//                           onChange={(e) =>
//                             field.onChange(Number(e.target.value) || 0)
//                           }
//                         />
//                       </FormControl>
//                       <FormMessage className="text-red-300" />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             )}
//             {currentStep === 3 && (
//               <div className="space-y-4">
//                 {parsedOutlines.length === 0 && (
//                   <Button
//                     onClick={handleSubmit(generateOutline)}
//                     variant={"outline"}
//                     className="font-bold py-2 px-4 rounded-full ml-4 bg-gray-300"
//                   >
//                     {"Click to Generate Classroom Outline"}
//                   </Button>
//                 )}

//                 {isLoadingOutline && (
//                   <div className="mt-4 text-center">
//                     Generating new outlines...
//                   </div>
//                 )}
//                 {parsedOutlines.length > 0 && !isLoadingOutline && (
//                   <div>
//                     <h3>Classroom Outlines:</h3>
//                     <OutlineInputs
//                       initialOutlines={parsedOutlines}
//                       grade={getValues("grade")}
//                       onOutlinesChange={handleOutlinesChange}
//                       onSelectedOutlinesChange={handleSelectedOutlinesChange}
//                       onGenerateMoreOutlines={generateOutline}
//                     />
//                   </div>
//                 )}

//                 {selectedOutlines.length > 0 && (
//                   <div className="mt-6">
//                     <h3 className="text-lg font-semibold mb-3">
//                       Selected Outlines:
//                     </h3>
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Actions
//                           </th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Title
//                           </th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Assessment
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {selectedOutlines.map((outline, index) => (
//                           <tr key={index}>
//                             <td className="px-2 py-4 ">
//                               <Button
//                                 onClick={(event) =>
//                                   handleRemoveSelectedOutline(
//                                     outline.title,
//                                     event
//                                   )
//                                 }
//                                 className="rounded-full bg-red-50 text-gray-500 hover:text-gray-700"
//                                 aria-label="Unselect Tool"
//                               >
//                                 <X className="h-4 w-4 text-purple-700" />
//                               </Button>
//                             </td>

//                             <td className="px-6 py-4 ">{outline.title}</td>
//                             <td className="px-6 py-4">
//                               {outline.assessment &&
//                                 outline.assessment.map((question, qIndex) => (
//                                   <div key={qIndex} className="mb-4">
//                                     <p className="font-semibold">
//                                       {question.title}
//                                     </p>
//                                   </div>
//                                 ))}
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </div>
//             )}
//             {currentStep === 4 && (
//               <div className="space-y-4">
//                 <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
//                   Select Tools Needed
//                 </h2>
//                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
//                   {studentLoading ? (
//                     <p>Loading tools...</p>
//                   ) : (
//                     studentTools.map((tool) => {
//                       const isSelected = selectedTools.find(
//                         (t) => t.id === tool.id
//                       );
//                       const selectedTool = selectedTools.find(
//                         (t) => t.id === tool.id
//                       );

//                       return (
//                         <div
//                           key={tool.id}
//                           className={`relative p-4 border rounded-lg cursor-pointer ${
//                             isSelected ? "bg-[#e3def0]" : "bg-white"
//                           }`}
//                           onClick={() => {
//                             if (!isSelected) handleToolSelect(tool);
//                           }}
//                         >
//                           <div className="flex ">
//                             <div className="text-primary text-2xl mr-4">
//                               {tool.thumbnail ? (
//                                 <img
//                                   src={
//                                     tool.thumbnail.startsWith("http")
//                                       ? tool.thumbnail
//                                       : `https://${tool.thumbnail}`
//                                   }
//                                   alt={tool.name || "Tool Thumbnail"}
//                                   className="w-16 h-20 object-cover rounded-lg"
//                                 />
//                               ) : (
//                                 <FaHeart className="text-purple-500 w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center" />
//                               )}
//                             </div>
//                             <div className="">
//                               <h3 className="font-semibold">{tool.name}</h3>
//                               <p className="text-sm text-gray-600">
//                                 {tool.description}
//                               </p>
//                             </div>
//                           </div>

//                           {isSelected && (
//                             <div className="mt-2 space-y-2">
//                               <Button
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   handleToolSelect(tool);
//                                 }}
//                                 className="absolute top-2 right-2 p-2 rounded-full bg-red-50 text-gray-500 hover:text-gray-700"
//                                 aria-label="Unselect Tool"
//                               >
//                                 <X className="h-4 w-4 text-purple-700" />
//                               </Button>

//                               <CustomizeDialog
//                                 toolName={tool.name}
//                                 customized_name={
//                                   selectedTool?.customized_name || ""
//                                 }
//                                 customized_description={
//                                   selectedTool?.customized_description || ""
//                                 }
//                                 additional_instruction={
//                                   selectedTool?.additional_instruction || ""
//                                 }
//                                 onCustomizeChange={(field, value) =>
//                                   handleToolEdit(tool.id, field, value)
//                                 }
//                               />
//                             </div>
//                           )}
//                         </div>
//                       );
//                     })
//                   )}
//                 </div>
//                 <Button
//                   onClick={previousStep}
//                   variant="outline"
//                   className="bg-gray-300 text-black rounded-md mt-4"
//                 >
//                   Previous
//                 </Button>
//               </div>
//             )}
//           </form>
//         </FormProvider>

//         <Toast
//           open={toastOpen}
//           onOpenChange={setToastOpen}
//           variant={toastVariant}
//         >
//           <ToastTitle>{toastMessage}</ToastTitle>
//         </Toast>
//         <ToastViewport />
//       </div>
//     </ToastProvider>
//   );
// };

// export default CreateOrEditClassroom;

import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loadStudentTools } from "../../../store/slices/toolsSlice";
import { RootState, AppDispatch } from "../../../store";
import { Button } from "../../../components/ui/Button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../../components/ui/Select";
import { Input } from "../../../components/ui/Input";
import { Checkbox } from "../../../components/ui/Checkbox";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastViewport,
} from "../../../components/ui/Toast";
import { Country } from "country-state-city";
import { fetchCurriculumByCountry } from "../../../api/tools";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { AiOutlineYoutube } from "react-icons/ai";
import { FiImage } from "react-icons/fi";
import { CiFileOn } from "react-icons/ci";
import { PiFile, PiNoteBold, PiYoutubeLogo } from "react-icons/pi";
import { PiSlideshow } from "react-icons/pi";
import { PiLinkSimple } from "react-icons/pi";
import { suggestClassroomOutlines } from "../../../api/classrooms";
import {
  parseOutlines,
  OutlineInputs,
  AssessmentQuestion,
} from "./parsedInputs";
import Avatar from "../../../assets/img/avatar.svg";
import {
  loadClassrooms,
  createClassroomThunk,
} from "../../../store/slices/classroomSlice";
import CustomizeDialog from "./components/CustomizeDialogue";

const stepOneSchema = z.object({
  name: z.string().min(1, "Classroom name is required"),
  country: z.string().min(1, "Country is required"),
  curriculum_type: z.string().min(1, "Curriculum type is required"),
  grade: z.string().min(1, "Grade is required"),
  currency: z.string().optional(),
  amount: z.number().optional(),
});

const stepTwoSchema = z.object({
  description: z.string().min(1, "Classroom description is required"),
  endDate: z.string().optional(),
  studentCount: z
    .number()
    .min(1, "Enter a valid number of students")
    .optional(),
});

const finalStepSchema = z.object({
  uploads: z.record(z.any()).optional(),
});

const formSchema = stepOneSchema.merge(stepTwoSchema).merge(finalStepSchema);

const gradeOptions = [
  "Pre School",
  "Early Years",
  "Nursery 1",
  "Nursery 2",
  ...Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`),
  ...Array.from({ length: 5 }, (_, i) => `Higher Institution Year ${i + 1}`),
];

type OutlineType = {
  title: string;
  items?: string[];
  assessment?: AssessmentQuestion[];
};

const CLASSROOM_DRAFT_KEY = "ai-teacha-classroom-draft";
const CreateOrEditClassroom = ({ isEdit }: { isEdit?: boolean }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // BASIC STATES
  const [isChecked, setIsChecked] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [countries, setCountries] = useState<
    { name: string; isoCode: string }[]
  >([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [curriculums, setCurriculums] = useState<any[]>([]);
  const [isCurriculumLoading, setIsCurriculumLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
    "default"
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // STEP 2 STATES
  const [description, setDescription] = useState("");
  const [scopeRestricted, setScopeRestricted] = useState(false);
  const [endDate, setEndDate] = useState("");
  const [studentCount, setStudentCount] = useState<number | "">("");

  // STEP 3: UPLOAD STATES
  const [activeUpload, setActiveUpload] = useState<string | null>(null);
  const [uploadInput, setUploadInput] = useState<string>("");
  const [uploads, setUploads] = useState<Record<string, any[]>>({
    notes: [],
    files: [],
    image: [],
    youtube: [],
    links: [],
    slides: [],
  });
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // STEP 4: OUTLINES
  const [isLoadingOutline, setIsLoadingOutline] = useState(false);
  const [parsedOutlines, setParsedOutlines] = useState<
    { title: string; items?: string[]; assessment?: AssessmentQuestion[] }[]
  >([]);
  const [selectedOutlines, setSelectedOutlines] = useState<
    { title: string; items?: string[]; assessment?: AssessmentQuestion[] }[]
  >([]);
  // Add these at the top of your parent component
  // const [parsedOutlines, setParsedOutlines] = useState<OutlineItem[]>([]);
  // const [selectedOutlines, setSelectedOutlines] = useState<OutlineItem[]>([]);

  // FORM
  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      country: "",
      curriculum_type: "",
      grade: "",
      currency: "NGN",
      amount: 0,
    },
  });
  const { register, handleSubmit, setValue, trigger, getValues, watch } =
    formMethods;

  // STEP 5: TOOLS SELECTION
  const [selectedTools, setSelectedTools] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { studentTools, studentLoading } = useSelector(
    (state: RootState) => state.tools
  );
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const allCountries = Country.getAllCountries().map((country) => ({
      name: country.name,
      isoCode: country.isoCode,
    }));
    setCountries(allCountries);

    if (studentTools.length === 0) {
      dispatch(loadStudentTools());
    }
  }, [dispatch, studentTools.length]);

  // Select / Unselect Tool
  const handleToolSelect = (tool: any) => {
    setSelectedTools((prev) => {
      const exists = prev.find((t) => t.id === tool.id);
      return exists ? prev.filter((t) => t.id !== tool.id) : [...prev, tool];
    });
  };

  const handleToolEdit = (toolId: string, field: string, value: string) => {
    setSelectedTools((prev) =>
      prev.map((t) => (t.id === toolId ? { ...t, [field]: value } : t))
    );
  };

  const handleSaveClassroom = async () => {
    const values = getValues();
    const storedUser = JSON.parse(
      localStorage.getItem("ai-teacha-user") || "{}"
    );
    const userId = storedUser?.id ?? null;

    // Start loading
    setIsLoading(true);

    const payload = {
      ...values,
      user_id: userId,
      description,
      grade: values.grade,
      status: "active",
      class_type: isChecked ? "Paid" : "Free",
      currency: values.currency || "NGN",
      amount: String(values.amount || 0),
      curriculum_type: values.curriculum_type,
      country: values.country,
      scope_restriction: scopeRestricted,
      number_of_students: Number(studentCount || 0),
      resource_accessibility: true,
      resource_links: [],
      tools: selectedTools.map((t) => ({
        tools_id: t.id,
        customized_name: t.customized_name || null,
        customized_description: t.customized_description || null,
        additional_instruction: t.additional_instruction || null,
      })),
      outlines: selectedOutlines.map(({ title, assessment }) => ({
        title,
        assessments:
          assessment?.map((a) => ({
            type: "objective",
            title: a.title,
            options: a.options || [],
          })) || [],
      })),
      resources: Object.values(uploads)
        .flat()
        .filter((f) => f instanceof File),
      end_date: endDate || null,
    };

    try {
      // Dispatch async create call
      await dispatch(createClassroomThunk(payload)).unwrap();
      localStorage.removeItem(CLASSROOM_DRAFT_KEY);
      showToast("Classroom created successfully!");
      await dispatch(loadClassrooms());

      // Give spinner a moment to show before redirect
      await new Promise((resolve) => setTimeout(resolve, 500));

      navigate("/dashboard/classrooms");
    } catch (error) {
      console.error("Error saving classroom:", error);
      showToast("Failed to create classroom. Please try again.", "destructive");
    } finally {
      // Stop spinner
      setIsLoading(false);
    }
  };

  // HELPERS
  const showToast = (
    msg: string,
    variant: "default" | "destructive" = "default"
  ) => {
    setToastMessage(msg);
    setToastVariant(variant);
    setToastOpen(true);
  };

  const handleCountryChange = async (value: string) => {
    setSelectedCountry(value);
    setValue("country", value);
    try {
      setIsCurriculumLoading(true);
      const selected = countries.find((c) => c.name === value);
      const fetched = await fetchCurriculumByCountry(selected?.isoCode || "");
      setCurriculums(fetched);
    } finally {
      setIsCurriculumLoading(false);
    }
  };

  useEffect(() => {
    const savedDraft = localStorage.getItem(CLASSROOM_DRAFT_KEY);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);

        // Restore form fields (Step 1)
        Object.entries(draft.formValues || {}).forEach(([key, value]) =>
          setValue(key as any, value)
        );

        // Restore Step 2–4
        setDescription(draft.description || "");
        setScopeRestricted(draft.scopeRestricted || false);
        setEndDate(draft.endDate || "");
        setStudentCount(draft.studentCount || "");
        setUploads(
          draft.uploads || {
            notes: [],
            files: [],
            image: [],
            youtube: [],
            links: [],
            slides: [],
          }
        );
        setSelectedTools(draft.selectedTools || []);
        setParsedOutlines(draft.parsedOutlines || []);
        setSelectedOutlines(draft.selectedOutlines || []);
        setCurrentStep(draft.currentStep || 1);
        setIsChecked(draft.isChecked || false);
        setIsAgreed(draft.isAgreed || false);
      } catch (error) {
        console.error("Error parsing saved classroom draft:", error);
      }
    }
  }, [setValue]);

  useEffect(() => {
    if (currentStep === 4) {
      const savedDraft = localStorage.getItem(CLASSROOM_DRAFT_KEY);
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          if (draft.selectedOutlines && draft.selectedOutlines.length > 0) {
            setSelectedOutlines(draft.selectedOutlines);
          }
          if (draft.parsedOutlines && draft.parsedOutlines.length > 0) {
            setParsedOutlines(draft.parsedOutlines);
          }
        } catch (error) {
          console.error("Error restoring outlines:", error);
        }
      }
    }
  }, [currentStep]);

  const watchedValues = watch();

  useEffect(() => {
    const draft = {
      formValues: watchedValues,
      description,
      scopeRestricted,
      endDate,
      studentCount,
      uploads,
      selectedTools,
      parsedOutlines,
      selectedOutlines,
      currentStep,
      isChecked,
      isAgreed,
    };

    localStorage.setItem(CLASSROOM_DRAFT_KEY, JSON.stringify(draft));
  }, [
    watchedValues,
    description,
    scopeRestricted,
    endDate,
    studentCount,
    uploads,
    selectedTools,
    parsedOutlines,
    selectedOutlines,
    currentStep,
    isChecked,
    isAgreed,
  ]);

  // STEP CONTROL LOGIC
  const goNext = async () => {
    if (currentStep === 1) {
      const isValid = await trigger([
        "name",
        "country",
        "curriculum_type",
        "grade",
        "currency",
        "amount",
      ]);
      if (!isValid)
        return showToast("Please fill all required fields.", "destructive");
      if (isChecked && !isAgreed)
        return showToast(
          "Please agree for the service fee deduction.",
          "destructive"
        );
    }

    if (currentStep === 2) {
      if (!description.trim())
        return showToast("Please enter a description.", "destructive");
    }

    if (
      currentStep === 3 &&
      uploads &&
      Object.values(uploads).flat().length === 0
    )
      return showToast("Please upload at least one resource.", "destructive");

    setCompletedSteps((prev) =>
      prev.includes(currentStep) ? prev : [...prev, currentStep]
    );
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const goBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // UPLOAD LOGIC
  const openUploadModal = (type: string) => {
    setActiveUpload(type);
    setUploadModalOpen(true);
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setUploads((prev) => ({
        ...prev,
        [type]: [...(prev[type] || []), ...newFiles],
      }));
    }
  };

  const handleUploadConfirm = (type: string) => {
    if (uploadInput.trim() === "" && !uploads[type].length) {
      showToast("Please add a valid entry before confirming.", "destructive");
      return;
    }
    if (uploadInput.trim() !== "") {
      setUploads((prev) => ({
        ...prev,
        [type]: [...(prev[type] || []), { value: uploadInput }],
      }));
    }
    setUploadInput("");
    setUploadModalOpen(false);
  };

  // OUTLINE GENERATION LOGIC
  const generateOutline = async () => {
    setIsLoadingOutline(true);
    try {
      const grade = getValues("grade");
      const response = await suggestClassroomOutlines(description, grade);
      const parsed = parseOutlines(response);
      setParsedOutlines(parsed);
    } catch (err: any) {
      console.error("Outline generation failed:", err);
      showToast("Failed to generate outlines.", "destructive");
    } finally {
      setIsLoadingOutline(false);
    }
  };

  const handleOutlinesChange = (updated: OutlineType[]) => {
    const merged = updated.map((outline) => {
      const existing = selectedOutlines.find(
        (sel) => sel.title === outline.title
      );
      return existing && existing.assessment
        ? { ...outline, assessment: existing.assessment }
        : outline;
    });

    setParsedOutlines(merged);

    // ✅ persist immediately
    const draft = JSON.parse(localStorage.getItem(CLASSROOM_DRAFT_KEY) || "{}");
    localStorage.setItem(
      CLASSROOM_DRAFT_KEY,
      JSON.stringify({ ...draft, parsedOutlines: merged })
    );
  };

  const handleSelectedOutlinesChange = (selected: OutlineType[]) => {
    // ✅ Ensure selectedOutlines also carry their assessment data
    const enriched = selected.map((sel) => {
      const parsed = parsedOutlines.find((o) => o.title === sel.title);
      return {
        ...sel,
        assessment: sel.assessment || parsed?.assessment || [],
      };
    });

    setSelectedOutlines(enriched);

    // ✅ Persist immediately to localStorage
    const draft = JSON.parse(localStorage.getItem(CLASSROOM_DRAFT_KEY) || "{}");
    localStorage.setItem(
      CLASSROOM_DRAFT_KEY,
      JSON.stringify({ ...draft, selectedOutlines: enriched })
    );
  };

  // SUBMIT
  const onSubmit = async (data: any) => {
    console.log("Submitting classroom data:", data);

    // ✅ Step 1: Retrieve user from localStorage safely
    const storedUser = JSON.parse(
      localStorage.getItem("ai-teacha-user") || "{}"
    );
    const userId = storedUser?.id ?? null;

    if (!userId) {
      console.error("No user_id found in localStorage");
      showToast("User session expired. Please log in again.", "destructive");
      return;
    }

    // ✅ Step 2: Build payload safely
    const payload = {
      ...data,
      user_id: userId,
      description,
      end_date: endDate || null,
      number_of_students: Number(studentCount || 0),
      resources: uploads || [],
      outlines:
        selectedOutlines?.map((outline: any) => ({
          title: outline.title,
          assessments: outline.assessment || [],
        })) || [],
    };

    console.log("Final Classroom Data:", payload);

    try {
      // ✅ Step 3: Dispatch classroom creation thunk
      await dispatch(createClassroomThunk(payload)).unwrap();
      await dispatch(loadClassrooms());
      showToast("Classroom created successfully!");
      navigate("/dashboard/classrooms");
    } catch (error: any) {
      console.error("Error saving classroom:", error);
      showToast("Failed to create classroom. Please try again.", "destructive");
    }
  };

  const extractYouTubeID = (url: string) => {
    try {
      const match = url.match(
        /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
      );
      return match ? match[1] : null;
    } catch {
      return null;
    }
  };

  // UI START
  return (
    <ToastProvider swipeDirection="left">
      <section className="fixed inset-0 z-[9999] bg-[#F5F5F5] flex flex-col">
        {/* Close Button */}
        <div className="fixed top-4 left-6 z-[10000]">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full hover:bg-gray-100 p-2"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* LOADING OVERLAY */}
        {isLoadingOutline && (
          <div className="fixed inset-0 bg-white z-[10001] flex flex-col items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-[32px] shadow-lg p-10 flex flex-col items-center justify-center">
              <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                {/* Animated Circular Loader */}
                <div className="absolute inset-0 rounded-full border-[10px] border-[#F3EEFF] border-t-[#6B46FF] animate-spin-slow"></div>

                {/* Avatar */}
                <img
                  src={Avatar}
                  alt="Loading avatar"
                  className="w-28 h-28 object-contain relative z-10"
                />
              </div>

              <h1 className="text-xl font-semibold text-[#2A2929] mb-1">
                Classroom Outlines
              </h1>
              <p className="text-sm text-gray-500">Generating outline...</p>
            </div>
          </div>
        )}

        {/* Scrollable main container */}
        <div className="flex-1 overflow-y-auto px-6 py-10">
          <div className="max-w-3xl mx-auto">
            {/* Stepper */}
            <div className="mb-10">
              <h1 className="text-2xl font-bold text-[#2A2929] text-center">
                {isEdit ? "Edit Classroom" : "Create Classroom"}
              </h1>
              <div className="flex items-center justify-center space-x-6 mt-6">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div key={step} className="flex items-center space-x-2">
                    <div
                      className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium ${
                        completedSteps.includes(step) || currentStep === step
                          ? "bg-[#6200EE] text-white"
                          : "bg-[#EBEBEB] text-black"
                      }`}
                    >
                      {step}
                    </div>
                    {step < 5 && (
                      <div
                        className={`w-8 h-[2px] ${
                          completedSteps.includes(step)
                            ? "bg-[#6B46FF]"
                            : "bg-gray-300"
                        }`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* STEP 1 */}
            {currentStep === 1 && (
              <FormProvider {...formMethods}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6 bg-white rounded-[32px] shadow-sm p-8 mb-8"
                >
                  <h3 className="font-semibold text-xl mb-4">Class Details</h3>

                  {/* name */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Classroom Name
                    </label>
                    <Input
                      {...register("name")}
                      placeholder="Eg. Intro to web design"
                      className="w-full rounded-full border-2 border-[#C2C2C2]"
                    />
                  </div>

                  {/* Pricing */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Pricing
                    </label>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name="pricing"
                          checked={!isChecked}
                          onChange={() => setIsChecked(false)}
                        />
                        Free Classroom
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name="pricing"
                          checked={isChecked}
                          onChange={() => setIsChecked(true)}
                        />
                        Paid Classroom
                      </label>
                    </div>
                  </div>

                  {isChecked && (
                    <>
                      <div className="flex gap-2">
                        <Select
                          onValueChange={(v) => setValue("currency", v)}
                          defaultValue="NGN"
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NGN">₦ NGN</SelectItem>
                            <SelectItem value="USD">$ USD</SelectItem>
                            <SelectItem value="GBP">£ GBP</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          {...register("amount", { valueAsNumber: true })}
                          type="number"
                          placeholder="Amount"
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Checkbox
                          checked={isAgreed}
                          onCheckedChange={(checked) =>
                            setIsAgreed(checked === true)
                          }
                        />
                        <span className="text-sm text-gray-600">
                          The service fee would be deducted from the amount
                        </span>
                      </div>
                    </>
                  )}

                  {/* grade */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Grade
                    </label>
                    <Select
                      value={watch("grade")}
                      onValueChange={(v) => setValue("grade", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {gradeOptions.map((g) => (
                          <SelectItem key={g} value={g}>
                            {g}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* country & curriculum */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">
                        Country
                      </label>
                      <Select
                        value={watch("country")} // 👈 react-hook-form keeps the current value
                        onValueChange={(value) => {
                          setValue("country", value);
                          handleCountryChange(value);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.name} value={country.name}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">
                        Curriculum Type
                      </label>
                      <Select
                        value={watch("curriculum_type")}
                        disabled={!selectedCountry || isCurriculumLoading}
                        onValueChange={(v) => setValue("curriculum_type", v)}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isCurriculumLoading
                                ? "Loading Curriculum..."
                                : "Select Type"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {curriculums.length > 0 ? (
                            curriculums.map((cur) => (
                              <SelectItem key={cur} value={cur}>
                                {cur}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>
                              No curriculums available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </form>
                <div className="flex justify-between border-t border-gray-100 pt-6">
                  <button onClick={() => navigate(-1)} className="flex gap-1">
                    <MdChevronLeft className="mt-1" /> Back
                  </button>
                  <button
                    onClick={goNext}
                    className="flex gap-1 bg-[#6200EE] text-white pt-[8px] pb-[8px] pl-[16px] pr-[16px] rounded-full"
                  >
                    Next
                    <MdChevronRight className="mt-1" />
                  </button>
                </div>
              </FormProvider>
            )}

            {/* STEP 2 */}
            {currentStep === 2 && (
              <section className="max-w-3xl mx-auto">
                <div className="bg-white rounded-[32px] shadow-sm p-8 mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-8">
                    Classroom Resources
                  </h3>

                  {/* Description */}
                  <label className="block text-base font-semibold text-gray-800 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="E.g. This course offers an introduction to web design concepts, tools & techniques, tailored for beginners with no prior experience in designing websites"
                    rows={5}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 focus:ring-2 focus:ring-[#6B46FF] resize-none"
                  />

                  {/* Suggested Descriptions */}
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      Enter a detailed description on what this classroom is all
                      about
                    </p>
                    <p className="text-sm text-gray-600 mb-2 font-medium">
                      Suggested Descriptions:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        "Counting and number recognition",
                        "Basic shapes and patterns",
                        "Fun with counting songs",
                        "Introduction to addition and subtraction",
                      ].map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => setDescription(suggestion)}
                          className="text-left text-sm text-[#626161] bg-[#F5F5F5] rounded-lg p-2 flex hover:bg-[#F3EEFF] font-semibold transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Restriction */}
                  <div className="flex items-center gap-2 mt-6">
                    <input
                      type="checkbox"
                      checked={scopeRestricted}
                      onChange={(e) => setScopeRestricted(e.target.checked)}
                      className="w-4 h-4 accent-[#6B46FF]"
                    />
                    <label className="text-sm text-gray-700 font-medium">
                      Limit student to stay within scope
                    </label>
                  </div>

                  {/* End date & students */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <label className="text-base font-semibold text-gray-800 mb-2 block">
                        Classroom End Date
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full border border-gray-300 rounded-full py-3 px-4 text-gray-700 focus:ring-2 focus:ring-[#6B46FF]"
                      />
                    </div>
                    <div>
                      <label className="text-base font-semibold text-gray-800 mb-2 block">
                        Number of Students
                      </label>
                      <input
                        type="number"
                        value={studentCount}
                        onChange={(e) =>
                          setStudentCount(Number(e.target.value))
                        }
                        placeholder="Enter number"
                        className="w-full border border-gray-300 rounded-full py-3 px-4 text-gray-700 focus:ring-2 focus:ring-[#6B46FF]"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Navigation */}
                <div className="flex justify-between border-t border-gray-100">
                  <button onClick={goBack} className="flex gap-1">
                    <MdChevronLeft className="mt-1" /> Back
                  </button>
                  <button
                    onClick={goNext}
                    className="flex gap-1 bg-[#6200EE] text-white pt-[8px] pb-[8px] pl-[16px] pr-[16px] rounded-full"
                  >
                    Next
                    <MdChevronRight className="mt-1" />
                  </button>
                </div>
              </section>
            )}

            {/* STEP 3 */}
            {currentStep === 3 && (
              <section className="flex gap-8">
                {/* Sidebar */}
                <aside
                  className={`bg-white rounded-2xl shadow-sm p-6 h-fit transition-all duration-300 lg:left-10 lg:absolute lg:flex lg:flex-col md:hidden hidden ${
                    sidebarCollapsed ? "w-16" : "w-56"
                  }`}
                >
                  <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="flex items-center justify-left text-2xl mb-4 ml-4"
                  >
                    <span className="text-2xl font-medium text-gray-700">
                      {sidebarCollapsed ? "›" : "‹"}
                    </span>
                  </button>
                  <ul className="space-y-2">
                    {[
                      {
                        id: "notes",
                        label: "Notes",
                        icon: <PiNoteBold className="text-[#6B46FF]" />,
                      },
                      {
                        id: "files",
                        label: "Files (Pdf, doc)",
                        icon: <CiFileOn className="text-[#F59E0B]" />,
                      },
                      {
                        id: "image",
                        label: "Image",
                        icon: <FiImage className="text-[#10B981]" />,
                      },
                      {
                        id: "youtube",
                        label: "YouTube",
                        icon: <AiOutlineYoutube className="text-[#EF4444]" />,
                      },
                      {
                        id: "links",
                        label: "Links",
                        icon: <PiLinkSimple className="text-[#3B82F6]" />,
                      },
                      // {
                      //   id: "slides",
                      //   label: "Slides",
                      //   icon: <PiSlideshow className="text-[#3B82F6]" />,
                      // },
                    ].map((item) => (
                      <li
                        key={item.id}
                        onClick={() => openUploadModal(item.id)}
                        className={`flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-50 ${
                          activeUpload === item.id ? "bg-gray-100" : ""
                        }`}
                      >
                        <span className="text-lg">{item.icon}</span>
                        {!sidebarCollapsed && (
                          <span className="text-sm font-medium text-gray-800">
                            {item.label}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </aside>

                {/* Upload Area */}
                <div className="mt-10 w-full">
                  <div className="">
                    {/* Uploaded Files Section */}
                    {Object.keys(uploads).some(
                      (key) => uploads[key]?.length > 0
                    ) && (
                      <div className="rounded-2xl shadow-sm lg:p-6 mb-10 space-y-8">
                        {/* NOTES SECTION */}
                        {uploads.notes?.length > 0 && (
                          <div className="bg-white rounded-2xl p-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-[#EFE6FD] rounded-full p-3">
                                <PiNoteBold className="text-[#6200EE] text-2xl" />
                              </div>
                              <div>
                                <p className="text-lg font-semibold">Notes</p>
                                <p className="text-sm -mt-4 text-[#7C7B7B]">
                                  Add notes to classroom
                                </p>
                              </div>
                            </div>
                            <div className="mt-6">
                              {uploads.notes.map((file, i) => (
                                <div
                                  key={`note-${i}`}
                                  className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3"
                                >
                                  <div className="flex items-center gap-3">
                                    <PiNoteBold className="text-[#6B46FF] text-xl" />
                                    <span className="text-sm font-medium text-gray-700 truncate">
                                      {file.name ||
                                        file.value ||
                                        "Untitled Note"}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() =>
                                      setUploads((prev) => ({
                                        ...prev,
                                        notes: prev.notes.filter(
                                          (_, idx) => idx !== i
                                        ),
                                      }))
                                    }
                                    className="text-red-500 hover:text-red-700 text-xs font-semibold"
                                  >
                                    Delete
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* FILES SECTION */}
                        {uploads.files?.length > 0 && (
                          <div className="bg-white rounded-2xl p-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-[#FEF8EE] rounded-full p-3">
                                <PiFile className="text-yellow-800 text-2xl" />
                              </div>
                              <div>
                                <p className="text-lg font-semibold">PDF</p>
                                <p className="text-sm -mt-4 text-[#7C7B7B]">
                                  Upload PDF files to classroom
                                </p>
                              </div>
                            </div>
                            <div className="mt-4">
                              {uploads.files.map((file, i) => (
                                <div
                                  key={`file-${i}`}
                                  className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3"
                                >
                                  <div className="flex items-center gap-3">
                                    <CiFileOn className="text-[#F59E0B] text-xl" />
                                    <span className="text-sm font-medium text-gray-700 truncate">
                                      {file.name || "Untitled File"}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() =>
                                      setUploads((prev) => ({
                                        ...prev,
                                        files: prev.files.filter(
                                          (_, idx) => idx !== i
                                        ),
                                      }))
                                    }
                                    className="text-red-500 hover:text-red-700 text-xs font-semibold"
                                  >
                                    Delete
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* IMAGE SECTION */}
                        {uploads.image?.length > 0 && (
                          <div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                              {uploads.image.map((file, i) => (
                                <div
                                  key={`img-${i}`}
                                  className="relative bg-gray-50 border border-gray-200 rounded-xl overflow-hidden"
                                >
                                  <img
                                    src={
                                      file instanceof File
                                        ? URL.createObjectURL(file)
                                        : file.url ||
                                          (typeof file === "string" ? file : "")
                                    }
                                    alt={file.name || "Uploaded image"}
                                    className="w-full h-full object-cover"
                                  />

                                  <button
                                    onClick={() =>
                                      setUploads((prev) => ({
                                        ...prev,
                                        image: prev.image.filter(
                                          (_, idx) => idx !== i
                                        ),
                                      }))
                                    }
                                    className="absolute top-2 right-2 bg-white/80 text-red-600 text-xs px-2 py-1 rounded-md"
                                  >
                                    Delete
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* YOUTUBE SECTION */}
                        {uploads.youtube?.length > 0 && (
                          <div className="bg-white p-4 rounded-2xl">
                            <div className="flex items-center gap-3">
                              <div className="bg-[#FFE9E9] rounded-full p-3">
                                <AiOutlineYoutube className="text-[red] text-2xl" />
                              </div>
                              <div>
                                <p className="text-lg font-semibold">YouTube</p>
                                <p className="text-sm -mt-4 text-[#7C7B7B]">
                                  Add YouTube links to classroom
                                </p>
                              </div>
                            </div>

                            <div className="mt-4 space-y-3">
                              {uploads.youtube.map((file, i) => {
                                // ✅ Extract video ID
                                const extractYouTubeID = (url: string) => {
                                  const match = url.match(
                                    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
                                  );
                                  return match ? match[1] : null;
                                };

                                const videoId = extractYouTubeID(file.value);
                                const thumbnail = videoId
                                  ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                                  : null;

                                return (
                                  <div
                                    key={`yt-${i}`}
                                    className="flex flex-col gap-3 items-center justify-between bg-gray-50 border border-gray-200 rounded-xl"
                                  >
                                    <div className="flex items-center gap-3 truncate">
                                      {thumbnail ? (
                                        <div className="relative group">
                                          <img
                                            src={thumbnail}
                                            alt="YouTube thumbnail"
                                            className="w-full h-full object-cover rounded-md shadow-sm"
                                          />
                                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md">
                                            <a
                                              href={file.value}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-white text-xs bg-red-500 px-2 py-1 rounded-md font-semibold"
                                            >
                                              ▶
                                            </a>
                                          </div>
                                        </div>
                                      ) : (
                                        <AiOutlineYoutube className="text-[#EF4444] text-xl" />
                                      )}
                                      {/* <a
                href={file.value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-[red] truncate hover:underline"
              >
                {file.value}
              </a> */}
                                    </div>

                                    <button
                                      onClick={() =>
                                        setUploads((prev) => ({
                                          ...prev,
                                          youtube: prev.youtube.filter(
                                            (_, idx) => idx !== i
                                          ),
                                        }))
                                      }
                                      className="text-red-500 hover:text-red-700 text-xs font-semibold"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* LINKS SECTION */}
                        {uploads.links?.length > 0 && (
                          <div className="bg-white rounded-2xl p-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-[#E4F1FF] rounded-full p-3">
                                <PiLinkSimple className="text-blue-600 text-2xl" />
                              </div>
                              <div>
                                <p className="text-lg font-semibold">
                                  External Links
                                </p>
                                <p className="text-sm -mt-4 text-[#7C7B7B]">
                                  Add External links to classroom
                                </p>
                              </div>
                            </div>
                            <div className="mt-4">
                              {uploads.links.map((file, i) => (
                                <div
                                  key={`link-${i}`}
                                  className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3"
                                >
                                  <div className="flex items-center gap-3 truncate">
                                    <PiLinkSimple className="text-[#3B82F6] text-xl" />
                                    <a
                                      href={file.value}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm font-medium text-blue-600 truncate hover:underline"
                                    >
                                      {file.value}
                                    </a>
                                  </div>
                                  <button
                                    onClick={() =>
                                      setUploads((prev) => ({
                                        ...prev,
                                        links: prev.links.filter(
                                          (_, idx) => idx !== i
                                        ),
                                      }))
                                    }
                                    className="text-red-500 hover:text-red-700 text-xs font-semibold"
                                  >
                                    Delete
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* SLIDES SECTION */}
                        {/* {uploads.slides?.length > 0 && (
                          <div className="bg-white p-4 rounded-2xl">
                            <div className="flex items-center gap-3">
                              <div className="bg-[#E4F1FF] rounded-full p-3">
                                <PiSlideshow className="text-blue-600 text-2xl" />
                              </div>
                              <div>
                                <p className="text-lg font-semibold">Slides</p>
                                <p className="text-sm -mt-4 text-[#7C7B7B]">
                                  Add Slides to classroom
                                </p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              {uploads.slides.map((file, i) => (
                                <div
                                  key={`slide-${i}`}
                                  className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3"
                                >
                                  <div className="flex items-center gap-3">
                                    <PiSlideshow className="text-[#3B82F6] text-xl" />
                                    <span className="text-sm font-medium text-gray-700 truncate">
                                      {file.name || "Untitled Slide"}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() =>
                                      setUploads((prev) => ({
                                        ...prev,
                                        slides: prev.slides.filter(
                                          (_, idx) => idx !== i
                                        ),
                                      }))
                                    }
                                    className="text-red-500 hover:text-red-700 text-xs font-semibold"
                                  >
                                    Delete
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )} */}
                      </div>
                    )}

                    <div className="flex flex-col items-center gap-8">
                      {/* Top Row (3 items) */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 justify-items-center">
                        {[
                          {
                            id: "notes",
                            label: "Notes",
                            icon: <PiNoteBold className="text-[#6B46FF]" />,
                          },
                          {
                            id: "files",
                            label: "Files (PDF, DOC)",
                            icon: <CiFileOn className="text-[#F59E0B]" />,
                          },
                          {
                            id: "image",
                            label: "Image",
                            icon: <FiImage className="text-[#10B981]" />,
                          },
                        ].map((type) => {
                          const uploadedCount = uploads[type.id]?.length || 0;
                          return (
                            <button
                              key={type.id}
                              onClick={() => openUploadModal(type.id)}
                              className="flex flex-col items-center justify-center gap-3 w-56 sm:w-44 h-28 sm:h-32 bg-white rounded-2xl border border-gray-200 hover:bg-[#E5E5E5] transition-all"
                            >
                              <span className="text-3xl">{type.icon}</span>
                              <span className="text-black text-sm sm:text-base">
                                {type.label}
                              </span>
                              {uploadedCount > 0 && (
                                <span className="text-xs text-[#6200EE]">
                                  {uploadedCount} uploaded
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Bottom Row (2 items) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-items-center">
                        {[
                          {
                            id: "youtube",
                            label: "YouTube",
                            icon: (
                              <AiOutlineYoutube className="text-[#EF4444]" />
                            ),
                          },
                          {
                            id: "links",
                            label: "Links",
                            icon: <PiLinkSimple className="text-[#3B82F6]" />,
                          },
                          // { id: "slides", label: "Slides", icon: <PiSlideshow className="text-[#3B82F6]" /> },
                        ].map((type) => {
                          const uploadedCount = uploads[type.id]?.length || 0;
                          return (
                            <button
                              key={type.id}
                              onClick={() => openUploadModal(type.id)}
                              className="flex flex-col items-center justify-center gap-3 w-56 sm:w-44 h-28 sm:h-32 bg-white rounded-2xl border border-gray-200 hover:bg-[#E5E5E5] transition-all"
                            >
                              <span className="text-3xl">{type.icon}</span>
                              <span className="font-semibold text-gray-800 text-sm sm:text-base">
                                {type.label}
                              </span>
                              {uploadedCount > 0 && (
                                <span className="text-xs text-[#6B46FF]">
                                  {uploadedCount} uploaded
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Upload Modal */}
                  {uploadModalOpen && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[10000]">
                      <div className="bg-white rounded-3xl p-10 shadow-xl relative w-[90%] md:w-[60%]">
                        {/* Close Button */}
                        <button
                          onClick={() => setUploadModalOpen(false)}
                          className="absolute top-5 right-6 text-gray-500 hover:text-gray-800"
                        >
                          <X className="h-6 w-6" />
                        </button>

                        {/* Description below title */}
                        <p className="text-sm text-black text-center mb-6">
                          {activeUpload === "image" &&
                            "Upload an image to visually represent your classroom, project, or resource. Supported formats: JPG, PNG."}
                          {activeUpload === "files" &&
                            "Upload supporting documents such as PDFs or Word files that students can download."}
                          {activeUpload === "slides" &&
                            "Upload your PowerPoint or Google Slides presentation for your class or workshop."}
                          {activeUpload === "youtube" &&
                            "Paste a YouTube video link that will appear as an embedded video in your classroom."}
                          {activeUpload === "links" &&
                            "Paste an external link to an article, website, or resource that complements your classroom material."}
                          {activeUpload === "notes" &&
                            "Write or paste notes that summarize your lesson or provide additional context for your students."}
                        </p>

                        {/* File upload box */}
                        {["image", "files", "slides"].includes(
                          activeUpload || ""
                        ) && (
                          <div
                            className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-2xl h-64 flex flex-col items-center justify-center text-black cursor-pointer hover:border-[#6B46FF]"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <input
                              type="file"
                              ref={fileInputRef}
                              className="hidden"
                              onChange={(e) =>
                                activeUpload &&
                                handleFileUpload(e, activeUpload)
                              }
                            />
                            <p className="text-center px-4 text-gray-600">
                              Select, drag or drop{" "}
                              {activeUpload === "image"
                                ? "image file"
                                : activeUpload === "slides"
                                ? "presentation file"
                                : "document"}{" "}
                              here.
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                              (Supported: JPG, PNG, PDF, PPTX)
                            </p>
                          </div>
                        )}

                        {/* YouTube / Links / Notes input field */}
                        {["youtube", "links", "notes"].includes(
                          activeUpload || ""
                        ) && (
                          <div>
                            <label className="text-sm font-semibold mb-2 text-gray-800 block">
                              {activeUpload === "notes"
                                ? "Write Notes"
                                : "Enter URL"}
                            </label>
                            {activeUpload === "notes" ? (
                              <textarea
                                value={uploadInput}
                                onChange={(e) => setUploadInput(e.target.value)}
                                placeholder="Type your classroom notes here..."
                                rows={6}
                                className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-[#6B46FF] placeholder:text-gray-600 resize-none"
                              />
                            ) : (
                              <input
                                type="url"
                                value={uploadInput}
                                onChange={(e) => setUploadInput(e.target.value)}
                                placeholder={
                                  activeUpload === "youtube"
                                    ? "https://www.youtube.com/watch?v=example"
                                    : "https://example.com/resource"
                                }
                                className="w-full border border-gray-300 rounded-full px-4 py-3 focus:ring-2 focus:ring-[#6B46FF] placeholder:text-gray-600"
                              />
                            )}
                          </div>
                        )}

                        {/* Uploaded files persist here */}
                        {uploads[activeUpload || ""]?.length > 0 && (
                          <div className="mt-6">
                            <p className="text-sm text-gray-700 font-medium mb-2">
                              Uploaded:
                            </p>
                            <ul className="space-y-2 text-sm">
                              {uploads[activeUpload || ""].map(
                                (file, index) => (
                                  <li
                                    key={index}
                                    className="flex items-center justify-between bg-gray-100 rounded-xl px-3 py-2"
                                  >
                                    <span className="truncate">
                                      {file.name || file.value}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {file.size
                                        ? `${(file.size / 1024).toFixed(1)} KB`
                                        : "Saved"}
                                    </span>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}

                        {/* Upload Button */}
                        <div className="mt-6 flex justify-start">
                          <button
                            className="bg-[#6B46FF] hover:bg-[#5B36F5] text-white rounded-full px-8 py-2 transition-all"
                            onClick={() =>
                              activeUpload && handleUploadConfirm(activeUpload)
                            }
                          >
                            Upload
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Footer Navigation */}
                  <div className="flex justify-between border-t border-gray-100 mt-20">
                    <button onClick={goBack} className="flex gap-1">
                      <MdChevronLeft className="mt-1" /> Back
                    </button>
                    <button
                      onClick={goNext}
                      className="flex gap-1 bg-[#6200EE] text-white pt-[8px] pb-[8px] pl-[16px] pr-[16px] rounded-full"
                    >
                      Next
                      <MdChevronRight className="mt-1" />
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* STEP 4 */}
            {currentStep === 4 && (
              <div className="bg-white rounded-[32px] shadow-sm p-8 mb-16 transition-all duration-300 mt-20">
                <h4 className="font-[700] text-[20px] text-[#2A2929] text-center mb-6">
                  Classroom Outlines
                </h4>

                {/* STEP 4 CONTENT */}
                {parsedOutlines.length === 0 ? (
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-6">
                      Click the button below to generate outline in seconds
                    </p>
                    <button
                      onClick={async () => {
                        setIsLoadingOutline(true);
                        await generateOutline();
                        setIsLoadingOutline(false);
                      }}
                      className="bg-[#6B46FF] hover:bg-[#5B36F5] text-white rounded-full px-6 py-3 font-medium flex items-center gap-2 mx-auto transition"
                    >
                      ✨ Generate Outline
                    </button>
                  </div>
                ) : (
                  <>
                    <OutlineInputs
                      initialOutlines={parsedOutlines}
                      grade={getValues("grade")}
                      onOutlinesChange={handleOutlinesChange}
                      onSelectedOutlinesChange={handleSelectedOutlinesChange}
                      onGenerateMoreOutlines={generateOutline}
                      savedSelectedOutlines={selectedOutlines}
                    />

                    {selectedOutlines.length > 0 && (
                      <div className="mt-10">
                        <h3 className="text-lg font-semibold mb-3 text-gray-800">
                          Selected Outlines
                        </h3>
                        <table className="min-w-full divide-y divide-gray-200 border border-gray-100 rounded-lg">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Title
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Assessment
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-100">
                            {selectedOutlines.map((outline, index) => (
                              <tr key={index}>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                  {outline.title}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700">
                                  {outline.assessment?.length ? (
                                    outline.assessment.map((q, qIndex) => (
                                      <div key={qIndex} className="mb-2">
                                        <p className="font-medium">{q.title}</p>
                                        {q.options?.length > 0 && (
                                          <ul className="list-disc list-inside text-gray-500 text-sm">
                                            {q.options.map((opt, oIndex) => (
                                              <li key={oIndex}>{opt}</li>
                                            ))}
                                          </ul>
                                        )}
                                      </div>
                                    ))
                                  ) : (
                                    <span className="text-gray-400 italic">
                                      No assessments added yet
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <button
                            onClick={() => {
                              setParsedOutlines([]);
                              setSelectedOutlines([]);
                              localStorage.removeItem(CLASSROOM_DRAFT_KEY);
                            }}
                            className="text-sm bg-red-500 text-white rounded-lg p-2 mt-4"
                          >
                            Clear saved outlines
                          </button>
                        </table>
                      </div>
                    )}
                  </>
                )}

                {/* ✅ NAVIGATION FOOTER */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-10">
                  <button
                    onClick={goBack}
                    className="flex items-center text-sm font-medium text-gray-500"
                  >
                    <MdChevronLeft className="mt-0.5" />
                    Back
                  </button>

                  <div className="flex items-center gap-5">
                    {/* Skip visible only if outlines aren't generated yet */}
                    {parsedOutlines.length === 0 && (
                      <button
                        onClick={goNext}
                        className="text-[#6200EE] rounded-full px-6 py-2 text-sm border border-[#6200EE] font-medium transition"
                      >
                        Skip
                      </button>
                    )}

                    <button
                      onClick={goNext}
                      className="bg-[#6200EE] hover:bg-[#4E00C8] text-white rounded-full px-6 py-2 text-sm font-medium flex items-center gap-1 transition"
                    >
                      Next
                      <MdChevronRight className="mt-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {currentStep === 5 && (
            <section className="space-y-6 max-w-6xl mx-auto">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
                Select Tools Needed
              </h2>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-1 lg:grid-cols-4">
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
                        className={`relative p-5 border rounded-2xl transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#F3EEFF] border-[#6B46FF]"
                            : "bg-white border-gray-200 hover:shadow-sm"
                        }`}
                        onClick={() => {
                          if (!isSelected) handleToolSelect(tool);
                        }}
                      >
                        <div className="flex flex-col">
                          <div className="text-primary text-2xl">
                            {tool.thumbnail ? (
                              <img
                                src={
                                  tool.thumbnail.startsWith("http")
                                    ? tool.thumbnail
                                    : `https://${tool.thumbnail}`
                                }
                                alt={tool.name || "Tool Thumbnail"}
                                className="w-full h-48 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg">
                                <span className="text-[#6B46FF] font-bold text-xl">
                                  {tool.name?.[0] || "T"}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex-1 mt-2">
                            <h3 className="font-semibold text-gray-900">
                              {tool.name}
                            </h3>
                            <p className="text-sm text-gray-600 truncate">
                              {tool.description ||
                                "Tool to assist with lesson creation and management."}
                            </p>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="mt-3 space-y-2">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToolSelect(tool);
                              }}
                              className="absolute top-3 right-0 p-2 rounded-lg bg-white"
                              aria-label="Unselect Tool"
                            >
                              <X className="h-6 w-6 text-[red]" />
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                <button onClick={goBack} className="flex items-center gap-1">
                  <MdChevronLeft className="mt-1" /> Back
                </button>

                <button
                  onClick={handleSaveClassroom}
                  className="bg-[#6B46FF] text-white rounded-full flex items-center gap-2 px-6 py-2"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <svg
                      className="w-4 h-4 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                  )}
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </section>
          )}
        </div>

        <Toast
          open={toastOpen}
          onOpenChange={setToastOpen}
          variant={toastVariant}
        >
          <ToastTitle>{toastMessage}</ToastTitle>
        </Toast>
        <ToastViewport />
      </section>
    </ToastProvider>
  );
};

export default CreateOrEditClassroom;
