import apiClient from "../lib/apiClient";

export interface Tool {
  id: number;
  name: string;
  description: string;
  service_id: string;
  prompt: string | null;
  thumbnail: string;
  assign_to: string;
  slug: string;
  is_customizable: number;
  req_param: string;
  label: string;
  created_at: string;
  updated_at: string;
}

export const fetchTools = async (): Promise<Tool[]> => {
  try {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: Tool[];
    }>("/tools");
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data || "Failed to fetch tools. Please try again."
    );
  }
};

export interface SubmitToolData {
  user_id: number;
  serviceId: string;
  title?: string;
  subject?: string;
  grade?: string;
  country?: string;
  description?: string;
  objective?: string;
  topic?: string;
  noOfQuestions?: number;
  ageGroup?: string;
  theme?: string;
  numberOfVerse?: number;
  keywords?: string;
}

export const submitToolData = async (data: SubmitToolData) => {
  try {
    const response = await apiClient.post("/ai/teacher", data);
    return response;
  } catch (error: any) {
    throw new Error(
      error.response?.data || "Failed to submit tool data. Please try again."
    );
  }
};
