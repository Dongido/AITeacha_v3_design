import apiClient from "../lib/apiClient";

export const authenticateLiveClass = async () => {
  try {
    const response = await apiClient.get("/live/class/auth");
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data ||
      "Failed to authenticate live class. Please try again.";
    throw new Error(errorMessage);
  }
};

export const handleLiveClassOAuthCallback = async (code: string) => {
  try {
    const response = await apiClient.post("/live/class/oauth2callback", {
      code,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data ||
      "Failed to handle live class OAuth callback. Please try again.";
    throw new Error(errorMessage);
  }
};
export const createLiveClass = async (classData: any) => {
  try {
    const response = await apiClient.post("/live/class/basic", classData);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data || "Failed to create live class. Please try again.";
    throw new Error(errorMessage);
  }
};
export const listLiveClassesByUser = async (classroomId: any) => {
  try {
    const response = await apiClient.get(`/live/class/user/all/${classroomId}`);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data || "Failed to list live classes. Please try again.";
    throw new Error(errorMessage);
  }
};

export const getLiveClassById = async (id: number) => {
  try {
    const response = await apiClient.get(`/live/class/${id}`);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data ||
      `Failed to retrieve live class with ID ${id}. Please try again.`;
    throw new Error(errorMessage);
  }
};
export const listTranscripts = async (classroomId: string) => {
  try {
    const response = await apiClient.get(
      `/live/class/list/transcripts/${classroomId}`
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data ||
      `Failed to list transcripts for classroom. Please try again.`;
    throw new Error(errorMessage);
  }
};

export const getTranscriptDetails = async (transcriptId: any) => {
  try {
    const response = await apiClient.get(
      `/live/class/get/transcript/${transcriptId}`
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data ||
      `Failed to retrieve transcript details for meeting. Please try again.`;
    throw new Error(errorMessage);
  }
};

export const deleteLiveClass = async (meetingId: number) => {
  try {
    const response = await apiClient.delete(`/live/class/${meetingId}`);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data ||
      `Failed to delete live class with ID ${meetingId}. Please try again.`;
    throw new Error(errorMessage);
  }
};
export const suggestAssessment = async (transcript_content: any) => {
  try {
    const response = await apiClient.post(
      "/assistant/suggest/transcript/assessment",
      transcript_content
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data ||
      "Failed to post transcript assessment. Please try again.";
    throw new Error(errorMessage);
  }
};

export const sendLiveClassroomAssessmentAnswers = async (submissionData: {
  liveclassroom_id: string;
  classroom_id: number;
  answers: any[];
}) => {
  try {
    const response = await apiClient.post(
      "/live/class/add/transcript/assssment",
      submissionData
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      "Failed to submit live classroom assessment answers. Please try again.";
    throw new Error(errorMessage);
  }
};

export const updateLiveClassMeetingUrl = async (
  meetingId: number,
  meeting_url: string
) => {
  try {
    const response = await apiClient.put(`/live/class/${meetingId}`, {
      meeting_url,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data ||
      `Failed to update meeting URL for live class with ID ${meetingId}. Please try again.`;
    throw new Error(errorMessage);
  }
};

export interface SaveAssessmentPayload {
  question: string;
  options: string[];
  correct_answer: string;
  liveclassroom_id: number;
  transcript_id: number;
  classroom_id: number;
}
export const saveAssessment = async (payload: SaveAssessmentPayload[]) => {
  try {
    const response = await apiClient.post(
      "/live/class/add/transcript/assessment",
      payload
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data || "Failed to save assessment. Please try again.";
    throw new Error(errorMessage);
  }
};
export const getTranscriptAssessment = async (transcriptId: number) => {
  try {
    const response = await apiClient.get(
      `/live/class/get/transcript/assessment/${transcriptId}`
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data ||
      `Failed to retrieve assessment for transcript ID ${transcriptId}. Please try again.`;
    throw new Error(errorMessage);
  }
};
