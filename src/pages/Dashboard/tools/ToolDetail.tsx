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

const gradeOptions = [
  "Pre School",
  "Early Years",
  "Nursery 1",
  "Nursery 2",
  ...Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`),
  "University",
];

const activityList = [
  { label: "Quizzes", value: "Quizzes" },
  { label: "Crossword Puzzles", value: "Crossword Puzzles" },
  { label: "Word Searches", value: "Word Searches" },
  { label: "Matching Games", value: "Matching Games" },
];
interface FormField {
  name: string;
  label: string;
  value?: string;
}

interface FormLabels {
  [key: string]: string; // Keys are field names, and values are the labels
}

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
  const [responseMessage, setResponseMessage] = useState<any | null>(null);
  const [tunedResponseMessage, setTunedResponseMessage] = useState<any | null>(
    null
  );
  const [imageUrl, setImageUrl] = useState<string | "">("");
  const [countries, setCountries] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
    "default"
  );

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
        const reqParam = JSON.parse(selectedTool.req_param);
        const label = JSON.parse(selectedTool.label);
        try {
          const initialFields = JSON.parse(selectedTool.req_param);
          const reqParam = JSON.parse(selectedTool.req_param);
          const label = JSON.parse(selectedTool.label);
          delete initialFields.serviceId;
          setFormData({ ...initialFields, grade: "University" });
          if (selectedTool.label) {
            const parsedLabels = JSON.parse(selectedTool.label);
            setFormLabels(parsedLabels);

            const updatedLabels = Object.keys(parsedLabels).reduce(
              (acc: FormLabels, key: string) => {
                const labelValue = parsedLabels[key] || key;
                const formattedKey = key.replace(/\s+/g, "");
                acc[formattedKey] = labelValue;
                return acc;
              },
              {}
            );

            const fields = Object.keys(reqParam).map((key) => ({
              name: key,
              label: updatedLabels[key] || key,
            }));

            setFormFields(fields);
            console.log(fields);
            console.log(reqParam);
            console.log(updatedLabels);
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
      country: countryName,
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

    const data: SubmitToolData = {
      user_id: user_Id,
      serviceId: tool.service_id,
      ...formData,
    };

    const markdownToPlainText = async (markdown: string): Promise<string> => {
      const html = await marked(markdown);
      return html.replace(/<[^>]*>?/gm, "");
    };

    setIsSubmitting(true);
    try {
      const response = await submitToolData(data);
      const plainTextResponse = await markdownToPlainText(response.data.data);

      setResponseMessage(response.data.data);
      setTunedResponseMessage(plainTextResponse);
      const imageUrl = plainTextResponse;
      const quotedImageUrl = `${imageUrl}`;
      setImageUrl(quotedImageUrl);
      console.log(quotedImageUrl);
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
  const splitCompoundWord = (word: string): string => {
    return word
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
      .replace(/^./, (match) => match.toUpperCase());
  };

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
              {formFields.map((field) => (
                <div key={field.name}>
                  {field.name === "grade" &&
                    tool.req_param?.includes("grade") && (
                      <div>
                        <Label>Grade</Label>
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
                  {field.name === "country" &&
                    tool.req_param?.includes("country") && (
                      <div>
                        <Label>Country</Label>
                        <Select onValueChange={handleCountryChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Country" />
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
                  {field.name === "subject" && (
                    <div>
                      <Label>Subject</Label>
                      {tool.service_id === "math calculator" ? (
                        <Select
                          onValueChange={(value) =>
                            setFormData((prevData) => ({
                              ...prevData,
                              subject: value,
                            }))
                          }
                          defaultValue="Maths"
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
                          value={formData.subject || ""}
                          onChange={handleInputChange}
                        />
                      )}
                    </div>
                  )}
                  {field.name === "activitytype" && (
                    <div>
                      <Label>Activity Type</Label>
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

                  {field.name !== "grade" &&
                    field.name !== "country" &&
                    field.name !== "activitytype" &&
                    field.name !== "subject" && (
                      <div>
                        <label className="capitalize">
                          {splitCompoundWord(field.label)}
                        </label>

                        <Input
                          type="text"
                          name={field.name}
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
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </div>

          <div className="lg:w-1/2 mt-8 lg:mt-0">
            <h3 className="text-xl font-bold mb-4">Submission Response</h3>
            {tool.service_id === "image creator" && responseMessage ? (
              <>
                <div className="p-2 bg-white border border-gray-300 rounded-md">
                  <img
                    src={responseMessage}
                    alt="Generated Content"
                    className="max-w-full h-auto border border-gray-300 rounded-md"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/400?text=Image+Unavailable";
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
            ) : (
              <>
                {/* <TextArea
                  readOnly
                  value={responseMessage || "No response yet."}
                  className="w-full p-3 border border-gray-300 rounded-md resize-none"
                  
                /> */}
                <ReactMarkdown
                  className="w-full p-3 border border-gray-300 bg-white rounded-md resize-none markdown overflow-auto max-h-96"
                  remarkPlugins={[remarkGfm]}
                >
                  {responseMessage || "No response yet."}
                </ReactMarkdown>
                {responseMessage && (
                  <div className="flex gap-4 mt-4">
                    {/* <button
                      onClick={() => {
                        const blob = new Blob([responseMessage], {
                          type: "text/plain;charset=utf-8",
                        });
                        const link = document.createElement("a");
                        link.href = URL.createObjectURL(blob);
                        link.download = "response.txt";
                        link.click();
                      }}
                      className="bg-green-500 text-white py-2 px-4 rounded-md"
                    >
                      Download as .txt
                    </button> */}
                    <button
                      onClick={() => {
                        const doc = new jsPDF();
                        doc.text(responseMessage, 10, 10);
                        doc.save("response.pdf");
                      }}
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

export default ToolDetail;
