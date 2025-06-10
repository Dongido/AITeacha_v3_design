import apiClient from "../lib/apiClient";

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}
const parseApiError = (error: any): string => {
  if (error.isAxiosError && error.response && error.response.data) {
    const apiError = error.response.data as ApiResponse<any>;
    console.log(apiError);
    if (apiError.message) {
      return apiError.message;
    }
  }
  return "Failed to fetch data. Please try again.";
};
export const fetchArchivedAssistants = async (): Promise<any[]> => {
  try {
    const response = await apiClient.get<ApiResponse<any[]>>(
      "/assistant/retrieve/archive"
    );
    return response.data.data;
  } catch (error: any) {
    throw parseApiError(error);
  }
};

export const removeArchivedAssistant = async (ref: string): Promise<void> => {
  try {
    await apiClient.delete(`/assistant/remove/archive/${ref}`);
  } catch (error: any) {
    throw new Error(
      error.response?.data ||
        "Failed to remove archived assistant. Please try again."
    );
  }
};

export const uploadArchivedAssistant = async (
  formData: FormData
): Promise<any> => {
  try {
    const response = await apiClient.post<{
      status: string;
      message: string;
      data: any;
    }>("/assistant/upload/archive", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data ||
        "Failed to upload archived assistant. Please try again."
    );
  }
};
