import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  FiSend,
  FiCopy,
  FiMic,
  FiVolume2,
  FiPause,
  FiX,
  FiPaperclip,
  FiMoreVertical,
} from "react-icons/fi";
import { TextArea } from "../../components/ui/TextArea";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "../../components/ui/Dialogue";
import { Switch } from "../../components/ui/Switch";
import { motion } from "framer-motion";
import { sendChatMessage } from "../../api/chat";
import MarkdownRenderer from "./_components/MarkdownRenderer";
import {
  SpeechRecognition,
  SpeechRecognitionEvent,
  SpeechRecognitionResultList,
} from "../../interfaces";
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.min.js`;
import mammoth from "mammoth";
import Cookies from "js-cookie";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/Select";
import { useNavigate } from "react-router-dom";

const randomPrompts = [
  "Generate lesson plans for teachers",
  "Help students with homework explanations",
  "Create engaging classroom activities",
  "Provide study tips for exams",
];

const Chat = () => {
  const [inputText, setInputText] = useState("");
  const [selectedTool, setSelectedTool] = useState<string>("");
  const navigate = useNavigate();
  const prevPathRef = useRef<string | null>(null);
  const [messages, setMessages] = useState<
    { text: string; fromUser: boolean; isLoading?: boolean }[]
  >([]);
  const responseMessage = useSelector(
    (state: RootState) => state.response.message
  );
  const { tools, loading } = useSelector((state: RootState) => state.tools);

  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [useArchive, setUseArchive] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [content, setContent] = useState("");
  const [prevPath, setPrevPath] = useState<string | null>(null);
  const [sentMessages, setSentMessages] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const storedPrevPath = Cookies.get("prevPath");

    if (storedPrevPath) {
      console.log("Previous Path Found:", storedPrevPath);
      setPrevPath(storedPrevPath);

      if (responseMessage) {
        setMessages((prev) => {
          if (prev.some((msg) => msg.text === responseMessage)) return prev;
          return [...prev, { text: responseMessage, fromUser: false }];
        });
      }
    }
  }, [responseMessage]);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const fileReader = new FileReader();
    return new Promise((resolve, reject) => {
      fileReader.onload = async function () {
        const typedarray = new Uint8Array(this.result as ArrayBuffer);
        try {
          const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
          let extractedText = "";
          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .map((item: any) => item.str)
              .join(" ");
            extractedText += pageText + "\n";
          }
          resolve(extractedText);
        } catch (error) {
          reject(error);
        }
      };
      fileReader.onerror = function (error) {
        reject(error);
      };
      fileReader.readAsArrayBuffer(file);
    });
  };

  const extractTextFromDoc = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  const extractFileContent = async (file: File): Promise<string> => {
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (fileExtension === "pdf") {
      return await extractTextFromPDF(file);
    } else if (fileExtension === "doc" || fileExtension === "docx") {
      return await extractTextFromDoc(file);
    } else {
      return "";
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() && !selectedFile) return;

    if (selectedFile) {
      setUploading(true);
      for (let i = 0; i <= 100; i += 10) {
        setTimeout(() => setUploadProgress(i), i * 10);
      }
      setTimeout(() => setUploading(false), 1000);
    }

    setMessages((prev) => [
      ...prev,
      { text: inputText, fromUser: true, isLoading: false },
      { text: "Zyra is typing...", fromUser: false, isLoading: true },
    ]);
    setInputText("");

    try {
      const formData = new FormData();

      const combinedContent = responseMessage
        ? `${responseMessage}\n${
            sentMessages ? sentMessages + "\n" : ""
          }${inputText}`
        : inputText;

      formData.append("content", combinedContent);

      formData.append("content_from", "aichat");

      formData.append("use_archive", useArchive ? "true" : "false");

      if (content) {
        formData.append("document", content);
      } else if (selectedFile) {
        formData.append("document", selectedFile);
      }

      const response = await sendChatMessage(formData);
      setSentMessages((prev) => (prev ? `${prev}\n${inputText}` : inputText));

      setMessages((prev) => [
        ...prev.filter((msg) => !msg.isLoading),
        { text: response.data, fromUser: false },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev.filter((msg) => !msg.isLoading),
        { text: "An error occurred. Please try again.", fromUser: false },
      ]);
    } finally {
      setSelectedFile(null);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => {
          setCopySuccess(false);
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        alert("Failed to copy zyra response.");
      });
  };

  const preprocessText = (text: string) => {
    return text.replace(/\*\*/g, "").replace(/###/g, "").replace(/\n/g, " ");
  };
  const triggerFileInput = () => {
    document.getElementById("file-upload")?.click();
  };

  const handleTextToSpeech = (text: string) => {
    const cleanText = preprocessText(text);
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const speech = new SpeechSynthesisUtterance(cleanText);
    speech.lang = "en-US";

    speech.onend = () => setIsSpeaking(false);
    speechRef.current = speech;

    window.speechSynthesis.speak(speech);
    setIsSpeaking(true);
  };

  const toggleRecording = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);

    recognition.onresult = (
      event: SpeechRecognitionEvent & {
        resultIndex: number;
        results: SpeechRecognitionResultList;
      }
    ) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        }
      }
      setInputText((prev) => prev + finalTranscript);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (["pdf", "doc", "docx"].includes(fileExtension || "")) {
        setSelectedFile(file);
        try {
          const extractedContent = await extractFileContent(file);
          setContent((prev) => prev + "\n" + extractedContent);
          console.log(extractedContent);
        } catch (error) {
          console.error("Error extracting file content:", error);
          alert("Failed to extract content from the file.");
        }
      } else if (["jpg", "jpeg", "png", "gif"].includes(fileExtension || "")) {
        setSelectedFile(file);
      } else {
        alert(
          "Only PDF, DOC/DOCX, and image files (JPG, JPEG, PNG, GIF) are accepted."
        );
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };
  return (
    <div className="min-h-screen border-2  py-[30px]   bg-[linear-gradient(to_right,#6200EE1A_10%,#F133E11A_90%)] overflow-y-auto flex flex-col">
      <div className="flex justify-center pt-6 pb-4">
        <div className="bg-gray-100 px-5 py-1 rounded-full shadow-sm border-2 border-white flex items-center gap-2">
          <span className="font-semibold text-black">
            Tool:{" "}
            {/* {selectedTool && (
              <span className="text-blue-600 font-medium ml-1">
                {selectedTool}
              </span>
            )} */}
          </span>

          <Select
            value={selectedTool}
            onValueChange={(value) => setSelectedTool(value)}
          >
            <SelectTrigger className="border-none outline-none w-full bg-transparent text-sm font-medium">
              <SelectValue
                placeholder={loading ? "Loading tools..." : "Select Tool"}
              />
            </SelectTrigger>

            <SelectContent>
              {!loading && tools.length > 0 ? (
                tools.map((t) => (
                  <SelectItem key={t.service_id} value={t.name}>
                    {t.name}
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-gray-500 text-sm">
                  {loading ? "Loading..." : "No tools available"}
                </div>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto  rounded-lg   p-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-800 italic">
            Hi👋, welcome to <span className="font-bold">Zyra (Edubot)</span>!
            <div className="mt-4 text-sm lg:text-lg max-w-xl mx-auto text-gray-600">
              Zyra is here to assist you with educational tasks, provide
              resources, answer your questions, and help you learn better.
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex flex-col mb-2 ${
                message.fromUser ? "items-end" : "items-start"
              }`}
            >
              {!message.fromUser && (
                <div className="flex justify-end space-x-4 mb-1">
                  <button
                    onClick={() => handleCopy(message.text)}
                    className="text-gray-600 hover:text-gray-800 flex gap-1"
                  >
                    <FiCopy /> <span className="text-sm">Copy</span>
                  </button>
                  {copySuccess && (
                    <motion.div
                      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-purple-200 text-white py-2 px-4 rounded-md shadow-lg z-50"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      Zyra response copied!
                    </motion.div>
                  )}
                  <button
                    onClick={() => handleTextToSpeech(message.text)}
                    className="text-gray-600 hover:text-gray-800 flex gap-1"
                  >
                    {isSpeaking ? <FiPause /> : <FiVolume2 />}
                    <span className="text-sm">
                      {isSpeaking ? "Pause" : "Voice"}
                    </span>
                  </button>
                </div>
              )}
              <MarkdownRenderer
                content={message.text}
                className={`p-3 text-sm ${
                  message.fromUser
                    ? "bg-primary max-w-xs text-white rounded-tl-lg"
                    : "bg-gray-200 max-w-xl text-black rounded-tr-lg"
                }`}
                style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}
              />
            </motion.div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length === 0 && (
        <div className="p-4 max-w-2xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              "📚 Generate lesson plans for teachers",
              "🧑‍🏫 Help students with homework explanations",
              "🎲 Create fun classroom activities",
              "📝 Provide study tips",
            ].map((prompt, index) => (
              <button
                key={index}
                onClick={() => setInputText(prompt.replace(/^\S+\s/, ""))}
                className="bg-white/30 text-start text-base  backdrop-filter border-white backdrop-blur-1 text-black px-3 py-2 rounded-md min-h-[70px] hover:bg-gray-300"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 w-full md:w-[672px] mx-auto">
        {uploading && (
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
        <div className="w-full  relative flex items-center  rounded-lg">
          <TextArea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="w-full bg-white/30 placeholder-black  pr-16 px-3 py-2 rounded-full focus:outline-none"
          />
          {selectedFile && (
            <div className="absolute left-0 -bottom-8 flex items-center bg-blue-100 text-blue-700 text-sm px-3 py-1 m-0 rounded-md shadow-sm">
              📎 {selectedFile.name}
              <button
                onClick={removeFile}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          )}

          <Dialog>
            <DialogTrigger asChild>
              <button className="absolute right-20 bottom-3 p-[6px] mr-4 rounded-full bg-gray-200 text-black hover:bg-gray-300 transition-all">
                <FiMoreVertical className="w-5 h-5" />
              </button>
            </DialogTrigger>

            <DialogContent className="p-6 rounded-lg shadow-lg">
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Upload File
              </DialogTitle>
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept=".pdf, .doc, .docx, .jpg, .jpeg, .png, .gif"
              />
              <label
                htmlFor="file-upload"
                className="block w-full py-2 px-4 mt-4 border-2 border-dashed border-black text-center rounded-lg cursor-pointer hover:border-gray-600 transition-all"
              >
                Choose File
              </label>

              {selectedFile && (
                <p className="mt-2 text-gray-600 text-sm text-center">
                  {selectedFile.name}
                </p>
              )}

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700 font-medium">
                    Use Archive
                  </span>
                  <Switch
                    thumbColor="purple"
                    checked={useArchive}
                    onCheckedChange={(checked) => setUseArchive(checked)}
                  />
                </div>
              </div>
              <p className="text-md text-gray-500 mt-1">
                Enabling this option will use the uploaded files in your archive
                for better response.
              </p>

              <DialogClose className="mt-4 w-full py-2 px-4 bg-gray-300 text-black rounded-lg cursor-pointer text-center hover:bg-gray-400 transition-all">
                Close
              </DialogClose>
            </DialogContent>
          </Dialog>

          <button
            onClick={toggleRecording}
            className={`absolute right-14 bottom-3 p-2 rounded-full ${
              isRecording ? "bg-red-500 text-white" : "bg-gray-200 text-black"
            }`}
          >
            <FiMic />
          </button>
          <button
            onClick={handleSend}
            className="absolute right-2 bottom-3 p-2 bg-primary text-white rounded-full"
          >
            <FiSend />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
