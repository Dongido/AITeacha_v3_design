import apiClient from "../lib/apiClient";

export const uploadStudents = async (students: any): Promise<any> => {
  console.log("students", students)
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

export const uploadSingleStudents = async (students: any): Promise<any> => {
   console.log("student", students)
  try {
    const response = await apiClient.post(
      "/profile/add/students/batch",
      students
    );
    return response.data;
    console.log("response", response)
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

export const uploadTeachers = async (teachers: any): Promise<any> => {
  try {
    const response = await apiClient.post(
      "/profile/add/teachers/batch",
      teachers
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to upload teachers due to invalid data. Please check your CSV."
      );
    } else if (error.response?.status === 403) {
      throw new Error(
        error.response?.data?.message || "Unauthorized to upload teachers."
      );
    } else {
      throw new Error("Failed to upload teachers. Please try again later.");
    }
  }
};
