import apiClient from "../lib/apiClient";

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}
export const fetchAdminResources = async (): Promise<any[]> => {
  try {
    const response = await apiClient.get<ApiResponse<any[]>>(
      `/admin/openai/training/files`
    );
    return response.data.data;
  } catch (error: any) {
    console.log(error.response?.data.message);
    throw new Error(
      error.response?.data.message || "Failed to fetch banks. Please try again."
    );
  }
};

interface AddAdminResourcePayload {
  file: File;
  subject: string;
  grade: string;
  country: string;
  title: string;
}
export const addAdminResource = async (
  payload: AddAdminResourcePayload
): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append("file", payload.file);
    formData.append("subject", payload.subject);
    formData.append("grade", payload.grade);
    formData.append("country", payload.country);
    formData.append("title", payload.title);

    const response = await apiClient.post<ApiResponse<any>>(
      `/admin/openai/filestorage`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", 
        },
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.log(error.response?.data.message);
    throw new Error(
      error.response?.data.message ||
        "Failed to add resource. Please try again."
    );
  }
};
