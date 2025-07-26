import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import { createClassroomSuggestion, fetchClassroomByIdThunk } from "../../../store/slices/classroomSlice";
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
import { Routes, Route } from "react-router-dom";
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
import StudentNavbar from "../../../components/layout/Student-Navbar";

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
  "Photosynthesis in plants."
];


const Classroom = () => {
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");


  const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
    "default"
  );

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
    [key: string]: { text: string; fromUser: boolean; isLoading?: boolean }[];
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
  const [userrole, setIsuserRole] = useState<any>()
     const {classroomTopic } = useSelector(
      (state: RootState) => state.classrooms
    );
     
    

  const MAX_CALL_DURATION_SECONDS = 30 * 60;
  const handleOverviewClick = () => {
    setSelectedOverview(true);
    console.log("selectedOverview set to true in handler");
    console.log("selectedOverview", selectedOverview);
  };

  const [showTopicPopup, setShowTopicPopup] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    const initialTimeout = setTimeout(() => {
      setShowTopicPopup(true);
      intervalId = setInterval(() => {
        setShowTopicPopup(true);
      }, 4 * 60 * 1000);
    }, 60 * 1000);
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(intervalId);
    };
  }, []);

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
    if (classroom?.classroomoutlines) {
      const mappedOutlines = classroom.classroomoutlines.map((outline) => ({
        name: outline.classroomoutline_title,
        path: outline.classroomoutline_content || "#",
        classroomoutline_id: outline.classroomoutline_id,
        assessmentStatus: outline.assessment_status,
        assessments: outline.assessments,
        mark_as_read: outline.mark_as_read,
      }));
      setOutlines(mappedOutlines);
      setSelectedOutline(mappedOutlines[0]);
    }
  }, [classroom]);

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
        setIsuserRole(parsedDetails.role_id);
      }
    }

  }, [])

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
        console.log("Received from OpenAI (DataChannel):", event);

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
            console.log("OpenAI response done.");
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
        console.log("Data Channel Opened.");
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

  useEffect(() => {
    let newMessage: string = classroom?.content || "";
    console.log("selectedOverview", selectedOverview);
    if (selectedOverview) {
      console.log("niiice");
      if (!newMessage) {
        newMessage = `Hi👋 ${userDetails?.firstname || "there"
          }, welcome to class "<strong>${classroom?.classroom_name || "the classroom"
          }</strong>." Start your conversation here!`;
      }
    } else if (newMessage && selectedTool) {
      newMessage = `Hi👋 ${userDetails?.firstname || "there"
        }, welcome to <strong>${selectedTool}</strong>. Start your conversation here!`;
    } else if (newMessage && selectedOutline) {
      newMessage = selectedOutline.path || "Welcome to the selected outline.";
    } else if (!newMessage && selectedOutline) {
      newMessage = selectedOutline.path || "Welcome to the selected outline.";
    } else if (!newMessage) {
      newMessage = `Hi👋 ${userDetails?.firstname || "there"
        }, welcome to class "<strong>${classroom?.classroom_name || "the classroom"
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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedTool]);

  useEffect(() => {
    const userDetailsFromStorage = localStorage.getItem("ai-teacha-user");
    if (userDetailsFromStorage) {
      const parsedDetails = JSON.parse(userDetailsFromStorage);
      setUserDetails(parsedDetails);
    }
  }, []);


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
    const currentKey = selectedTool ? selectedTool : "main";
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
  const currentKey = selectedTool ? selectedTool : "main";
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
        file_content: classroom?.classroomresources?.map(
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
          className={`flex-1 transition-all duration-3 px-2  ${isCollapsed ? "xl:ml-28" : "xl:ml-72"
            }`}
        >
          {
            userrole === 3 ? <><StudentNavbar /></> : <>  <DashboardNavbar /></>
          }
          <div className="mt-4 md:mt-6 lg:mt-10">
            <div className="flex items-center  justify-between flex-col sm:flex-row">
              <div className="mt-4 ml-4 sm:mt-0 flex items-center justify-between w-full">
                <div className="text-left">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-9">
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
                </div>
              </div>
              <div className=" flex gap-4">
                <Dialog
                  open={showVoiceSettingsDialog}
                  onOpenChange={setShowVoiceSettingsDialog}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className={`rounded-full hover:bg-gray-400 mt-5 border-[#5c3cbb]  ${isVoiceRecording
                        ? "bg-red-500 text-white"
                        : "bg-gray-200 text-black"
                        }`}
                      disabled={isVoiceRecording}
                    >
                      {isVoiceRecording ? (
                        <FiX className="h-5 w-5" />
                      ) : (
                        <img
                          src={VoiceIcon}
                          alt="Microphone"
                          className="h-16 w-5"
                        />
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Voice Session Settings</DialogTitle>
                      <DialogDescription>
                        Choose your preferred voice, language, and grade for the
                        AI.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="voiceType" className="text-right">
                          Voice
                        </label>
                        <select
                          id="voiceType"
                          value={selectedVoiceType}
                          onChange={(e) => setSelectedVoiceType(e.target.value)}
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
                        <label htmlFor="language" className="text-right">
                          Language
                        </label>
                        <select
                          id="language"
                          value={selectedLanguage}
                          onChange={(e) => setSelectedLanguage(e.target.value)}
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
                        <label htmlFor="grade" className="text-right">
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
                    <DialogFooter>
                      <Button
                        onClick={() =>
                          startAudioRecording(
                            selectedVoiceType,
                            selectedLanguage,
                            selectedGrade
                          )
                        }
                        variant={"gradient"}
                        className="w-full rounded-md"
                        disabled={submittingAssessment}
                      >
                        {submittingAssessment
                          ? "Connecting..."
                          : "Start Voice Session"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button
                  onClick={() => navigate(`/student/Studentforum/${id}`)}
                  className="relative flex items-center justify-center bg-white border border-[#5c3cbb] mt-5
                  hover:border-purple-600 hover:bg-purple-50 rounded-full  text-sm text-[#5c3cbb] pt-1 font-medium shadow-sm transition-all"
                >
                  Chat

                  <span className="absolute -top-1.5 -right-1.5 bg-[#5c3cbb]
                  text-white rounded-full p-1 flex items-center justify-center shadow-md">
                    <FiMessageCircle size={14} />
                  </span>
                </Button>
                {classroom?.isLiveclassroom === 1 ||
                  (viewState !== "liveclass" && (
                    <Button
                      variant={"gradient"}
                      className="rounded-full mt-4"
                      onClick={() => setViewState("liveclass")}
                    >
                      Preview Live Class
                    </Button>
                  ))}
                {classroom?.isLiveclassroom === 1 ||
                  (viewState !== "classroom" && (
                    <Button
                      variant={"gradient"}
                      className="rounded-full mt-4"
                      onClick={() => setViewState("classroom")}
                    >
                      Back to Classroom
                    </Button>
                  ))}
              </div>
            </div>

            {viewState === "classroom" ? (
              <>
                <div className="relative flex flex-col lg:flex-row max-h-[550px]  overflow-y-auto pb-[1px] lg:pb-[70px]">
                  <div
                    ref={chatContainerRef}
                    className="flex-grow overflow-y-auto bg-gray-50 border border-gray-3 rounded-lg shadow-inner space-y-2 m-4 p-4 max-h-[450px]"
                  >
                    {selectedOverview ? (
                      <MarkdownRenderer
                        content={welcomeMessage}
                        className="text-sm lg:text-md text-gray-8"
                      />
                    ) : currentMessages.length === 0 ? (
                      <>
                        <MarkdownRenderer
                          content={welcomeMessage}
                          className="text-sm lg:text-md text-gray-8"
                        />


                        <div className="flex justify-between items-center w-full p-4">
                          <div className="flex-1 ">
                            {selectedOutline &&
                              selectedOutline.mark_as_read === 0 ? (
                              <Button
                                onClick={() =>
                                  handleMarkAsRead(
                                    selectedOutline.classroomoutline_id
                                  )
                                }
                                variant={"gradient"}
                                className="rounded-md"
                                disabled={loading}
                              >
                                {loading ? "Marking..." : "Mark as Read"}
                              </Button>
                            ) : selectedOutline &&
                              selectedOutline.mark_as_read === 1 ? (
                              <Button
                                variant={"gray"}
                                className="rounded-md"
                                disabled
                              >
                                Completed
                              </Button>
                            ) : null}
                          </div>
                          <div className="flex-1 flex justify-end gap-2">
                            {(() => {
                              const currentIndex = outlines.findIndex(o => o.name === selectedOutline?.name);
                              const current = outlines[currentIndex];
                              const next = outlines[currentIndex + 1];
                              const prevIndex = [...outlines]
                                .slice(0, currentIndex)
                                .reverse()
                                .findIndex(o => o.mark_as_read === 1);
                              const actualPrevIndex = prevIndex !== -1 ? currentIndex - prevIndex - 1 : -1;
                              return (
                                <>

                                  {actualPrevIndex !== -1 && (
                                    <Button
                                      variant="gradient"
                                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-all duration-200"
                                      onClick={() => setSelectedOutline(outlines[actualPrevIndex])}
                                    >
                                      Previous
                                    </Button>
                                  )}


                                  {next && (
                                    <Button
                                      variant="gradient"
                                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-all duration-200 ml-2"
                                      onClick={() => setSelectedOutline(next)}
                                    >
                                      Next
                                    </Button>
                                  )}
                                </>
                              );
                            })()}
                          </div>

                          <div>

                          </div>
                        </div>
                        {selectedOutline &&
                          selectedOutline.assessments &&
                          selectedOutline.assessments.length > 0 &&
                          selectedOutline.assessmentStatus === "pending" && (
                            <>
                              <hr />
                              <br />
                              <h2>Take Assessments:</h2>
                              <br />
                              {selectedOutline.assessments.map(
                                (assessment: any, index: any) => (
                                  <div key={assessment.outlineassessment_id}>
                                    Question {index + 1}:{" "}
                                    {assessment.outlineassessment_question}
                                    <br />
                                    {(() => {
                                      try {
                                        const options = JSON.parse(
                                          assessment.outlineassessment_options
                                        );
                                        if (Array.isArray(options)) {
                                          return (
                                            <>
                                              {options.map((option, index) => (
                                                <div
                                                  key={`${assessment.outlineassessment_id}-${index}`}
                                                >
                                                  <input
                                                    type="radio"
                                                    id={`${assessment.outlineassessment_id}-${index}`}
                                                    name={
                                                      assessment.outlineassessment_id
                                                    }
                                                    value={option}
                                                  />
                                                  &ensp;
                                                  <label
                                                    htmlFor={`${assessment.outlineassessment_id}-${index}`}
                                                  >
                                                    {option}
                                                  </label>
                                                  <br />
                                                </div>
                                              ))}
                                              <br />
                                              <br />
                                            </>
                                          );
                                        } else {
                                          return `Options: ${assessment.outlineassessment_options}<br><br>`;
                                        }
                                      } catch (e) {
                                        return `Options: ${assessment.outlineassessment_options}<br><br>`;
                                      }
                                    })()}
                                  </div>
                                )
                              )}
                              <Button
                                onClick={() =>
                                  sendAllAnswers(selectedOutline.assessments)
                                }
                                variant={"gradient"}
                                className="rounded-md mt-4"
                                disabled={loading}
                              >
                                {loading
                                  ? "Submitting..."
                                  : "Submit All Answers"}
                              </Button>
                            </>
                          )}
                        {selectedOutline &&
                          selectedOutline.assessments &&
                          selectedOutline.assessments.length > 0 &&
                          selectedOutline.assessmentStatus !== "pending" && (
                            <>
                              <hr />
                              <h2>Assessment Taken</h2>
                            </>
                          )}
                      </>
                    ) : (
                      <>
                        {loadingHistory &&
                          !selectedTool &&
                          historyPage === 0 && (
                            <div className="flex justify-center items-center h-full">
                              <svg
                                className="animate-spin h-6 w-6 text-primary"
                                xmlns="http://www.w3.org/20/svg"
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
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                            </div>
                          )}
                        {errorHistory && !selectedTool && (
                          <div className="text-center text-red-4">
                            Error loading history: {errorHistory}
                          </div>
                        )}
                        {loadingToolHistory &&
                          selectedTool &&
                          toolHistoryPage === 0 && (
                            <div className="flex justify-center items-center h-full">
                              <svg
                                className="animate-spin h-6 w-6 text-primary"
                                xmlns="http://www.w3.org/20/svg"
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
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                            </div>
                          )}
                        {errorToolHistory && selectedTool && (
                          <div className="text-center text-red-4">
                            Error loading tool history: {errorToolHistory}
                          </div>
                        )}

                        {showLoadMoreButton && (
                          <div className=" bg-gray-50 py-2 flex justify-center">
                            {!loadingHistory && !loadingToolHistory && (
                              <button
                                onClick={(event) => handleLoadMore(event)}
                                className="text-primary hover:underline text-sm"
                              >
                                Load More
                              </button>
                            )}
                            {loadingHistory &&
                              !selectedTool &&
                              historyPage > 0 && (
                                <div className="text-gray-5 text-sm">
                                  Loading more history...
                                </div>
                              )}
                            {loadingToolHistory &&
                              selectedTool &&
                              toolHistoryPage > 0 && (
                                <div className="text-gray-5 text-sm">
                                  Loading more tool history...
                                </div>
                              )}
                          </div>
                        )}
                        {showTopicPopup && (
                          <motion.div
                            initial={{ opacity: 0, translateY: -10 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ duration: 0.4 }}
                            className="fixed top-28 right-5 z-50"
                          >
                            <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 text-white p-5 px-6 rounded-2xl shadow-2xl max-w-sm">

                              <button
                                onClick={() => setShowTopicPopup(false)}
                                className="absolute top-2 right-2 text-white hover:text-gray-300 text-2xl font-bold  pr-4"
                                aria-label="Close"
                              >
                                ×
                              </button>
                              <div className="absolute right-0 bottom-2 w-3 h-3 bg-pink-500 rotate-45 mr-[-6px] rounded-sm shadow-sm"></div>
                              <div className="flex items-start gap-3">
                                <div className="text-2xl mt-0.5">✨</div>
                                <div>
                                  <p className="font-bold text-lg mb-1 text-yellow-300">Recommended Topic</p>
                                  <p className="text-sm leading-snug text-gray-200 mb-3">
                                    Here's a suggested topic for you:
                                  </p>
                                  <p className="text-white font-semibold">{classroomTopic}</p>

                                  <button
                                    onClick={() => { handleSendTopic(), setShowTopicPopup(false) }}
                                    className="bg-white text-purple-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-yellow-100 transition-all mt-2"
                                  >
                                    Learn More
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {currentMessages.map((message, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className={`flex flex-col mb-2 ${message.fromUser ? "items-end" : "items-start"
                              }`}
                          >
                            {!message.fromUser && (
                              <div className="flex justify-end space-x-4 mb-1">
                                <button
                                  onClick={() => handleCopy(message.text)}
                                  className="text-gray-6 hover:text-gray-8 flex gap-1"
                                >
                                  <FiCopy />{" "}
                                  <span className="text-sm">Copy</span>
                                </button>
                                <button
                                  onClick={() =>
                                    handleTextToSpeech(message.text)
                                  }
                                  className="text-gray-6 hover:text-gray-8 flex gap-1"
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
                              className={`p-3 text-sm ${message.fromUser
                                ? "bg-primary max-w-xs text-white rounded-tl-lg"
                                : "bg-gray-2 max-w-xl text-black rounded-tr-lg"
                                }`}
                              style={{
                                wordWrap: "break-word",
                                whiteSpace: "pre-wrap",
                              }}
                            />
                          </motion.div>
                        ))}
                      </>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                <div
                  className="fixed bottom-0 left-0 w-full bg-white 
                 border-t lg:flex lg:w-[calc(100%-5rem)] lg:ml-[5rem] flex-col lg:flex-row"
                >
                  <div className="flex justify-between items-center gap-24 w-full">
                    <div
                      className="w-64 h-20 bg-cover bg-center relative hidden lg:block"
                      style={{ backgroundImage: `url(${greyImg})` }}
                    >
                      <span
                        className="absolute inset-0 flex items-center italic justify-center
                       text-white text-lg font-bold bg-black bg-opacity-20"
                      >
                        Powered By <span className="text-lg ml-1"> Zyra</span>
                      </span>
                    </div>

                    <div className="relative p-2 lg:-ml-24 flex items-center w-full">
                      <TextArea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        className="flex-grow pr-16 px-3 py-2 border text-md rounded-lg"
                      />
                      <button
                        onClick={toggleRecording}
                        className={`absolute right-16 top-1/2 transform -translate-y-1/2 p-3 rounded-full ${isRecording
                          ? "bg-red-500 text-white"
                          : "bg-gray-200 text-black"
                          }`}
                      >
                        <FiMic />
                      </button>
                      <button
                        onClick={handleSend}
                        aria-label="Send Message"
                        disabled={inputText.trim().length === 0}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-primary text-white rounded-full mr-4"
                      >
                        <FiSend className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <Button
                    onClick={() => setIsDrawerOpen(true)}
                    variant={"gradient"}
                    className="flex items-center bg-white w-full rounded-md text-black lg:hidden mt-2 mx-auto"
                  >
                    View Tools
                  </Button>
                </div>
              </>
            ) : viewState === "liveclass" ? (
              <div className="liveclass-div">
                <div className="my-8 p-6 bg-gradient-to-r from-gray-50 to-purple-50 border border-purple-2 rounded-lg shadow-sm">
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
                        ${!isAssessmentCompleted
                                            ? "cursor-pointer hover:bg-gray-1"
                                            : "cursor-not-allowed"
                                          }
                        ${isAssessmentCompleted &&
                                          isChecked &&
                                          isCorrect &&
                                          "bg-green-1 border border-green-3"
                                          }
                        ${isAssessmentCompleted &&
                                          isChecked &&
                                          !isCorrect &&
                                          "bg-red-1 border border-red-3"
                                          }
                        ${isAssessmentCompleted &&
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
                                          className={`form-radio h-4 w-4 ${isAssessmentCompleted
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
                      <LightBulbIcon className="w-16 h-16 text-yellow-5 mb-4 animate-pulse mx-auto" />
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-8 mb-2">
                        No Live Class Assessments Available Yet!
                      </h2>
                      <p className="text-md sm:text-lg text-gray-6 max-w-prose mx-auto">
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
              </div>
            ) : (
              <div className="bg-white border border-gray-2 rounded-lg shadow-md p-6 mt-6 space-y-6">
                <h2 className="text-xl font-semibold text-primary">
                  Explore Classroom Resources
                </h2>

                <div>
                  <h3 className="text-lg font-semibold text-gray-8 mb-3">
                    <svg
                      xmlns="http://www.w3.org/20/svg"
                      className="h-5 w-5 inline-block mr-2 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H10a2 2 0 01-2-2v-4a2 2 0 012-2h4v-2a2 2 0 012-2h1m-2 8H9a2 2 0 -2 2v4a2 2 0 2 2h1m2-8h2m-2 8H9"
                      />
                    </svg>
                    Uploaded Files
                  </h3>
                  {classroom?.classroomresources &&
                    classroom.classroomresources.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {classroom.classroomresources.map((resource) => (
                        <div
                          key={resource.resources_id}
                          className="bg-gray-50 border border-gray-3 rounded-md p-4 flex flex-col items-center justify-between"
                        >
                          <div className="flex items-center w-full">
                            <svg
                              xmlns="http://www.w3.org/20/svg"
                              className="h-6 w-6 mr-2 text-gray-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 16v-4m0 0l-2-2m2 2l2-2m12-8v14l-4-4H8l-4 4V4h16z"
                              />
                            </svg>
                            <p className="text-sm font-medium text-gray-8 truncate">
                              {resource.resources_filename}
                            </p>
                          </div>
                          <div className="mt-2 w-full flex justify-center">
                            <Button
                              onClick={() => {
                                const fullUrl = `https://${resource.resources_path}`;
                                window.open(fullUrl, "_blank");
                              }}
                              className="text-primary hover:underline mr-2"
                            >
                              View
                            </Button>
                            <Button
                              onClick={() => {
                                const fullUrl = `https://${resource.resources_path}`;
                                window.open(fullUrl, "_blank");
                              }}
                              variant="outline"
                              size="sm"
                              className="rounded-md text-primary border-indigo-3 hover:bg-indigo-50"
                            >
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-5 italic">No files uploaded yet.</p>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-8 mb-3">
                    <svg
                      xmlns="http://www.w3.org/20/svg"
                      className="h-5 w-5 inline-block mr-2 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 -5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.99a4 4 0 5.656 0l4-4a4 4 0 10-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                    External Links
                  </h3>
                  {classroom?.classroomresources_link &&
                    Array.isArray(classroom.classroomresources_link) &&
                    classroom.classroomresources_link.length > 0 ? (
                    <ul className="space-y-2">
                      {classroom.classroomresources_link.map(
                        (link: string, index: number) => (
                          <li key={index}>
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-6 hover:text-indigo-8 hover:underline text-sm"
                            >
                              {link || "No link provided"}
                            </a>
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p className="text-gray-5 italic">
                      No external links provided.
                    </p>
                  )}
                </div>
                <hr className="my-6 border-t border-gray-6" />

                <h3 className="text-lg font-semibold text-gray-8 mb-3">
                  <svg
                    xmlns="http://www.w3.org/20/svg"
                    className="h-5 w-5 inline-block mr-2 text-green-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Grades & Certification
                </h3>

                {classroom?.classroomoutlines &&
                  classroom.classroomoutlines.every(
                    (outline) => outline.mark_as_read === 1
                  ) &&
                  classroom.classroomoutlines.some(
                    (outline) =>
                      outline.assessments && outline.assessments.length > 0
                  ) ? (
                  <Button
                    className="mt-4  flex justify-center rounded-md"
                    onClick={handleViewGradesClick}
                    variant={"gray"}
                  >
                    View Grades
                  </Button>
                ) : (
                  <Button
                    className="mt-4 flex justify-center rounded-md"
                    variant={"gray"}
                    disabled
                  >
                    View Grades (Complete All Assessments)
                  </Button>
                )}

                {!classroom?.classroomoutlines?.some(
                  (outline) =>
                    outline.assessments && outline.assessments.length > 0
                ) && (
                    <p className="text-sm text-gray-5 mt-2 italic">
                      No assessments available for this classroom.
                    </p>
                  )}
                <Button
                  onClick={handleToggleView}
                  variant="outline"
                  className="rounded-md text-indigo-6 border-indigo-3 hover:bg-indigo-50"
                >
                  Back to Classroom
                </Button>
              </div>
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
                    className={`cursor-pointer px-4 py-2 rounded-lg ${selectedTool === null ? "bg-primary text-white" : ""
                      }`}
                    onClick={() => setSelectedTool(null)}
                  >
                    Main Classroom
                  </li>
                  {tools.map((tool) => (
                    <li
                      key={tool.tool_id}
                      className={`capitalize cursor-pointer px-4 py-2 rounded-lg ${selectedTool === tool.tool_name
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
