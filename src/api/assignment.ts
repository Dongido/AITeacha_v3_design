import apiClient from "../lib/apiClient";
import { Assignment, AssignmentData } from "./interface";

export const fetchAssignmentsByUser = async (): Promise<Assignment[]> => {
  try {
    const user = JSON.parse(localStorage.getItem("ai-teacha-user") || "{}");
    const userId = user.id;

    if (!userId) {
      throw new Error("User ID not found. Please log in.");
    }

    const response = await apiClient.get<{
      status: string;
      message: string;
      data: Assignment[];
    }>("/assignment/creator/all");

    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data || "Failed to fetch assignments. Please try again."
    );
  }
};

export const deleteAssignment = async (assignmentId: number): Promise<void> => {
  try {
    const response = await apiClient.delete(`/assignment/${assignmentId}`);
    if (response.status !== 200) {
      throw new Error("Failed to delete assignment.");
    }
  } catch (error: any) {
    throw new Error(
      error.response?.data || "Failed to delete assignment. Please try again."
    );
  }
};

export interface CreateAssignmentData {
  user_id: number;
  name: string;
  description?: string;
  grade: string;
  status: string;
  number_of_students: number;
  scope_restriction: boolean;
}

export const createAssignment = async (
  data: CreateAssignmentData,
  contentType: string = "application/json"
): Promise<Assignment> => {
  console.log("Using Content-Type:", contentType);
  console.log(data);
  try {
    const response = await apiClient.post<{
      status: string;
      message: string;
      data: Assignment;
    }>("/assignment", data, {
      headers: {
        "Content-Type": contentType,
      },
    });

    if (response.status !== 201) {
      throw new Error("Failed to create assignment.");
    }

    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data || "Failed to create assignment. Please try again."
    );
  }
};

export const fetchAssignmentById = async (
  assignmentId: number
): Promise<Assignment> => {
  try {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: Assignment[];
    }>(`/assignment/${assignmentId}`);

    const assignmentData = response.data.data[0];
    if (!assignmentData) {
      throw new Error("Assignment not found.");
    }

    return assignmentData;
  } catch (error: any) {
    throw new Error(
      error.response?.data ||
        "Failed to fetch assignment details. Please try again."
    );
  }
};

export const fetchAssignmentByJoinCode = async (
  joinCode: string
): Promise<AssignmentData> => {
  try {
    const response = await apiClient.post<{
      status: string;
      message: string;
      data: AssignmentData[];
    }>("/assignment/current", { join_code: joinCode });

    const assignmentData = response.data.data[0];
    if (!assignmentData) {
      throw new Error("Assignment not found.");
    }

    return assignmentData;
  } catch (error: any) {
    throw new Error(
      error.response?.data ||
        "Failed to fetch assignment details. Please try again."
    );
  }
};

export const joinAssignment = async (
  joinUrl: string,
  joinCode: string
): Promise<{ status: string; message: string }> => {
  try {
    const response = await apiClient.post<{
      status: string;
      message: string;
    }>("/assignment/validate/student", {
      join_url: joinUrl,
      join_code: joinCode,
    });

    if (response.status !== 200) {
      throw new Error("Failed to join the assignment.");
    }

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data || "Failed to join the assignment. Please try again."
    );
  }
};

export const checkIfStudentInAssignment = async (
  joinCode: number
): Promise<boolean> => {
  try {
    const response = await apiClient.post<{
      status: string;
      data: { isInAssignment: boolean };
    }>("/student/checkassignment", { assignment_id: joinCode });

    return response.data.data.isInAssignment;
  } catch (error: any) {
    throw new Error(
      error.response?.data || "Failed to check if student is in the assignment."
    );
  }
};

export const addStudentToAssignment = async (
  assignmentId: number
): Promise<{ status: string; message: string }> => {
  try {
    const response = await apiClient.post<{
      status: string;
      message: string;
    }>("/student/addassignmentstudent", {
      assignment_id: assignmentId,
    });

    if (response.status !== 200) {
      throw new Error("Failed to add student to the assignment.");
    }

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data ||
        "Failed to add student to the assignment. Please try again."
    );
  }
};

export const fetchStudentsInAssignment = async (
  assignmentId: number
): Promise<any[]> => {
  try {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: any[];
    }>(`/assignment/students/${assignmentId}`, {});

    if (response.status !== 200) {
      throw new Error("Failed to fetch students.");
    }

    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data || "Failed to fetch students. Please try again."
    );
  }
};

export const removeStudentFromAssignment = async (
  assignment_id: number,
  student_id: number
): Promise<void> => {
  try {
    await apiClient.delete(`/assignment/delete/student`, {
      data: {
        assignment_id,
        student_id,
      },
    });
  } catch (error) {
    throw new Error(
      `Error removing student ${student_id} from assignment ${assignment_id}`
    );
  }
};

export const fetchAssignmentQuestions = async (
  assignmentId: number
): Promise<any[]> => {
  try {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: any[];
    }>(`/assignment/questions/${assignmentId}`);

    if (response.status !== 200) {
      throw new Error("Failed to fetch assignment questions.");
    }

    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data ||
        "Failed to fetch assignment questions. Please try again."
    );
  }
};

export const fetchStudentAssignmentAnalytics = async (
  assignmentId: number,
  studentId: number,
  questions: any[]
): Promise<any> => {
  try {
    const response = await apiClient.post(
      "/assistant/student/assignment-analytics",
      {
        assignmentId,
        studentId,
        questions,
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch student assignment analytics."
    );
  }
};
