import apiClient from "../lib/apiClient";
import { Classroom, ClassroomData, Student } from "./interface";

export interface messageResponse {
  status: string;
  message: string;
  data: string;
}
export const sendChatMessage = async (data: {
  content: string;
  content_from: string;
}) => {
  try {
    const response = await apiClient.post("/assistant/chat", data);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data ||
      "Failed to fetch chat response. Please try again.";
    throw new Error(errorMessage);
  }
};
