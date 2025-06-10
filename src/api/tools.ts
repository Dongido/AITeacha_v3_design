import apiClient from "../lib/apiClient";

export interface Tool {
  id: number;
  name: string;
  description: string;
  service_id: string;
  prompt: string | null;
  thumbnail: string;
  assign_to: string;
  category: string;
  slug: string;
  is_customizable: number;
  req_param: string;
  tag: string;
  editable: string;
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

export const fetchStudentTools = async (): Promise<Tool[]> => {
  try {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: Tool[];
    }>("/tools/students/use");
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data || "Failed to fetch student tools. Please try again."
    );
  }
};

export const fetchToolsCategory = async (): Promise<any[]> => {
  try {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: any[];
    }>("/tools/get/category");
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data ||
        "Failed to fetch tools  category. Please try again."
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
  initial?: boolean;
  objective?: string;
  topic?: string;
  noOfQuestions?: number;
  ageGroup?: string;
  theme?: string;
  purpose?: string;
  prompt?: string;
  numberOfVerse?: number;
  keywords?: string;
}

export interface SaveResourceData {
  category: string;
  prompt_q: string;
  returned_answer: string;
}

export interface Resource {
  id: string;
  user_id: string;
  returned_answer: string;
  category: string;
  prompt: string;
  created_at: string;
}

export const saveResource = async (data: SaveResourceData) => {
  try {
    const response = await apiClient.post("/ai/save/resources", data);
    return response;
  } catch (error: any) {
    throw new Error(
      error.response?.data || "Failed to save resource. Please try again."
    );
  }
};

export const getUserResources = async (): Promise<any[]> => {
  try {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: any[];
    }>("/ai/user/resources");
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data ||
        "Failed to fetch user resources. Please try again."
    );
  }
};

export const getUserResourceById = async (id: string): Promise<any> => {
  try {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: any;
    }>(`/ai/user/resource/${id}`);
    return response.data.data[0];
  } catch (error: any) {
    throw new Error(
      error.response?.data || "Failed to fetch the resource. Please try again."
    );
  }
};

export const checkEligibility = async (id: number): Promise<any> => {
  try {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: any;
    }>(`/profile/check/toolrestriction/${id}`);
    console.log(response.data.data);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data ||
        "Failed to check tool eligibility. Please try again."
    );
  }
};

export const submitToolData = async (
  data: any,
  contentType: string = "multipart/form-data"
) => {
  try {
    const response = await apiClient.post("/ai/teacher", data, {
      headers: {
        "Content-Type": contentType,
      },
    });
    return response;
  } catch (error: any) {
    throw new Error(
      error.response?.data.message ||
        "Failed to submit tool data. Please try again."
    );
  }
};
export const submitStudentToolData = async (data: SubmitToolData) => {
  try {
    const response = await apiClient.post("/ai/learner", data);
    return response;
  } catch (error: any) {
    console.log(error);
    return error.response || "Network Error";
  }
};
export const fetchToolsReport = async (): Promise<any> => {
  try {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: any;
    }>("/report/get/tools/report");

    if (response.status !== 200) {
      throw new Error("Failed to fetch the tools report.");
    }

    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data ||
        "Failed to fetch the tools report. Please try again."
    );
  }
};
