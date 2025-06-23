import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLiveClassById, listTranscripts } from "../../../api/liveclass";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  AcademicCapIcon,
  ChatBubbleBottomCenterTextIcon,
  SpeakerWaveIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import {
  ClipboardDocumentListIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/solid";
import { Skeleton } from "../../../components/ui/Skeleton";
import { Button } from "../../../components/ui/Button";
import { transcriptColumns } from "./components/column.transcript";
import BaseTable from "../../../components/table/BaseTable";
export interface Meeting {
  id: number;
  user_id: number;
  name: string;
  title: string | null;
  description: string | null;
  meeting_code: string;
  meeting_url: string;
  meeting_timezone: string | null;
  meeting_location: string | null;
  notes: string | null;
  participant: string | null;
  classroom_name: string | null;
  meeting_type: string;
  created_at: string;
  updated_at: string;
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

const LiveClassDetailsPage: React.FC = () => {
  const { meetingId } = useParams<{ meetingId: string }>();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const [transcripts, setTranscripts] = useState<any[] | null>(null);
  const [transcriptsLoading, setTranscriptsLoading] = useState<boolean>(false);
  const [transcriptsError, setTranscriptsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!meetingId) {
        setError("Meeting ID is missing from the URL.");
        setLoading(false);
        return;
      }

      const id = parseInt(meetingId);
      if (isNaN(id)) {
        setError("Invalid Meeting ID in the URL.");
        setLoading(false);
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
          setMeeting(data.data[0]);
        } else if (data && !Array.isArray(data.data)) {
          setMeeting(data);
        } else {
          setError("Meeting data not found in API response.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch meeting details.");
        console.error("Error fetching live class details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [meetingId]);

  useEffect(() => {
    const fetchMeetingTranscripts = async () => {
      if (meetingId && meeting) {
        setTranscriptsLoading(true);
        setTranscriptsError(null);
        try {
          const data = await listTranscripts(meetingId);
          setTranscripts(data.data);
          console.log("Fetched Transcripts:", data);
        } catch (err: any) {
          setTranscriptsError(err.message || "Failed to load transcripts.");
          console.error("Error fetching transcripts:", err);
        } finally {
          setTranscriptsLoading(false);
        }
      } else if (!loading && !meetingId) {
        setTranscriptsError("Meeting ID is required to fetch transcripts.");
      }
    };
    if (!loading && meeting) {
      fetchMeetingTranscripts();
    }
  }, [meetingId, meeting, loading]);

  const handleCopy = async (text: any) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleStartMeeting = () => {
    navigate(`/dashboard/liveclass/meeting/live/${meetingId}`);
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

  if (!meeting && !loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 p-4">
        <div className="text-center text-gray-700 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Live Class Not Found</h2>
          <p>
            The requested live class could not be found. It might have been
            deleted or never existed.
          </p>
        </div>
      </div>
    );
  }

  const formattedCreatedAt = meeting?.created_at
    ? new Date(meeting.created_at).toLocaleString()
    : "N/A";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="relative p-6 sm:p-10 bg-gradient-to-r from-purple-700 to-indigo-700 text-white">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-indigo-500 flex items-center justify-center border-4 border-white shadow-lg">
              {loading ? (
                <Skeleton className="w-full h-full rounded-full" />
              ) : (
                <AcademicCapIcon className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {loading ? (
                  <Skeleton className="w-72 h-10" />
                ) : (
                  meeting?.title || "Untitled Live Class"
                )}
              </h1>
              <p className="mt-2 text-indigo-200 text-lg">
                {loading ? (
                  <Skeleton className="w-60 h-6 mt-1" />
                ) : meeting?.title?.split(" ")[0] ? (
                  `Dive deep into the world of ${meeting.title.split(" ")[0]}`
                ) : (
                  "A captivating learning experience"
                )}
              </p>
              <div className="mt-4 flex items-center text-indigo-300 text-sm">
                {loading ? (
                  <Skeleton className="w-40 h-5 mt-1" />
                ) : (
                  <>
                    <UserGroupIcon className="w-5 h-5 mr-2" />
                    <span>Participants: {meeting?.participant || "N/A"}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            {loading ? (
              <Skeleton className="w-28 h-8 rounded-full" />
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-600 text-white shadow">
                {meeting?.meeting_type === "instant"
                  ? "Instant Class"
                  : "Scheduled Class"}
              </span>
            )}
          </div>
        </div>

        <div className="p-6 sm:p-10">
          {" "}
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Class Overview
          </h2>
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200 mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <ChatBubbleBottomCenterTextIcon className="w-6 h-6 mr-3 text-purple-600" />
              Description
            </h3>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-5/6 h-4" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-4/5 h-4" />
              </div>
            ) : (
              <p className="text-gray-600 leading-relaxed">
                {meeting?.description ||
                  "No description provided for this live class."}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <DetailCard
              icon={<CalendarIcon className="w-6 h-6 text-red-600" />}
              title="Created On"
              value={formattedCreatedAt}
              loading={loading}
            />
            <DetailCard
              icon={<ClockIcon className="w-6 h-6 text-yellow-600" />}
              title="Timezone"
              value={meeting?.meeting_timezone || "N/A"}
              loading={loading}
            />
            <DetailCard
              icon={<MapPinIcon className="w-6 h-6 text-blue-600" />}
              title="Location"
              value={meeting?.meeting_location || "Online"}
              loading={loading}
            />
            <DetailCard
              icon={<SpeakerWaveIcon className="w-6 h-6 text-orange-600" />}
              title="Meeting Type"
              value={
                meeting?.meeting_type
                  ? meeting.meeting_type.charAt(0).toUpperCase() +
                    meeting.meeting_type.slice(1)
                  : "N/A"
              }
              loading={loading}
            />
          </div>
          <div className="flex justify-center mt-6">
            <Button
              onClick={handleStartMeeting}
              disabled={loading}
              className="bg-primary text-white font-bold py-3 px-8 rounded-lg shadow-lg "
            >
              Start Meeting
            </Button>
          </div>
          <div className="mt-10">
            {" "}
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Resources & Notes
            </h2>
            {(transcriptsLoading ||
              (transcripts && transcripts.length > 0) ||
              transcriptsError) && (
              <div className="mb-6">
                {" "}
                <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                  Transcripts
                </h3>
                {transcriptsLoading ? (
                  <Skeleton className="w-full h-48" />
                ) : transcriptsError ? (
                  <div className="text-red-600">{transcriptsError}</div>
                ) : transcripts && transcripts.length > 0 ? (
                  <BaseTable data={transcripts} columns={transcriptColumns} />
                ) : (
                  <div className="text-gray-500">
                    No transcripts available for this class.
                  </div>
                )}
              </div>
            )}
            {(meeting?.notes || loading) && (
              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                  <ClipboardDocumentListIcon className="w-6 h-6 mr-3 text-purple-600" />
                  Notes
                </h3>
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-3/4 h-4" />
                    <Skeleton className="w-full h-4" />
                  </div>
                ) : (
                  <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 max-h-40 overflow-y-auto custom-scrollbar">
                    <p className="text-gray-800 text-sm whitespace-pre-wrap">
                      {meeting?.notes || "No notes available for this class."}
                    </p>
                  </div>
                )}
                {loading ? (
                  <Skeleton className="w-32 h-10 mt-4 rounded-md" />
                ) : (
                  <button
                    onClick={() => handleCopy(meeting?.notes || "")}
                    className="mt-4 inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors"
                  >
                    {copied ? (
                      <ClipboardDocumentCheckIcon className="w-5 h-5 mr-2" />
                    ) : (
                      <ClipboardDocumentListIcon className="w-5 h-5 mr-2" />
                    )}
                    {copied ? "Copied!" : "Copy Notes"}
                  </button>
                )}
              </div>
            )}
            {!meeting?.notes &&
              !(transcripts && transcripts.length > 0) &&
              !loading &&
              !transcriptsLoading && (
                <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200 text-center text-gray-500">
                  <p>No transcript or notes available for this class yet.</p>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveClassDetailsPage;
