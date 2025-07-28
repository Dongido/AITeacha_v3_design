import apiClient from "../lib/apiClient";
import { Classroom, ClassroomData, Student } from "./interface";

export interface messageResponse {
  status: string;
  message: string;
  data: string;
}
export const sendChatMessage = async (data: FormData) => {
  try {
    const response = await apiClient.post("/assistant/chat", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data ||
      "Failed to fetch chat response. Please try again.";
    throw new Error(errorMessage);
  }
};
export const getEphemeralKey = async (data: {
  voice_type: string;
  language: string;
  grade: string;
  description: string;
  topics: string;
}) => {
  try {
    const response = await apiClient.post(
      "/assistant/realtime/session/token",
      data
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      "Failed to retrieve ephemeral key. Please try again.";
    throw new Error(errorMessage);
  }
};
export const loadClassroomChatHistory = async (
  classroom_id: number,
  limit: number,
  page: number
) => {
  try {
    const response = await apiClient.get(
      `/assistant/classroom/chat/history/${classroom_id}/${limit}/${page}`
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data ||
      "Failed to load classroom chat history. Please try again.";
    throw new Error(errorMessage);
  }
};

export const loadToolChatHistory = async (
  classroom_id: number,
  toolID: number,
  limit: number,
  page: number
) => {
  try {
    const response = await apiClient.get(
      `/assistant/classroomtools/chat/history/${classroom_id}/${toolID}/${limit}/${page}`
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data ||
      "Failed to load tool chat history. Please try again.";
    throw new Error(errorMessage);
  }
};
export interface SimulationResponse {
  status: string;
  message: string;
  data: any;
}

export interface TopicsResponse {
  status: any;
  message: string;
  data?: string[];
}

export const getSimulation = async (
  grade: string,
  topics: string
): Promise<any> => {
  try {
    const response = await apiClient.post("/assistant/generate/lab/simulator", {
      grade,
      topics,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      "Failed to fetch simulation. Please try again.";
    throw new Error(errorMessage);
  }
};

export const fetchTopics = async (
  grade: string,
  classroom_id: string,
  classroom_content: string,
  outline_title: string,
  outline_content: string
): Promise<any> => {
  try {
    const response = await apiClient.post(
      "/assistant/suggest/labsimulation/topics",
      {
        grade,
        classroom_id,
        classroom_content,
        outline_title,
        outline_content,
      }
    );
    console.log(response.data);

    return response;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      "Failed to fetch topics. Please try again.";
    return { status: "error", message: errorMessage, data: [] };
  }
};
