import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../store";
import { loadTools } from "../../../store/slices/toolsSlice";
import { TextArea } from "../../../components/ui/TextArea";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import { Button } from "../../../components/ui/Button";
import { Undo2 } from "lucide-react";
import parse from "html-react-parser";

import {
  submitToolData,
  saveResource,
  SubmitToolData,
} from "../../../api/tools";
import { marked } from "marked";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/Select";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastViewport,
  ToastClose,
} from "../../../components/ui/Toast";
import NotFound from "./NotFound";
import LoadingToolDetails from "./Loading";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { jsPDF } from "jspdf";
import { Country } from "country-state-city";
import { Checkbox } from "../../../components/ui/Checkbox";
import { MultiSelect } from "primereact/multiselect";
import {
  activityList,
  sdgOptions,
  questionTypelist,
  curriculumFocus,
  appraisalTypeList,
  mediaTypelist,
  wordTypeList,
  supportResourcesList,
  difficultyList,
  ageGroupList,
  examTypeList,
  voiceTypelist,
} from "./data";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/saga-blue/theme.css";
import { pdf, Document, Page, Text, StyleSheet } from "@react-pdf/renderer";

const gradeOptions = [
  "Pre School",
  "Early Years",
  "Nursery 1",
  "Nursery 2",
  ...Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`),
  ...Array.from({ length: 5 }, (_, i) => `higher institution year ${i + 1}`),
];

interface FormField {
  name: string;
  label: string;
  value?: string;
  placeholder: string;
}

interface FormLabels {
  [key: string]: string;
}

const markdownToPlainText = async (markdown: string): Promise<string> => {
  const html = await marked(markdown);
  return html.replace(/<[^>]*>?/gm, "");
};

const ToolDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { tools, loading } = useSelector((state: RootState) => state.tools);

  const [tool, setTool] = useState<any>(null);
  const [loadingTool, setLoadingTool] = useState(true);
  const [formData, setFormData] = useState<{ [key: string]: any }>({
    grade: "University",
  });
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [formLabels, setFormLabels] = useState<{ [key: string]: string }>({});
  const [responseMessage, setResponseMessage] = useState<any | "">("");
  const [tunedResponseMessage, setTunedResponseMessage] = useState<any | null>(
    null
  );
  const [imageUrl, setImageUrl] = useState<string | "">("");
  const [visibleFieldPairs, setVisibleFieldPairs] = useState(1);
  const [countries, setCountries] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
    "default"
  );

  interface Field {
    req_param: string;
    label: string;
    name: string;
    placeholder: string;
  }
  const [fields, setFields] = useState<Field[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (tools.length === 0) {
        await dispatch(loadTools());
      }
      setLoadingTool(false);
    };

    fetchData();
  }, [dispatch, tools.length]);

  useEffect(() => {
    const countryList = Country.getAllCountries().map(
      (country) => country.name
    );
    setCountries(countryList);
  }, []);

  useEffect(() => {
    if (!loadingTool) {
      const selectedTool = tools.find((t) => t.slug === slug);
      setTool(selectedTool);

      if (selectedTool?.req_param) {
        try {
          const initialFields = JSON.parse(selectedTool.req_param);

          delete initialFields.serviceId;
          setFormData({ ...initialFields, grade: "University" });
          if (tools.length > 0) {
            const tool = tools.find((t) => t.slug === slug);
            if (!tool) return;

            const reqParams = JSON.parse(tool.req_param);
            const labels = JSON.parse(tool.label);

            const fields = Object.keys(reqParams).map((key, index) => {
              const label = Object.keys(labels)[index];
              return {
                name: key,
                label: label ? capitalize(label) : "",
                placeholder: labels[label] || "",
              };
            });
            console.log(fields);
            setFormFields(fields);
          }
        } catch (error) {
          console.error("Failed to parse req_param:", error);
        }
      }
    }
  }, [slug, tools, loadingTool]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleGradeChange = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      grade: value,
    }));
  };

  const handleCountryChange = (countryName: string) => {
    setSelectedCountry(countryName);
    setFormData((prevData) => ({
      ...prevData,
      curriculum_type: countryName,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("ai-teacha-user") || "{}");
    const user_Id = user?.id;

    if (!user_Id || !tool?.service_id) {
      setToastMessage("Service_id is missing from tool");
      setToastVariant("destructive");
      setShowToast(true);
      return;
    }
    const formDataToSubmit = new FormData();

    const data: SubmitToolData = {
      user_id: user_Id,
      serviceId: tool.service_id,
      ...formData,
    };

    formDataToSubmit.append("user_id", user_Id.toString());
    formDataToSubmit.append("serviceId", tool.service_id);

    for (const key in formData) {
      if (formData.hasOwnProperty(key)) {
        if (key === "file" && formData[key]) {
          formDataToSubmit.append(key, formData[key]);
        } else {
          formDataToSubmit.append(key, formData[key]);
        }
      }
    }

    setIsSubmitting(true);
    try {
      console.log(data);
      console.log("FormData to submit:", formDataToSubmit);

      const response = await submitToolData(formDataToSubmit);
      const plainTextResponse = await markdownToPlainText(response.data.data);
      const markedResponse = marked(response.data.data);
      console.log(response.data.data);
      setResponseMessage(markedResponse);
      setTunedResponseMessage(plainTextResponse);
      const imageUrl = plainTextResponse;
      const quotedImageUrl = `${imageUrl}`;
      setImageUrl(quotedImageUrl);
      setToastMessage("Submission successful!");
      setToastVariant("default");
    } catch (error: any) {
      setResponseMessage(error.message || "Failed to submit tool data.");
      console.log(error);
      setToastMessage("Failed to submit tool data.");
      setToastVariant("destructive");
    } finally {
      setIsSubmitting(false);
      setShowToast(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();

      formData.append("file", file);

      setFormData((prevData) => ({
        ...prevData,
        file: formData,
      }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const currentDate = new Date().toLocaleDateString();

    const prompt_q =
      formData.title ||
      formData.description ||
      formData.topic ||
      `${tool.name} ${currentDate}`;

    const data = {
      category: tool.name,
      prompt_q,
      returned_answer: responseMessage,
    };
    try {
      await saveResource(data);
      setToastMessage("Submission successful!");
      setToastVariant("default");
    } catch (error: any) {
      setToastMessage("Failed to submit tool data.");
      setToastVariant("destructive");
    } finally {
      setShowToast(true);
      setSaving(false);
    }
  };
  const handleDownload = async () => {
    console.log("pdf");
    const MyDocument = (
      <Document>
        <Page style={styles.page}>
          <Text>{tunedResponseMessage || "No response available."}</Text>
        </Page>
      </Document>
    );

    const blob = await pdf(MyDocument).toBlob();

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${tool.service_id}response.pdf`;
    link.click();
  };
  const [subTopicInputList, setSubTopicInputList] = useState<string[]>([""]);

  const handleAddSubTopic = () => {
    setSubTopicInputList((prev) => [...prev, ""]); // Add a new empty input field
  };

  const handleSubTopicChange = (index: number, value: string) => {
    setSubTopicInputList((prev) =>
      prev.map((item, i) => (i === index ? value : item))
    ); // Update the value of a specific input
  };

  const handleRemoveSubTopic = (index: number) => {
    if (index === 0) return;
    setSubTopicInputList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveSubTopics = () => {
    setFormData((prev) => ({
      ...prev,
      subtopic: subTopicInputList.filter((subTopic) => subTopic.trim() !== ""),
    }));
  };

  const capitalize = (str: string) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  interface FieldPair {
    criteria: string;
    weightage: string;
  }
  const fieldPairs: FieldPair[] = [
    { criteria: "criteria", weightage: "weightage" },
    { criteria: "criteria2", weightage: "weightage2" },
    { criteria: "criteria3", weightage: "weightage3" },
    { criteria: "criteria4", weightage: "weightage4" },
  ];

  if (loading || loadingTool) {
    return (
      <p>
        <LoadingToolDetails />
      </p>
    );
  }

  if (!tool) {
    return (
      <p>
        <NotFound />
      </p>
    );
  }

  return (
    <ToastProvider>
      <div className="mt-12 px-4">
        <Button
          className="flex items-center bg-white rounded-md text-black w-fit h-full gap-3 py-2 mb-4"
          onClick={() => navigate(-1)}
        >
          <Undo2 size={"1.1rem"} color="black" />
          Back
        </Button>
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          <div className="lg:w-1/2">
            <div className="flex gap-3 mb-4">
              <h2 className="text-2xl font-bold capitalize">
                {tool.name === "math calculator" ? "Solver" : tool.name}
              </h2>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6 text-yellow-500"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            </div>
            <p className="mb-6">{tool.description}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              {tool.service_id === "markingscheme generator" && (
                <>
                  <div className="flex gap-4 mb-4">
                    <div className="w-full">
                      <Label className="capitalize">Description</Label>
                      <Input
                        type="text"
                        name="description"
                        placeholder="Enter Specific Details "
                        value={formData.description || ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        className="input-field w-full"
                      />
                    </div>
                  </div>
                  {fieldPairs.slice(0, visibleFieldPairs).map((pair, index) => (
                    <div
                      key={index}
                      className="flex gap-4 mb-4 border p-4 rounded-md border-gray-400"
                    >
                      <div className="w-1/2">
                        <Label className="capitalize">{pair.criteria}</Label>
                        <Input
                          type="text"
                          name={pair.criteria}
                          placeholder={`Enter ${pair.criteria}`}
                          value={formData[pair.criteria] || ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData((prev) => ({
                              ...prev,
                              [pair.criteria]: e.target.value,
                            }))
                          }
                          className="input-field w-full"
                        />
                      </div>
                      <div className="w-1/2">
                        <Label>{pair.weightage}</Label>
                        <Input
                          type="text"
                          name={pair.weightage}
                          placeholder={`Enter ${pair.weightage}`}
                          value={formData[pair.weightage] || ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData((prev) => ({
                              ...prev,
                              [pair.weightage]: e.target.value,
                            }))
                          }
                          className="input-field w-full"
                        />
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 flex gap-4">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (visibleFieldPairs < fieldPairs.length) {
                          setVisibleFieldPairs((prev) => prev + 1);
                        }
                      }}
                      className={`bg-gray-900 p-2 px-6 text-white rounded-full ${
                        visibleFieldPairs >= fieldPairs.length
                          ? "cursor-not-allowed opacity-50"
                          : "hover:bg-gray-500"
                      }`}
                      disabled={visibleFieldPairs >= fieldPairs.length}
                    >
                      Add
                    </button>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (visibleFieldPairs > 1) {
                          setVisibleFieldPairs((prev) => prev - 1);
                        }
                      }}
                      className={`bg-red-900 p-2 px-6 text-white rounded-full ${
                        visibleFieldPairs <= 1
                          ? "cursor-not-allowed opacity-50"
                          : "hover:bg-red-700"
                      }`}
                      disabled={visibleFieldPairs <= 1}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="flex gap-4 mb-4">
                    <div className="w-1/2">
                      <Label>Scoring Scale</Label>
                      <Input
                        type="text"
                        name="scoringScale"
                        placeholder="Enter Scoring Scale (e.g., 0-5, 1-10)"
                        value={formData.scoringScale || ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData((prev) => ({
                            ...prev,
                            scoringScale: e.target.value,
                          }))
                        }
                        className="input-field w-full"
                      />
                    </div>
                    <div className="w-1/2">
                      <Label>Comments</Label>
                      <Input
                        type="text"
                        name="comments"
                        placeholder="Indicate if you want space for comments for each criterion"
                        value={formData.comments || ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData((prev) => ({
                            ...prev,
                            comments: e.target.value,
                          }))
                        }
                        className="input-field w-full"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 mb-4 border">
                    <div className="w-full">
                      <Label>Additional Notes</Label>
                      <Input
                        type="text"
                        name="additionalNotes"
                        placeholder="Enter any additional guidelines or notes for the markers"
                        value={formData.additionalNotes || ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData((prev) => ({
                            ...prev,
                            additionalNotes: e.target.value,
                          }))
                        }
                        className="input-field w-full"
                      />
                    </div>
                  </div>
                </>
              )}

              {formFields.map((field) => (
                <div key={field.name}>
                  {field.name === "grade" &&
                    tool.req_param?.includes("grade") && (
                      <div>
                        <Label>{field.label}</Label>
                        <Select
                          onValueChange={handleGradeChange}
                          defaultValue="University"
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
                      </div>
                    )}
                  {field.name === "curriculum_type" &&
                    tool.req_param?.includes("curriculum_type") && (
                      <div>
                        <Label>{field.label}</Label>
                        <Select onValueChange={handleCountryChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Curriculum Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((countryName) => (
                              <SelectItem key={countryName} value={countryName}>
                                {countryName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  {field.name === "file" &&
                    tool.req_param?.includes("file") && (
                      <div>
                        <Label>
                          {tool.service_id === "transcribe"
                            ? "Upload Audio"
                            : "Upload File (Optional)"}
                        </Label>
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e)}
                          className="file-input bg-white"
                          accept={
                            tool.service_id === "transcribe"
                              ? "audio/*"
                              : "application/pdf, image/png, image/jpeg, image/jpg"
                          }
                          required={tool.service_id === "transcribe"}
                        />
                      </div>
                    )}

                  {field.name === "audio" &&
                    tool.req_param?.includes("audio") && (
                      <div>
                        <Label>{field.label}</Label>
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e)}
                          className="file-input bg-white "
                          accept=" video/mp4, video/quicktime"
                        />
                      </div>
                    )}

                  {field.name === "subject" && (
                    <div>
                      <Label>{field.label}</Label>
                      {tool.service_id === "solver" ? (
                        <Select
                          onValueChange={(value) =>
                            setFormData((prevData) => ({
                              ...prevData,
                              subject: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            {["Maths", "Physics", "Chemistry"].map(
                              (subject) => (
                                <SelectItem key={subject} value={subject}>
                                  {subject}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          type="text"
                          name="subject"
                          placeholder={
                            field.placeholder || `Enter ${field.name}`
                          }
                          value={formData.subject || ""}
                          onChange={handleInputChange}
                        />
                      )}
                    </div>
                  )}
                  {field.name === "subtopic" &&
                    tool.req_param?.includes("subtopic") && (
                      <div>
                        <Label>{field.label}</Label>

                        {/* Render the first (default) subtopic field */}
                        <div className="flex gap-4 mb-4">
                          <div className="w-full">
                            <Input
                              type="text"
                              placeholder="Enter sub topic"
                              value={subTopicInputList[0]}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => handleSubTopicChange(0, e.target.value)}
                              className="input-field w-full"
                            />
                          </div>
                        </div>

                        {/* Render dynamically created input fields (excluding the first one) */}
                        {subTopicInputList.slice(1).map((subTopic, index) => (
                          <div key={index + 1} className="flex gap-4 mb-4">
                            <div className="w-full">
                              <Input
                                type="text"
                                placeholder="Enter sub topic"
                                value={subTopic}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                  handleSubTopicChange(
                                    index + 1,
                                    e.target.value
                                  )
                                }
                                className="input-field w-full"
                              />
                            </div>
                            <Button
                              type="button"
                              onClick={() => handleRemoveSubTopic(index + 1)}
                              className="text-red-500"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}

                        <div className="flex gap-4">
                          <div className="mt-4">
                            <Button
                              type="button"
                              onClick={handleAddSubTopic}
                              className="rounded-md bg-white border border-gray-300"
                            >
                              Add SubTopic
                            </Button>
                          </div>

                          <div className="mt-4">
                            <Button
                              type="button"
                              onClick={handleSaveSubTopics}
                              variant={"gray"}
                              className=" rounded-md text-white"
                            >
                              Save SubTopics
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  {field.name === "sdg" && tool.req_param?.includes("sdg") && (
                    <div>
                      <Label>{field.label}</Label>
                      <MultiSelect
                        value={formData.sdg || []}
                        onChange={(e) => {
                          setFormData((prevData) => ({
                            ...prevData,
                            sdg: e.value,
                          }));
                        }}
                        options={sdgOptions.map((option) => ({
                          label: option.label,
                          value: option.value,
                        }))}
                        optionLabel="label"
                        placeholder="Select SDG Goals"
                        display="chip"
                        className="w-full rounded-md"
                        maxSelectedLabels={3}
                      />
                    </div>
                  )}

                  {field.name === "activitytype" && (
                    <div>
                      <Label>{field.label}</Label>
                      <Select
                        onValueChange={(value) =>
                          setFormData((prevData) => ({
                            ...prevData,
                            activityType: value,
                          }))
                        }
                        defaultValue={formData.activityType || ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select activity type" />
                        </SelectTrigger>
                        <SelectContent>
                          {activityList.map((activity) => (
                            <SelectItem
                              key={activity.value}
                              value={activity.value}
                            >
                              {activity.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {field.name === "voiceType" && (
                    <div>
                      <Label>{field.label}</Label>
                      <Select
                        onValueChange={(value) =>
                          setFormData((prevData) => ({
                            ...prevData,
                            voiceType: value,
                          }))
                        }
                        defaultValue={formData.voiceType || ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Voice Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {voiceTypelist.map((voiceType) => (
                            <SelectItem
                              key={voiceType.value}
                              value={voiceType.value}
                            >
                              {voiceType.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {field.name === "examType" && (
                    <div>
                      <Label>{field.label}</Label>
                      <Select
                        onValueChange={(value) =>
                          setFormData((prevData) => ({
                            ...prevData,
                            examType: value,
                          }))
                        }
                        defaultValue={formData.examType || ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Exam Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {examTypeList.map((examType) => (
                            <SelectItem
                              key={examType.value}
                              value={examType.value}
                            >
                              {examType.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {field.name === "supportResources" && (
                    <div>
                      <Label>{field.label}</Label>
                      <Select
                        onValueChange={(value) =>
                          setFormData((prevData) => ({
                            ...prevData,
                            supportResources: value,
                          }))
                        }
                        defaultValue={formData.supportResources || ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Support Resources " />
                        </SelectTrigger>
                        <SelectContent>
                          {supportResourcesList.map((supportResources) => (
                            <SelectItem
                              key={supportResources.value}
                              value={supportResources.value}
                            >
                              {supportResources.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {field.name === "difficultyLevel" && (
                    <div>
                      <Label>{field.label}</Label>
                      <Select
                        onValueChange={(value) =>
                          setFormData((prevData) => ({
                            ...prevData,
                            difficultyLevel: value,
                          }))
                        }
                        defaultValue={formData.difficultyLevel || ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Difficulty Level" />
                        </SelectTrigger>
                        <SelectContent>
                          {difficultyList.map((difficultyLevel) => (
                            <SelectItem
                              key={difficultyLevel.value}
                              value={difficultyLevel.value}
                            >
                              {difficultyLevel.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {field.name === "ageGroup" && (
                    <div>
                      <Label>{field.label}</Label>
                      <Select
                        onValueChange={(value) =>
                          setFormData((prevData) => ({
                            ...prevData,
                            ageGroup: value,
                          }))
                        }
                        defaultValue={formData.ageGroup || ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Age Group" />
                        </SelectTrigger>
                        <SelectContent>
                          {ageGroupList.map((ageGroup) => (
                            <SelectItem
                              key={ageGroup.value}
                              value={ageGroup.value}
                            >
                              {ageGroup.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {field.name === "wordType" && (
                    <div>
                      <Label>{field.label}</Label>
                      <Select
                        onValueChange={(value) =>
                          setFormData((prevData) => ({
                            ...prevData,
                            wordType: value,
                          }))
                        }
                        defaultValue={formData.wordType || ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Word Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {wordTypeList.map((wordType) => (
                            <SelectItem
                              key={wordType.value}
                              value={wordType.value}
                            >
                              {wordType.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {field.name === "questionFormat" && (
                    <div>
                      <Label>{field.label}</Label>
                      <Select
                        onValueChange={(value) =>
                          setFormData((prevData) => ({
                            ...prevData,
                            questionFormat: value,
                          }))
                        }
                        defaultValue={formData.questionFormat || ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Question Format" />
                        </SelectTrigger>
                        <SelectContent>
                          {questionTypelist.map((questionFormat) => (
                            <SelectItem
                              key={questionFormat.value}
                              value={questionFormat.value}
                            >
                              {questionFormat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {field.name === "feedbackType" && (
                    <div>
                      <Label>{field.label}</Label>
                      <Select
                        onValueChange={(value) =>
                          setFormData((prevData) => ({
                            ...prevData,
                            feedbackType: value,
                          }))
                        }
                        defaultValue={formData.type || ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select  Feedback Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {appraisalTypeList.map((feedbackType) => (
                            <SelectItem
                              key={feedbackType.value}
                              value={feedbackType.value}
                            >
                              {feedbackType.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {field.name === "assessmentType" && (
                    <div>
                      <Label>{field.label}</Label>
                      <Select
                        onValueChange={(value) =>
                          setFormData((prevData) => ({
                            ...prevData,
                            assessmentType: value,
                          }))
                        }
                        defaultValue={formData.assessmentType || ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Assessment Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {questionTypelist.map((assessmentType) => (
                            <SelectItem
                              key={assessmentType.value}
                              value={assessmentType.value}
                            >
                              {assessmentType.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {field.name === "curriculum_focus" && (
                    <div>
                      <Label>{field.label}</Label>
                      <Select
                        onValueChange={(value) =>
                          setFormData((prevData) => ({
                            ...prevData,
                            curriculum_focus: value,
                          }))
                        }
                        defaultValue={formData.curriculum_focus || ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Curriculum Focus" />
                        </SelectTrigger>
                        <SelectContent>
                          {curriculumFocus.map((curriculum) => (
                            <SelectItem
                              key={curriculum.value}
                              value={curriculum.value}
                            >
                              {curriculum.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {field.name === "type" && (
                    <div>
                      <Label>{field.label}</Label>
                      <Select
                        onValueChange={(value) =>
                          setFormData((prevData) => ({
                            ...prevData,
                            type: value,
                          }))
                        }
                        defaultValue={formData.type || ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Question Type Focus" />
                        </SelectTrigger>
                        <SelectContent>
                          {questionTypelist.map((question) => (
                            <SelectItem
                              key={question.value}
                              value={question.value}
                            >
                              {question.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {field.name === "mediaType" && (
                    <div>
                      <Label>{field.label}</Label>
                      <Select
                        onValueChange={(value) =>
                          setFormData((prevData) => ({
                            ...prevData,
                            mediaType: value,
                          }))
                        }
                        defaultValue={formData.mediaType || ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Media Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {mediaTypelist.map((media) => (
                            <SelectItem key={media.value} value={media.value}>
                              {media.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {field.name !== "grade" &&
                    field.name !== "country" &&
                    field.name != "sdg" &&
                    field.name != "file" &&
                    field.name != "type" &&
                    field.name != "difficultyLevel" &&
                    field.name != "wordType" &&
                    field.name != "examType" &&
                    field.name != "assessmentType" &&
                    field.name != "ageGroup" &&
                    field.name != "voiceType" &&
                    field.name != "supportResources" &&
                    field.name != "questionFormat" &&
                    field.name != "curriculum_type" &&
                    field.name != "audio" &&
                    field.name != "mediaType" &&
                    field.name != "subtopic" &&
                    field.name != "feedbackType" &&
                    field.name != "curriculum_focus" &&
                    field.name !== "activitytype" &&
                    tool.service_id !== "markingscheme generator" &&
                    field.name !== "subject" && (
                      <div>
                        <label className="capitalize">{field.label}</label>
                        <Input
                          type={
                            field.name === "numberOfSlides" ||
                            field.name === "numberOfQuestion" ||
                            field.name === "numberOfVerse"
                              ? "number"
                              : "text"
                          }
                          name={field.name}
                          required={
                            field.name === "theme"
                              ? false
                              : field.name === "description"
                              ? tool.is_description_optional === 0
                              : field.name !== "additionalNotes"
                          }
                          placeholder={
                            field.placeholder || `Enter ${field.label}`
                          }
                          value={formData[field.name] || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    )}
                </div>
              ))}
              <Button
                type="submit"
                variant={"gradient"}
                className="text-white py-2 px-4 rounded-md w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "AI Teacha is Typing..." : "Submit"}
              </Button>
            </form>
          </div>

          <div className="lg:w-1/2 mt-8 lg:mt-0">
            <h3 className="text-xl font-bold mb-4">Submission Response</h3>
            {(tool.service_id === "image creator" ||
              tool.service_id === "worksheeteid generator") &&
            responseMessage ? (
              <>
                <div className="p-2 bg-white border border-gray-300 rounded-md">
                  <img
                    src={`${responseMessage}`}
                    alt="Generated Content"
                    className="max-w-full h-auto border border-gray-300 rounded-md"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://eagle-sensors.com/wp-content/uploads/unavailable-image.jpg";
                    }}
                  />
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = responseMessage;
                      link.download = "generated_image.png";
                      link.click();
                    }}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md mr-4"
                  >
                    Download Image
                  </button>
                </div>
              </>
            ) : tool.service_id === "power point slide" && responseMessage ? (
              <div className="mt-4">
                <button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = responseMessage;
                    link.download = "generated_slide.pptx";
                    link.click();
                  }}
                  className="bg-black text-white py-2 px-4 rounded-md"
                >
                  Download Slide
                </button>
              </div>
            ) : tool.service_id === "text to speech" && responseMessage ? (
              <div className="mt-4">
                <button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = responseMessage;
                    link.target = "_blank";
                    link.download = "generated_audio.mp3";
                    link.click();
                  }}
                  className="bg-green-500 text-white py-2 px-4 rounded-md"
                >
                  Download Audio
                </button>
              </div>
            ) : (
              <>
                <div className="w-full p-3 border border-gray-300 bg-white rounded-md resize-none markdown overflow-auto max-h-[700px]">
                  {isSubmitting ? (
                    "AI Teacha is Typing..."
                  ) : (
                    <div>
                      {responseMessage
                        ? parse(responseMessage)
                        : responseMessage || "No response available."}
                    </div>
                  )}
                </div>
                {responseMessage && (
                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={handleDownload}
                      className="bg-black text-white py-2 px-4 rounded-md"
                    >
                      Download as PDF
                    </button>
                    <Button
                      onClick={handleSave}
                      variant={"gradient"}
                      disabled={saving}
                      className="px-4 rounded-md"
                    >
                      {saving ? "Saving..." : "Save to history"}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {showToast && (
          <Toast variant={toastVariant} onOpenChange={setShowToast}>
            <ToastTitle>
              {toastVariant === "destructive" ? "Error" : "Success"}
            </ToastTitle>
            <ToastDescription>{toastMessage}</ToastDescription>
            <ToastClose />
          </Toast>
        )}
        <ToastViewport />
      </div>
    </ToastProvider>
  );
};

const styles = StyleSheet.create({
  page: {
    fontSize: 12,
    padding: 20,
    lineHeight: 1.6,
  },
});
export default ToolDetail;
