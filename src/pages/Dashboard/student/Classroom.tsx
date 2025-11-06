// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import {
//   FiSend,
//   FiCopy,
//   FiMic,
//   FiVolume2,
//   FiPause,
//   FiX,
//   FiPaperclip,
//   FiMessageCircle,
// } from "react-icons/fi";
// import { Button } from "../../../components/ui/Button";
// import { TextArea } from "../../../components/ui/TextArea";
// import { Undo2 } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   createClassroomSuggestion,
//   fetchClassroomByIdThunk,
// } from "../../../store/slices/classroomSlice";
// import { RootState, AppDispatch } from "../../../store";
// import { motion } from "framer-motion";
// import {
//   listTranscripts,
//   getLiveClassById,
//   getTranscriptDetails,
//   getTranscriptAssessment,
// } from "../../../api/liveclass";
// import {
//   sendClassroomMessage,
//   sendClassroomToolMessage,
//   sendClassroomOutlineMessage,
// } from "../../../api/studentclassroom";
// import { sendClassroomOutlineAssessment } from "../../../api/studentassignment";
// import Drawer from "react-modern-drawer";
// import "react-modern-drawer/dist/index.css";
// import greyImg from "../../../assets/img/greyimg.avif";
// import {
//   SpeechRecognition,
//   SpeechRecognitionEvent,
//   SpeechRecognitionResultList,
// } from "../../../interfaces";
// import MarkdownRenderer from "../_components/MarkdownRenderer";
// import { useMaterialTailwindController } from "../../../context";
// import { Sidenav } from "../classrooms/components/Sidenav";
// import { markOutlineAsRead } from "../../../api/studentassignment";
// import { Routes, Route } from "react-router-dom";
// import { Cog6ToothIcon } from "@heroicons/react/24/solid";
// import {
//   DashboardNavbar,
//   Configurator,
//   Footer,
// } from "../../../components/layout";
// import { LightBulbIcon } from "@heroicons/react/24/outline";
// import { AssessmentReportItem } from "../classrooms/components/Sidenav";
// import { getOutlineAssessmentReport } from "../../../api/studentassignment";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogTitle,
//   DialogTrigger,
//   DialogHeader,
//   DialogFooter,
// } from "../../../components/ui/Dialogue";
// import { Skeleton } from "../../../components/ui/Skeleton";
// import {
//   loadClassroomChatHistory,
//   loadToolChatHistory,
// } from "../../../api/chat";
// import { sendLiveClassroomAssessmentAnswers } from "../../../api/liveclass";
// import {
//   ToastProvider,
//   Toast,
//   ToastTitle,
//   ToastViewport,
// } from "../../../components/ui/Toast";
// import { getEphemeralKey } from "../../../api/chat";
// import CallPopup from "./CallPopUp";
// import {
//   ClassroomVoiceTypelist,
//   gradeOptions,
//   languageOptions,
// } from "../tools/data";
// import VoiceIcon from "../../../assets/img/voiceIcon.svg";
// import SimulationDashboardPage from "../tools/SimulationPage";
// import StudentNavbar from "../../../components/layout/Student-Navbar";
// import { FiPlayCircle } from "react-icons/fi";
// import { button } from "@material-tailwind/react";
// import Participant from "./Particpant";
// import { FaHeart } from "react-icons/fa";
// import Avatar from "../../../assets/img/0e846ab4-992d-48b3-a818-d62a7803bd8e 1.png";
// import StudentClass from "./StudentChat";
// import { Outlet } from "react-router-dom";

// type OutlineType = {
//   name: string;
//   path: string;
//   classroomoutline_id: string;
//   assessmentStatus?: string;
//   assessments?: any[];
//   mark_as_read?: number;
// };

// const suggestedTopics = [
//   "What is climate change?",
//   "Explain the water cycle.",
//   "History of Nigeria's independence.",
//   "Basic algebra for beginners.",
//   "Photosynthesis in plants.",
// ];

// const Classroom = () => {
//   const [inputText, setInputText] = useState("");
//   const [isRecording, setIsRecording] = useState(false);
//   const [isVoiceRecording, setIsVoiceRecording] = useState(false);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [toastOpen, setToastOpen] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");

//   const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
//     "default"
//   );
//   const [showToolChat, setShowToolChat] = useState(false);
//   const [toolChatMessages, setToolChatMessages] = useState<any[]>([]);
//   const [toolChatInput, setToolChatInput] = useState("");
//   const [toolChatLoading, setToolChatLoading] = useState(false);

//   const recognitionRef = useRef<SpeechRecognition | null>(null);
//   const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
//   const [selectedTool, setSelectedTool] = useState<string | null>(null);
//   const [selectedOutline, setSelectedOutline] = useState<any>(null);
//   const [loadingHistory, setLoadingHistory] = useState(false);
//   const [errorHistory, setErrorHistory] = useState<string | null>(null);
//   const [historyPage, setHistoryPage] = useState(0);
//   const historyLimit = 40;
//   const [allHistoryLoaded, setAllHistoryLoaded] = useState(false);
//   const [loadingToolHistory, setLoadingToolHistory] = useState(false);
//   const [errorToolHistory, setErrorToolHistory] = useState<string | null>(null);
//   const [previouslySelectedTool, setPreviouslySelectedTool] = useState<
//     string | null
//   >(null);
//   const [loadedToolHistory, setLoadedToolHistory] = useState<string | null>(
//     null
//   );
//   const [toolHistoryPage, setToolHistoryPage] = useState(0);
//   const toolHistoryLimit = 40;
//   const [allToolHistoryLoaded, setAllToolHistoryLoaded] = useState(false);
//   const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
//   const [audioUrl, setAudioUrl] = useState<string | null>(null);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   // OpenAI Realtime API specific refs and states
//   const wsRef = useRef<WebSocket | null>(null);
//   const audioContextRef = useRef<AudioContext | null>(null);
//   const analyserRef = useRef<AnalyserNode | null>(null);
//   const animationFrameRef = useRef<number | null>(null);
//   const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
//   const audioWorkletNodeRef = useRef<AudioWorkletNode | null>(null);
//   const mediaStreamRef = useRef<MediaStream | null>(null);
//   const audioQueueRef = useRef<Int16Array[]>([]);
//   const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
//   const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
//   const isPlayingAudioRef = useRef(false);

//   // WebRTC specific refs and states
//   const [isSessionActive, setIsSessionActive] = useState(false);
//   const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);
//   const peerConnection = useRef<RTCPeerConnection | null>(null);
//   const audioElement = useRef<HTMLAudioElement | null>(null);
//   const [showCallPopup, setShowCallPopup] = useState(false);

//   const [messages, setMessages] = useState<{
//     [key: string]: {
//       text: string;
//       fromUser: boolean;
//       isLoading?: boolean;
//       isHistory?: boolean;
//     }[];
//   }>({ main: [] });

//   const [previousCurrentMessages, setPreviousCurrentMessages] = useState<{
//     [key: string]: { text: string; fromUser: boolean; isLoading?: boolean }[];
//   }>({ main: [] });
//   const [totalClassroomHistoryPages, setTotalClassroomHistoryPages] =
//     useState(0);
//   const [totalToolHistoryPages, setTotalToolHistoryPages] = useState(0);

//   const [userDetails, setUserDetails] = useState<any>(null);
//   const [viewState, setViewState] = useState("classroom");
//   const [welcomeMessage, setWelcomeMessage] = useState("");
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const navigate = useNavigate();
//   const { id } = useParams<{ id: string }>();
//   const dispatch = useDispatch<AppDispatch>();
//   const [loading, setLoading] = useState(false);
//   const [selectedOverview, setSelectedOverview] = useState(true);
//   const [showDialog, setShowDialog] = React.useState(false);
//   const [showGradeDialog, setShowGradeDialog] = React.useState(false);
//   const [reportData, setReportData] = React.useState<
//     AssessmentReportItem[] | null
//   >(null);

//   const [loadingGrade, setLoadingGrade] = React.useState(false);
//   const [errorGrade, setErrorGrade] = React.useState<string | null>(null);

//   const classroom = useSelector(
//     (state: RootState) => state.classrooms.selectedClassroom
//   );
//   const fetchingClassroom = useSelector(
//     (state: RootState) => state.classrooms.fetchingClassroom
//   );

//   const tools = classroom?.tools || [];
//   const chatContainerRef = useRef<HTMLDivElement>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const { controller } = useMaterialTailwindController();
//   const { sidenavType } = controller;
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [currentLiveClass, setCurrentLiveClass] = useState<any | null>(null);
//   const [allTranscriptsWithAssessments, setAllTranscriptsWithAssessments] =
//     useState<any[]>([]);
//   const [loadingLiveClassData, setLoadingLiveClassData] =
//     useState<boolean>(false);
//   const [errorLiveClassData, setErrorLiveClassData] = useState<string | null>(
//     null
//   );

//   const [isEmailVerified, setIsEmailVerified] = useState<number>(0);
//   const [studentAnswers, setStudentAnswers] = useState<{
//     [questionId: number]: string;
//   }>({});

//   const [submittingAssessment, setSubmittingAssessment] = useState(false);
//   const [submissionSuccess, setSubmissionSuccess] = useState(false);
//   const [submissionError, setSubmissionError] = useState<string | null>(null);
//   const [isAssessmentCompleted, setIsAssessmentCompleted] = useState(false);
//   const [showVoiceSettingsDialog, setShowVoiceSettingsDialog] = useState(false);
//   const [selectedVoiceType, setSelectedVoiceType] = useState("alloy");
//   const [selectedLanguage, setSelectedLanguage] = useState("English");
//   const [selectedGrade, setSelectedGrade] = useState("");
//   const timerRef = useRef<NodeJS.Timeout | null>(null);
//   const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
//   const [remainingCallTime, setRemainingCallTime] = useState(0);
//   const [outlines, setOutlines] = useState<OutlineType[]>([]);
//   const [userrole, setIsuserRole] = useState<any>();
//   const [selectedOutlines, setSelectedOutlines] = useState<any>(null);
//   const outline = (classroom?.classroomoutlines || []).map((outline) => ({
//     name: outline.classroomoutline_title,
//     path: outline.classroomoutline_content || "#",
//     classroomoutline_id: outline.classroomoutline_id,
//     assessmentStatus: outline.assessment_status,
//     assessments: outline.assessments,
//     mark_as_read: outline.mark_as_read,
//   }));
//   const { classroomTopic } = useSelector(
//     (state: RootState) => state.classrooms
//   );

//   const [isListening, setIsListening] = useState(false);

//   // 🎙 Voice-to-Text Handler
//   const handleVoiceInput = () => {
//     if (!("webkitSpeechRecognition" in window)) {
//       alert("Speech recognition is not supported in this browser.");
//       return;
//     }

//     const recognition = new (window as any).webkitSpeechRecognition();
//     recognition.lang = "en-US";
//     recognition.interimResults = false;
//     recognition.maxAlternatives = 1;

//     if (isListening) {
//       recognition.stop();
//       setIsListening(false);
//       return;
//     }

//     setIsListening(true);
//     recognition.start();

//     recognition.onresult = (event: any) => {
//       const transcript = event.results[0][0].transcript;
//       setToolChatInput((prev) => prev + (prev ? " " : "") + transcript);
//       setIsListening(false);
//     };

//     recognition.onerror = () => {
//       setIsListening(false);
//     };

//     recognition.onend = () => {
//       setIsListening(false);
//     };
//   };

//   // ✅ Load saved chat history
//   useEffect(() => {
//     const saved = localStorage.getItem(`toolChat_${selectedTool}`);
//     if (saved) {
//       setToolChatMessages(JSON.parse(saved));
//     }
//   }, [selectedTool]);

//   // ✅ Save chat history automatically
//   useEffect(() => {
//     if (toolChatMessages.length > 0 && selectedTool) {
//       localStorage.setItem(
//         `toolChat_${selectedTool}`,
//         JSON.stringify(toolChatMessages)
//       );
//     }
//   }, [toolChatMessages, selectedTool]);

//   // ✅ Auto-scroll to bottom when new messages arrive
//   useEffect(() => {
//     const chatEnd = document.getElementById("tool-chat-scroll");
//     chatEnd?.scrollTo({ top: chatEnd.scrollHeight, behavior: "smooth" });
//   }, [toolChatMessages]);

//   const MAX_CALL_DURATION_SECONDS = 30 * 60;
//   const handleOverviewClick = () => {
//     setSelectedOverview(true);

//     console.log("selectedOverview", selectedOverview);
//   };

//   const [showTopicPopup, setShowTopicPopup] = useState(false);
//   // useEffect(() => {
//   //   if (messagesEndRef.current) {
//   //     messagesEndRef.current.scrollIntoView();
//   //   }
//   // }, [messages, selectedTool]);

//   useEffect(() => {
//     const userDetailsFromStorage = localStorage.getItem("ai-teacha-user");
//     if (userDetailsFromStorage) {
//       const parsedDetails = JSON.parse(userDetailsFromStorage);
//       setUserDetails(parsedDetails);
//     }
//   }, []);

//   useEffect(() => {
//     if (outline.length > 0 && !selectedOutlines) {
//       setSelectedOutlines(outlines[0]);
//     }
//   }, [outlines]);

//   const playNextAudioChunk = useCallback(() => {
//     if (
//       !audioContextRef.current ||
//       !isPlayingAudioRef.current ||
//       audioQueueRef.current.length === 0
//     ) {
//       return;
//     }

//     const chunk = audioQueueRef.current.shift();
//     if (!chunk) return;

//     const audioBuffer = audioContextRef.current.createBuffer(
//       1,
//       chunk.length,
//       audioContextRef.current.sampleRate
//     );
//     const float32Data = audioBuffer.getChannelData(0);

//     for (let i = 0; i < chunk.length; i++) {
//       float32Data[i] = chunk[i] / 32768.0;
//     }

//     audioSourceRef.current = audioContextRef.current.createBufferSource();
//     audioSourceRef.current.buffer = audioBuffer;
//     audioSourceRef.current.connect(audioContextRef.current.destination);

//     audioSourceRef.current.onended = () => {
//       if (isPlayingAudioRef.current) {
//         playNextAudioChunk();
//       }
//     };

//     audioSourceRef.current.start();
//   }, []);

//   useEffect(() => {
//     if (!classroom) return;
//     dispatch(
//       createClassroomSuggestion({
//         description: classroom.classroom_description || "",
//         grade: classroom.grade || "",
//         classroom_id: classroom.classroom_id || "",
//         classroom_content: classroom.content || "",
//         outline_title: classroom.classroomoutlines || "",
//         outline_content: classroom.classroomoutlines || "",
//       })
//     );
//   }, [classroom]);

//   useEffect(() => {
//     if (!classroom) return;

//     let intervalId: NodeJS.Timeout;

//     const initialTimeout = setTimeout(() => {
//       dispatch(
//         createClassroomSuggestion({
//           description: classroom.classroom_description || "",
//           grade: classroom.grade || "",
//           classroom_id: classroom.classroom_id || "",
//           classroom_content: classroom.content || "",
//           outline_title: classroom.classroomoutlines || "",
//           outline_content: classroom.classroomoutlines || "",
//         })
//       );

//       setShowTopicPopup(true);

//       intervalId = setInterval(() => {
//         dispatch(
//           createClassroomSuggestion({
//             description: classroom.classroom_description || "",
//             grade: classroom.grade || "",
//             classroom_id: classroom.classroom_id || "",
//             classroom_content: classroom.content || "",
//             outline_title: classroom.classroomoutlines || "",
//             outline_content: classroom.classroomoutlines || "",
//           })
//         );

//         setShowTopicPopup(true);
//       }, 10 * 60 * 1000);
//     }, 60 * 1000);

//     return () => {
//       clearTimeout(initialTimeout);
//       clearInterval(intervalId);
//     };
//   }, [classroom, dispatch]);

//   useEffect(() => {
//     if (!audioContextRef.current) {
//       audioContextRef.current = new (window.AudioContext ||
//         (window as any).webkitAudioContext)();
//     }
//     if (!analyserRef.current) {
//       analyserRef.current = audioContextRef.current.createAnalyser();
//       analyserRef.current.fftSize = 256;
//     }

//     return () => {
//       if (animationFrameRef.current) {
//         cancelAnimationFrame(animationFrameRef.current);
//       }
//       if (
//         mediaRecorderRef.current &&
//         mediaRecorderRef.current.state !== "inactive"
//       ) {
//         mediaRecorderRef.current.stop();
//       }
//       if (sourceNodeRef.current) {
//         sourceNodeRef.current.disconnect();
//         sourceNodeRef.current = null;
//       }
//       if (audioWorkletNodeRef.current) {
//         audioWorkletNodeRef.current.disconnect();
//         audioWorkletNodeRef.current = null;
//       }
//       if (wsRef.current) {
//         wsRef.current.close();
//         wsRef.current = null;
//       }
//       if (mediaStreamRef.current) {
//         mediaStreamRef.current.getTracks().forEach((track) => track.stop());
//         mediaStreamRef.current = null;
//       }
//       if (audioSourceRef.current) {
//         audioSourceRef.current.stop();
//         audioSourceRef.current.disconnect();
//         audioSourceRef.current = null;
//       }
//       isPlayingAudioRef.current = false;
//       audioQueueRef.current = [];

//       if (
//         audioContextRef.current &&
//         audioContextRef.current.state !== "closed"
//       ) {
//         audioContextRef.current
//           .close()
//           .catch((e) => console.error("Error closing AudioContext:", e));
//         audioContextRef.current = null;
//       }
//       analyserRef.current = null;
//     };
//   }, []);

//   useEffect(() => {
//     const userDetailsFromStorage = localStorage.getItem("ai-teacha-user");
//     if (userDetailsFromStorage) {
//       if (userDetailsFromStorage) {
//         const parsedDetails = JSON.parse(userDetailsFromStorage);
//         setUserDetails(parsedDetails);
//         setIsuserRole(parsedDetails.role_id || parsedDetails.role);
//       }
//     }
//   }, []);

//   const drawVisualization = () => {
//     const canvas = canvasRef.current;
//     const analyser = analyserRef.current;

//     if (!canvas || !analyser) {
//       return;
//     }

//     const canvasCtx = canvas.getContext("2d");
//     if (!canvasCtx) {
//       return;
//     }
//     console.log("Wave visualization started.");
//     const bufferLength = analyser.frequencyBinCount;
//     const dataArray = new Uint8Array(bufferLength);

//     const draw = () => {
//       animationFrameRef.current = requestAnimationFrame(draw);

//       if (!isVoiceRecording || !analyser) {
//         canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
//         return;
//       }

//       analyser.getByteFrequencyData(dataArray);

//       canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
//       canvasCtx.fillStyle = "rgb(0, 0, 0)";
//       canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

//       const barWidth = (canvas.width / bufferLength) * 2.5;
//       let x = 0;

//       for (let i = 0; i < bufferLength; i++) {
//         const barHeight = dataArray[i];

//         canvasCtx.fillStyle = "rgb(" + (barHeight + 100) + ",50,50)";
//         canvasCtx.fillRect(
//           x,
//           canvas.height - barHeight / 2,
//           barWidth,
//           barHeight / 2
//         );

//         x += barWidth + 1;
//       }
//     };

//     draw();
//   };
//   const startAudioRecording = async (
//     voiceType: string,
//     language: string,
//     grade: string
//   ) => {
//     if (!navigator.mediaDevices || !window.RTCPeerConnection || !window.Audio) {
//       alert("Your browser does not support WebRTC or audio.");
//       return;
//     }

//     if (isSessionActive) {
//       console.log("Session already active.");
//       return;
//     }

//     setSubmittingAssessment(true);
//     setSubmissionError(null);
//     setShowCallPopup(true);
//     setShowVoiceSettingsDialog(false);

//     try {
//       const outlineTitlesString = classroom?.classroomoutlines
//         ?.map((outline) => outline.classroomoutline_title)
//         .filter(Boolean)
//         .join(", ");

//       const tokenResponse = await getEphemeralKey({
//         voice_type: voiceType,
//         language: language,
//         grade: grade,
//         description: classroom?.class_intro || "",
//         topics: outlineTitlesString || "",
//       });
//       const EPHEMERAL_KEY = tokenResponse.data.client_secret.value;

//       const pc = new RTCPeerConnection();
//       peerConnection.current = pc;

//       pc.onconnectionstatechange = () => {
//         console.log("Peer Connection State:", pc.connectionState);
//         if (
//           pc.connectionState === "disconnected" ||
//           pc.connectionState === "failed" ||
//           pc.connectionState === "closed"
//         ) {
//           console.warn("Peer connection no longer active, ensuring cleanup.");
//           if (isSessionActive) {
//             stopAudioRecording();
//           }
//         }
//       };

//       if (!audioElement.current) {
//         audioElement.current = new Audio();
//         audioElement.current.autoplay = true;
//         audioElement.current.onerror = (e) => {
//           console.error("Audio element error:", e);
//           setToastMessage("Audio playback error. Please try again.");
//           setToastVariant("destructive");
//           setToastOpen(true);
//         };
//       }
//       pc.ontrack = (e) => {
//         if (audioElement.current) {
//           audioElement.current.srcObject = e.streams[0];
//           setIsSpeaking(true);
//           audioElement.current.onended = () => setIsSpeaking(false);
//         }
//       };

//       const mediaStream = await navigator.mediaDevices.getUserMedia({
//         audio: true,
//       });
//       mediaStreamRef.current = mediaStream;
//       mediaStream
//         .getTracks()
//         .forEach((track) => pc.addTrack(track, mediaStream));

//       const dc = pc.createDataChannel("oai-events");
//       setDataChannel(dc);

//       const offer = await pc.createOffer();
//       await pc.setLocalDescription(offer);

//       const baseUrl = "https://api.openai.com/v1/realtime";
//       const model = "gpt-4o-realtime-preview-2024-12-17";
//       const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
//         method: "POST",
//         body: offer.sdp,
//         headers: {
//           Authorization: `Bearer ${EPHEMERAL_KEY}`,
//           "Content-Type": "application/sdp",
//         },
//       });

//       const answer: RTCSessionDescriptionInit = {
//         type: "answer",
//         sdp: await sdpResponse.text(),
//       };
//       await pc.setRemoteDescription(answer);

//       setIsVoiceRecording(true);
//       setSubmittingAssessment(false);

//       dc.onmessage = (e) => {
//         const event = JSON.parse(e.data);
//         switch (event.type) {
//           case "response.audio_transcript.delta": {
//             setMessages((prev) => {
//               const currentKey = selectedTool ? selectedTool : "main";
//               const currentMessagesForDisplay = [...(prev[currentKey] || [])];
//               const lastMessage =
//                 currentMessagesForDisplay[currentMessagesForDisplay.length - 1];

//               if (lastMessage && !lastMessage.fromUser) {
//                 if (lastMessage.isLoading) {
//                   lastMessage.text = event.delta;
//                   lastMessage.isLoading = false;
//                 } else {
//                   lastMessage.text += event.delta;
//                 }
//               } else {
//                 currentMessagesForDisplay.push({
//                   text: event.delta,
//                   fromUser: false,
//                   isLoading: false,
//                 });
//               }
//               return { ...prev, [currentKey]: currentMessagesForDisplay };
//             });
//             break;
//           }
//           case "response.done": {
//             setMessages((prev) => {
//               const currentKey = selectedTool ? selectedTool : "main";
//               return {
//                 ...prev,
//                 [currentKey]: (prev[currentKey] || []).map((msg) =>
//                   msg.isLoading ? { ...msg, isLoading: false } : msg
//                 ),
//               };
//             });
//             break;
//           }
//           case "conversation.item.created": {
//             if (event.item.type === "message" && event.item.role === "user") {
//               const userTranscript = event.item.content[0]?.text;
//               if (userTranscript) {
//                 setMessages((prev) => {
//                   const currentKey = selectedTool ? selectedTool : "main";
//                   const filteredMessages = (prev[currentKey] || []).filter(
//                     (msg) => !(msg.fromUser && msg.isLoading)
//                   );
//                   return {
//                     ...prev,
//                     [currentKey]: [
//                       ...filteredMessages,
//                       {
//                         text: userTranscript,
//                         fromUser: true,
//                         isLoading: false,
//                       },
//                     ],
//                   };
//                 });
//               }
//             }
//             break;
//           }
//           case "error": {
//             console.error("OpenAI WebRTC Error:", event);
//             setToastMessage(
//               `OpenAI Error: ${event.message || "An unknown error occurred."}`
//             );
//             setToastVariant("destructive");
//             setToastOpen(true);
//             stopAudioRecording();
//             break;
//           }
//           default: {
//             console.log(
//               "Unhandled OpenAI event (DataChannel):",
//               event.type,
//               event
//             );
//           }
//         }
//       };

//       dc.onopen = () => {
//         setIsSessionActive(true);
//         setMessages((prev) => ({ ...prev, [getMessageKey()]: [] }));

//         setRemainingCallTime(MAX_CALL_DURATION_SECONDS);
//         countdownIntervalRef.current = setInterval(() => {
//           setRemainingCallTime((prevTime) => {
//             if (prevTime <= 1) {
//               clearInterval(countdownIntervalRef.current as NodeJS.Timeout);
//               countdownIntervalRef.current = null;
//               return 0;
//             }
//             return prevTime - 1;
//           });
//         }, 1000);

//         timerRef.current = setTimeout(() => {
//           console.log("30-minute timer expired. Ending call...");
//           stopAudioRecording();
//           setToastMessage("Your voice session has ended after 30 minutes.");
//           setToastVariant("default");
//           setToastOpen(true);
//         }, MAX_CALL_DURATION_SECONDS * 1000);

//         drawVisualization();
//       };

//       dc.onclose = () => {
//         console.log("Data Channel Closed.");
//         stopAudioRecording();
//       };

//       dc.onerror = (error) => {
//         console.error("Data Channel Error:", error);
//         setToastMessage("Data channel error. Please try again.");
//         setToastVariant("destructive");
//         setToastOpen(true);
//         stopAudioRecording();
//       };
//     } catch (err: any) {
//       console.error("Error starting WebRTC session:", err);
//       setSubmissionError(
//         err.message ||
//           "Failed to start WebRTC session. Check microphone permissions."
//       );
//       setToastMessage(
//         err.message ||
//           "Failed to start WebRTC session. Check microphone permissions."
//       );
//       setToastVariant("destructive");
//       setToastOpen(true);
//       setSubmittingAssessment(false);
//       stopAudioRecording();
//     }
//   };

//   const stopAudioRecording = () => {
//     console.log("Stopping WebRTC session...");

//     if (timerRef.current) {
//       clearTimeout(timerRef.current);
//       timerRef.current = null;
//       console.log("Call duration auto-end timer cleared.");
//     }
//     if (countdownIntervalRef.current) {
//       clearInterval(countdownIntervalRef.current);
//       countdownIntervalRef.current = null;
//       console.log("Countdown interval cleared.");
//     }
//     setRemainingCallTime(0);

//     if (dataChannel) {
//       dataChannel.close();
//       setDataChannel(null);
//     }

//     if (peerConnection.current) {
//       peerConnection.current.getSenders().forEach((sender) => {
//         if (sender.track) {
//           sender.track.stop();
//         }
//       });
//       peerConnection.current.close();
//       peerConnection.current = null;
//     }

//     if (audioElement.current) {
//       audioElement.current.pause();
//       audioElement.current.srcObject = null;
//     }

//     if (mediaStreamRef.current) {
//       mediaStreamRef.current.getTracks().forEach((track) => track.stop());
//       mediaStreamRef.current = null;
//     }

//     setIsSessionActive(false);
//     setIsVoiceRecording(false);
//     setIsSpeaking(false);
//     setShowCallPopup(false);

//     if (animationFrameRef.current) {
//       cancelAnimationFrame(animationFrameRef.current);
//       animationFrameRef.current = null;
//     }

//     audioQueueRef.current = [];
//     isPlayingAudioRef.current = false;
//     if (audioSourceRef.current) {
//       try {
//         audioSourceRef.current.stop();
//         audioSourceRef.current.disconnect();
//       } catch (e) {
//         console.warn("AudioSourceNode already stopped or not connected:", e);
//       } finally {
//         audioSourceRef.current = null;
//       }
//     }
//     if (audioContextRef.current && audioContextRef.current.state !== "closed") {
//       audioContextRef.current
//         .close()
//         .catch((e) => console.error("Error closing AudioContext:", e));
//       audioContextRef.current = null;
//     }
//     analyserRef.current = null;

//     console.log("WebRTC Session stopped.");
//   };
//   useEffect(() => {
//     if (!audioContextRef.current) {
//       audioContextRef.current = new (window.AudioContext ||
//         (window as any).webkitAudioContext)();
//     }
//     if (!analyserRef.current) {
//       analyserRef.current = audioContextRef.current.createAnalyser();
//       analyserRef.current.fftSize = 256;
//     }

//     return () => {
//       if (animationFrameRef.current) {
//         cancelAnimationFrame(animationFrameRef.current);
//       }
//       if (
//         mediaRecorderRef.current &&
//         mediaRecorderRef.current.state !== "inactive"
//       ) {
//         mediaRecorderRef.current.stop();
//       }
//       if (sourceNodeRef.current) {
//         sourceNodeRef.current.disconnect();
//         sourceNodeRef.current = null;
//       }
//       if (audioWorkletNodeRef.current) {
//         audioWorkletNodeRef.current.disconnect();
//         audioWorkletNodeRef.current = null;
//       }
//       if (wsRef.current) {
//         wsRef.current.close();
//         wsRef.current = null;
//       }
//       if (mediaStreamRef.current) {
//         mediaStreamRef.current.getTracks().forEach((track) => track.stop());
//         mediaStreamRef.current = null;
//       }
//       if (audioSourceRef.current) {
//         audioSourceRef.current.stop();
//         audioSourceRef.current.disconnect();
//         audioSourceRef.current = null;
//       }
//       isPlayingAudioRef.current = false;
//       audioQueueRef.current = [];

//       if (
//         audioContextRef.current &&
//         audioContextRef.current.state !== "closed"
//       ) {
//         audioContextRef.current
//           .close()
//           .catch((e) => console.error("Error closing AudioContext:", e));
//         audioContextRef.current = null;
//       }
//       analyserRef.current = null;
//     };
//   }, []);

//   useEffect(() => {
//     if (id) {
//       dispatch(fetchClassroomByIdThunk(Number(id)));
//     }
//   }, [dispatch, id]);

//   useEffect(() => {
//     if (!classroom) {
//       setIsAssessmentCompleted(false);
//       setStudentAnswers({});
//       return;
//     }
//     const completed = classroom.liveclassassessment_status === "submitted";
//     setIsAssessmentCompleted(completed);

//     if (
//       completed ||
//       classroom.liveclassroomassessments.some(
//         (q) => q.liveclassroomassessment_student_answer !== null
//       )
//     ) {
//       const initialAnswers: { [key: number]: string } = {};
//       classroom.liveclassroomassessments.forEach((q) => {
//         if (q.liveclassroomassessment_student_answer !== null) {
//           initialAnswers[q.liveclassroomassessment_id] =
//             q.liveclassroomassessment_student_answer;
//         }
//       });
//       setStudentAnswers(initialAnswers);
//     }
//   }, [classroom]);

//   useEffect(() => {
//     return () => {
//       if (animationFrameRef.current) {
//         cancelAnimationFrame(animationFrameRef.current);
//       }
//       if (audioContextRef.current) {
//         audioContextRef.current
//           .close()
//           .catch((e) => console.error("Error closing AudioContext:", e));
//         audioContextRef.current = null;
//       }
//       if (
//         mediaRecorderRef.current &&
//         mediaRecorderRef.current.state !== "inactive"
//       ) {
//         mediaRecorderRef.current.stop();
//       }
//       if (sourceNodeRef.current) {
//         sourceNodeRef.current.disconnect();
//       }
//     };
//   }, []);

//   // console.log("selectedtools",selectedTool)

//   useEffect(() => {
//     let newMessage: string = classroom?.content || "";
//     console.log("selectedOverview", selectedOverview);
//     if (selectedOverview) {
//       if (!newMessage) {
//         newMessage = `Hi👋 ${
//           userDetails?.firstname || "there"
//         }, welcome to class "<strong>${
//           classroom?.classroom_name || "the classroom"
//         }</strong>." Start your conversation here!`;
//       }
//     } else if (newMessage && selectedTool) {
//       newMessage = `Hi👋 ${
//         userDetails?.firstname || "there"
//       }, welcome to <strong>${selectedTool}</strong>. Start your conversation here!`;
//     } else if (newMessage && selectedOutline) {
//       newMessage = selectedOutline.path || "Welcome to the selected outline.";
//     } else if (!newMessage && selectedOutline) {
//       newMessage = selectedOutline.path || "Welcome to the selected outline.";
//     } else if (!newMessage) {
//       newMessage = `Hi👋 ${
//         userDetails?.firstname || "there"
//       }, welcome to class "<strong>${
//         classroom?.classroom_name || "the classroom"
//       }</strong>." Start your conversation here!`;
//     }

//     setWelcomeMessage(newMessage);
//   }, [selectedOutline, selectedTool, classroom, userDetails, selectedOverview]);

//   useEffect(() => {
//     const fetchClassroomHistory = async () => {
//       if (id && !selectedTool && !previouslySelectedTool && historyPage === 0) {
//         setLoadingHistory(true);
//         setErrorHistory(null);
//         try {
//           const historyData = await loadClassroomChatHistory(
//             Number(id),
//             historyLimit,
//             historyPage
//           );
//           if (historyData?.data && Array.isArray(historyData.data)) {
//             setMessages((prevMessages) => ({
//               ...prevMessages,
//               main: [
//                 ...historyData.data.map((msg: any) => ({
//                   text: msg.content,
//                   fromUser: msg.label === "question",
//                   isHistory: true,
//                 })),
//                 ...(prevMessages.main || []),
//               ],
//             }));
//             setTotalClassroomHistoryPages(historyData.count || 0);
//             if (
//               historyData.data.length < historyLimit ||
//               historyData.count <= 1
//             ) {
//               setAllHistoryLoaded(true);
//             }
//           } else if (historyData?.count === 0) {
//             setTotalClassroomHistoryPages(0);
//             setMessages((prevMessages) => ({ ...prevMessages, main: [] }));
//             setAllHistoryLoaded(true);
//           }
//         } catch (error: any) {
//           console.error("Error loading classroom chat history:", error);
//           setErrorHistory(error.message || "Failed to load chat history.");
//         } finally {
//           setLoadingHistory(false);
//         }
//       }
//     };

//     fetchClassroomHistory();
//   }, [id, historyPage, historyLimit, selectedTool, previouslySelectedTool]);

//   useEffect(() => {
//     const fetchToolHistory = async () => {
//       if (
//         id &&
//         selectedTool &&
//         selectedTool !== previouslySelectedTool &&
//         toolHistoryPage === 0
//       ) {
//         setLoadingToolHistory(true);
//         setErrorToolHistory(null);
//         try {
//           const tool = tools.find((t) => t.tool_name === selectedTool);
//           if (tool?.tool_id) {
//             const historyData = await loadToolChatHistory(
//               Number(id),
//               tool.tool_id,
//               toolHistoryLimit,
//               toolHistoryPage
//             );
//             if (historyData?.data && Array.isArray(historyData.data)) {
//               setMessages((prevMessages) => ({
//                 ...prevMessages,
//                 [selectedTool]: [
//                   ...historyData.data.map((msg: any) => ({
//                     text: msg.content,
//                     fromUser: msg.label === "question",
//                     isHistory: true,
//                   })),
//                   ...(prevMessages[selectedTool] || []),
//                 ],
//               }));
//               setPreviouslySelectedTool(selectedTool);
//               setTotalToolHistoryPages(historyData.count || 0);
//               if (
//                 historyData.data.length < toolHistoryLimit ||
//                 historyData.count <= 1
//               ) {
//                 setAllToolHistoryLoaded(true);
//               }
//             } else if (historyData?.count === 0) {
//               setTotalToolHistoryPages(0);
//               setMessages((prevMessages) => ({
//                 ...prevMessages,
//                 [selectedTool]: [],
//               }));
//               setAllToolHistoryLoaded(true);
//             }
//           }
//         } catch (error: any) {
//           console.error(
//             `Error loading chat history for tool ${selectedTool}:`,
//             error
//           );
//           setErrorToolHistory(
//             error.message || `Failed to load chat history for ${selectedTool}.`
//           );
//           setMessages((prevMessages) => ({
//             ...prevMessages,
//             [selectedTool]: [],
//           }));
//           setPreviouslySelectedTool(null);
//         } finally {
//           setLoadingToolHistory(false);
//         }
//       } else if (id && !selectedTool) {
//         setPreviouslySelectedTool(null);
//         const { [getMessageKey()]: _, ...rest } = messages;
//         setMessages(rest);
//         setToolHistoryPage(0);
//         setAllToolHistoryLoaded(false);
//         setErrorToolHistory(null);
//         setLoadingToolHistory(false);
//         setTotalToolHistoryPages(0);
//       }
//     };

//     fetchToolHistory();
//   }, [
//     id,
//     selectedTool,
//     tools,
//     toolHistoryPage,
//     toolHistoryLimit,
//     previouslySelectedTool,
//   ]);

//   useEffect(() => {
//     setPreviousCurrentMessages(messages);
//   }, [messages]);

//   const sendAllAnswers = (assessments: any[]) => {
//     const answerData = {
//       classroom_id: classroom?.classroom_id,
//       outline_id: selectedOutline?.classroomoutline_id,
//       answers: assessments
//         .map((assessment) => {
//           const selectedAnswer = document.querySelector(
//             `input[name="${assessment.outlineassessment_id}"]:checked`
//           ) as HTMLInputElement;

//           return {
//             outline_assessment_id: assessment.outlineassessment_id,
//             question: assessment.outlineassessment_question,
//             student_answer: selectedAnswer?.value || null,
//           };
//         })
//         .filter((answer) => answer.student_answer !== null),
//     };

//     if (answerData.answers.length === 0) {
//       alert("Please select answers for all questions.");
//       return;
//     }

//     setLoading(true);

//     sendClassroomOutlineAssessment(answerData)
//       .then((response) => {
//         console.log("Answers sent:", response);
//         setLoading(false);
//         dispatch(fetchClassroomByIdThunk(Number(id)));
//         window.location.reload();
//       })
//       .catch((error) => {
//         console.error("Error sending answers:", error);
//         setLoading(false);
//       });
//   };

//   interface MessageData {
//     classroom_id: number;
//     classname: string;
//     description: string;
//     scope_restriction: boolean;
//     grade: string;
//     student_message: string;
//     content_from: string;
//     file_content: any[];
//     tool_name?: string;
//     tool_id?: number;
//     tool_description?: string;
//     outline_content?: any;
//     outline_title?: any;
//   }

//   const getMessageKey = () => {
//     if (selectedOutline) {
//       return "outline";
//     }
//     return selectedTool || "main";
//   };

//   const currentMessages =
//     selectedOutline &&
//     (!messages["outline"] || messages["outline"].length === 0)
//       ? []
//       : messages[getMessageKey()] || [];

//   console.log("currentmessage", currentMessages, selectedOutline);

//   const previousMessages =
//     selectedOutline &&
//     (!previousCurrentMessages["outline"] ||
//       previousCurrentMessages["outline"].length === 0)
//       ? []
//       : previousCurrentMessages[getMessageKey()]?.slice(
//           0,
//           -currentMessages.length
//         ) || [];

//   const handleMarkAsRead = async (outlineId: number) => {
//     if (!classroom) return;

//     setLoading(true);
//     try {
//       await markOutlineAsRead(outlineId, classroom.classroom_id);
//       setSelectedOutline({ ...selectedOutline, mark_as_read: 1 });
//       window.location.reload();
//     } catch (error) {
//       console.error("Error marking outline as read:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleSend = async () => {
//     if (!inputText.trim()) return;
//     setSelectedOutline(null);
//     setSelectedOverview(false);
//     let currentKey = selectedOverview
//       ? "main"
//       : selectedTool
//       ? selectedTool
//       : "main";
//     console.log(currentKey);

//     setMessages((prev) => ({
//       ...prev,
//       [currentKey]: [
//         ...(prev[currentKey] || []),
//         { text: inputText, fromUser: true, isLoading: false },
//       ],
//     }));

//     setInputText("");

//     setMessages((prev) => ({
//       ...prev,
//       [currentKey]: [
//         ...(prev[currentKey] || []),
//         {
//           text: `${classroom?.author} AI Assistant typing...`,
//           fromUser: false,
//           isLoading: true,
//         },
//       ],
//     }));

//     let messageData: MessageData = selectedTool
//       ? {
//           classroom_id: classroom?.classroom_id || 0,
//           classname: classroom?.classroom_name || "",
//           description: classroom?.classroom_description || "",
//           scope_restriction: classroom?.scope_restriction || true,
//           grade: classroom?.grade || "",
//           student_message: inputText,
//           content_from: "classroom_tools",
//           file_content:
//             classroom?.classroomresources?.map(
//               (resource) => resource.file_content
//             ) || [],
//           tool_name: selectedTool || "",
//           tool_id:
//             tools.find((tool) => tool.tool_name === selectedTool)?.tool_id || 0,
//           tool_description:
//             tools.find((tool) => tool.tool_name === selectedTool)
//               ?.tool_description || "",
//         }
//       : {
//           classroom_id: classroom?.classroom_id || 0,
//           classname: classroom?.classroom_name || "",
//           scope_restriction: classroom?.scope_restriction || true,
//           description: classroom?.classroom_description || "",
//           grade: classroom?.grade || "",
//           file_content: classroom?.classroomresources
//             ? classroom.classroomresources.map(
//                 (resource) => resource.file_content
//               ) || []
//             : [],
//           student_message: inputText,
//           content_from: "classroom",
//         };

//     if (selectedOutline) {
//       messageData = {
//         ...messageData,
//         outline_content: selectedOutline?.path || "",
//         outline_title: selectedOutline?.name || "",
//       };
//     }

//     let response: any;

//     try {
//       if (selectedOutline) {
//         currentKey = "main";
//         response = await sendClassroomOutlineMessage(messageData);
//       } else {
//         response = selectedTool
//           ? await sendClassroomToolMessage(messageData)
//           : await sendClassroomMessage(messageData);
//       }

//       setMessages((prev) => ({
//         ...prev,
//         [currentKey]: [
//           ...(prev[currentKey] || []).filter((msg) => !msg.isLoading),
//           { text: response.data, fromUser: false },
//         ],
//       }));
//     } catch (error) {
//       console.error("Error sending message:", error);
//       setMessages((prev) => ({
//         ...prev,
//         [currentKey]: [
//           ...(prev[currentKey] || []).filter((msg) => !msg.isLoading),
//           {
//             text: "An error occurred. Please try again later.",
//             fromUser: false,
//           },
//         ],
//       }));
//     }
//   };

//   const handleSendTopic = async () => {
//     if (!classroomTopic?.trim()) return;

//     setSelectedOutline(null);
//     setSelectedOverview(false);

//     const currentKey = selectedOverview
//       ? "main"
//       : selectedTool
//       ? selectedTool
//       : "main";

//     setSelectedOutline(null);
//     console.log(currentKey);

//     setMessages((prev) => ({
//       ...prev,
//       [currentKey]: [
//         ...(prev[currentKey] || []),
//         { text: classroomTopic, fromUser: true, isLoading: false },
//       ],
//     }));

//     setMessages((prev) => ({
//       ...prev,
//       [currentKey]: [
//         ...(prev[currentKey] || []),
//         {
//           text: `${classroom?.author} AI Assistant typing...`,
//           fromUser: false,
//           isLoading: true,
//         },
//       ],
//     }));

//     let messageData: MessageData = selectedTool
//       ? {
//           classroom_id: classroom?.classroom_id || 0,
//           classname: classroom?.classroom_name || "",
//           description: classroom?.classroom_description || "",
//           scope_restriction: classroom?.scope_restriction ?? true,
//           grade: classroom?.grade || "",
//           student_message: classroomTopic,
//           content_from: "classroom_tools",
//           file_content:
//             classroom?.classroomresources?.map(
//               (resource) => resource.file_content
//             ) || [],
//           tool_name: selectedTool,
//           tool_id:
//             tools.find((tool) => tool.tool_name === selectedTool)?.tool_id || 0,
//           tool_description:
//             tools.find((tool) => tool.tool_name === selectedTool)
//               ?.tool_description || "",
//         }
//       : {
//           classroom_id: classroom?.classroom_id || 0,
//           classname: classroom?.classroom_name || "",
//           scope_restriction: classroom?.scope_restriction ?? true,
//           description: classroom?.classroom_description || "",
//           grade: classroom?.grade || "",
//           file_content:
//             classroom?.classroomresources?.map(
//               (resource) => resource.file_content
//             ) || [],
//           student_message: classroomTopic,
//           content_from: "classroom",
//         };

//     if (selectedOutline) {
//       messageData = {
//         ...messageData,
//         outline_content: selectedOutline?.path || "",
//         outline_title: selectedOutline?.name || "",
//       };
//     }

//     try {
//       const response = selectedOutline
//         ? await sendClassroomOutlineMessage(messageData)
//         : selectedTool
//         ? await sendClassroomToolMessage(messageData)
//         : await sendClassroomMessage(messageData);

//       setMessages((prev) => ({
//         ...prev,
//         [currentKey]: [
//           ...(prev[currentKey] || []).filter((msg) => !msg.isLoading),
//           { text: response.data, fromUser: false },
//         ],
//       }));
//     } catch (error) {
//       console.error("Error sending message:", error);
//       setMessages((prev) => ({
//         ...prev,
//         [currentKey]: [
//           ...(prev[currentKey] || []).filter((msg) => !msg.isLoading),
//           {
//             text: "An error occurred. Please try again later.",
//             fromUser: false,
//           },
//         ],
//       }));
//     }
//   };

//   const handleSubmitAssessment = async (liveAssessments: any[] | undefined) => {
//     if (
//       !classroom?.classroom_id ||
//       !liveAssessments ||
//       liveAssessments.length === 0
//     ) {
//       alert("No assessments or classroom ID available for submission.");
//       return;
//     }
//     console.log(liveAssessments);

//     const allAnswers: {
//       liveclassroomassessment_id: number;
//       question: string;
//       student_answer: string;
//       transcript_id?: number;
//     }[] = [];

//     liveAssessments.forEach((question: any) => {
//       const selectedAnswer =
//         studentAnswers[question.liveclassroomassessment_id];

//       if (selectedAnswer) {
//         allAnswers.push({
//           liveclassroomassessment_id: question.liveclassroomassessment_id,
//           question: question.liveclassroomassessment_question,
//           student_answer: selectedAnswer,
//           transcript_id: question.transcript_id,
//         });
//       }
//     });

//     if (allAnswers.length === 0) {
//       alert(
//         "Please select answers for at least one question before submitting."
//       );
//       return;
//     }

//     setSubmittingAssessment(true);
//     setSubmissionSuccess(false);
//     setSubmissionError(null);

//     try {
//       const response = await sendLiveClassroomAssessmentAnswers({
//         liveclassroom_id: classroom.liveclassroom_id,
//         classroom_id: classroom.classroom_id,
//         answers: allAnswers,
//       });

//       setSubmissionSuccess(true);

//       setToastMessage("Assessments submitted successfully!");
//       setToastVariant("default");
//       setToastOpen(true);
//       await dispatch(fetchClassroomByIdThunk(Number(id)));
//     } catch (error: any) {
//       console.error("Error submitting live class assessment answers:", error);
//       setSubmissionError(
//         error.response?.data?.message ||
//           "Failed to submit live class assessment."
//       );
//     } finally {
//       setSubmittingAssessment(false);
//     }
//   };

//   const handleAnswerChange = (
//     questionId: number,
//     selectedOptionKey: string
//   ) => {
//     setStudentAnswers((prevAnswers) => ({
//       ...prevAnswers,
//       [questionId]: selectedOptionKey,
//     }));
//   };
//   const handleToggleView = () => {
//     setViewState((prev) => (prev === "classroom" ? "resources" : "classroom"));
//   };

//   const handleCopy = (text: string) => {
//     navigator.clipboard.writeText(text);
//     alert("Copied to clipboard!");
//   };
//   const preprocessText = (text: string) => {
//     return text.replace(/\*\*/g, "").replace(/###/g, "").replace(/\n/g, " ");
//   };

//   const toggleRecording = () => {
//     if (!("webkitSpeechRecognition" in window)) {
//       alert("Your browser does not support speech recognition.");
//       return;
//     }

//     if (isRecording) {
//       recognitionRef.current?.stop();
//       setIsRecording(false);
//       return;
//     }

//     const SpeechRecognition =
//       (window as any).webkitSpeechRecognition ||
//       (window as any).SpeechRecognition;
//     const recognition = new SpeechRecognition();
//     recognition.lang = "en-US";
//     recognition.interimResults = true;

//     recognition.onstart = () => setIsRecording(true);
//     recognition.onend = () => setIsRecording(false);

//     recognition.onresult = (
//       event: SpeechRecognitionEvent & {
//         resultIndex: number;
//         results: SpeechRecognitionResultList;
//       }
//     ) => {
//       let finalTranscript = "";
//       for (let i = event.resultIndex; i < event.results.length; i++) {
//         const transcript = event.results[i][0].transcript;
//         if (event.results[i].isFinal) {
//           finalTranscript += transcript + " ";
//         }
//       }
//       console.log(finalTranscript);
//       setInputText((prev) => prev + finalTranscript);
//     };

//     recognitionRef.current = recognition;
//     recognition.start();
//   };

//   const handleTextToSpeech = (text: string) => {
//     const cleanText = preprocessText(text);
//     if (isSpeaking) {
//       window.speechSynthesis.cancel();
//       setIsSpeaking(false);
//       return;
//     }

//     const speech = new SpeechSynthesisUtterance(cleanText);
//     speech.lang = "en-US";

//     speech.onend = () => setIsSpeaking(false);
//     speechRef.current = speech;

//     window.speechSynthesis.speak(speech);
//     setIsSpeaking(true);
//   };

//   const handleViewGradesClick = () => {
//     setShowGradeDialog(true);
//     setLoadingGrade(true);
//     setErrorGrade(null);
//     setReportData(null);
//     const fetchGrade = async () => {
//       try {
//         if (id) {
//           const response = await getOutlineAssessmentReport(id);

//           setReportData(response.data);
//         } else {
//           setErrorGrade("Classroom ID not available.");
//         }
//       } catch (err: any) {
//         setErrorGrade(err.message || "Failed to fetch grades.");
//       } finally {
//         setLoadingGrade(false);
//       }
//     };
//     fetchGrade();
//   };
//   const handleLoadMore = async (event: React.MouseEvent) => {
//     event.preventDefault();
//     console.log("Fetching more data...");

//     if (!selectedTool && !loadingHistory) {
//       setLoadingHistory(true);
//       setErrorHistory(null);
//       try {
//         const historyData = await loadClassroomChatHistory(
//           Number(id),
//           historyLimit,
//           historyPage + 1
//         );
//         if (historyData?.data && Array.isArray(historyData.data)) {
//           setMessages((prevMessages) => ({
//             ...prevMessages,
//             main: [
//               ...historyData.data.map((msg: any) => ({
//                 text: msg.content,
//                 fromUser: msg.label === "question",
//                 isHistory: true,
//               })),
//               ...(prevMessages.main || []),
//             ],
//           }));
//           setHistoryPage((prevPage) => prevPage + 1);
//           if (historyPage + 2 > totalClassroomHistoryPages) {
//             setAllHistoryLoaded(true);
//           }
//         }
//       } catch (error: any) {
//         console.error("Error loading more classroom chat history:", error);
//         setErrorHistory(error.message || "Failed to load more chat history.");
//       } finally {
//         setLoadingHistory(false);
//       }
//     } else if (selectedTool && !loadingToolHistory) {
//       setLoadingToolHistory(true);
//       setErrorToolHistory(null);
//       try {
//         const tool = tools.find((t) => t.tool_name === selectedTool);
//         if (tool?.tool_id) {
//           const historyData = await loadToolChatHistory(
//             Number(id),
//             tool.tool_id,
//             toolHistoryLimit,
//             toolHistoryPage + 1
//           );
//           if (historyData?.data && Array.isArray(historyData.data)) {
//             setMessages((prevMessages) => ({
//               ...prevMessages,
//               [selectedTool]: [
//                 ...historyData.data.map((msg: any) => ({
//                   text: msg.content,
//                   fromUser: msg.label === "question",
//                   isHistory: true,
//                 })),
//                 ...(prevMessages[selectedTool] || []),
//               ],
//             }));
//             setToolHistoryPage((prevPage) => prevPage + 1);
//             if (toolHistoryPage + 2 > totalToolHistoryPages) {
//               setAllToolHistoryLoaded(true);
//             }
//           }
//         }
//       } catch (error: any) {
//         console.error(
//           `Error loading more chat history for tool ${selectedTool}:`,
//           error
//         );
//         setErrorToolHistory(
//           error.message ||
//             `Failed to load more chat history for ${selectedTool}.`
//         );
//       } finally {
//         setLoadingToolHistory(false);
//       }
//     }
//   };
//   const showLoadMoreButton =
//     (!selectedTool && totalClassroomHistoryPages > historyPage + 1) ||
//     (selectedTool && totalToolHistoryPages > toolHistoryPage + 1);

//   const handleCloseGradeDialog = () => {
//     setShowGradeDialog(false);
//     setReportData(null);
//     setErrorGrade(null);
//   };
//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };
//   const parseOptions = (optionsString: string): string[] => {
//     try {
//       let cleanString =
//         optionsString.startsWith('"') && optionsString.endsWith('"')
//           ? optionsString.substring(1, optionsString.length - 1)
//           : optionsString;

//       if (cleanString.startsWith("['") && cleanString.endsWith("']")) {
//         cleanString = cleanString.replace(/'/g, '"');
//       }

//       const parsed = JSON.parse(cleanString);

//       if (
//         Array.isArray(parsed) &&
//         parsed.every((item) => typeof item === "string")
//       ) {
//         return parsed;
//       }
//       return [];
//     } catch (error) {
//       console.error("Failed to parse options string:", optionsString, error);
//       return [];
//     }
//   };
//   const getOptionLetter = (index: number): string => {
//     return String.fromCharCode(65 + index);
//   };

//   const outlineTitlesString = classroom?.classroomoutlines
//     ?.map((outline) => outline.classroomoutline_title)
//     .filter(Boolean)
//     .join(", ");
//   const outlineContentString = classroom?.classroomoutlines
//     ?.map((outline) => outline.classroomoutline_content)
//     .filter(Boolean)
//     .join(", ");

//   if (fetchingClassroom) {
//     return (
//       <div className="overflow-x-auto">
//         <table className="min-w-full border-collapse">
//           <thead>
//             <tr>
//               {[...Array(5)].map((_, index) => (
//                 <th key={index} className="p-4 border-b">
//                   <Skeleton className="h-4 w-16 rounded" />
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {[...Array(6)].map((_, rowIndex) => (
//               <tr key={rowIndex} className="border-b">
//                 {[...Array(5)].map((_, colIndex) => (
//                   <td key={colIndex} className="p-4">
//                     <Skeleton className="h-4 w-full rounded" />
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   }

//   const handleToolChatSend = async () => {
//     if (!toolChatInput.trim()) return;

//     // Add user message
//     const userMsg = { text: toolChatInput, fromUser: true };
//     setToolChatMessages((prev) => [...prev, userMsg]);
//     setToolChatInput("");

//     // Add temporary "thinking" message
//     const thinkingMsg = {
//       text: `${selectedTool} is thinking...`,
//       fromUser: false,
//       isLoading: true,
//     };
//     setToolChatMessages((prev) => [...prev, thinkingMsg]);
//     setToolChatLoading(true);

//     try {
//       // ✅ Ensure valid data types before calling API
//       if (!classroom?.classroom_id || !selectedTool) {
//         console.warn("Missing classroom_id or selectedTool.");
//         setToolChatMessages((prev) =>
//           prev.map((msg) =>
//             msg.isLoading
//               ? {
//                   ...msg,
//                   text: "⚠️ Cannot send message — missing classroom or tool.",
//                   isLoading: false,
//                 }
//               : msg
//           )
//         );
//         setToolChatLoading(false);
//         return;
//       }

//       // ✅ Send message to backend AI
//       const response = await sendClassroomToolMessage({
//         classroom_id: Number(classroom?.classroom_id ?? 0),
//         tool_name: selectedTool ?? "",
//         student_message: userMsg.text,
//         content_from: "classroom_tools",
//       } as any);

//       // ✅ Update messages with AI response
//       setToolChatMessages((prev) =>
//         prev.map((msg) =>
//           msg.isLoading
//             ? {
//                 ...msg,
//                 text: response?.data || "No response received.",
//                 isLoading: false,
//               }
//             : msg
//         )
//       );
//     } catch (error) {
//       console.error("AI error:", error);

//       setToolChatMessages((prev) =>
//         prev.map((msg) =>
//           msg.isLoading
//             ? {
//                 ...msg,
//                 text: "⚠️ Error: Could not get a response from AI.",
//                 isLoading: false,
//               }
//             : msg
//         )
//       );
//     } finally {
//       setToolChatLoading(false);
//     }
//   };

//   // console.log("tools", tools)
//   return (
//     <ToastProvider>
//       <div className="min-h-screen bg-[#F1F1F1]">
//         <Sidenav
//           brandName="AiTeacha"
//           outlines={(classroom?.classroomoutlines || []).map((outline) => ({
//             name: outline.classroomoutline_title,
//             path: outline.classroomoutline_content || "#",
//             classroomoutline_id: outline.classroomoutline_id,
//             assessmentStatus: outline.assessment_status,
//             assessments: outline.assessments,
//             mark_as_read: outline.mark_as_read,
//           }))}
//           tools={tools}
//           selectedTool={selectedTool}
//           onSelectTool={setSelectedTool}
//           onToggle={(collapsed) => setIsCollapsed(collapsed)}
//           selectedOutline={selectedOutline}
//           onSelectOutline={setSelectedOutline}
//           selectedOverview={selectedOverview}
//           setSelectedOverview={setSelectedOverview}
//           onOverviewClick={handleOverviewClick}
//           classroomId={id}
//           viewState={viewState}
//           onToggleView={handleToggleView}
//         />
//         <div
//           className={`flex-1 transition-all duration-3  ${
//             isCollapsed ? "xl:ml-28" : "xl:ml-72"
//           }`}
//         >
//           {userrole === 3 ? (
//             <>
//               <StudentNavbar />
//             </>
//           ) : (
//             <>
//               {" "}
//               <DashboardNavbar />
//             </>
//           )}
//           <div className="mt-4 md:mt-6 lg:mt-10">
//             <div className="text-left mt-10 mb- lg:px-10 px-5">
//               <p className="text-black text-sm bg-gray-300 rounded-full px-4 py-2 inline-flex">
//                 End Date: Jan 25, 2026
//               </p>
//               <h2 className="text-xl font-semibold text-black">
//                 {classroom?.classroom_name}
//                 {selectedTool && (
//                   <>
//                     /
//                     <p className="text-primary text-sm font-bold">
//                       In use: {selectedTool}
//                     </p>
//                   </>
//                 )}
//               </h2>
//               <p>{classroom?.classroom_description}</p>
//             </div>

//             <div className="flex items-center pb-2 lg:px-8 px-5">
//               <div className="flex gap-6">
//                 {/* Overview */}
//                 <button
//                   onClick={() => setViewState("classroom")}
//                   className={`text-md font-semibold pb-2 transition-all duration-200 ${
//                     viewState === "classroom"
//                       ? "text-[#5c3cbb] border-b-4 border-[#6200EE]"
//                       : "text-gray-700 hover:text-[#6200EE]"
//                   }`}
//                 >
//                   Overview
//                 </button>

//                 {/* Simulation */}
//                 <button
//                   onClick={() => setViewState("simulation")}
//                   className={`text-md font-semibold pb-2 transition-all duration-200 ${
//                     viewState === "simulation"
//                       ? "text-[#5c3cbb] border-b-4 border-[#6200EE]"
//                       : "text-gray-700 hover:text-[#6200EE]"
//                   }`}
//                 >
//                   Simulation
//                 </button>

//                 {/* Live Class */}
//                 <button
//                   onClick={() => setViewState("liveclass")}
//                   className={`text-md font-semibold pb-2 transition-all duration-200 ${
//                     viewState === "liveclass"
//                       ? "text-[#5c3cbb] border-b-4 border-[#6200EE]"
//                       : "text-gray-700 hover:text-[#6200EE]"
//                   }`}
//                 >
//                   Live Class
//                 </button>

//                 {/* Chats */}
//                 <button
//                   // onClick={() => navigate(`/student/Studentforum/${id}`)}
//                   onClick={() => setViewState("chats")}
//                   className={`text-md font-semibold pb-2 transition-all duration-200 ${
//                     viewState === "chats"
//                       ? "text-[#5c3cbb] border-b-4 border-[#6200EE]"
//                       : "text-gray-700 hover:text-[#6200EE]"
//                   }`}
//                 >
//                   Chats
//                 </button>

//                 {/* Participants */}
//                 <button
//                   onClick={() => setViewState("participant")}
//                   className={`text-md font-semibold pb-2 transition-all duration-200 ${
//                     viewState === "participant"
//                       ? "text-[#5c3cbb] border-b-4 border-[#6200EE]"
//                       : "text-gray-700 hover:text-[#6200EE]"
//                   }`}
//                 >
//                   Participants
//                 </button>

//                 {/* Voice Settings */}
//                 <Dialog
//                   open={showVoiceSettingsDialog}
//                   onOpenChange={setShowVoiceSettingsDialog}
//                 >
//                   <DialogTrigger asChild>
//                     <button
//                       className={`text-md font-semibold pb-2 transition-all duration-200 ${
//                         viewState === "voice"
//                           ? "text-[#5c3cbb] border-b-4 border-[#6200EE]"
//                           : "text-gray-700 hover:text-[#6200EE]"
//                       }`}
//                       onClick={() => setViewState("voice")}
//                       disabled={isVoiceRecording}
//                     >
//                       Voice Session
//                     </button>
//                   </DialogTrigger>

//                   <DialogContent className="sm:max-w-[425px]">
//                     <DialogHeader>
//                       <DialogTitle>Voice Session Settings</DialogTitle>
//                       <DialogDescription>
//                         Choose your preferred voice, language, and grade for the
//                         AI.
//                       </DialogDescription>
//                     </DialogHeader>

//                     <div className="grid gap-4 py-4">
//                       <div className="grid grid-cols-4 items-center gap-4">
//                         <label htmlFor="voiceType" className="text-right">
//                           Voice
//                         </label>
//                         <select
//                           id="voiceType"
//                           value={selectedVoiceType}
//                           onChange={(e) => setSelectedVoiceType(e.target.value)}
//                           className="col-span-3 border rounded-md p-2"
//                         >
//                           {ClassroomVoiceTypelist.map((voice) => (
//                             <option key={voice.value} value={voice.value}>
//                               {voice.label}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       <div className="grid grid-cols-4 items-center gap-4">
//                         <label htmlFor="language" className="text-right">
//                           Language
//                         </label>
//                         <select
//                           id="language"
//                           value={selectedLanguage}
//                           onChange={(e) => setSelectedLanguage(e.target.value)}
//                           className="col-span-3 border rounded-md p-2"
//                         >
//                           {languageOptions.map((lang) => (
//                             <option key={lang.value} value={lang.value}>
//                               {lang.label}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       <div className="grid grid-cols-4 items-center gap-4">
//                         <label htmlFor="grade" className="text-right">
//                           Grade
//                         </label>
//                         <select
//                           id="grade"
//                           value={selectedGrade}
//                           onChange={(e) => setSelectedGrade(e.target.value)}
//                           className="col-span-3 border rounded-md p-2"
//                         >
//                           <option value="">Select Grade (Optional)</option>
//                           {gradeOptions.map((grade, index) => (
//                             <option key={index} value={grade}>
//                               {grade}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     </div>

//                     <DialogFooter>
//                       <Button
//                         onClick={() =>
//                           startAudioRecording(
//                             selectedVoiceType,
//                             selectedLanguage,
//                             selectedGrade
//                           )
//                         }
//                         variant={"gradient"}
//                         className="w-full rounded-md"
//                         disabled={submittingAssessment}
//                       >
//                         {submittingAssessment
//                           ? "Connecting..."
//                           : "Start Voice Session"}
//                       </Button>
//                     </DialogFooter>
//                   </DialogContent>
//                 </Dialog>
//               </div>
//             </div>

//             {viewState === "classroom" ? (
//               <>
//                 <div className="relative flex flex-col lg:flex-row routes-scroll-area">
//                   <div
//                     ref={chatContainerRef}
//                     className="flex-grow space-y-2 m-4 p-4"
//                   >
//                     {showTopicPopup && (
//                       <motion.div
//                         initial={{ opacity: 0, translateY: -10 }}
//                         animate={{ opacity: 1, translateY: 0 }}
//                         transition={{ duration: 0.4 }}
//                         className="fixed top-28 right-5 z-50"
//                       >
//                         <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 text-white p-5 px-6 rounded-2xl shadow-2xl max-w-sm">
//                           <button
//                             onClick={() => setShowTopicPopup(false)}
//                             className="absolute top-2 right-2 text-white hover:text-gray-300 text-2xl font-bold  pr-4"
//                             aria-label="Close"
//                           >
//                             ×
//                           </button>
//                           <div className="absolute right-0 bottom-2 w-3 h-3 bg-pink-500 rotate-45 mr-[-6px] rounded-sm shadow-sm"></div>
//                           <div className="flex items-start gap-3">
//                             <div className="text-2xl mt-0.5">✨</div>
//                             <div>
//                               <p className="font-bold text-lg mb-1 text-yellow-300">
//                                 Recommended Topic
//                               </p>
//                               <p className="text-sm leading-snug text-gray-200 mb-3">
//                                 Here's a suggested topic for you:
//                               </p>
//                               <p className="text-white font-semibold">
//                                 {classroomTopic}
//                               </p>

//                               <button
//                                 onClick={() => {
//                                   handleSendTopic(), setShowTopicPopup(false);
//                                 }}
//                                 className="bg-white text-purple-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-yellow-100 transition-all mt-2"
//                               >
//                                 Learn More
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       </motion.div>
//                     )}

//                     <div className="flex lg:flex-row flex-col gap-5">
//                       <div className="bg-white p-4 rounded-xl shadow-md w-full">
//                         <h1 className="text-2xl font-semi-bold text-[#6200EE]">
//                           3/10
//                         </h1>
//                         <p className="text-gray-500">completed</p>
//                         <p className="text-black">Assignments</p>
//                       </div>
//                       <div className="bg-white p-4 rounded-xl shadow-md w-full">
//                         <h1 className="text-2xl font-semibold text-[#6200EE]">
//                           2/10
//                         </h1>
//                         <p className="text-gray-500">completed</p>
//                         <p className="text-black">Test & Exams</p>
//                       </div>
//                     </div>

//                     <br />

//                     <div className="w-full mt-10">
//                       <h2 className="text-lg font-semibold text-gray-800 mb-4">
//                         Class Tools
//                       </h2>

//                       <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
//                         <div
//                           key="zyra"
//                           onClick={() => {
//                             setSelectedTool("Zyra AI Chat");
//                             setSelectedOverview(false);
//                             setSelectedOutline(null);
//                             setViewState("classroom");
//                             setShowToolChat(true);

//                             const savedChat = localStorage.getItem(
//                               "toolChat_Zyra AI Chat"
//                             );
//                             setToolChatMessages(
//                               savedChat ? JSON.parse(savedChat) : []
//                             );
//                           }}
//                           className={`flex flex-col items-center justify-center border rounded-2xl p-6 transition-all duration-300 cursor-pointer ${
//                             selectedTool === "Zyra AI Chat"
//                               ? "bg-[#EFE6FD] border-[#6200EE]/30 shadow-md scale-[1.02]"
//                               : "bg-[#EFE6FD] border-gray-200 hover:border-[#6200EE]/30 hover:shadow-lg hover:scale-[1.02]"
//                           }`}
//                         >
//                           <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-50 mb-3 shadow-sm">
//                             <img
//                               src={Avatar}
//                               alt="Zyra AI Chat"
//                               className="w-full h-full object-cover"
//                             />
//                           </div>
//                           <p className="text-sm font-semibold text-gray-800 text-center">
//                             Zyra AI Chat
//                           </p>
//                         </div>

//                         {/* ✅ Dynamic Tool Cards */}
//                         {tools.map((tool, index) => (
//                           <div
//                             key={index}
//                             onClick={() => {
//                               setSelectedTool(tool.tool_name);
//                               setSelectedOverview(false);
//                               setSelectedOutline(null);
//                               setViewState("classroom");
//                               setShowToolChat(true);

//                               // ✅ Load stored chat if exists
//                               const savedChat = localStorage.getItem(
//                                 `toolChat_${tool.tool_name}`
//                               );
//                               setToolChatMessages(
//                                 savedChat ? JSON.parse(savedChat) : []
//                               );
//                             }}
//                             className={`flex flex-col items-center justify-between border rounded-2xl p-5 transition-all duration-300 cursor-pointer ${
//                               selectedTool === tool.tool_name
//                                 ? "bg-[#EFE6FD] border-[#6200EE]/30 shadow-md scale-[1.02]"
//                                 : "bg-white border-gray-200 hover:border-[#6200EE]/30 hover:shadow-lg hover:scale-[1.02]"
//                             }`}
//                           >
//                             {/* Thumbnail */}
//                             <div className="w-full h-24 flex items-center justify-center overflow-hidden rounded-xl bg-gray-50 mb-3">
//                               {tool.tool_thumbnail ? (
//                                 <img
//                                   src={
//                                     tool.tool_thumbnail.startsWith("http")
//                                       ? tool.tool_thumbnail
//                                       : `https://${tool.tool_thumbnail}`
//                                   }
//                                   alt={tool.tool_name || "Tool Thumbnail"}
//                                   className="w-full h-full object-cover rounded-lg"
//                                 />
//                               ) : (
//                                 <FaHeart className="text-[#6200EE] w-10 h-10" />
//                               )}
//                             </div>

//                             {/* Label */}
//                             <p className="text-sm font-semibold text-gray-800 text-center">
//                               {tool.tool_name}
//                             </p>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     <br />

//                     {classroom?.classroomresources &&
//                       classroom.classroomresources.length > 0 && (
//                         <div className="mt-32">
//                           <h2 className="text-lg font-semibold text-gray-800 mb-4">
//                             Resources
//                           </h2>

//                           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
//                             {classroom.classroomresources.map((resource) => (
//                               <div
//                                 key={resource.resources_id}
//                                 className="group bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#6200EE]/30 transition-all duration-300 flex flex-col justify-between"
//                               >
//                                 {/* File Info */}
//                                 <div className="flex items-start space-x-3">
//                                   <div className="flex-shrink-0 w-10 h-10 bg-[#EFE6FD] text-[#6200EE] rounded-xl flex items-center justify-center shadow-sm">
//                                     <svg
//                                       xmlns="http://www.w3.org/2000/svg"
//                                       className="w-5 h-5"
//                                       fill="none"
//                                       viewBox="0 0 24 24"
//                                       stroke="currentColor"
//                                       strokeWidth="2"
//                                     >
//                                       <path
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         d="M12 16v-4m0 0l-2-2m2 2l2-2m12-8v14l-4-4H8l-4 4V4h16z"
//                                       />
//                                     </svg>
//                                   </div>

//                                   <div className="flex-1 min-w-0">
//                                     <p className="text-sm font-semibold text-gray-800 truncate">
//                                       {resource.resources_filename}
//                                     </p>
//                                     <p className="text-xs text-gray-500 mt-1">
//                                       {resource.resources_type || "Document"}
//                                     </p>
//                                   </div>
//                                 </div>

//                                 {/* Actions */}
//                                 <div className="mt-5 flex justify-between items-center border-t border-gray-100 pt-4">
//                                   <p className="text-xs text-gray-500 truncate">
//                                     {resource.resources_size
//                                       ? `${(
//                                           resource.resources_size / 1024
//                                         ).toFixed(1)} KB`
//                                       : ""}
//                                   </p>
//                                   <button
//                                     onClick={() => {
//                                       const fullUrl = `https://${resource.resources_path}`;
//                                       window.open(fullUrl, "_blank");
//                                     }}
//                                     className="bg-[#6200EE] text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm hover:bg-[#5300d6] transition-all duration-200"
//                                   >
//                                     View
//                                   </button>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}

//                     {/* {selectedOverview ? (
//                       <MarkdownRenderer
//                         content={welcomeMessage}
//                         shouldType={false}
//                         className="text-sm lg:text-md text-gray-8"
//                       />
//                     ) : currentMessages.length === 0 ? (
//                       <>
//                         <MarkdownRenderer
//                           content={welcomeMessage}
//                           shouldType={false}
//                           className="text-sm lg:text-md text-gray-8"
//                         />

//                         <div className="flex justify-between items-center w-full p-4">
//                           <div className="flex-1 ">
//                             {selectedOutline &&
//                             selectedOutline.mark_as_read === 0 ? (
//                               <button
//                                 onClick={() =>
//                                   handleMarkAsRead(
//                                     selectedOutline.classroomoutline_id
//                                   )
//                                 }
                       
//                                 className="rounded-full text-black bg-[#EFE6FD] px-4 py-2"
//                                 disabled={loading}
//                               >
//                                 {loading ? "Marking..." : "Mark as Read"}
//                               </button>
//                             ) : selectedOutline &&
//                               selectedOutline.mark_as_read === 1 ? (
//                               <button
//                                 // variant={"gray"}
//                                 className="rounded-full text-white bg-[#6200EE] px-4 py-2"
//                                 disabled
//                               >
//                                 Completed
//                               </button>
//                             ) : null}
//                           </div>

//                           {selectedOutline && (
//                             <div className="flex-1 flex justify-end gap-2">
//                               {(() => {
//                                 const Nexoutlines = (
//                                   classroom?.classroomoutlines || []
//                                 ).map((outline) => ({
//                                   name: outline.classroomoutline_title,
//                                   path: outline.classroomoutline_content || "#",
//                                   classroomoutline_id:
//                                     outline.classroomoutline_id,
//                                   assessmentStatus: outline.assessment_status,
//                                   assessments: outline.assessments,
//                                 }));

//                                 const currentIndex = Nexoutlines.findIndex(
//                                   (o) => o.name === selectedOutline?.name
//                                 );

//                                 const prev =
//                                   currentIndex > 0
//                                     ? Nexoutlines[currentIndex - 1]
//                                     : null;
//                                 const next =
//                                   currentIndex < Nexoutlines.length - 1
//                                     ? Nexoutlines[currentIndex + 1]
//                                     : null;

//                                 return (
//                                   <>
//                                     {prev && (
//                                       <button
//                                         className="bg-[#6200EE] text-white px-4 py-2 rounded-full transition-all duration-200"
//                                         onClick={() => setSelectedOutline(prev)}
//                                       >
//                                         Previous
//                                       </button>
//                                     )}

//                                     {next && (
//                                       <button
//                                         className="bg-[#6200EE] text-white px-4 py-2 rounded-full transition-all duration-200"
//                                         onClick={() => setSelectedOutline(next)}
//                                       >
//                                         Next
//                                       </button>
//                                     )}
//                                   </>
//                                 );
//                               })()}
//                             </div>
//                           )}
//                         </div>
//                         {selectedOutline &&
//                           selectedOutline.assessments &&
//                           selectedOutline.assessments.length > 0 &&
//                           selectedOutline.assessmentStatus === "pending" && (
//                             <>
//                               <hr />
//                               <br />
//                               <h2>Take Assessments:</h2>
//                               <br />
//                               {selectedOutline.assessments.map(
//                                 (assessment: any, index: any) => (
//                                   <div key={assessment.outlineassessment_id}>
//                                     Question {index + 1}:{" "}
//                                     {assessment.outlineassessment_question}
//                                     <br />
//                                     {(() => {
//                                       try {
//                                         const options = JSON.parse(
//                                           assessment.outlineassessment_options
//                                         );
//                                         if (Array.isArray(options)) {
//                                           return (
//                                             <>
//                                               {options.map((option, index) => (
//                                                 <div
//                                                   key={`${assessment.outlineassessment_id}-${index}`}
//                                                 >
//                                                   <input
//                                                     type="radio"
//                                                     id={`${assessment.outlineassessment_id}-${index}`}
//                                                     name={
//                                                       assessment.outlineassessment_id
//                                                     }
//                                                     value={option}
//                                                   />
//                                                   &ensp;
//                                                   <label
//                                                     htmlFor={`${assessment.outlineassessment_id}-${index}`}
//                                                   >
//                                                     {option}
//                                                   </label>
//                                                   <br />
//                                                 </div>
//                                               ))}
//                                               <br />
//                                               <br />
//                                             </>
//                                           );
//                                         } else {
//                                           return `Options: ${assessment.outlineassessment_options}<br><br>`;
//                                         }
//                                       } catch (e) {
//                                         return `Options: ${assessment.outlineassessment_options}<br><br>`;
//                                       }
//                                     })()}
//                                   </div>
//                                 )
//                               )}
//                               <Button
//                                 onClick={() =>
//                                   sendAllAnswers(selectedOutline.assessments)
//                                 }
//                                 variant={"gradient"}
//                                 className="rounded-md mt-4"
//                                 disabled={loading}
//                               >
//                                 {loading
//                                   ? "Submitting..."
//                                   : "Submit All Answers"}
//                               </Button>
//                             </>
//                           )}
//                         {selectedOutline &&
//                           selectedOutline.assessments &&
//                           selectedOutline.assessments.length > 0 &&
//                           selectedOutline.assessmentStatus !== "pending" && (
//                             <>
//                               <hr />
//                               <h2>Assessment Taken</h2>
//                             </>
//                           )}
//                       </>
//                     ) : (
//                       <>
//                         {loadingHistory &&
//                           !selectedTool &&
//                           historyPage === 0 && (
//                             <div className="flex justify-center items-center h-full">
//                               <svg
//                                 className="animate-spin h-6 w-6 text-primary"
//                                 xmlns="http://www.w3.org/20/svg"
//                                 fill="none"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <circle
//                                   className="opacity-25"
//                                   cx="12"
//                                   cy="12"
//                                   r="10"
//                                   stroke="currentColor"
//                                   strokeWidth="4"
//                                 ></circle>
//                                 <path
//                                   className="opacity-75"
//                                   fill="currentColor"
//                                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                                 ></path>
//                               </svg>
//                             </div>
//                           )}
//                         {errorHistory && !selectedTool && (
//                           <div className="text-center text-red-4">
//                             Error loading history: {errorHistory}
//                           </div>
//                         )}
//                         {loadingToolHistory &&
//                           selectedTool &&
//                           toolHistoryPage === 0 && (
//                             <div className="flex justify-center items-center h-full">
//                               <svg
//                                 className="animate-spin h-6 w-6 text-primary"
//                                 xmlns="http://www.w3.org/20/svg"
//                                 fill="none"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <circle
//                                   className="opacity-25"
//                                   cx="12"
//                                   cy="12"
//                                   r="10"
//                                   stroke="currentColor"
//                                   strokeWidth="4"
//                                 ></circle>
//                                 <path
//                                   className="opacity-75"
//                                   fill="currentColor"
//                                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                                 ></path>
//                               </svg>
//                             </div>
//                           )}
//                         {errorToolHistory && selectedTool && (
//                           <div className="text-center text-red-4">
//                             Error loading tool history: {errorToolHistory}
//                           </div>
//                         )}

//                         {showLoadMoreButton && (
//                           <div className=" bg-gray-50 py-2 flex justify-center">
//                             {!loadingHistory && !loadingToolHistory && (
//                               <button
//                                 onClick={(event) => handleLoadMore(event)}
//                                 className="text-primary hover:underline text-sm"
//                               >
//                                 Load More
//                               </button>
//                             )}
//                             {loadingHistory &&
//                               !selectedTool &&
//                               historyPage > 0 && (
//                                 <div className="text-gray-5 text-sm">
//                                   Loading more history...
//                                 </div>
//                               )}
//                             {loadingToolHistory &&
//                               selectedTool &&
//                               toolHistoryPage > 0 && (
//                                 <div className="text-gray-5 text-sm">
//                                   Loading more tool history...
//                                 </div>
//                               )}
//                           </div>
//                         )}
//                         {showTopicPopup && (
//                           <motion.div
//                             initial={{ opacity: 0, translateY: -10 }}
//                             animate={{ opacity: 1, translateY: 0 }}
//                             transition={{ duration: 0.4 }}
//                             className="fixed top-28 right-5 z-50"
//                           >
//                             <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 text-white p-5 px-6 rounded-2xl shadow-2xl max-w-sm">
//                               <button
//                                 onClick={() => setShowTopicPopup(false)}
//                                 className="absolute top-2 right-2 text-white hover:text-gray-300 text-2xl font-bold  pr-4"
//                                 aria-label="Close"
//                               >
//                                 ×
//                               </button>
//                               <div className="absolute right-0 bottom-2 w-3 h-3 bg-pink-500 rotate-45 mr-[-6px] rounded-sm shadow-sm"></div>
//                               <div className="flex items-start gap-3">
//                                 <div className="text-2xl mt-0.5">✨</div>
//                                 <div>
//                                   <p className="font-bold text-lg mb-1 text-yellow-300">
//                                     Recommended Topic
//                                   </p>
//                                   <p className="text-sm leading-snug text-gray-200 mb-3">
//                                     Here's a suggested topic for you:
//                                   </p>
//                                   <p className="text-white font-semibold">
//                                     {classroomTopic}
//                                   </p>

//                                   <button
//                                     onClick={() => {
//                                       handleSendTopic(),
//                                         setShowTopicPopup(false);
//                                     }}
//                                     className="bg-white text-purple-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-yellow-100 transition-all mt-2"
//                                   >
//                                     Learn More
//                                   </button>
//                                 </div>
//                               </div>
//                             </div>
//                           </motion.div>
//                         )}

//                         {currentMessages.map((message, index) => (
//                           <motion.div
//                             key={index}
//                             initial={{ opacity: 0, scale: 0.9 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             transition={{ duration: 0.3, delay: index * 0.1 }}
//                             className={`flex flex-col mb-2 ${
//                               message.fromUser ? "items-end" : "items-start"
//                             }`}
//                           >
//                             {!message.fromUser && (
//                               <div className="flex justify-end space-x-4 mb-1">
//                                 <button
//                                   onClick={() => handleCopy(message.text)}
//                                   className="text-gray-6 hover:text-gray-8 flex gap-1"
//                                 >
//                                   <FiCopy />{" "}
//                                   <span className="text-sm">Copy</span>
//                                 </button>
//                                 <button
//                                   onClick={() =>
//                                     handleTextToSpeech(message.text)
//                                   }
//                                   className="text-gray-6 hover:text-gray-8 flex gap-1"
//                                 >
//                                   {isSpeaking ? <FiPause /> : <FiVolume2 />}
//                                   <span className="text-sm">
//                                     {isSpeaking ? "Pause" : "Voice"}
//                                   </span>
//                                 </button>
//                               </div>
//                             )}
//                             <MarkdownRenderer
//                               content={message.text}
//                               className={`p-3 text-sm ${
//                                 message.fromUser
//                                   ? "bg-primary max-w-xs text-white rounded-tl-lg"
//                                   : "bg-gray-2 max-w-xl text-black rounded-tr-lg"
//                               }`}
//                               shouldType={
//                                 !message.fromUser && !message.isHistory
//                               }
//                               style={{
//                                 wordWrap: "break-word",
//                                 whiteSpace: "pre-wrap",
//                               }}
//                             />
//                           </motion.div>
//                         ))}
//                       </>
//                     )} */}
//                     <div ref={messagesEndRef} />
//                   </div>
//                 </div>
//               </>
//             ) : viewState === "simulation" ? (
//               <SimulationDashboardPage
//                 description={classroom?.classroom_description || ""}
//                 grade={classroom?.grade || ""}
//                 classroom_id={classroom?.classroom_id || ""}
//                 classroom_content={classroom?.content || ""}
//                 outline_title={outlineTitlesString || ""}
//                 outline_content={outlineContentString || ""}
//               />
//             ) : viewState === "participant" && <Participant /> ? (
//               <Participant />
//             ) : viewState === "chats" && <StudentClass /> ? (
//               <StudentClass />
//             ) : viewState === "liveclass" ? (
//               <div className="lg:px-10">
//                 <div className="my-8 px-6 py-20 bg-white border border-purple-2 rounded-lg shadow-sm">
//                   {classroom?.liveclassroomassessments &&
//                   classroom.liveclassroomassessments.length > 0 ? (
//                     <>
//                       <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-8 mb-6 text-center">
//                         Live Class Assessments
//                       </h2>
//                       {classroom.liveclassroomassessments.map(
//                         (question: any, qIndex: number) => {
//                           const options = parseOptions(
//                             question.liveclassroomassessment_options
//                           );
//                           const studentAnswerForThisQuestion =
//                             question.liveclassroomassessment_student_answer ||
//                             studentAnswers[question.liveclassroomassessment_id];

//                           const isQuestionAnswered =
//                             isAssessmentCompleted ||
//                             question.liveclassroomassessment_student_answer !==
//                               null;

//                           const isCorrect =
//                             isQuestionAnswered &&
//                             studentAnswerForThisQuestion ===
//                               question.liveclassroomassessment_correct_answer;

//                           const didStudentFailToAnswer =
//                             isAssessmentCompleted &&
//                             question.liveclassroomassessment_student_answer ===
//                               null;

//                           return (
//                             <div
//                               key={
//                                 question.liveclassroomassessment_id ||
//                                 `q-${qIndex}`
//                               }
//                               className="mb-6 p-4 border border-gray-2 rounded-md bg-gray-50"
//                             >
//                               <p className="text-lg font-medium text-gray-8 mb-3 flex items-center">
//                                 {qIndex + 1}.{" "}
//                                 {question.liveclassroomassessment_question}
//                                 {isAssessmentCompleted && (
//                                   <span className="ml-3">
//                                     {didStudentFailToAnswer ? (
//                                       <span className="text-red-5 font-bold">
//                                         &#106; Unanswered
//                                       </span>
//                                     ) : isCorrect ? (
//                                       <span className="text-green-5 font-bold">
//                                         &#103; Correct
//                                       </span>
//                                     ) : (
//                                       <span className="text-red-5 font-bold">
//                                         &#106; Incorrect
//                                       </span>
//                                     )}
//                                   </span>
//                                 )}
//                               </p>
//                               <div className="space-y-2">
//                                 {options.map(
//                                   (
//                                     optionValue: string,
//                                     optionIndex: number
//                                   ) => {
//                                     const optionKey =
//                                       getOptionLetter(optionIndex);
//                                     const isChecked =
//                                       studentAnswerForThisQuestion ===
//                                       optionKey;
//                                     const isCorrectAnswerOption =
//                                       question.liveclassroomassessment_correct_answer ===
//                                       optionKey;

//                                     return (
//                                       <label
//                                         key={optionKey}
//                                         className={`flex items-center space-x-2 p-2 rounded-md transition-colors duration-2
//                         ${
//                           !isAssessmentCompleted
//                             ? "cursor-pointer hover:bg-gray-1"
//                             : "cursor-not-allowed"
//                         }
//                         ${
//                           isAssessmentCompleted &&
//                           isChecked &&
//                           isCorrect &&
//                           "bg-green-1 border border-green-3"
//                         }
//                         ${
//                           isAssessmentCompleted &&
//                           isChecked &&
//                           !isCorrect &&
//                           "bg-red-1 border border-red-3"
//                         }
//                         ${
//                           isAssessmentCompleted &&
//                           !isChecked &&
//                           isCorrectAnswerOption &&
//                           "bg-blue-50 border border-blue-2"
//                         }
//                       `}
//                                       >
//                                         <input
//                                           type="radio"
//                                           name={`question-${question.liveclassroomassessment_id}`}
//                                           value={optionKey}
//                                           checked={isChecked}
//                                           onChange={() =>
//                                             handleAnswerChange(
//                                               question.liveclassroomassessment_id,
//                                               optionKey
//                                             )
//                                           }
//                                           className={`form-radio h-4 w-4 ${
//                                             isAssessmentCompleted
//                                               ? "cursor-not-allowed"
//                                               : "text-purple-6 focus:ring-purple-5"
//                                           }`}
//                                           readOnly={isAssessmentCompleted}
//                                           disabled={isAssessmentCompleted}
//                                         />
//                                         <span className="text-gray-7">
//                                           {optionKey}. {optionValue}
//                                         </span>
//                                         {isAssessmentCompleted &&
//                                           !didStudentFailToAnswer &&
//                                           isCorrectAnswerOption &&
//                                           !isChecked && (
//                                             <span className="ml-2 text-green-6">
//                                               &#103; (Correct Answer)
//                                             </span>
//                                           )}
//                                       </label>
//                                     );
//                                   }
//                                 )}
//                                 {isAssessmentCompleted &&
//                                   didStudentFailToAnswer && (
//                                     <p className="text-sm text-blue-6 mt-1">
//                                       Correct Answer:{" "}
//                                       {
//                                         question.liveclassroomassessment_correct_answer
//                                       }
//                                       .{" "}
//                                       {
//                                         options[
//                                           question.liveclassroomassessment_correct_answer.charCodeAt(
//                                             0
//                                           ) - 65
//                                         ]
//                                       }
//                                     </p>
//                                   )}
//                               </div>
//                             </div>
//                           );
//                         }
//                       )}
//                       <div className="mt-8 text-center">
//                         {!isAssessmentCompleted ? (
//                           <Button
//                             onClick={() =>
//                               handleSubmitAssessment(
//                                 classroom.liveclassroomassessments
//                               )
//                             }
//                             disabled={submittingAssessment}
//                             className="mt-2 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-all duration-3 hover:scale-105 hover:shadow-xl bg-gradient-to-r from-green-6 to-teal-6 hover:from-green-7 hover:to-teal-7"
//                             variant={"gradient"}
//                           >
//                             {submittingAssessment
//                               ? "Submitting..."
//                               : "Submit Answers"}
//                           </Button>
//                         ) : (
//                           <div className="p-4 bg-blue-50 border border-blue-2 rounded-md">
//                             <p className="text-lg font-bold text-blue-8">
//                               Assessment Completed!
//                             </p>
//                             {submissionSuccess && (
//                               <p className="text-green-6 mt-2">
//                                 Your answers have been submitted.
//                               </p>
//                             )}
//                             <p className="text-gray-7 mt-2">
//                               Review your answers above.
//                             </p>
//                           </div>
//                         )}

//                         {submissionError && (
//                           <p className="text-red-6 mt-2">{submissionError}</p>
//                         )}
//                       </div>
//                       {classroom?.meeting_url && (
//                         <div className="mt-6">
//                           <p className="text-gray-7 text-lg mb-4">
//                             Ready to dive into the learning?
//                           </p>
//                           <Button
//                             onClick={() => {
//                               const encodedMeetingUrl = encodeURIComponent(
//                                 classroom.meeting_url
//                               );
//                               navigate(
//                                 `/student/meeting-view?url=${encodedMeetingUrl}`
//                               );
//                             }}
//                             className="mt-2 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-all duration-3 hover:scale-105 hover:shadow-xl bg-gradient-to-r from-purple-6 to-indigo-6 hover:from-purple-7 hover:to-indigo-7"
//                             variant={"gradient"}
//                           >
//                             🚀 Join the Live Session Now!
//                           </Button>
//                         </div>
//                       )}
//                     </>
//                   ) : (
//                     <div className="text-center">
//                       <FiPlayCircle className="w-16 h-16 text-[red] mb-4 mx-auto" />
//                       <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-8 mb-2">
//                         No Live Class Assessments Available Yet!
//                       </h2>
//                       <p className="text-md sm:text-lg text-gray-6 max-w-prose mx-auto mt-5">
//                         It looks like the{" "}
//                         <span className="font-bold">
//                           assessment for this live session isn't ready yet.
//                         </span>{" "}
//                         Please check back later or join the live session if it's
//                         ongoing.
//                       </p>
//                       {classroom?.meeting_url && (
//                         <div className="mt-6">
//                           <p className="text-gray-7 text-lg mb-4">
//                             Ready to dive into the learning?
//                           </p>
//                           <Button
//                             onClick={() => {
//                               const encodedMeetingUrl = encodeURIComponent(
//                                 classroom.meeting_url
//                               );
//                               navigate(
//                                 `/student/meeting-view?url=${encodedMeetingUrl}`
//                               );
//                             }}
//                             className="mt-2 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-all duration-3 hover:scale-105 hover:shadow-xl bg-gradient-to-r from-purple-6 to-indigo-6 hover:from-purple-7 hover:to-indigo-7"
//                             variant={"gradient"}
//                           >
//                             🚀 Join the Live Session Now!
//                           </Button>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ) : (
//               <div className=""></div>
//             )}

//             <Drawer
//               open={isDrawerOpen}
//               onClose={() => setIsDrawerOpen(false)}
//               direction="bottom"
//               className="lg:hidden"
//             >
//               <div className="p-4">
//                 <h3 className="text-xl font-semibold">Class Tools</h3>
//                 <ul className="space-y-4 mt-4">
//                   <li
//                     className={`cursor-pointer px-4 py-2 rounded-lg ${
//                       selectedTool === null ? "bg-primary text-white" : ""
//                     }`}
//                     onClick={() => setSelectedTool(null)}
//                   >
//                     Main Classroom
//                   </li>
//                   {tools.map((tool) => (
//                     <li
//                       key={tool.tool_id}
//                       className={`capitalize cursor-pointer px-4 py-2 rounded-lg ${
//                         selectedTool === tool.tool_name
//                           ? "bg-primary text-white"
//                           : ""
//                       }`}
//                       onClick={() => setSelectedTool(tool.tool_name)}
//                     >
//                       {tool.tool_name}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </Drawer>
//           </div>
//         </div>

//         <Dialog open={showGradeDialog} onOpenChange={setShowGradeDialog}>
//           <DialogContent className="max-w-3xl">
//             <DialogTitle>Assessment Grades</DialogTitle>
//             <DialogDescription>
//               {loadingGrade ? (
//                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 text-center mx-auto">
//                   {[...Array(6)].map((_, index) => (
//                     <Skeleton key={index} className="h-24 w-full rounded-md" />
//                   ))}
//                 </div>
//               ) : errorGrade ? (
//                 <p className="text-red-5">{errorGrade}</p>
//               ) : reportData && reportData.length > 0 ? (
//                 <div className="mt-4 overflow-x-auto">
//                   <table className="min-w-full divide-y text-left divide-gray-2 shadow-md rounded-md bg-white">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-6 py-3 text-xs font-medium text-gray-5 uppercase tracking-wider">
//                           Outline
//                         </th>
//                         <th className="px-6 py-3 text-xs font-medium text-gray-5 uppercase tracking-wider">
//                           Total Score
//                         </th>
//                         <th className="px-6 py-3 text-xs font-medium text-gray-5 uppercase tracking-wider">
//                           No. of Questions
//                         </th>
//                         <th className="px-6 py-3 text-xs font-medium text-gray-5 uppercase tracking-wider">
//                           Passed
//                         </th>
//                         <th className="px-6 py-3 text-xs font-medium text-gray-5 uppercase tracking-wider">
//                           Failed
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-2">
//                       {reportData.map((item, index) => (
//                         <tr
//                           key={index}
//                           className={
//                             index % 2 === 0 ? "bg-gray-50" : "bg-white"
//                           }
//                         >
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             {item.outline}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             {item.total_score}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             {item.no_of_question}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             {item.passed}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             {item.failed}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 <p>No assessment grade details available.</p>
//               )}
//             </DialogDescription>
//             <div className="mt-4 flex justify-end">
//               <Button variant="secondary" onClick={handleCloseGradeDialog}>
//                 Close
//               </Button>
//             </div>
//           </DialogContent>
//         </Dialog>

//         {showToolChat && selectedTool && (
//           <motion.div
//             initial={{ x: 300, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             exit={{ x: 300, opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             className="
//       fixed top-0 z-40
//       bg-white border-l shadow-2xl
//       flex flex-col
//       h-screen
//       right-0
//       left-[18rem]   /* ✅ Adjust for sidenav width */
//     "
//           >
//             {/* Header */}
//             <div className="flex items-center justify-between px-5 py-4 border-b bg-gray-50">
//               <h3 className="text-base font-semibold text-[#6200EE]">
//                 {selectedTool} Assistant
//               </h3>
//               <button
//                 onClick={() => setShowToolChat(false)}
//                 className="text-gray-500 hover:text-red-500 transition"
//               >
//                 ✕
//               </button>
//             </div>

//             {/* Chat Messages */}
//             <div
//               id="tool-chat-scroll"
//               className="flex-1 overflow-y-auto p-5 space-y-3 bg-gray-50"
//             >
//               {toolChatMessages.length === 0 && (
//                 <p className="text-gray-400 text-center text-sm mt-6">
//                   Start a conversation with {selectedTool}
//                 </p>
//               )}

//               {toolChatMessages.map((msg, i) => (
//                 <div
//                   key={i}
//                   className={`flex ${
//                     msg.fromUser ? "justify-end" : "justify-start"
//                   }`}
//                 >
//                   <div
//                     className={`p-3 rounded-2xl max-w-[75%] text-sm ${
//                       msg.fromUser
//                         ? "bg-[#6200EE] text-white rounded-tr-none"
//                         : "bg-white text-gray-800 rounded-tl-none border"
//                     }`}
//                   >
//                     {/* Copy + Voice + Pause Buttons for AI Messages */}
//                     {!msg.fromUser && (
//                       <div className="flex justify-end gap-3 mb-1 text-xs text-gray-500">
//                         {/* Copy */}
//                         <button
//                           onClick={() => {
//                             navigator.clipboard.writeText(msg.text);
//                             const toast = document.createElement("div");
//                             toast.innerText = "Copied!";
//                             toast.className =
//                               "fixed bottom-6 right-6 bg-green-600 text-white text-sm px-3 py-2 rounded-md shadow-md animate-fadeInOut z-[9999]";
//                             document.body.appendChild(toast);
//                             setTimeout(() => toast.remove(), 1200);
//                           }}
//                           className="hover:text-[#6200EE] flex items-center gap-1"
//                           title="Copy"
//                         >
//                           <FiCopy size={14} /> Copy
//                         </button>

//                         {/* Voice Play / Pause */}
//                         <button
//                           onClick={() => {
//                             if (window.speechSynthesis.speaking) {
//                               window.speechSynthesis.cancel();
//                               setIsSpeaking(false);
//                             } else {
//                               const utterance = new SpeechSynthesisUtterance(
//                                 msg.text
//                               );
//                               setIsSpeaking(true);
//                               utterance.onend = () => setIsSpeaking(false);
//                               window.speechSynthesis.speak(utterance);
//                             }
//                           }}
//                           className="hover:text-[#6200EE] flex items-center gap-1"
//                           title={isSpeaking ? "Pause Voice" : "Play Voice"}
//                         >
//                           {isSpeaking ? (
//                             <>
//                               <FiPause size={14} /> Pause
//                             </>
//                           ) : (
//                             <>
//                               <FiVolume2 size={14} /> Voice
//                             </>
//                           )}
//                         </button>
//                       </div>
//                     )}
//                     <p className="whitespace-pre-wrap break-words">
//                       {msg.text}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//               <div ref={messagesEndRef} />
//             </div>

//             {/* Input Area */}
//             <div className="border-t p-4 bg-white flex items-center gap-3">
//               <input
//                 value={toolChatInput}
//                 onChange={(e) => setToolChatInput(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && handleToolChatSend()}
//                 placeholder={`Ask ${selectedTool}...`}
//                 className="flex-grow border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#6200EE] outline-none bg-gray-50"
//               />

//               {/* 🎙 Voice Input Button */}
//               <button
//                 onClick={() => handleVoiceInput()}
//                 className={`p-3 rounded-full border text-[#6200EE] hover:bg-[#EFE6FD] transition ${
//                   isListening ? "bg-[#EFE6FD]" : ""
//                 }`}
//                 title="Voice Input"
//               >
//                 <FiMic
//                   className={`${isListening ? "text-[#6200EE]" : ""}`}
//                   size={18}
//                 />
//               </button>

//               {/* 📨 Send Button */}
//               <button
//                 onClick={() => handleToolChatSend()}
//                 disabled={!toolChatInput.trim() || toolChatLoading}
//                 className={`p-3 rounded-full text-white ${
//                   toolChatLoading
//                     ? "bg-gray-400"
//                     : "bg-[#6200EE] hover:bg-[#5300d6]"
//                 }`}
//               >
//                 <FiSend size={18} />
//               </button>
//             </div>
//           </motion.div>
//         )}
//       </div>
//       {showCallPopup && (
//         <CallPopup
//           onClose={stopAudioRecording}
//           isSpeaking={isSpeaking}
//           isVoiceRecording={isVoiceRecording}
//           remainingTime={remainingCallTime}
//         />
//       )}
//       <audio ref={audioPlayerRef} autoPlay style={{ display: "none" }} />
//       <Toast
//         open={toastOpen}
//         onOpenChange={setToastOpen}
//         variant={toastVariant}
//       >
//         <ToastTitle>{toastMessage}</ToastTitle>
//       </Toast>
//       <ToastViewport />
//     </ToastProvider>
//   );
// };

// export default Classroom;



import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useParams, useLocation, Routes, Route } from "react-router-dom";
import {
  FiSend,
  FiCopy,
  FiMic,
  FiVolume2,
  FiPause,
  FiX,
  FiPaperclip,
  FiMessageCircle,
} from "react-icons/fi";
import { Button } from "../../../components/ui/Button";
import { TextArea } from "../../../components/ui/TextArea";
import { Undo2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  createClassroomSuggestion,
  fetchClassroomByIdThunk,
} from "../../../store/slices/classroomSlice";
import { RootState, AppDispatch } from "../../../store";
import { motion } from "framer-motion";
import {
  listTranscripts,
  getLiveClassById,
  getTranscriptDetails,
  getTranscriptAssessment,
} from "../../../api/liveclass";
import {
  sendClassroomMessage,
  sendClassroomToolMessage,
  sendClassroomOutlineMessage,
} from "../../../api/studentclassroom";
import { sendClassroomOutlineAssessment } from "../../../api/studentassignment";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import greyImg from "../../../assets/img/greyimg.avif";
import {
  SpeechRecognition,
  SpeechRecognitionEvent,
  SpeechRecognitionResultList,
} from "../../../interfaces";
import MarkdownRenderer from "../_components/MarkdownRenderer";
import { useMaterialTailwindController } from "../../../context";
import { Sidenav } from "../classrooms/components/Sidenav";
import { markOutlineAsRead } from "../../../api/studentassignment";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import {
  DashboardNavbar,
  Configurator,
  Footer,
} from "../../../components/layout";
import { LightBulbIcon } from "@heroicons/react/24/outline";
import { AssessmentReportItem } from "../classrooms/components/Sidenav";
import { getOutlineAssessmentReport } from "../../../api/studentassignment";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogFooter,
} from "../../../components/ui/Dialogue";
import { Skeleton } from "../../../components/ui/Skeleton";
import {
  loadClassroomChatHistory,
  loadToolChatHistory,
} from "../../../api/chat";
import { sendLiveClassroomAssessmentAnswers } from "../../../api/liveclass";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastViewport,
} from "../../../components/ui/Toast";
import { getEphemeralKey } from "../../../api/chat";
import CallPopup from "./CallPopUp";
import {
  ClassroomVoiceTypelist,
  gradeOptions,
  languageOptions,
} from "../tools/data";
import VoiceIcon from "../../../assets/img/voiceIcon.svg";
import SimulationDashboardPage from "../tools/SimulationPage";
import StudentNavbar from "../../../components/layout/Student-Navbar";
import { FiPlayCircle } from "react-icons/fi";
import { button } from "@material-tailwind/react";
import Participant from "./Particpant";
import { FaHeart } from "react-icons/fa";
import Avatar from "../../../assets/img/0e846ab4-992d-48b3-a818-d62a7803bd8e 1.png";
import StudentClass from "./StudentChat";
import { Outlet } from "react-router-dom";
import { AiFillCloseCircle } from "react-icons/ai";

type OutlineType = {
  name: string;
  path: string;
  classroomoutline_id: string;
  assessmentStatus?: string;
  assessments?: any[];
  mark_as_read?: number;
};

const suggestedTopics = [
  "What is climate change?",
  "Explain the water cycle.",
  "History of Nigeria's independence.",
  "Basic algebra for beginners.",
  "Photosynthesis in plants.",
];

const Classroom = () => {
  const { id: classroomId } = useParams();
  const location = useLocation();

  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
    "default"
  );
  const [showToolChat, setShowToolChat] = useState(false);
  const [toolChatMessages, setToolChatMessages] = useState<any[]>([]);
  const [toolChatInput, setToolChatInput] = useState("");
  const [toolChatLoading, setToolChatLoading] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [selectedOutline, setSelectedOutline] = useState<any>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [errorHistory, setErrorHistory] = useState<string | null>(null);
  const [historyPage, setHistoryPage] = useState(0);
  const historyLimit = 40;
  const [allHistoryLoaded, setAllHistoryLoaded] = useState(false);
  const [loadingToolHistory, setLoadingToolHistory] = useState(false);
  const [errorToolHistory, setErrorToolHistory] = useState<string | null>(null);
  const [previouslySelectedTool, setPreviouslySelectedTool] = useState<
    string | null
  >(null);
  const [loadedToolHistory, setLoadedToolHistory] = useState<string | null>(
    null
  );
  const [toolHistoryPage, setToolHistoryPage] = useState(0);
  const toolHistoryLimit = 40;
  const [allToolHistoryLoaded, setAllToolHistoryLoaded] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // OpenAI Realtime API specific refs and states
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const audioWorkletNodeRef = useRef<AudioWorkletNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioQueueRef = useRef<Int16Array[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const isPlayingAudioRef = useRef(false);

  // WebRTC specific refs and states
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const audioElement = useRef<HTMLAudioElement | null>(null);
  const [showCallPopup, setShowCallPopup] = useState(false);

  const [messages, setMessages] = useState<{
    [key: string]: {
      text: string;
      fromUser: boolean;
      isLoading?: boolean;
      isHistory?: boolean;
    }[];
  }>({ main: [] });

  const [previousCurrentMessages, setPreviousCurrentMessages] = useState<{
    [key: string]: { text: string; fromUser: boolean; isLoading?: boolean }[];
  }>({ main: [] });
  const [totalClassroomHistoryPages, setTotalClassroomHistoryPages] =
    useState(0);
  const [totalToolHistoryPages, setTotalToolHistoryPages] = useState(0);

  const [userDetails, setUserDetails] = useState<any>(null);
  const [viewState, setViewState] = useState("classroom");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [selectedOverview, setSelectedOverview] = useState(true);
  const [showDialog, setShowDialog] = React.useState(false);
  const [showGradeDialog, setShowGradeDialog] = React.useState(false);
  const [reportData, setReportData] = React.useState<
    AssessmentReportItem[] | null
  >(null);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);

  const [loadingGrade, setLoadingGrade] = React.useState(false);
  const [errorGrade, setErrorGrade] = React.useState<string | null>(null);

  const classroom = useSelector(
    (state: RootState) => state.classrooms.selectedClassroom
  );
  const fetchingClassroom = useSelector(
    (state: RootState) => state.classrooms.fetchingClassroom
  );

  const tools = classroom?.tools || [];
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { controller } = useMaterialTailwindController();
  const { sidenavType } = controller;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentLiveClass, setCurrentLiveClass] = useState<any | null>(null);
  const [allTranscriptsWithAssessments, setAllTranscriptsWithAssessments] =
    useState<any[]>([]);
  const [loadingLiveClassData, setLoadingLiveClassData] =
    useState<boolean>(false);
  const [errorLiveClassData, setErrorLiveClassData] = useState<string | null>(
    null
  );

  const [isEmailVerified, setIsEmailVerified] = useState<number>(0);
  const [studentAnswers, setStudentAnswers] = useState<{
    [questionId: number]: string;
  }>({});

  const [submittingAssessment, setSubmittingAssessment] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isAssessmentCompleted, setIsAssessmentCompleted] = useState(false);
  const [showVoiceSettingsDialog, setShowVoiceSettingsDialog] = useState(false);
  const [selectedVoiceType, setSelectedVoiceType] = useState("alloy");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [selectedGrade, setSelectedGrade] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [remainingCallTime, setRemainingCallTime] = useState(0);
  const [outlines, setOutlines] = useState<OutlineType[]>([]);
  const [userrole, setIsuserRole] = useState<any>();
  const [selectedOutlines, setSelectedOutlines] = useState<any>(null);
  const outline = (classroom?.classroomoutlines || []).map((outline) => ({
    name: outline.classroomoutline_title,
    path: outline.classroomoutline_content || "#",
    classroomoutline_id: outline.classroomoutline_id,
    assessmentStatus: outline.assessment_status,
    assessments: outline.assessments,
    mark_as_read: outline.mark_as_read,
  }));
  const { classroomTopic } = useSelector(
    (state: RootState) => state.classrooms
  );

  const [isListening, setIsListening] = useState(false);

  // 🎙 Voice-to-Text Handler
  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setToolChatInput((prev) => prev + (prev ? " " : "") + transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  // Redirect to the correct URL if classroomId is undefined
  useEffect(() => {
    if (!classroomId) {
      const storedClassroomId = localStorage.getItem('currentClassroomId');
      if (storedClassroomId) {
        navigate(`/class/class-details/${storedClassroomId}${location.pathname.includes('/intro') ? '/intro' : ''}`);
      }
    } else {
      localStorage.setItem('currentClassroomId', classroomId);
    }
  }, [classroomId]);

  // ✅ Load saved chat history
  useEffect(() => {
    const saved = localStorage.getItem(`toolChat_${selectedTool}`);
    if (saved) {
      setToolChatMessages(JSON.parse(saved));
    }
  }, [selectedTool]);

  // ✅ Save chat history automatically
  useEffect(() => {
    if (toolChatMessages.length > 0 && selectedTool) {
      localStorage.setItem(
        `toolChat_${selectedTool}`,
        JSON.stringify(toolChatMessages)
      );
    }
  }, [toolChatMessages, selectedTool]);

  // ✅ Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const chatEnd = document.getElementById("tool-chat-scroll");
    chatEnd?.scrollTo({ top: chatEnd.scrollHeight, behavior: "smooth" });
  }, [toolChatMessages]);

  const MAX_CALL_DURATION_SECONDS = 30 * 60;
  const handleOverviewClick = () => {
    setSelectedOverview(true);

    console.log("selectedOverview", selectedOverview);
  };

  const [showTopicPopup, setShowTopicPopup] = useState(false);
  // useEffect(() => {
  //   if (messagesEndRef.current) {
  //     messagesEndRef.current.scrollIntoView();
  //   }
  // }, [messages, selectedTool]);

  useEffect(() => {
    const userDetailsFromStorage = localStorage.getItem("ai-teacha-user");
    if (userDetailsFromStorage) {
      const parsedDetails = JSON.parse(userDetailsFromStorage);
      setUserDetails(parsedDetails);
    }
  }, []);

  useEffect(() => {
    if (outline.length > 0 && !selectedOutlines) {
      setSelectedOutlines(outlines[0]);
    }
  }, [outlines]);

  const playNextAudioChunk = useCallback(() => {
    if (
      !audioContextRef.current ||
      !isPlayingAudioRef.current ||
      audioQueueRef.current.length === 0
    ) {
      return;
    }

    const chunk = audioQueueRef.current.shift();
    if (!chunk) return;

    const audioBuffer = audioContextRef.current.createBuffer(
      1,
      chunk.length,
      audioContextRef.current.sampleRate
    );
    const float32Data = audioBuffer.getChannelData(0);

    for (let i = 0; i < chunk.length; i++) {
      float32Data[i] = chunk[i] / 32768.0;
    }

    audioSourceRef.current = audioContextRef.current.createBufferSource();
    audioSourceRef.current.buffer = audioBuffer;
    audioSourceRef.current.connect(audioContextRef.current.destination);

    audioSourceRef.current.onended = () => {
      if (isPlayingAudioRef.current) {
        playNextAudioChunk();
      }
    };

    audioSourceRef.current.start();
  }, []);

  useEffect(() => {
    if (!classroom) return;
    dispatch(
      createClassroomSuggestion({
        description: classroom.classroom_description || "",
        grade: classroom.grade || "",
        classroom_id: classroom.classroom_id || "",
        classroom_content: classroom.content || "",
        outline_title: classroom.classroomoutlines || "",
        outline_content: classroom.classroomoutlines || "",
      })
    );
  }, [classroom]);

  useEffect(() => {
    if (!classroom) return;

    let intervalId: NodeJS.Timeout;

    const initialTimeout = setTimeout(() => {
      dispatch(
        createClassroomSuggestion({
          description: classroom.classroom_description || "",
          grade: classroom.grade || "",
          classroom_id: classroom.classroom_id || "",
          classroom_content: classroom.content || "",
          outline_title: classroom.classroomoutlines || "",
          outline_content: classroom.classroomoutlines || "",
        })
      );

      setShowTopicPopup(true);

      intervalId = setInterval(() => {
        dispatch(
          createClassroomSuggestion({
            description: classroom.classroom_description || "",
            grade: classroom.grade || "",
            classroom_id: classroom.classroom_id || "",
            classroom_content: classroom.content || "",
            outline_title: classroom.classroomoutlines || "",
            outline_content: classroom.classroomoutlines || "",
          })
        );

        setShowTopicPopup(true);
      }, 10 * 60 * 1000);
    }, 60 * 1000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(intervalId);
    };
  }, [classroom, dispatch]);

  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
    if (!analyserRef.current) {
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
      if (sourceNodeRef.current) {
        sourceNodeRef.current.disconnect();
        sourceNodeRef.current = null;
      }
      if (audioWorkletNodeRef.current) {
        audioWorkletNodeRef.current.disconnect();
        audioWorkletNodeRef.current = null;
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      if (audioSourceRef.current) {
        audioSourceRef.current.stop();
        audioSourceRef.current.disconnect();
        audioSourceRef.current = null;
      }
      isPlayingAudioRef.current = false;
      audioQueueRef.current = [];

      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current
          .close()
          .catch((e) => console.error("Error closing AudioContext:", e));
        audioContextRef.current = null;
      }
      analyserRef.current = null;
    };
  }, []);

  useEffect(() => {
    const userDetailsFromStorage = localStorage.getItem("ai-teacha-user");
    if (userDetailsFromStorage) {
      if (userDetailsFromStorage) {
        const parsedDetails = JSON.parse(userDetailsFromStorage);
        setUserDetails(parsedDetails);
        setIsuserRole(parsedDetails.role_id || parsedDetails.role);
      }
    }
  }, []);

  const drawVisualization = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;

    if (!canvas || !analyser) {
      return;
    }

    const canvasCtx = canvas.getContext("2d");
    if (!canvasCtx) {
      return;
    }
    console.log("Wave visualization started.");
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);

      if (!isVoiceRecording || !analyser) {
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      analyser.getByteFrequencyData(dataArray);

      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      canvasCtx.fillStyle = "rgb(0, 0, 0)";
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i];

        canvasCtx.fillStyle = "rgb(" + (barHeight + 100) + ",50,50)";
        canvasCtx.fillRect(
          x,
          canvas.height - barHeight / 2,
          barWidth,
          barHeight / 2
        );

        x += barWidth + 1;
      }
    };

    draw();
  };
  const startAudioRecording = async (
    voiceType: string,
    language: string,
    grade: string
  ) => {
    if (!navigator.mediaDevices || !window.RTCPeerConnection || !window.Audio) {
      alert("Your browser does not support WebRTC or audio.");
      return;
    }

    if (isSessionActive) {
      console.log("Session already active.");
      return;
    }

    setSubmittingAssessment(true);
    setSubmissionError(null);
    setShowCallPopup(true);
    setShowVoiceSettingsDialog(false);

    try {
      const outlineTitlesString = classroom?.classroomoutlines
        ?.map((outline) => outline.classroomoutline_title)
        .filter(Boolean)
        .join(", ");

      const tokenResponse = await getEphemeralKey({
        voice_type: voiceType,
        language: language,
        grade: grade,
        description: classroom?.class_intro || "",
        topics: outlineTitlesString || "",
      });
      const EPHEMERAL_KEY = tokenResponse.data.client_secret.value;

      const pc = new RTCPeerConnection();
      peerConnection.current = pc;

      pc.onconnectionstatechange = () => {
        console.log("Peer Connection State:", pc.connectionState);
        if (
          pc.connectionState === "disconnected" ||
          pc.connectionState === "failed" ||
          pc.connectionState === "closed"
        ) {
          console.warn("Peer connection no longer active, ensuring cleanup.");
          if (isSessionActive) {
            stopAudioRecording();
          }
        }
      };

      if (!audioElement.current) {
        audioElement.current = new Audio();
        audioElement.current.autoplay = true;
        audioElement.current.onerror = (e) => {
          console.error("Audio element error:", e);
          setToastMessage("Audio playback error. Please try again.");
          setToastVariant("destructive");
          setToastOpen(true);
        };
      }
      pc.ontrack = (e) => {
        if (audioElement.current) {
          audioElement.current.srcObject = e.streams[0];
          setIsSpeaking(true);
          audioElement.current.onended = () => setIsSpeaking(false);
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      mediaStreamRef.current = mediaStream;
      mediaStream
        .getTracks()
        .forEach((track) => pc.addTrack(track, mediaStream));

      const dc = pc.createDataChannel("oai-events");
      setDataChannel(dc);

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const baseUrl = "https://api.openai.com/v1/realtime";
      const model = "gpt-4o-realtime-preview-2024-12-17";
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp",
        },
      });

      const answer: RTCSessionDescriptionInit = {
        type: "answer",
        sdp: await sdpResponse.text(),
      };
      await pc.setRemoteDescription(answer);

      setIsVoiceRecording(true);
      setSubmittingAssessment(false);

      dc.onmessage = (e) => {
        const event = JSON.parse(e.data);
        switch (event.type) {
          case "response.audio_transcript.delta": {
            setMessages((prev) => {
              const currentKey = selectedTool ? selectedTool : "main";
              const currentMessagesForDisplay = [...(prev[currentKey] || [])];
              const lastMessage =
                currentMessagesForDisplay[currentMessagesForDisplay.length - 1];

              if (lastMessage && !lastMessage.fromUser) {
                if (lastMessage.isLoading) {
                  lastMessage.text = event.delta;
                  lastMessage.isLoading = false;
                } else {
                  lastMessage.text += event.delta;
                }
              } else {
                currentMessagesForDisplay.push({
                  text: event.delta,
                  fromUser: false,
                  isLoading: false,
                });
              }
              return { ...prev, [currentKey]: currentMessagesForDisplay };
            });
            break;
          }
          case "response.done": {
            setMessages((prev) => {
              const currentKey = selectedTool ? selectedTool : "main";
              return {
                ...prev,
                [currentKey]: (prev[currentKey] || []).map((msg) =>
                  msg.isLoading ? { ...msg, isLoading: false } : msg
                ),
              };
            });
            break;
          }
          case "conversation.item.created": {
            if (event.item.type === "message" && event.item.role === "user") {
              const userTranscript = event.item.content[0]?.text;
              if (userTranscript) {
                setMessages((prev) => {
                  const currentKey = selectedTool ? selectedTool : "main";
                  const filteredMessages = (prev[currentKey] || []).filter(
                    (msg) => !(msg.fromUser && msg.isLoading)
                  );
                  return {
                    ...prev,
                    [currentKey]: [
                      ...filteredMessages,
                      {
                        text: userTranscript,
                        fromUser: true,
                        isLoading: false,
                      },
                    ],
                  };
                });
              }
            }
            break;
          }
          case "error": {
            console.error("OpenAI WebRTC Error:", event);
            setToastMessage(
              `OpenAI Error: ${event.message || "An unknown error occurred."}`
            );
            setToastVariant("destructive");
            setToastOpen(true);
            stopAudioRecording();
            break;
          }
          default: {
            console.log(
              "Unhandled OpenAI event (DataChannel):",
              event.type,
              event
            );
          }
        }
      };

      dc.onopen = () => {
        setIsSessionActive(true);
        setMessages((prev) => ({ ...prev, [getMessageKey()]: [] }));

        setRemainingCallTime(MAX_CALL_DURATION_SECONDS);
        countdownIntervalRef.current = setInterval(() => {
          setRemainingCallTime((prevTime) => {
            if (prevTime <= 1) {
              clearInterval(countdownIntervalRef.current as NodeJS.Timeout);
              countdownIntervalRef.current = null;
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);

        timerRef.current = setTimeout(() => {
          console.log("30-minute timer expired. Ending call...");
          stopAudioRecording();
          setToastMessage("Your voice session has ended after 30 minutes.");
          setToastVariant("default");
          setToastOpen(true);
        }, MAX_CALL_DURATION_SECONDS * 1000);

        drawVisualization();
      };

      dc.onclose = () => {
        console.log("Data Channel Closed.");
        stopAudioRecording();
      };

      dc.onerror = (error) => {
        console.error("Data Channel Error:", error);
        setToastMessage("Data channel error. Please try again.");
        setToastVariant("destructive");
        setToastOpen(true);
        stopAudioRecording();
      };
    } catch (err: any) {
      console.error("Error starting WebRTC session:", err);
      setSubmissionError(
        err.message ||
          "Failed to start WebRTC session. Check microphone permissions."
      );
      setToastMessage(
        err.message ||
          "Failed to start WebRTC session. Check microphone permissions."
      );
      setToastVariant("destructive");
      setToastOpen(true);
      setSubmittingAssessment(false);
      stopAudioRecording();
    }
  };

  const stopAudioRecording = () => {
    console.log("Stopping WebRTC session...");

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      console.log("Call duration auto-end timer cleared.");
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
      console.log("Countdown interval cleared.");
    }
    setRemainingCallTime(0);

    if (dataChannel) {
      dataChannel.close();
      setDataChannel(null);
    }

    if (peerConnection.current) {
      peerConnection.current.getSenders().forEach((sender) => {
        if (sender.track) {
          sender.track.stop();
        }
      });
      peerConnection.current.close();
      peerConnection.current = null;
    }

    if (audioElement.current) {
      audioElement.current.pause();
      audioElement.current.srcObject = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    setIsSessionActive(false);
    setIsVoiceRecording(false);
    setIsSpeaking(false);
    setShowCallPopup(false);

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    audioQueueRef.current = [];
    isPlayingAudioRef.current = false;
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.stop();
        audioSourceRef.current.disconnect();
      } catch (e) {
        console.warn("AudioSourceNode already stopped or not connected:", e);
      } finally {
        audioSourceRef.current = null;
      }
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current
        .close()
        .catch((e) => console.error("Error closing AudioContext:", e));
      audioContextRef.current = null;
    }
    analyserRef.current = null;

    console.log("WebRTC Session stopped.");
  };
  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
    if (!analyserRef.current) {
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
      if (sourceNodeRef.current) {
        sourceNodeRef.current.disconnect();
        sourceNodeRef.current = null;
      }
      if (audioWorkletNodeRef.current) {
        audioWorkletNodeRef.current.disconnect();
        audioWorkletNodeRef.current = null;
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      if (audioSourceRef.current) {
        audioSourceRef.current.stop();
        audioSourceRef.current.disconnect();
        audioSourceRef.current = null;
      }
      isPlayingAudioRef.current = false;
      audioQueueRef.current = [];

      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current
          .close()
          .catch((e) => console.error("Error closing AudioContext:", e));
        audioContextRef.current = null;
      }
      analyserRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(fetchClassroomByIdThunk(Number(id)));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (!classroom) {
      setIsAssessmentCompleted(false);
      setStudentAnswers({});
      return;
    }
    const completed = classroom.liveclassassessment_status === "submitted";
    setIsAssessmentCompleted(completed);

    if (
      completed ||
      classroom.liveclassroomassessments.some(
        (q) => q.liveclassroomassessment_student_answer !== null
      )
    ) {
      const initialAnswers: { [key: number]: string } = {};
      classroom.liveclassroomassessments.forEach((q) => {
        if (q.liveclassroomassessment_student_answer !== null) {
          initialAnswers[q.liveclassroomassessment_id] =
            q.liveclassroomassessment_student_answer;
        }
      });
      setStudentAnswers(initialAnswers);
    }
  }, [classroom]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current
          .close()
          .catch((e) => console.error("Error closing AudioContext:", e));
        audioContextRef.current = null;
      }
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
      if (sourceNodeRef.current) {
        sourceNodeRef.current.disconnect();
      }
    };
  }, []);

  // console.log("selectedtools",selectedTool)

  useEffect(() => {
    let newMessage: string = classroom?.content || "";
    console.log("selectedOverview", selectedOverview);
    if (selectedOverview) {
      if (!newMessage) {
        newMessage = `Hi👋 ${
          userDetails?.firstname || "there"
        }, welcome to class "<strong>${
          classroom?.classroom_name || "the classroom"
        }</strong>." Start your conversation here!`;
      }
    } else if (newMessage && selectedTool) {
      newMessage = `Hi👋 ${
        userDetails?.firstname || "there"
      }, welcome to <strong>${selectedTool}</strong>. Start your conversation here!`;
    } else if (newMessage && selectedOutline) {
      newMessage = selectedOutline.path || "Welcome to the selected outline.";
    } else if (!newMessage && selectedOutline) {
      newMessage = selectedOutline.path || "Welcome to the selected outline.";
    } else if (!newMessage) {
      newMessage = `Hi👋 ${
        userDetails?.firstname || "there"
      }, welcome to class "<strong>${
        classroom?.classroom_name || "the classroom"
      }</strong>." Start your conversation here!`;
    }

    setWelcomeMessage(newMessage);
  }, [selectedOutline, selectedTool, classroom, userDetails, selectedOverview]);

  useEffect(() => {
    const fetchClassroomHistory = async () => {
      if (id && !selectedTool && !previouslySelectedTool && historyPage === 0) {
        setLoadingHistory(true);
        setErrorHistory(null);
        try {
          const historyData = await loadClassroomChatHistory(
            Number(id),
            historyLimit,
            historyPage
          );
          if (historyData?.data && Array.isArray(historyData.data)) {
            setMessages((prevMessages) => ({
              ...prevMessages,
              main: [
                ...historyData.data.map((msg: any) => ({
                  text: msg.content,
                  fromUser: msg.label === "question",
                  isHistory: true,
                })),
                ...(prevMessages.main || []),
              ],
            }));
            setTotalClassroomHistoryPages(historyData.count || 0);
            if (
              historyData.data.length < historyLimit ||
              historyData.count <= 1
            ) {
              setAllHistoryLoaded(true);
            }
          } else if (historyData?.count === 0) {
            setTotalClassroomHistoryPages(0);
            setMessages((prevMessages) => ({ ...prevMessages, main: [] }));
            setAllHistoryLoaded(true);
          }
        } catch (error: any) {
          console.error("Error loading classroom chat history:", error);
          setErrorHistory(error.message || "Failed to load chat history.");
        } finally {
          setLoadingHistory(false);
        }
      }
    };

    fetchClassroomHistory();
  }, [id, historyPage, historyLimit, selectedTool, previouslySelectedTool]);

  useEffect(() => {
    const fetchToolHistory = async () => {
      if (
        id &&
        selectedTool &&
        selectedTool !== previouslySelectedTool &&
        toolHistoryPage === 0
      ) {
        setLoadingToolHistory(true);
        setErrorToolHistory(null);
        try {
          const tool = tools.find((t) => t.tool_name === selectedTool);
          if (tool?.tool_id) {
            const historyData = await loadToolChatHistory(
              Number(id),
              tool.tool_id,
              toolHistoryLimit,
              toolHistoryPage
            );
            if (historyData?.data && Array.isArray(historyData.data)) {
              setMessages((prevMessages) => ({
                ...prevMessages,
                [selectedTool]: [
                  ...historyData.data.map((msg: any) => ({
                    text: msg.content,
                    fromUser: msg.label === "question",
                    isHistory: true,
                  })),
                  ...(prevMessages[selectedTool] || []),
                ],
              }));
              setPreviouslySelectedTool(selectedTool);
              setTotalToolHistoryPages(historyData.count || 0);
              if (
                historyData.data.length < toolHistoryLimit ||
                historyData.count <= 1
              ) {
                setAllToolHistoryLoaded(true);
              }
            } else if (historyData?.count === 0) {
              setTotalToolHistoryPages(0);
              setMessages((prevMessages) => ({
                ...prevMessages,
                [selectedTool]: [],
              }));
              setAllToolHistoryLoaded(true);
            }
          }
        } catch (error: any) {
          console.error(
            `Error loading chat history for tool ${selectedTool}:`,
            error
          );
          setErrorToolHistory(
            error.message || `Failed to load chat history for ${selectedTool}.`
          );
          setMessages((prevMessages) => ({
            ...prevMessages,
            [selectedTool]: [],
          }));
          setPreviouslySelectedTool(null);
        } finally {
          setLoadingToolHistory(false);
        }
      } else if (id && !selectedTool) {
        setPreviouslySelectedTool(null);
        const { [getMessageKey()]: _, ...rest } = messages;
        setMessages(rest);
        setToolHistoryPage(0);
        setAllToolHistoryLoaded(false);
        setErrorToolHistory(null);
        setLoadingToolHistory(false);
        setTotalToolHistoryPages(0);
      }
    };

    fetchToolHistory();
  }, [
    id,
    selectedTool,
    tools,
    toolHistoryPage,
    toolHistoryLimit,
    previouslySelectedTool,
  ]);

  useEffect(() => {
    setPreviousCurrentMessages(messages);
  }, [messages]);

  const sendAllAnswers = (assessments: any[]) => {
    const answerData = {
      classroom_id: classroom?.classroom_id,
      outline_id: selectedOutline?.classroomoutline_id,
      answers: assessments
        .map((assessment) => {
          const selectedAnswer = document.querySelector(
            `input[name="${assessment.outlineassessment_id}"]:checked`
          ) as HTMLInputElement;

          return {
            outline_assessment_id: assessment.outlineassessment_id,
            question: assessment.outlineassessment_question,
            student_answer: selectedAnswer?.value || null,
          };
        })
        .filter((answer) => answer.student_answer !== null),
    };

    if (answerData.answers.length === 0) {
      alert("Please select answers for all questions.");
      return;
    }

    setLoading(true);

    sendClassroomOutlineAssessment(answerData)
      .then((response) => {
        console.log("Answers sent:", response);
        setLoading(false);
        dispatch(fetchClassroomByIdThunk(Number(id)));
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error sending answers:", error);
        setLoading(false);
      });
  };

  interface MessageData {
    classroom_id: number;
    classname: string;
    description: string;
    scope_restriction: boolean;
    grade: string;
    student_message: string;
    content_from: string;
    file_content: any[];
    tool_name?: string;
    tool_id?: number;
    tool_description?: string;
    outline_content?: any;
    outline_title?: any;
  }

  const getMessageKey = () => {
    if (selectedOutline) {
      return "outline";
    }
    return selectedTool || "main";
  };

  const currentMessages =
    selectedOutline &&
    (!messages["outline"] || messages["outline"].length === 0)
      ? []
      : messages[getMessageKey()] || [];

  console.log("currentmessage", currentMessages, selectedOutline);

  const previousMessages =
    selectedOutline &&
    (!previousCurrentMessages["outline"] ||
      previousCurrentMessages["outline"].length === 0)
      ? []
      : previousCurrentMessages[getMessageKey()]?.slice(
          0,
          -currentMessages.length
        ) || [];

  const handleMarkAsRead = async (outlineId: number) => {
    if (!classroom) return;

    setLoading(true);
    try {
      await markOutlineAsRead(outlineId, classroom.classroom_id);
      setSelectedOutline({ ...selectedOutline, mark_as_read: 1 });
      window.location.reload();
    } catch (error) {
      console.error("Error marking outline as read:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleSend = async () => {
    if (!inputText.trim()) return;
    setSelectedOutline(null);
    setSelectedOverview(false);
    let currentKey = selectedOverview
      ? "main"
      : selectedTool
      ? selectedTool
      : "main";
    console.log(currentKey);

    setMessages((prev) => ({
      ...prev,
      [currentKey]: [
        ...(prev[currentKey] || []),
        { text: inputText, fromUser: true, isLoading: false },
      ],
    }));

    setInputText("");

    setMessages((prev) => ({
      ...prev,
      [currentKey]: [
        ...(prev[currentKey] || []),
        {
          text: `${classroom?.author} AI Assistant typing...`,
          fromUser: false,
          isLoading: true,
        },
      ],
    }));

    let messageData: MessageData = selectedTool
      ? {
          classroom_id: classroom?.classroom_id || 0,
          classname: classroom?.classroom_name || "",
          description: classroom?.classroom_description || "",
          scope_restriction: classroom?.scope_restriction || true,
          grade: classroom?.grade || "",
          student_message: inputText,
          content_from: "classroom_tools",
          file_content:
            classroom?.classroomresources?.map(
              (resource) => resource.file_content
            ) || [],
          tool_name: selectedTool || "",
          tool_id:
            tools.find((tool) => tool.tool_name === selectedTool)?.tool_id || 0,
          tool_description:
            tools.find((tool) => tool.tool_name === selectedTool)
              ?.tool_description || "",
        }
      : {
          classroom_id: classroom?.classroom_id || 0,
          classname: classroom?.classroom_name || "",
          scope_restriction: classroom?.scope_restriction || true,
          description: classroom?.classroom_description || "",
          grade: classroom?.grade || "",
          file_content: classroom?.classroomresources
            ? classroom.classroomresources.map(
                (resource) => resource.file_content
              ) || []
            : [],
          student_message: inputText,
          content_from: "classroom",
        };

    if (selectedOutline) {
      messageData = {
        ...messageData,
        outline_content: selectedOutline?.path || "",
        outline_title: selectedOutline?.name || "",
      };
    }

    let response: any;

    try {
      if (selectedOutline) {
        currentKey = "main";
        response = await sendClassroomOutlineMessage(messageData);
      } else {
        response = selectedTool
          ? await sendClassroomToolMessage(messageData)
          : await sendClassroomMessage(messageData);
      }

      setMessages((prev) => ({
        ...prev,
        [currentKey]: [
          ...(prev[currentKey] || []).filter((msg) => !msg.isLoading),
          { text: response.data, fromUser: false },
        ],
      }));
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => ({
        ...prev,
        [currentKey]: [
          ...(prev[currentKey] || []).filter((msg) => !msg.isLoading),
          {
            text: "An error occurred. Please try again later.",
            fromUser: false,
          },
        ],
      }));
    }
  };

  const handleSendTopic = async () => {
    if (!classroomTopic?.trim()) return;

    setSelectedOutline(null);
    setSelectedOverview(false);

    const currentKey = selectedOverview
      ? "main"
      : selectedTool
      ? selectedTool
      : "main";

    setSelectedOutline(null);
    console.log(currentKey);

    setMessages((prev) => ({
      ...prev,
      [currentKey]: [
        ...(prev[currentKey] || []),
        { text: classroomTopic, fromUser: true, isLoading: false },
      ],
    }));

    setMessages((prev) => ({
      ...prev,
      [currentKey]: [
        ...(prev[currentKey] || []),
        {
          text: `${classroom?.author} AI Assistant typing...`,
          fromUser: false,
          isLoading: true,
        },
      ],
    }));

    let messageData: MessageData = selectedTool
      ? {
          classroom_id: classroom?.classroom_id || 0,
          classname: classroom?.classroom_name || "",
          description: classroom?.classroom_description || "",
          scope_restriction: classroom?.scope_restriction ?? true,
          grade: classroom?.grade || "",
          student_message: classroomTopic,
          content_from: "classroom_tools",
          file_content:
            classroom?.classroomresources?.map(
              (resource) => resource.file_content
            ) || [],
          tool_name: selectedTool,
          tool_id:
            tools.find((tool) => tool.tool_name === selectedTool)?.tool_id || 0,
          tool_description:
            tools.find((tool) => tool.tool_name === selectedTool)
              ?.tool_description || "",
        }
      : {
          classroom_id: classroom?.classroom_id || 0,
          classname: classroom?.classroom_name || "",
          scope_restriction: classroom?.scope_restriction ?? true,
          description: classroom?.classroom_description || "",
          grade: classroom?.grade || "",
          file_content:
            classroom?.classroomresources?.map(
              (resource) => resource.file_content
            ) || [],
          student_message: classroomTopic,
          content_from: "classroom",
        };

    if (selectedOutline) {
      messageData = {
        ...messageData,
        outline_content: selectedOutline?.path || "",
        outline_title: selectedOutline?.name || "",
      };
    }

    try {
      const response = selectedOutline
        ? await sendClassroomOutlineMessage(messageData)
        : selectedTool
        ? await sendClassroomToolMessage(messageData)
        : await sendClassroomMessage(messageData);

      setMessages((prev) => ({
        ...prev,
        [currentKey]: [
          ...(prev[currentKey] || []).filter((msg) => !msg.isLoading),
          { text: response.data, fromUser: false },
        ],
      }));
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => ({
        ...prev,
        [currentKey]: [
          ...(prev[currentKey] || []).filter((msg) => !msg.isLoading),
          {
            text: "An error occurred. Please try again later.",
            fromUser: false,
          },
        ],
      }));
    }
  };

  const handleSubmitAssessment = async (liveAssessments: any[] | undefined) => {
    if (
      !classroom?.classroom_id ||
      !liveAssessments ||
      liveAssessments.length === 0
    ) {
      alert("No assessments or classroom ID available for submission.");
      return;
    }
    console.log(liveAssessments);

    const allAnswers: {
      liveclassroomassessment_id: number;
      question: string;
      student_answer: string;
      transcript_id?: number;
    }[] = [];

    liveAssessments.forEach((question: any) => {
      const selectedAnswer =
        studentAnswers[question.liveclassroomassessment_id];

      if (selectedAnswer) {
        allAnswers.push({
          liveclassroomassessment_id: question.liveclassroomassessment_id,
          question: question.liveclassroomassessment_question,
          student_answer: selectedAnswer,
          transcript_id: question.transcript_id,
        });
      }
    });

    if (allAnswers.length === 0) {
      alert(
        "Please select answers for at least one question before submitting."
      );
      return;
    }

    setSubmittingAssessment(true);
    setSubmissionSuccess(false);
    setSubmissionError(null);

    try {
      const response = await sendLiveClassroomAssessmentAnswers({
        liveclassroom_id: classroom.liveclassroom_id,
        classroom_id: classroom.classroom_id,
        answers: allAnswers,
      });

      setSubmissionSuccess(true);

      setToastMessage("Assessments submitted successfully!");
      setToastVariant("default");
      setToastOpen(true);
      await dispatch(fetchClassroomByIdThunk(Number(id)));
    } catch (error: any) {
      console.error("Error submitting live class assessment answers:", error);
      setSubmissionError(
        error.response?.data?.message ||
          "Failed to submit live class assessment."
      );
    } finally {
      setSubmittingAssessment(false);
    }
  };

  const handleAnswerChange = (
    questionId: number,
    selectedOptionKey: string
  ) => {
    setStudentAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: selectedOptionKey,
    }));
  };
  const handleToggleView = () => {
    setViewState((prev) => (prev === "classroom" ? "resources" : "classroom"));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };
  const preprocessText = (text: string) => {
    return text.replace(/\*\*/g, "").replace(/###/g, "").replace(/\n/g, " ");
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
      console.log(finalTranscript);
      setInputText((prev) => prev + finalTranscript);
    };

    recognitionRef.current = recognition;
    recognition.start();
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

  const handleViewGradesClick = () => {
    setShowGradeDialog(true);
    setLoadingGrade(true);
    setErrorGrade(null);
    setReportData(null);
    const fetchGrade = async () => {
      try {
        if (id) {
          const response = await getOutlineAssessmentReport(id);

          setReportData(response.data);
        } else {
          setErrorGrade("Classroom ID not available.");
        }
      } catch (err: any) {
        setErrorGrade(err.message || "Failed to fetch grades.");
      } finally {
        setLoadingGrade(false);
      }
    };
    fetchGrade();
  };
  const handleLoadMore = async (event: React.MouseEvent) => {
    event.preventDefault();
    console.log("Fetching more data...");

    if (!selectedTool && !loadingHistory) {
      setLoadingHistory(true);
      setErrorHistory(null);
      try {
        const historyData = await loadClassroomChatHistory(
          Number(id),
          historyLimit,
          historyPage + 1
        );
        if (historyData?.data && Array.isArray(historyData.data)) {
          setMessages((prevMessages) => ({
            ...prevMessages,
            main: [
              ...historyData.data.map((msg: any) => ({
                text: msg.content,
                fromUser: msg.label === "question",
                isHistory: true,
              })),
              ...(prevMessages.main || []),
            ],
          }));
          setHistoryPage((prevPage) => prevPage + 1);
          if (historyPage + 2 > totalClassroomHistoryPages) {
            setAllHistoryLoaded(true);
          }
        }
      } catch (error: any) {
        console.error("Error loading more classroom chat history:", error);
        setErrorHistory(error.message || "Failed to load more chat history.");
      } finally {
        setLoadingHistory(false);
      }
    } else if (selectedTool && !loadingToolHistory) {
      setLoadingToolHistory(true);
      setErrorToolHistory(null);
      try {
        const tool = tools.find((t) => t.tool_name === selectedTool);
        if (tool?.tool_id) {
          const historyData = await loadToolChatHistory(
            Number(id),
            tool.tool_id,
            toolHistoryLimit,
            toolHistoryPage + 1
          );
          if (historyData?.data && Array.isArray(historyData.data)) {
            setMessages((prevMessages) => ({
              ...prevMessages,
              [selectedTool]: [
                ...historyData.data.map((msg: any) => ({
                  text: msg.content,
                  fromUser: msg.label === "question",
                  isHistory: true,
                })),
                ...(prevMessages[selectedTool] || []),
              ],
            }));
            setToolHistoryPage((prevPage) => prevPage + 1);
            if (toolHistoryPage + 2 > totalToolHistoryPages) {
              setAllToolHistoryLoaded(true);
            }
          }
        }
      } catch (error: any) {
        console.error(
          `Error loading more chat history for tool ${selectedTool}:`,
          error
        );
        setErrorToolHistory(
          error.message ||
            `Failed to load more chat history for ${selectedTool}.`
        );
      } finally {
        setLoadingToolHistory(false);
      }
    }
  };
  const showLoadMoreButton =
    (!selectedTool && totalClassroomHistoryPages > historyPage + 1) ||
    (selectedTool && totalToolHistoryPages > toolHistoryPage + 1);

  const handleCloseGradeDialog = () => {
    setShowGradeDialog(false);
    setReportData(null);
    setErrorGrade(null);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  const parseOptions = (optionsString: string): string[] => {
    try {
      let cleanString =
        optionsString.startsWith('"') && optionsString.endsWith('"')
          ? optionsString.substring(1, optionsString.length - 1)
          : optionsString;

      if (cleanString.startsWith("['") && cleanString.endsWith("']")) {
        cleanString = cleanString.replace(/'/g, '"');
      }

      const parsed = JSON.parse(cleanString);

      if (
        Array.isArray(parsed) &&
        parsed.every((item) => typeof item === "string")
      ) {
        return parsed;
      }
      return [];
    } catch (error) {
      console.error("Failed to parse options string:", optionsString, error);
      return [];
    }
  };
  const getOptionLetter = (index: number): string => {
    return String.fromCharCode(65 + index);
  };

  const outlineTitlesString = classroom?.classroomoutlines
    ?.map((outline) => outline.classroomoutline_title)
    .filter(Boolean)
    .join(", ");
  const outlineContentString = classroom?.classroomoutlines
    ?.map((outline) => outline.classroomoutline_content)
    .filter(Boolean)
    .join(", ");

  if (fetchingClassroom) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              {[...Array(5)].map((_, index) => (
                <th key={index} className="p-4 border-b">
                  <Skeleton className="h-4 w-16 rounded" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(6)].map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b">
                {[...Array(5)].map((_, colIndex) => (
                  <td key={colIndex} className="p-4">
                    <Skeleton className="h-4 w-full rounded" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const handleToolChatSend = async () => {
    if (!toolChatInput.trim()) return;

    // Add user message
    const userMsg = { text: toolChatInput, fromUser: true };
    setToolChatMessages((prev) => [...prev, userMsg]);
    setToolChatInput("");

    // Add temporary "thinking" message
    const thinkingMsg = {
      text: `${selectedTool} is thinking...`,
      fromUser: false,
      isLoading: true,
    };
    setToolChatMessages((prev) => [...prev, thinkingMsg]);
    setToolChatLoading(true);

    try {
      // ✅ Ensure valid data types before calling API
      if (!classroom?.classroom_id || !selectedTool) {
        console.warn("Missing classroom_id or selectedTool.");
        setToolChatMessages((prev) =>
          prev.map((msg) =>
            msg.isLoading
              ? {
                  ...msg,
                  text: "⚠️ Cannot send message — missing classroom or tool.",
                  isLoading: false,
                }
              : msg
          )
        );
        setToolChatLoading(false);
        return;
      }

      // ✅ Send message to backend AI
      const response = await sendClassroomToolMessage({
        classroom_id: Number(classroom?.classroom_id ?? 0),
        tool_name: selectedTool ?? "",
        student_message: userMsg.text,
        content_from: "classroom_tools",
      } as any);

      // ✅ Update messages with AI response
      setToolChatMessages((prev) =>
        prev.map((msg) =>
          msg.isLoading
            ? {
                ...msg,
                text: response?.data || "No response received.",
                isLoading: false,
              }
            : msg
        )
      );
    } catch (error) {
      console.error("AI error:", error);

      setToolChatMessages((prev) =>
        prev.map((msg) =>
          msg.isLoading
            ? {
                ...msg,
                text: "⚠️ Error: Could not get a response from AI.",
                isLoading: false,
              }
            : msg
        )
      );
    } finally {
      setToolChatLoading(false);
    }
  };

  // console.log("tools", tools)
  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#F1F1F1]">
        <Sidenav
          brandName="AiTeacha"
          outlines={(classroom?.classroomoutlines || []).map((outline) => ({
            name: outline.classroomoutline_title,
            path: outline.classroomoutline_content || "#",
            classroomoutline_id: outline.classroomoutline_id,
            assessmentStatus: outline.assessment_status,
            assessments: outline.assessments,
            mark_as_read: outline.mark_as_read,
          }))}
          tools={tools}
          selectedTool={selectedTool}
          onSelectTool={setSelectedTool}
          onToggle={(collapsed) => setIsCollapsed(collapsed)}
          selectedOutline={selectedOutline}
          onSelectOutline={setSelectedOutline}
          selectedOverview={selectedOverview}
          setSelectedOverview={setSelectedOverview}
          onOverviewClick={handleOverviewClick}
          classroomId={id}
          viewState={viewState}
          onToggleView={handleToggleView}
        />
        <div
          className={`flex-1 transition-all duration-3  ${
            isCollapsed ? "xl:ml-28" : "xl:ml-72"
          }`}
        >
          {userrole === 3 ? (
            <div className="pt-4">
              <StudentNavbar />
            </div>
          ) : (
            <div className="pt-4">
              {" "}
              <DashboardNavbar />
            </div>
          )}
          <div className="mt-4 md:mt-6 lg:mt-10">
            <div className="text-left mt-10 mb- lg:px-10 px-5">
              <p className="text-black text-sm bg-gray-300 rounded-full px-4 py-2 inline-flex">
                End Date: Jan 25, 2026
              </p>
              <h2 className="text-xl font-semibold text-black">
                {classroom?.classroom_name}
                {selectedTool && (
                  <>
                    /
                    <p className="text-primary text-sm font-bold">
                      In use: {selectedTool}
                    </p>
                  </>
                )}
              </h2>
              <p>{classroom?.classroom_description}</p>
            </div>

            <div className="flex items-center pb-2 lg:px-8 px-5">
              <div className="flex gap-2 w-full border border-b-gray-400">
                {/* Overview */}
                <button
                  onClick={() => setViewState("classroom")}
                  className={`text-sm p-4 font-semibold pb-2 transition-all duration-200 ${
                    viewState === "classroom"
                      ? "text-[#6200EE] border-b-4 border-[#6200EE]"
                      : "text-gray-700 hover:text-[#6200EE]"
                  }`}
                >
                  Overview
                </button>

                {/* Simulation */}
                <button
                  onClick={() => setViewState("simulation")}
                  className={`text-sm p-4 font-semibold pb-2 transition-all duration-200 ${
                    viewState === "simulation"
                      ? "text-[#6200EE] border-b-4 border-[#6200EE]"
                      : "text-gray-700 hover:text-[#6200EE]"
                  }`}
                >
                  Simulation
                </button>

                {/* Live Class */}
                <button
                  onClick={() => setViewState("liveclass")}
                  className={`text-sm p-4 font-semibold pb-2 transition-all duration-200 ${
                    viewState === "liveclass"
                      ? "text-[#6200EE] border-b-4 border-[#6200EE]"
                      : "text-gray-700 hover:text-[#6200EE]"
                  }`}
                >
                  Live Class
                </button>

                {/* Chats */}
                <button
                  // onClick={() => navigate(`/student/Studentforum/${id}`)}
                  onClick={() => setViewState("chats")}
                  className={`text-sm p-4 font-semibold pb-2 transition-all duration-200 ${
                    viewState === "chats"
                      ? "text-[#6200EE] border-b-4 border-[#6200EE]"
                      : "text-gray-700 hover:text-[#6200EE]"
                  }`}
                >
                  Chats
                </button>

                {/* Participants */}
                <button
                  onClick={() => setViewState("participant")}
                  className={`text-sm p-4 font-semibold pb-2 transition-all duration-200 ${
                    viewState === "participant"
                      ? "text-[#6200EE] border-b-4 border-[#6200EE]"
                      : "text-gray-700 hover:text-[#6200EE]"
                  }`}
                >
                  Participants
                </button>

                {/* ---- Voice Session Tab Button ---- */}
                <button
                  onClick={() => setViewState("voice")}
                  className={`text-sm p-4 font-semibold pb-2 transition-all duration-200 ${
                    viewState === "voice"
                      ? "text-[#6200EE] border-b-4 border-[#6200EE]"
                      : "text-gray-700 hover:text-[#6200EE]"
                  }`}
                  disabled={isVoiceRecording}
                >
                  Voice Session
                </button>
              </div>
            </div>

            {viewState === "classroom" ? (
              <>
                <motion.div
                  className="relative flex flex-col lg:flex-row routes-scroll-area"
                  key="classroom"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <div
                    ref={chatContainerRef}
                    className="flex-grow space-y-2 m-4 p-4"
                  >
                    

                    <div className="flex lg:flex-row flex-col gap-5">
                      <div className="bg-white p-4 rounded-xl shadow-md w-full">
                        <h1 className="text-2xl font-semi-bold text-[#6200EE]">
                          3/10
                        </h1>
                        <p className="text-gray-500">completed</p>
                        <p className="text-black">Assignments</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl shadow-md w-full">
                        <h1 className="text-2xl font-semibold text-[#6200EE]">
                          2/10
                        </h1>
                        <p className="text-gray-500">completed</p>
                        <p className="text-black">Test & Exams</p>
                      </div>
                    </div>

                    <br />

                    <div className="w-full mt-10">
                      <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Class Tools
                      </h2>

                      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
                        <div
                          key="zyra"
                          onClick={() => {
                            setSelectedTool("Zyra AI Chat");
                            setSelectedOverview(false);
                            setSelectedOutline(null);
                            setViewState("classroom");
                            setShowToolChat(true);

                            const savedChat = localStorage.getItem(
                              "toolChat_Zyra AI Chat"
                            );
                            setToolChatMessages(
                              savedChat ? JSON.parse(savedChat) : []
                            );
                          }}
                          className={`flex flex-col items-center justify-center border rounded-2xl p-6 transition-all duration-300 cursor-pointer ${
                            selectedTool === "Zyra AI Chat"
                              ? "bg-[#EFE6FD] border-[#6200EE]/30 shadow-md scale-[1.02]"
                              : "bg-[#EFE6FD] border-gray-200 hover:border-[#6200EE]/30 hover:shadow-lg hover:scale-[1.02]"
                          }`}
                        >
                          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-50 mb-3 shadow-sm">
                            <img
                              src={Avatar}
                              alt="Zyra AI Chat"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-sm font-semibold text-gray-800 text-center">
                            Zyra AI Chat
                          </p>
                        </div>

                        {/* ✅ Dynamic Tool Cards */}
                        {tools.map((tool, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              setSelectedTool(tool.tool_name);
                              setSelectedOverview(false);
                              setSelectedOutline(null);
                              setViewState("classroom");
                              setShowToolChat(true);

                              // ✅ Load stored chat if exists
                              const savedChat = localStorage.getItem(
                                `toolChat_${tool.tool_name}`
                              );
                              setToolChatMessages(
                                savedChat ? JSON.parse(savedChat) : []
                              );
                            }}
                            className={`flex flex-col items-center justify-between border rounded-2xl p-5 transition-all duration-300 cursor-pointer ${
                              selectedTool === tool.tool_name
                                ? "bg-[#EFE6FD] border-[#6200EE]/30 shadow-md scale-[1.02]"
                                : "bg-white border-gray-200 hover:border-[#6200EE]/30 hover:shadow-lg hover:scale-[1.02]"
                            }`}
                          >
                            {/* Thumbnail */}
                            <div className="w-full h-24 flex items-center justify-center overflow-hidden rounded-xl bg-gray-50 mb-3">
                              {tool.tool_thumbnail ? (
                                <img
                                  src={
                                    tool.tool_thumbnail.startsWith("http")
                                      ? tool.tool_thumbnail
                                      : `https://${tool.tool_thumbnail}`
                                  }
                                  alt={tool.tool_name || "Tool Thumbnail"}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <FaHeart className="text-[#6200EE] w-10 h-10" />
                              )}
                            </div>

                            {/* Label */}
                            <p className="text-sm font-semibold text-gray-800 text-center">
                              {tool.tool_name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <br />

                    {classroom?.classroomresources &&
                      classroom.classroomresources.length > 0 && (
                        <div className="mt-32">
                          <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Resources
                          </h2>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                            {classroom.classroomresources.map((resource) => (
                              <div
                                key={resource.resources_id}
                                className="group bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#6200EE]/30 transition-all duration-300 flex flex-col justify-between"
                              >
                                {/* File Info */}
                                <div className="flex items-start space-x-3">
                                  <div className="flex-shrink-0 w-10 h-10 bg-[#EFE6FD] text-[#6200EE] rounded-xl flex items-center justify-center shadow-sm">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="w-5 h-5"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 16v-4m0 0l-2-2m2 2l2-2m12-8v14l-4-4H8l-4 4V4h16z"
                                      />
                                    </svg>
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 truncate">
                                      {resource.resources_filename}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {resource.resources_type || "Document"}
                                    </p>
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-5 flex justify-between items-center border-t border-gray-100 pt-4">
                                  <p className="text-xs text-gray-500 truncate">
                                    {resource.resources_size
                                      ? `${(
                                          resource.resources_size / 1024
                                        ).toFixed(1)} KB`
                                      : ""}
                                  </p>
                                  <button
                                    onClick={() => {
                                      const fullUrl = `https://${resource.resources_path}`;
                                      window.open(fullUrl, "_blank");
                                    }}
                                    className="bg-[#6200EE] text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm hover:bg-[#5300d6] transition-all duration-200"
                                  >
                                    View
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    <div ref={messagesEndRef} />
                  </div>
                </motion.div>
              </>
            ) : viewState === "simulation" ? (
              <motion.div
                key="simulation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <SimulationDashboardPage
                  description={classroom?.classroom_description || ""}
                  grade={classroom?.grade || ""}
                  classroom_id={classroom?.classroom_id || ""}
                  classroom_content={classroom?.content || ""}
                  outline_title={outlineTitlesString || ""}
                  outline_content={outlineContentString || ""}
                />
              </motion.div>
            ) : viewState === "participant" && <Participant /> ? (
              <motion.div
                key="simulation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <Participant />
              </motion.div>
            ) : viewState === "chats" && <StudentClass /> ? (
              <motion.div
                key="voice"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <StudentClass />
              </motion.div>
            ) : viewState === "voice" ? (
              <motion.div
                className="mt-10 mx-5 relative flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl min-h-[50vh]"
                key="voice"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Start a Voice Session
                </h2>
                <p className="text-gray-600 text-sm mb-6 max-w-md">
                  Click the button below to configure your voice, language, and
                  grade for this AI-powered voice class.
                </p>

                {/* 🎤 Start Listening Button */}
                <button
                  onClick={() => setShowVoiceSettings(true)}
                  className="bg-[#6200EE] text-white font-semibold px-6 py-3 rounded-full shadow-md hover:bg-[#5b00d1] transition-all duration-200"
                >
                  🎤 Start Listening
                </button>

                {/* 🟣 Voice Settings Overlay (Modal inside Voice view) */}
                {showVoiceSettings && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="p-10 bg-white rounded-2xl shadow-lg max-w-lg w-full mx-4 relative">
                      <button
                        onClick={() => setShowVoiceSettings(false)}
                        className="text-gray-800 text-2xl font-medium absolute right-6 top-4"
                      >
                        ✕
                      </button>
                      <h2 className="text-xl font-semibold text-gray-800 mb-3">
                        Voice Session Settings
                      </h2>
                      <p className="text-gray-600 mb-6">
                        Choose your preferred voice, language, and grade for the
                        AI.
                      </p>

                      {/* Settings Form */}
                      <div className="grid gap-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label
                            htmlFor="voiceType"
                            className="text-right text-sm font-medium text-gray-700"
                          >
                            Voice
                          </label>
                          <select
                            id="voiceType"
                            value={selectedVoiceType}
                            onChange={(e) =>
                              setSelectedVoiceType(e.target.value)
                            }
                            className="col-span-3 border rounded-md p-2"
                          >
                            {ClassroomVoiceTypelist.map((voice) => (
                              <option key={voice.value} value={voice.value}>
                                {voice.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                          <label
                            htmlFor="language"
                            className="text-right text-sm font-medium text-gray-700"
                          >
                            Language
                          </label>
                          <select
                            id="language"
                            value={selectedLanguage}
                            onChange={(e) =>
                              setSelectedLanguage(e.target.value)
                            }
                            className="col-span-3 border rounded-md p-2"
                          >
                            {languageOptions.map((lang) => (
                              <option key={lang.value} value={lang.value}>
                                {lang.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                          <label
                            htmlFor="grade"
                            className="text-right text-sm font-medium text-gray-700"
                          >
                            Grade
                          </label>
                          <select
                            id="grade"
                            value={selectedGrade}
                            onChange={(e) => setSelectedGrade(e.target.value)}
                            className="col-span-3 border rounded-md p-2"
                          >
                            <option value="">Select Grade (Optional)</option>
                            {gradeOptions.map((grade, index) => (
                              <option key={index} value={grade}>
                                {grade}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Footer Buttons */}
                      <div className="flex justify-center items-center mt-8">
                        <button
                          onClick={() =>
                            startAudioRecording(
                              selectedVoiceType,
                              selectedLanguage,
                              selectedGrade
                            )
                          }
                          className="bg-[#6200EE] text-white font-semibold px-6 py-2 rounded-full hover:bg-[#5b00d1] transition-all"
                          disabled={submittingAssessment}
                        >
                          {submittingAssessment
                            ? "Connecting..."
                            : "Start Voice Session"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : viewState === "liveclass" ? (
              <motion.div
                className="lg:px-5"
                key="voice"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <div className="my-8 px-6 py-20 bg-white border border-purple-2 rounded-2xl shadow-sm">
                  {classroom?.liveclassroomassessments &&
                  classroom.liveclassroomassessments.length > 0 ? (
                    <>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-8 mb-6 text-center">
                        Live Class Assessments
                      </h2>
                      {classroom.liveclassroomassessments.map(
                        (question: any, qIndex: number) => {
                          const options = parseOptions(
                            question.liveclassroomassessment_options
                          );
                          const studentAnswerForThisQuestion =
                            question.liveclassroomassessment_student_answer ||
                            studentAnswers[question.liveclassroomassessment_id];

                          const isQuestionAnswered =
                            isAssessmentCompleted ||
                            question.liveclassroomassessment_student_answer !==
                              null;

                          const isCorrect =
                            isQuestionAnswered &&
                            studentAnswerForThisQuestion ===
                              question.liveclassroomassessment_correct_answer;

                          const didStudentFailToAnswer =
                            isAssessmentCompleted &&
                            question.liveclassroomassessment_student_answer ===
                              null;

                          return (
                            <div
                              key={
                                question.liveclassroomassessment_id ||
                                `q-${qIndex}`
                              }
                              className="mb-6 p-4 border border-gray-2 rounded-md bg-gray-50"
                            >
                              <p className="text-lg font-medium text-gray-8 mb-3 flex items-center">
                                {qIndex + 1}.{" "}
                                {question.liveclassroomassessment_question}
                                {isAssessmentCompleted && (
                                  <span className="ml-3">
                                    {didStudentFailToAnswer ? (
                                      <span className="text-red-5 font-bold">
                                        &#106; Unanswered
                                      </span>
                                    ) : isCorrect ? (
                                      <span className="text-green-5 font-bold">
                                        &#103; Correct
                                      </span>
                                    ) : (
                                      <span className="text-red-5 font-bold">
                                        &#106; Incorrect
                                      </span>
                                    )}
                                  </span>
                                )}
                              </p>
                              <div className="space-y-2">
                                {options.map(
                                  (
                                    optionValue: string,
                                    optionIndex: number
                                  ) => {
                                    const optionKey =
                                      getOptionLetter(optionIndex);
                                    const isChecked =
                                      studentAnswerForThisQuestion ===
                                      optionKey;
                                    const isCorrectAnswerOption =
                                      question.liveclassroomassessment_correct_answer ===
                                      optionKey;

                                    return (
                                      <label
                                        key={optionKey}
                                        className={`flex items-center space-x-2 p-2 rounded-md transition-colors duration-2
                        ${
                          !isAssessmentCompleted
                            ? "cursor-pointer hover:bg-gray-1"
                            : "cursor-not-allowed"
                        }
                        ${
                          isAssessmentCompleted &&
                          isChecked &&
                          isCorrect &&
                          "bg-green-1 border border-green-3"
                        }
                        ${
                          isAssessmentCompleted &&
                          isChecked &&
                          !isCorrect &&
                          "bg-red-1 border border-red-3"
                        }
                        ${
                          isAssessmentCompleted &&
                          !isChecked &&
                          isCorrectAnswerOption &&
                          "bg-blue-50 border border-blue-2"
                        }
                      `}
                                      >
                                        <input
                                          type="radio"
                                          name={`question-${question.liveclassroomassessment_id}`}
                                          value={optionKey}
                                          checked={isChecked}
                                          onChange={() =>
                                            handleAnswerChange(
                                              question.liveclassroomassessment_id,
                                              optionKey
                                            )
                                          }
                                          className={`form-radio h-4 w-4 ${
                                            isAssessmentCompleted
                                              ? "cursor-not-allowed"
                                              : "text-purple-6 focus:ring-purple-5"
                                          }`}
                                          readOnly={isAssessmentCompleted}
                                          disabled={isAssessmentCompleted}
                                        />
                                        <span className="text-gray-7">
                                          {optionKey}. {optionValue}
                                        </span>
                                        {isAssessmentCompleted &&
                                          !didStudentFailToAnswer &&
                                          isCorrectAnswerOption &&
                                          !isChecked && (
                                            <span className="ml-2 text-green-6">
                                              &#103; (Correct Answer)
                                            </span>
                                          )}
                                      </label>
                                    );
                                  }
                                )}
                                {isAssessmentCompleted &&
                                  didStudentFailToAnswer && (
                                    <p className="text-sm text-blue-6 mt-1">
                                      Correct Answer:{" "}
                                      {
                                        question.liveclassroomassessment_correct_answer
                                      }
                                      .{" "}
                                      {
                                        options[
                                          question.liveclassroomassessment_correct_answer.charCodeAt(
                                            0
                                          ) - 65
                                        ]
                                      }
                                    </p>
                                  )}
                              </div>
                            </div>
                          );
                        }
                      )}
                      <div className="mt-8 text-center">
                        {!isAssessmentCompleted ? (
                          <Button
                            onClick={() =>
                              handleSubmitAssessment(
                                classroom.liveclassroomassessments
                              )
                            }
                            disabled={submittingAssessment}
                            className="mt-2 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-all duration-3 hover:scale-105 hover:shadow-xl bg-gradient-to-r from-green-6 to-teal-6 hover:from-green-7 hover:to-teal-7"
                            variant={"gradient"}
                          >
                            {submittingAssessment
                              ? "Submitting..."
                              : "Submit Answers"}
                          </Button>
                        ) : (
                          <div className="p-4 bg-blue-50 border border-blue-2 rounded-md">
                            <p className="text-lg font-bold text-blue-8">
                              Assessment Completed!
                            </p>
                            {submissionSuccess && (
                              <p className="text-green-6 mt-2">
                                Your answers have been submitted.
                              </p>
                            )}
                            <p className="text-gray-7 mt-2">
                              Review your answers above.
                            </p>
                          </div>
                        )}

                        {submissionError && (
                          <p className="text-red-6 mt-2">{submissionError}</p>
                        )}
                      </div>
                      {classroom?.meeting_url && (
                        <div className="mt-6">
                          <p className="text-gray-7 text-lg mb-4">
                            Ready to dive into the learning?
                          </p>
                          <Button
                            onClick={() => {
                              const encodedMeetingUrl = encodeURIComponent(
                                classroom.meeting_url
                              );
                              navigate(
                                `/student/meeting-view?url=${encodedMeetingUrl}`
                              );
                            }}
                            className="mt-2 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-all duration-3 hover:scale-105 hover:shadow-xl bg-gradient-to-r from-purple-6 to-indigo-6 hover:from-purple-7 hover:to-indigo-7"
                            variant={"gradient"}
                          >
                            🚀 Join the Live Session Now!
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center">
                      <FiPlayCircle className="w-16 h-16 text-[red] mb-4 mx-auto" />
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-8 mb-2">
                        No Live Class Assessments Available Yet!
                      </h2>
                      <p className="text-md sm:text-lg text-gray-6 max-w-prose mx-auto mt-5">
                        It looks like the{" "}
                        <span className="font-bold">
                          assessment for this live session isn't ready yet.
                        </span>{" "}
                        Please check back later or join the live session if it's
                        ongoing.
                      </p>
                      {classroom?.meeting_url && (
                        <div className="mt-6">
                          <p className="text-gray-7 text-lg mb-4">
                            Ready to dive into the learning?
                          </p>
                          <Button
                            onClick={() => {
                              const encodedMeetingUrl = encodeURIComponent(
                                classroom.meeting_url
                              );
                              navigate(
                                `/student/meeting-view?url=${encodedMeetingUrl}`
                              );
                            }}
                            className="mt-2 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-all duration-3 hover:scale-105 hover:shadow-xl bg-gradient-to-r from-purple-6 to-indigo-6 hover:from-purple-7 hover:to-indigo-7"
                            variant={"gradient"}
                          >
                            🚀 Join the Live Session Now!
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className=""></div>
            )}

            <Drawer
              open={isDrawerOpen}
              onClose={() => setIsDrawerOpen(false)}
              direction="bottom"
              className="lg:hidden"
            >
              <div className="p-4">
                <h3 className="text-xl font-semibold">Class Tools</h3>
                <ul className="space-y-4 mt-4">
                  <li
                    className={`cursor-pointer px-4 py-2 rounded-lg ${
                      selectedTool === null ? "bg-primary text-white" : ""
                    }`}
                    onClick={() => setSelectedTool(null)}
                  >
                    Main Classroom
                  </li>
                  {tools.map((tool) => (
                    <li
                      key={tool.tool_id}
                      className={`capitalize cursor-pointer px-4 py-2 rounded-lg ${
                        selectedTool === tool.tool_name
                          ? "bg-primary text-white"
                          : ""
                      }`}
                      onClick={() => setSelectedTool(tool.tool_name)}
                    >
                      {tool.tool_name}
                    </li>
                  ))}
                </ul>
              </div>
            </Drawer>
          </div>
        </div>

        <Dialog open={showGradeDialog} onOpenChange={setShowGradeDialog}>
          <DialogContent className="max-w-3xl">
            <DialogTitle>Assessment Grades</DialogTitle>
            <DialogDescription>
              {loadingGrade ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 text-center mx-auto">
                  {[...Array(6)].map((_, index) => (
                    <Skeleton key={index} className="h-24 w-full rounded-md" />
                  ))}
                </div>
              ) : errorGrade ? (
                <p className="text-red-5">{errorGrade}</p>
              ) : reportData && reportData.length > 0 ? (
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full divide-y text-left divide-gray-2 shadow-md rounded-md bg-white">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-xs font-medium text-gray-5 uppercase tracking-wider">
                          Outline
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-5 uppercase tracking-wider">
                          Total Score
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-5 uppercase tracking-wider">
                          No. of Questions
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-5 uppercase tracking-wider">
                          Passed
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-5 uppercase tracking-wider">
                          Failed
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-2">
                      {reportData.map((item, index) => (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          }
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.outline}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.total_score}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.no_of_question}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.passed}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.failed}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No assessment grade details available.</p>
              )}
            </DialogDescription>
            <div className="mt-4 flex justify-end">
              <Button variant="secondary" onClick={handleCloseGradeDialog}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {showToolChat && selectedTool && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 z-[9999] bg-white border-l shadow-lg flex flex-col h-screen right-0 left-[18rem]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b bg-gray-50">
              <h3 className="text-base font-semibold text-[#6200EE]">
                {selectedTool} Assistant
              </h3>
              <button
                onClick={() => setShowToolChat(false)}
                className="text-gray-500 hover:text-red-500 transition"
              >
                ✕
              </button>
            </div>

            {/* Chat Messages */}
            <div
              id="tool-chat-scroll"
              className="flex-1 overflow-y-auto p-5 space-y-3 bg-gray-50"
            >
              {toolChatMessages.length === 0 && (
                <p className="text-gray-400 text-center text-sm mt-6">
                  Start a conversation with {selectedTool}
                </p>
              )}

              {toolChatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.fromUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-2xl max-w-[75%] text-sm ${
                      msg.fromUser
                        ? "bg-[#6200EE] text-white rounded-tr-none"
                        : "bg-white text-gray-800 rounded-tl-none border"
                    }`}
                  >
                    {/* Copy + Voice + Pause Buttons for AI Messages */}
                    {!msg.fromUser && (
                      <div className="flex justify-end gap-3 mb-1 text-xs text-gray-500">
                        {/* Copy */}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(msg.text);
                            const toast = document.createElement("div");
                            toast.innerText = "Copied!";
                            toast.className =
                              "fixed bottom-6 right-6 bg-green-600 text-white text-sm px-3 py-2 rounded-md shadow-md animate-fadeInOut z-[9999]";
                            document.body.appendChild(toast);
                            setTimeout(() => toast.remove(), 1200);
                          }}
                          className="hover:text-[#6200EE] flex items-center gap-1"
                          title="Copy"
                        >
                          <FiCopy size={14} /> Copy
                        </button>

                        {/* Voice Play / Pause */}
                        <button
                          onClick={() => {
                            if (window.speechSynthesis.speaking) {
                              window.speechSynthesis.cancel();
                              setIsSpeaking(false);
                            } else {
                              const utterance = new SpeechSynthesisUtterance(
                                msg.text
                              );
                              setIsSpeaking(true);
                              utterance.onend = () => setIsSpeaking(false);
                              window.speechSynthesis.speak(utterance);
                            }
                          }}
                          className="hover:text-[#6200EE] flex items-center gap-1"
                          title={isSpeaking ? "Pause Voice" : "Play Voice"}
                        >
                          {isSpeaking ? (
                            <>
                              <FiPause size={14} /> Pause
                            </>
                          ) : (
                            <>
                              <FiVolume2 size={14} /> Voice
                            </>
                          )}
                        </button>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap break-words">
                      {msg.text}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t p-4 bg-white flex items-center gap-3">
              <input
                value={toolChatInput}
                onChange={(e) => setToolChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleToolChatSend()}
                placeholder={`Ask ${selectedTool}...`}
                className="flex-grow border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#6200EE] outline-none bg-gray-50"
              />

              {/* 🎙 Voice Input Button */}
              <button
                onClick={() => handleVoiceInput()}
                className={`p-3 rounded-full border text-[#6200EE] hover:bg-[#EFE6FD] transition ${
                  isListening ? "bg-[#EFE6FD]" : ""
                }`}
                title="Voice Input"
              >
                <FiMic
                  className={`${isListening ? "text-[#6200EE]" : ""}`}
                  size={18}
                />
              </button>

              {/* 📨 Send Button */}
              <button
                onClick={() => handleToolChatSend()}
                disabled={!toolChatInput.trim() || toolChatLoading}
                className={`p-3 rounded-full text-white ${
                  toolChatLoading
                    ? "bg-gray-400"
                    : "bg-[#6200EE] hover:bg-[#5300d6]"
                }`}
              >
                <FiSend size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </div>
      {showCallPopup && (
        <CallPopup
          onClose={stopAudioRecording}
          isSpeaking={isSpeaking}
          isVoiceRecording={isVoiceRecording}
          remainingTime={remainingCallTime}
        />
      )}
      <audio ref={audioPlayerRef} autoPlay style={{ display: "none" }} />
      <Toast
        open={toastOpen}
        onOpenChange={setToastOpen}
        variant={toastVariant}
      >
        <ToastTitle>{toastMessage}</ToastTitle>
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
};

export default Classroom;
