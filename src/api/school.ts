import apiClient from "../lib/apiClient";

export const uploadStudents = async (students: any): Promise<any> => {
  try {
    const response = await apiClient.post(
      "/profile/add/students/batch",
      students
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to upload students due to invalid data. Please check your CSV."
      );
    } else if (error.response?.status === 403) {
      throw new Error(
        error.response?.data?.message || "Unauthorized to upload students."
      );
    } else {
      throw new Error("Failed to upload students. Please try again later.");
    }
  }
};
