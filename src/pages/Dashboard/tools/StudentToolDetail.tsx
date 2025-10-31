import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../store";
import { loadTools } from "../../../store/slices/toolsSlice";
import { TextArea } from "../../../components/ui/TextArea";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import { Button } from "../../../components/ui/Button";
import { Loader2, Undo2 } from "lucide-react";
import MarkdownRenderer from "../_components/MarkdownRenderer";
import { FiSend } from "react-icons/fi";
import {
  submitToolData,
  saveResource,
  SubmitToolData,
  submitStudentToolData,
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
import { MdChevronLeft } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
const gradeOptions = [
  "Pre School",
  "Early Years",
  "Nursery 1",
  "Nursery 2",
  ...Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`),
  ...Array.from({ length: 5 }, (_, i) => `Higher Institution Year ${i + 1}`),
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
  placeholder: string;
}

type Message = {
  type: "user" | "bot";
  text: string;
};
interface FormLabels {
  [key: string]: string;
}

const StudentToolDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { studentTools, studentLoading, studentError } = useSelector(
    (state: RootState) => state.tools
  );

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  interface Field {
    req_param: string;
    label: string;
    placeholder: string;
  }
  const [fields, setFields] = useState<Field[]>([]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (responseMessage && messages.length === 0) {
      setMessages([{ type: "bot", text: responseMessage }]);
    }
  }, [responseMessage]);
  useEffect(() => {
    const fetchData = async () => {
      if (studentTools.length === 0) {
        await dispatch(loadTools());
      }
      setLoadingTool(false);
    };

    fetchData();
  }, [dispatch, studentTools.length]);

  useEffect(() => {
    const countryList = Country.getAllCountries().map(
      (country) => country.name
    );
    setCountries(countryList);
  }, []);

  useEffect(() => {
    if (!loadingTool) {
      const selectedTool = studentTools.find((t) => t.slug === slug);
      setTool(selectedTool);

      if (selectedTool?.req_param) {
        try {
          const initialFields = JSON.parse(selectedTool.req_param);
          delete initialFields.serviceId;
          setFormData({ ...initialFields, grade: "University" });

          if (studentTools.length > 0) {
            const tool = studentTools.find((t) => t.slug === slug);
            if (!tool) return;

            const reqParams = JSON.parse(tool.req_param);
            const labels = JSON.parse(tool.label);

            const fields = Object.keys(reqParams).map((key, index) => {
              const label = Object.keys(labels)[index];
              return {
                name: key,
                label: label || "",
                placeholder: labels[label] || "",
              };
            });

            setFormFields(fields);
          }
        } catch (error) {
          console.error("Failed to parse req_param:", error);
        }
      }
    }
  }, [slug, studentTools, loadingTool]);

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
      initial: true,
      prompt: tool.prompt,
      purpose: tool.purpose,
      serviceId: tool.service_id,
      ...formData,
    };

    const markdownToPlainText = async (markdown: string): Promise<string> => {
      const html = await marked(markdown);
      return html.replace(/<[^>]*>?/gm, "");
    };

    setIsSubmitting(true);
    try {
      const response = await submitStudentToolData(data);
      const plainTextResponse = await markdownToPlainText(response.data.data);

      setResponseMessage(response.data.data);
      setTunedResponseMessage(plainTextResponse);
      const imageUrl = plainTextResponse;
      const quotedImageUrl = `${imageUrl}`;
      setImageUrl(quotedImageUrl);
      //console.log(quotedImageUrl);
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

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "user", text: currentMessage },
    ]);

    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "bot", text: "Generating response..." },
    ]);
    const user = JSON.parse(localStorage.getItem("ai-teacha-user") || "{}");
    const user_Id = user?.id;

    const messageData: SubmitToolData = {
      description: currentMessage,
      user_id: user_Id,
      initial: false,
      prompt: tool.prompt,
      purpose: tool.purpose,
      serviceId: tool.service_id,
    };
    const markdownToPlainText = async (markdown: string): Promise<string> => {
      const html = await marked(markdown);
      return html.replace(/<[^>]*>?/gm, "");
    };

    try {
      const response = await submitStudentToolData(messageData);

      const plainTextResponse = await markdownToPlainText(response.data.data);
      setMessages((prevMessages) => [
        ...prevMessages.slice(0, prevMessages.length - 1),
        { type: "bot", text: plainTextResponse },
      ]);
    } catch (error: any) {
      // setResponseMessage(error.message || "Failed to submit tool data.");
      // setToastMessage("Failed to submit tool data.");
      // setToastVariant("destructive");
      setMessages((prevMessages) => [
        ...prevMessages.slice(0, prevMessages.length - 1),
        { type: "bot", text: error },
      ]);
    } finally {
      setIsSubmitting(false);
      setShowToast(true);
    }

    setCurrentMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
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

  if (studentLoading || loadingTool) {
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
    <div className="bg-gradient-to-b from-[#EFE6FD] to-[#ebdcea] w-full overflow-hidden h-screen">
      <ToastProvider>
        <div className="mt-12 px-2">
          <div className="flex justify-center items-center w-full">
            {!responseMessage ? (
              <div className="">
                <div className="flex justify-center gap-2 pb-5">
                  <div>
                    {tool.thumbnail ? (
                      <img
                        src={
                          tool.thumbnail.startsWith("http")
                            ? tool.thumbnail
                            : `https://${tool.thumbnail}`
                        }
                        alt={tool.name || "Tool Thumbnail"}
                        className="w-12 h-12 object-cover rounded-full border-4 border-white"
                      />
                    ) : (
                      <FaHeart className="text-[#6200EE] w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center" />
                    )}
                  </div>

                  <div className="flex flex-col mt-2">
                    <h2 className="text-lg font-semibold capitalize">
                      {tool.name === "math calculator" ? "Solver" : tool.name}
                    </h2>

                    {/* {selectedTool && (
                      <p className="text-sm text-[#6200EE] -mt-3 transition-all duration-300 ease-in-out">
                        Generate {tool.name}
                      </p>
                    )} */}
                  </div>
                </div>
                <p className="mb-6">{tool.description}</p>

                <div>
                  <button
                    className="flex items-center ml-[40%] bg-[#6200EE] rounded-full px-6 py-2 text-white w-fit h-full gap-3 mb-4"
                    onClick={() => navigate(-1)}
                  >
                    Go Back
                  </button>

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4 bg-white p-6 rounded-2xl"
                    id="toolForm"
                  >
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
                        {field.name === "country" &&
                          tool.req_param?.includes("country") && (
                            <div>
                              <Label>{field.label}</Label>
                              <Select onValueChange={handleCountryChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Country" />
                                </SelectTrigger>
                                <SelectContent>
                                  {countries.map((countryName) => (
                                    <SelectItem
                                      key={countryName}
                                      value={countryName}
                                    >
                                      {countryName}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        {field.name === "subject" && (
                          <div>
                            <Label>{field.label}</Label>
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
                                placeholder={
                                  field.placeholder || `enter ${field.name}`
                                }
                                value={formData.subject || ""}
                                onChange={handleInputChange}
                              />
                            )}
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

                        {field.name !== "grade" &&
                          field.name !== "country" &&
                          field.name !== "activitytype" &&
                          field.name !== "subject" && (
                            <div>
                              <label className="capitalize">
                                {field.label}
                              </label>

                              <Input
                                type="text"
                                name={field.name}
                                value={formData[field.name] || ""}
                                placeholder={
                                  field.placeholder || `enter ${field.label}`
                                }
                                onChange={handleInputChange}
                              />
                            </div>
                          )}
                      </div>
                    ))}
                  </form>
                </div>

                <button
                  type="submit"
                  // variant={"gradient"}
                  form="toolForm"
                  className={`text-white bg-[#6200EE] py-3 px-4 rounded-full w-full mt-10 mb-20 flex justify-center items-center gap-2 transition ${
                    isSubmitting ? "opacity-80 cursor-not-allowed" : ""
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                      Generating...
                    </>
                  ) : (
                    "Generate"
                  )}
                </button>
              </div>
            ) : (
              <div className="">
                <div className="flex justify-center gap-2 pt-10 pb-5">
                  <div>
                    {tool.thumbnail ? (
                      <img
                        src={
                          tool.thumbnail.startsWith("http")
                            ? tool.thumbnail
                            : `https://${tool.thumbnail}`
                        }
                        alt={tool.name || "Tool Thumbnail"}
                        className="w-12 h-12 object-cover rounded-full border-4 border-white"
                      />
                    ) : (
                      <FaHeart className="text-[#6200EE] w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center" />
                    )}
                  </div>

                  <div className="flex flex-col mt-2">
                    <h2 className="text-[16px] font-semibold capitalize">
                      {tool.name === "math calculator" ? "Solver" : tool.name}
                    </h2>
                  </div>
                </div>

                <button
                  className="flex items-center ml-[40%] bg-[#6200EE] rounded-full px-6 py-2 text-white w-fit h-full gap-3 mb-4"
                  onClick={() => navigate(-1)}
                >
                  Go Back
                </button>
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
                        className="bg-[#6200EE] text-white py-2 px-6 rounded-full mr-4"
                      >
                        Download Image
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col items-center w-full bg-white p-4 rounded-2xl shadow-md">
                      <div className="lg:w-full bg-white border border-gray-300 rounded-lg flex-grow overflow-y-auto h-[280px] shadow-inner p-4">
                        {messages.map((msg, index) => (
                          <div
                            key={index}
                            className={`flex items-start mb-2 ${
                              msg.type === "user"
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div
                              className={`lg:w-full p-3 text-sm  ${
                                msg.type === "user"
                                  ? "bg-[#6200EE] text-white rounded-tl-lg"
                                  : "bg-white text-black rounded-tr-lg"
                              }`}
                            >
                              <MarkdownRenderer
                                content={msg.text}
                                className="markdown-content"
                              />
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>

                      <div className="flex w-full mt-4 space-x-2">
                        <TextArea
                          value={currentMessage}
                          onKeyDown={handleKeyDown}
                          onChange={(e) => setCurrentMessage(e.target.value)}
                          className="flex-grow p-2 border border-gray-300 rounded-lg"
                          placeholder="Type your message..."
                        />
                        <button
                          onClick={sendMessage}
                          // variant={"gradient"}
                          className=" py-2 px-4 bg-[#6200EE] text-white rounded-full"
                        >
                          <FiSend className="text-white" />
                        </button>
                      </div>

                      {messages.length > 0 && (
                        <div className="flex justify-end w-full mt-4 space-x-2">
                          <button
                            onClick={() => {
                              const doc = new jsPDF();
                              doc.text(
                                messages
                                  .map(
                                    (msg) =>
                                      `${
                                        msg.type === "user" ? "You" : "Bot"
                                      }: ${msg.text}`
                                  )
                                  .join("\n"),
                                10,
                                10
                              );
                              doc.save("response.pdf");
                            }}
                            className="bg-[#6200EE] text-white py-2 px-6 rounded-full text-sm"
                          >
                            PDF
                          </button>
                          <button
                            onClick={handleSave}
                            className="border border-[#6200EE] text-[#6200EE] py-2 px-6 rounded-full text-sm"
                            disabled={saving}
                          >
                            {saving ? "Saving..." : "Save"}
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
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
    </div>
  );
};

export default StudentToolDetail;
