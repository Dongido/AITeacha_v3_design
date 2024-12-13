import apiClient from "../lib/apiClient";
import { Classroom, ClassroomData, Student } from "./interface";

export const fetchClassroomsByUser = async (): Promise<Classroom[]> => {
  try {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: Classroom[];
    }>(`/classroom/creator/all`);

    return response.data.data;
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch classrooms. Please try again."
      );
    } else {
      throw new Error("Failed to fetch classrooms. Please try again.");
    }
  }
};

export const deleteClassroom = async (classroomId: number): Promise<void> => {
  try {
    const response = await apiClient.delete(`/classroom/${classroomId}`);
    if (response.status !== 200) {
      throw new Error("Failed to delete classroom.");
    }
  } catch (error: any) {
    throw new Error(
      error.response?.data || "Failed to delete classroom. Please try again."
    );
  }
};

interface CreateClassroomData {
  user_id: number;
  name: string;
  description?: string;
  grade: string;
  status: string;
  number_of_students: number;
  tools: {
    tools_id: number;

    customized_name: string | null;
    customized_description: string | null;
    additional_instruction: string | null;
  }[];
}

export const createClassroom = async (
  data: any,
  contentType: string = "multipart/form-data"
): Promise<Classroom> => {
  console.log("Using Content-Type:", contentType);
  console.log(data);
  try {
    const response = await apiClient.post<{
      status: string;
      message: string;
      data: Classroom;
    }>("/classroom", data, {
      headers: {
        "Content-Type": contentType,
      },
    });

    if (response.status !== 201) {
      throw new Error("Failed to create classroom.");
    }

    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data || "Failed to create classroom. Please try again."
    );
  }
};
export const fetchClassroomById = async (
  classroomId: number
): Promise<Classroom> => {
  try {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: Classroom[];
    }>(`/classroom/${classroomId}`);

    const classroomData = response.data.data[0];
    if (!classroomData) {
      throw new Error("Classroom not found.");
    }

    return classroomData;
  } catch (error: any) {
    throw new Error(
      error.response?.data ||
        "Failed to fetch classroom details. Please try again."
    );
  }
};

export const fetchClassroomByJoinCode = async (
  joinCode: string
): Promise<ClassroomData> => {
  try {
    const response = await apiClient.post<{
      status: string;
      message: string;
      data: ClassroomData[];
    }>("/classroom/current", { join_code: joinCode });

    const classroomData = response.data.data[0];
    if (!classroomData) {
      throw new Error("Classroom not found.");
    }

    return classroomData;
  } catch (error: any) {
    throw new Error(
      error.response?.data ||
        "Failed to fetch classroom details. Please try again."
    );
  }
};

export const joinClassroom = async (
  joinUrl: string,
  joinCode: string
): Promise<{ status: string; message: string }> => {
  try {
    const response = await apiClient.post<{
      status: string;
      message: string;
    }>("/classroom/validate/student", {
      join_url: joinUrl,
      join_code: joinCode,
    });

    if (response.status !== 200) {
      throw new Error("Failed to join the classroom.");
    }

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data || "Failed to join the classroom. Please try again."
    );
  }
};

export const checkIfStudentInClassroom = async (
  joinCode: number
): Promise<boolean> => {
  try {
    const response = await apiClient.post<{
      status: string;
      data: { isInClassroom: boolean };
    }>("/student/checkstudent", { classroom_id: joinCode });

    return response.data.data.isInClassroom;
  } catch (error: any) {
    throw new Error(
      error.response?.data || "Failed to check if student is in the classroom."
    );
  }
};

export const addStudentToClassroom = async (
  classroomId: number
): Promise<{ status: string; message: string }> => {
  try {
    const response = await apiClient.post<{
      status: string;
      message: string;
    }>("/student/addclassstudent", {
      classroom_id: classroomId,
    });

    if (response.status !== 200) {
      throw new Error("Failed to add student to the classroom.");
    }

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data ||
        "Failed to add student to the classroom. Please try again."
    );
  }
};
export const fetchStudentsInClassroom = async (
  classroomId: number
): Promise<any[]> => {
  try {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: any[];
    }>(`/classroom/students/${classroomId}`, {});

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

export const removeStudentFromClassroom = async (
  classroom_id: number,
  student_id: number
): Promise<void> => {
  try {
    await apiClient.delete(`/classroom/delete/student`, {
      data: {
        classroom_id,
        student_id,
      },
    });
  } catch (error) {
    throw new Error(
      `Error removing student ${student_id} from classroom ${classroom_id}`
    );
  }
};

export const fetchClassroomTools = async (
  classroomId: number
): Promise<any[]> => {
  try {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: any[];
    }>(`/classroom/tools/${classroomId}`);

    if (response.status !== 200) {
      throw new Error("Failed to fetch classroom tools.");
    }

    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data ||
        "Failed to fetch classroom tools. Please try again."
    );
  }
};

export const fetchStudentAnalytics = async (
  classroom_id: number,
  student_id: number,
  tools: any[]
): Promise<any> => {
  try {
    const response = await apiClient.post("/assistant/student/analytics", {
      classroom_id,
      student_id,
      tools,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch student analytics."
    );
  }
};
