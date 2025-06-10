import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getLiveClassById,
  getTranscriptDetails,
  suggestAssessment,
  saveAssessment,
  getTranscriptAssessment,
} from "../../../api/liveclass";
import {
  AcademicCapIcon,
  DocumentTextIcon,
  LightBulbIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import {
  ClipboardDocumentListIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/solid";
import { Skeleton } from "../../../components/ui/Skeleton";
import MarkdownRenderer from "../_components/MarkdownRenderer";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { TextArea } from "../../../components/ui/TextArea";
import { Label } from "../../../components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/Select";

export interface Meeting {
  id: number;
  user_id: number;
  name: string;
  title: string | null;
  description: string | null;
  meeting_code: string;
  classroom_id: any;
  meeting_url: string;
  meeting_timezone: string | null;
  meeting_location: string | null;
  notes: string | null;
  participant: string | null;
  meeting_type: string;
  created_at: string;
  updated_at: string;
}

export interface Transcript {
  id: number;
  liveclassroom_id: number;
  content: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface AssessmentQuestion {
  question: string;
  correct_answer: string;
  options: {
    [key: string]: string;
  };
}

interface DetailCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number | null | undefined;
  loading: boolean;
}

const DetailCard: React.FC<DetailCardProps> = ({
  icon,
  title,
  value,
  loading,
}) => {
  return (
    <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex items-start space-x-4">
      <div className="flex-shrink-0 text-gray-500">{icon}</div>
      <div>
        <h3 className="text-lg font-medium text-gray-700">{title}</h3>
        {loading ? (
          <Skeleton className="w-40 h-5 mt-1" />
        ) : (
          <p className="text-gray-800 text-sm font-semibold flex items-center">
            {value || "N/A"}
          </p>
        )}
      </div>
    </div>
  );
};

const TranscriptDetailsPage: React.FC = () => {
  const { liveclassroom_id, transcriptId } = useParams<{
    liveclassroom_id: string;
    transcriptId: string;
  }>();
  const [liveClass, setLiveClass] = useState<Meeting | null>(null);
  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [loadingLiveClass, setLoadingLiveClass] = useState<boolean>(true);
  const [loadingTranscript, setLoadingTranscript] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const [suggestedAssessment, setSuggestedAssessment] = useState<
    AssessmentQuestion[] | null
  >(null);
  const [assessmentLoading, setAssessmentLoading] = useState<boolean>(true); // Set to true initially to fetch existing assessments
  const [assessmentError, setAssessmentError] = useState<string | null>(null);
  const [savingAssessment, setSavingAssessment] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLiveClassDetails = async () => {
      if (!liveclassroom_id) {
        setError("Live Classroom ID is missing from the URL.");
        setLoadingLiveClass(false);
        return;
      }

      const id = parseInt(liveclassroom_id);
      if (isNaN(id)) {
        setError("Invalid Live Classroom ID in the URL.");
        setLoadingLiveClass(false);
        return;
      }

      try {
        const data = await getLiveClassById(id);
        if (
          data &&
          data.data &&
          Array.isArray(data.data) &&
          data.data.length > 0
        ) {
          setLiveClass(data.data[0]);
        } else if (data && !Array.isArray(data.data)) {
          setLiveClass(data);
        } else {
          setError("Live Class data not found in API response.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch live class details.");
      } finally {
        setLoadingLiveClass(false);
      }
    };

    fetchLiveClassDetails();
  }, [liveclassroom_id]);

  useEffect(() => {
    const fetchTranscriptAndAssessmentDetails = async () => {
      if (!transcriptId) {
        setError("Transcript ID is missing from the URL.");
        setLoadingTranscript(false);
        setAssessmentLoading(false);
        return;
      }

      const id = parseInt(transcriptId);
      if (isNaN(id)) {
        setError("Invalid Transcript ID in the URL.");
        setLoadingTranscript(false);
        setAssessmentLoading(false);
        return;
      }

      try {
        // Fetch transcript details
        const transcriptData = await getTranscriptDetails(id);
        const fetchedTranscript =
          transcriptData.data && Array.isArray(transcriptData.data)
            ? transcriptData.data[0]
            : transcriptData.data;
        setTranscript(fetchedTranscript);

        // Fetch existing assessments
        const assessmentResponse = await getTranscriptAssessment(id); // Call your new API
        if (assessmentResponse.data && Array.isArray(assessmentResponse.data)) {
          // Format the existing assessments to match the AssessmentQuestion interface
          const formattedAssessments: AssessmentQuestion[] =
            assessmentResponse.data.map((item: any) => {
              // Parse the options string into a JavaScript array
              const optionsArray = JSON.parse(item.options);
              return {
                question: item.question,
                correct_answer: item.correct_answer,
                options: optionsArray.reduce(
                  (
                    acc: { [key: string]: string },
                    option: string,
                    idx: number
                  ) => {
                    const optionKey = String.fromCharCode(65 + idx); // A, B, C, D...
                    acc[optionKey] = option;
                    return acc;
                  },
                  {}
                ),
              };
            });
          setSuggestedAssessment(formattedAssessments);
        } else if (assessmentResponse.data) {
          // Handle case where data might be a single object not array
          const item = assessmentResponse.data;
          const optionsArray = JSON.parse(item.options);
          const formattedAssessments: AssessmentQuestion[] = [
            {
              question: item.question,
              correct_answer: item.correct_answer,
              options: optionsArray.reduce(
                (
                  acc: { [key: string]: string },
                  option: string,
                  idx: number
                ) => {
                  const optionKey = String.fromCharCode(65 + idx); // A, B, C, D...
                  acc[optionKey] = option;
                  return acc;
                },
                {}
              ),
            },
          ];
          setSuggestedAssessment(formattedAssessments);
        } else {
          setSuggestedAssessment([]); // No existing assessments
        }
      } catch (err: any) {
        setError(
          err.message || "Failed to fetch transcript or assessment details."
        );
      } finally {
        setLoadingTranscript(false);
        setAssessmentLoading(false);
      }
    };

    fetchTranscriptAndAssessmentDetails();
  }, [transcriptId]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleSuggestAssessment = async () => {
    setAssessmentLoading(true);
    setAssessmentError(null);
    setSaveSuccess(false);
    setSaveError(null);
    if (!transcript || !transcript.content) {
      setAssessmentError(
        "No transcript content available to suggest assessment."
      );
      setAssessmentLoading(false);
      return;
    }

    try {
      const response = await suggestAssessment({
        transcript_content: transcript.content,
      });
      if (response.data && Array.isArray(response.data)) {
        setSuggestedAssessment((prev) =>
          prev ? [...prev, ...response.data] : response.data
        );
      } else {
        setAssessmentError("Unexpected assessment response format.");
      }
    } catch (err: any) {
      setAssessmentError(
        err.message || "Failed to suggest assessment. Please try again."
      );
    } finally {
      setAssessmentLoading(false);
    }
  };

  const handleAddNewQuestion = () => {
    setSuggestedAssessment((prev) => [
      ...(prev || []),
      {
        question: "",
        correct_answer: "",
        options: { A: "", B: "", C: "", D: "" },
      },
    ]);
  };

  const handleQuestionChange = (index: number, newQuestion: string) => {
    if (suggestedAssessment) {
      const updatedAssessment = [...suggestedAssessment];
      updatedAssessment[index] = {
        ...updatedAssessment[index],
        question: newQuestion,
      };
      setSuggestedAssessment(updatedAssessment);
    }
  };

  const handleOptionChange = (
    questionIndex: number,
    optionKey: string,
    newValue: string
  ) => {
    if (suggestedAssessment) {
      const updatedAssessment = [...suggestedAssessment];
      updatedAssessment[questionIndex].options = {
        ...updatedAssessment[questionIndex].options,
        [optionKey]: newValue,
      };
      setSuggestedAssessment(updatedAssessment);
    }
  };

  const handleCorrectAnswerChange = (
    index: number,
    newCorrectAnswer: string
  ) => {
    if (suggestedAssessment) {
      const updatedAssessment = [...suggestedAssessment];
      updatedAssessment[index] = {
        ...updatedAssessment[index],
        correct_answer: newCorrectAnswer,
      };
      setSuggestedAssessment(updatedAssessment);
    }
  };

  const handleSaveAssessment = async () => {
    setSavingAssessment(true);
    setSaveError(null);
    setSaveSuccess(false);

    if (!suggestedAssessment || suggestedAssessment.length === 0) {
      setSaveError("No assessment to save.");
      setSavingAssessment(false);
      return;
    }

    if (!liveclassroom_id || !transcriptId) {
      setSaveError("Missing live classroom ID or transcript ID for saving.");
      setSavingAssessment(false);
      return;
    }

    const assessmentToSave = suggestedAssessment.map((q) => ({
      question: q.question,
      options: Object.values(q.options), // Ensure options are sent as an array of strings
      correct_answer: q.correct_answer,
      liveclassroom_id: parseInt(liveclassroom_id),
      transcript_id: parseInt(transcriptId),
      classroom_id: parseInt(liveClass?.classroom_id || "123"), // Provide a default or handle appropriately
    }));

    try {
      await saveAssessment(assessmentToSave);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSaveSuccess(true);
    } catch (err: any) {
      setSaveError(err.message || "Failed to save assessment.");
    } finally {
      setSavingAssessment(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-50 p-4">
        <div className="text-center text-red-700 bg-red-100 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Error!</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const isLoading = loadingLiveClass || loadingTranscript;

  if (!liveClass && !loadingLiveClass && !transcript && !loadingTranscript) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 p-4">
        <div className="text-center text-gray-700 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Details Not Found</h2>
          <p>
            The requested live class or transcript could not be found. It might
            have been deleted or never existed.
          </p>
        </div>
      </div>
    );
  }

  const formattedCreatedAt = liveClass?.created_at
    ? new Date(liveClass.created_at).toLocaleString()
    : "N/A";

  const cleanedTranscriptContent = transcript?.content || "N/A";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="relative p-6 sm:p-10 bg-gradient-to-r from-purple-700 to-indigo-700 text-white">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-indigo-500 flex items-center justify-center border-4 border-white shadow-lg">
              {isLoading ? (
                <Skeleton className="w-full h-full rounded-full" />
              ) : (
                <AcademicCapIcon className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {isLoading ? (
                  <Skeleton className="w-72 h-10" />
                ) : (
                  liveClass?.title || "Live Class Details"
                )}
              </h1>
              <p className="mt-2 text-indigo-200 text-lg">
                {isLoading ? (
                  <Skeleton className="w-60 h-6 mt-1" />
                ) : liveClass?.title?.split(" ")[0] ? (
                  `Details for: ${liveClass.title.split(" ")[0]}`
                ) : (
                  "Associated Live Class Overview"
                )}
              </p>
              <div className="mt-4 flex items-center text-indigo-300 text-sm">
                {isLoading ? (
                  <Skeleton className="w-40 h-5 mt-1" />
                ) : (
                  <>
                    <span>Participants: {liveClass?.participant || "N/A"}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            {isLoading ? (
              <Skeleton className="w-28 h-8 rounded-full" />
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-600 text-white shadow">
                {liveClass?.meeting_type === "instant"
                  ? "Instant Class"
                  : "Scheduled Class"}
              </span>
            )}
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <DocumentTextIcon className="w-7 h-7 mr-3 text-purple-600" />
            Full Transcript Content (ID: {transcriptId || "N/A"})
          </h2>
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200 mb-6">
            {loadingTranscript ? (
              <div className="space-y-3">
                <Skeleton className="w-full h-5" />
                <Skeleton className="w-11/12 h-5" />
                <Skeleton className="w-full h-5" />
                <Skeleton className="w-10/12 h-5" />
                <Skeleton className="w-full h-5" />
                <Skeleton className="w-9/12 h-5" />
              </div>
            ) : (
              <div className="prose max-w-none text-gray-800 leading-relaxed overflow-y-auto max-h-[60vh] custom-scrollbar">
                {cleanedTranscriptContent === "N/A" ? (
                  <p>No transcript content available.</p>
                ) : (
                  <pre className="whitespace-pre-wrap font-sans text-sm">
                    <MarkdownRenderer
                      content={cleanedTranscriptContent}
                      style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}
                    />
                  </pre>
                )}
              </div>
            )}
            <div className="mt-6 flex justify-end">
              {loadingTranscript ? (
                <Skeleton className="w-32 h-10 rounded-md" />
              ) : (
                <button
                  onClick={() => handleCopy(cleanedTranscriptContent)}
                  disabled={cleanedTranscriptContent === "N/A"}
                  className="inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {copied ? (
                    <ClipboardDocumentCheckIcon className="w-5 h-5 mr-2" />
                  ) : (
                    <ClipboardDocumentListIcon className="w-5 h-5 mr-2" />
                  )}
                  {copied ? "Copied!" : "Copy Transcript"}
                </button>
              )}
            </div>
          </div>
          <hr className="my-8 border-gray-200" />{" "}
          {/* Added a horizontal rule for separation */}
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200 mt-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <LightBulbIcon className="w-6 h-6 mr-3 text-yellow-600" />
              Assessment
            </h3>
            <div className="flex space-x-4 mb-4">
              {assessmentLoading ? (
                <Skeleton className="w-40 h-10 rounded-md" />
              ) : suggestedAssessment === null ||
                suggestedAssessment.length === 0 ? (
                <Button
                  onClick={handleSuggestAssessment}
                  disabled={assessmentLoading || !transcript?.content}
                  className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md"
                >
                  {assessmentLoading ? "Generating..." : "Suggest Assessment"}
                </Button>
              ) : null}{" "}
              <Button
                onClick={handleAddNewQuestion}
                className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-green-600"
              >
                <PlusCircleIcon className="w-5 h-5 mr-2" /> Add New Question
              </Button>
            </div>

            {assessmentLoading ? (
              <div className="space-y-2">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-5/6 h-4" />
                <Skeleton className="w-full h-4" />
              </div>
            ) : assessmentError ? (
              <p className="text-red-600 text-sm">{assessmentError}</p>
            ) : suggestedAssessment && suggestedAssessment.length > 0 ? (
              <div>
                {suggestedAssessment.map((q, qIndex) => (
                  <div
                    key={qIndex}
                    className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50"
                  >
                    <div className="mb-3">
                      <Label
                        htmlFor={`question-${qIndex}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Question {qIndex + 1}:
                      </Label>
                      <TextArea
                        id={`question-${qIndex}`}
                        value={q.question}
                        onChange={(e) =>
                          handleQuestionChange(qIndex, e.target.value)
                        }
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      {Object.keys(q.options).map((optionKey) => (
                        <div key={`${qIndex}-${optionKey}`}>
                          <Label
                            htmlFor={`option-${qIndex}-${optionKey}`}
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Option {optionKey}:
                          </Label>
                          <Input
                            id={`option-${qIndex}-${optionKey}`}
                            value={q.options[optionKey]}
                            onChange={(e) =>
                              handleOptionChange(
                                qIndex,
                                optionKey,
                                e.target.value
                              )
                            }
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <Label
                        htmlFor={`correct-answer-${qIndex}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Correct Answer:
                      </Label>
                      <Select
                        value={q.correct_answer}
                        onValueChange={(value) =>
                          handleCorrectAnswerChange(qIndex, value)
                        }
                      >
                        <SelectTrigger
                          id={`correct-answer-${qIndex}`}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <SelectValue placeholder="Select correct option" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(q.options).map((optionKey) => (
                            <SelectItem key={optionKey} value={optionKey}>
                              {optionKey}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
                <div className="mt-6 text-right">
                  <Button
                    onClick={handleSaveAssessment}
                    disabled={savingAssessment || !suggestedAssessment.length}
                    className="inline-flex items-center px-6 py-3 bg-primary text-white text-base font-medium rounded-md hover:bg-green-700 "
                  >
                    {savingAssessment ? "Saving..." : "Save Assessment"}
                  </Button>
                  {saveSuccess && (
                    <p className="text-green-600 text-sm mt-2">
                      Assessment saved successfully!
                    </p>
                  )}
                  {saveError && (
                    <p className="text-red-600 text-sm mt-2">{saveError}</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                Click "Suggest Assessment" to generate a suitable assessment
                based on the transcript, or "Add New Question" to create one
                manually.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptDetailsPage;
