import apiClient from "../lib/apiClient";
import {
  Classroom,
  ClassroomData,
  Student,
  Topicsuggestion,
} from "./interface";

export const fetchClassroomsByUser = async (): Promise<Classroom[]> => {
  try {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: Classroom[];
    }>(`/classroom/creator/all`);

    return response.data.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch classrooms. Please try again."
      );
    } else {
      throw new Error("Failed to fetch classrooms. Please try again.");
    }
  }
};

export const fetchClassroomsByTeam = async (): Promise<Classroom[]> => {
  try {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: Classroom[];
    }>(`/classroom/team/classes`);

    return response.data.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
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

export const editClassroom = async (
  id: string,
  data: any,
  contentType: string = "multipart/form-data"
): Promise<Classroom> => {
  console.log("Using Content-Type:", contentType);
  console.log(data);
  try {
    const response = await apiClient.put<{
      status: string;
      message: string;
      data: Classroom;
    }>(`/classroom/${id}`, data, {
      headers: {
        "Content-Type": contentType,
      },
    });
    if (response.status !== 200) {
      throw new Error("Failed to update classroom.");
    }
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data || "Failed to update classroom. Please try again."
    );
  }
};

export const fetchReport = async (reportId: string): Promise<any> => {
  try {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: any;
    }>(`/report/${reportId}`);

    if (response.status !== 200) {
      throw new Error("Failed to fetch the report.");
    }

    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data || "Failed to fetch the report. Please try again."
    );
  }
};

export const fetchClassroomOutlineReport = async (
  classroomId: string
): Promise<any> => {
  try {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: any;
    }>(`/report/get/outlineassessment/${classroomId}`);

    if (response.status !== 200) {
      throw new Error("Failed to fetch the classroom outline report.");
    }

    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data ||
        "Failed to fetch the classroom outline report. Please try again."
    );
  }
};

export const fetchStudentReport = async (
  reportId: string,
  studentId: string
): Promise<any> => {
  try {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: any;
    }>(`/report/${reportId}/${studentId}`);

    if (response.status !== 200) {
      throw new Error("Failed to fetch the student report.");
    }

    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data ||
        "Failed to fetch the student report. Please try again."
    );
  }
};
export const fetchStudentPerformance = async (
  reportId: string
): Promise<any> => {
  try {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: any;
    }>(`/report/student/performance/${reportId}`);

    if (response.status !== 200) {
      throw new Error("Failed to fetch the student report.");
    }

    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data ||
        "Failed to fetch the student report. Please try again."
    );
  }
};
export const fetchLiveclassReport = async (
  classroomId: string
): Promise<any> => {
  try {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: any;
    }>(`/report/get/liveclassassessment/${classroomId}`);

    if (response.status !== 200) {
      throw new Error("Failed to fetch the student report.");
    }

    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data ||
        "Failed to fetch the student report. Please try again."
    );
  }
};

export const editClassroomTools = async (toolsData: any): Promise<any[]> => {
  console.log("Tools Data:", toolsData);

  try {
    const response = await apiClient.put<{
      status: string;
      message: string;
      data: any;
    }>(`/classroom/tools/update`, toolsData);

    if (response.status !== 200) {
      throw new Error("Failed to update classroom tools.");
    }

    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data ||
        "Failed to update classroom tools. Please try again."
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
    console.log(error.response.data);
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
    // console.log("student response", response)
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch student analytics."
    );
  }
};
export const suggestClassroomTopics = async (
  name: string,
  grade: string
): Promise<any> => {
  try {
    const response = await apiClient.post<{
      status: string;
      message: string;
      data: any;
    }>("/assistant/suggest/classroom/topics", {
      name,
      grade,
    });

    if (response.status !== 200) {
      throw new Error("Failed to suggest classroom topics.");
    }

    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data ||
        "Failed to suggest classroom topics. Please try again."
    );
  }
};

export const suggestClassroomOutlines = async (
  description: string,
  grade: string
): Promise<any> => {
  try {
    const response = await apiClient.post<{
      status: string;
      message: string;
      data: any;
    }>("/assistant/suggest/classroom/courseoutline", {
      description,
      grade,
    });

    if (response.status !== 200) {
      throw new Error("Failed to suggest classroom outline.");
    }

    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data ||
        "Failed to suggest classroom topics. Please try again."
    );
  }
};
export const toggleClassroomStatus = async (
  classroomId: number
): Promise<void> => {
  try {
    const response = await apiClient.put<{
      status: string;
      message: string;
    }>(`/classroom/activate/${classroomId}`);

    if (response.data.status !== "success") {
      throw new Error(
        response.data.message || "Failed to change classroom status ."
      );
    }
  } catch (error: any) {
    if (error.response?.status === 400 || error.response?.status === 404) {
      throw new Error(
        error.response?.data?.message || "Failed to change classroom status."
      );
    } else {
      throw new Error("Failed to change classroom status. Please try again.");
    }
  }
};

export const getSuggestedTopic = async (
  payload: any
): Promise<string | undefined> => {
  try {
    const response = await apiClient.post<{
      status: string;
      message: string;
      data: string;
    }>("/assistant/suggest/recommended/topic", payload);

    //  console.log("payload classrom", response.data)

    if (response.data.status !== "success") {
      throw new Error(
        response.data.message || "Failed to get suggested topic."
      );
    }

    return response.data.data;
  } catch (error) {
    console.log("Failed to get suggested topic", error);
    return undefined;
  }
};

export const chatHistory = async (payload: any): Promise<any[]> => {
  try {
    // console.log(payload,"payload")
    const { studentId, classroomId, page } = payload;
    // console.log("id", cla)
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: any[];
    }>(
      `/assistant/student/classroom/chat/history/${studentId}/${classroomId}/${10}/${page}`
    );

    //  console.log("response", response)

    if (response.data.status !== "success") {
      throw new Error(response.data.message || "Failed to get chat history");
    }
    const hasMore = response.data.data.length === 10;

    return response.data.data;
  } catch (error) {
    console.log("Failed to get chat History", error);
    return [];
  }
};

// interfaces.ts or top of classrooms.ts

export interface ToolHistoryParams {
  classroomId: any;
  toolId: any;
  userId: any;
  page?: number;
  limit?: number;
}
export const fetchToolsChatHistory = async ({
  classroomId,
  toolId,
  userId,
  page = 1,
  limit = 20,
}: ToolHistoryParams) => {
  try {
    const response = await apiClient.get(
      `/assistant/student/classroomtools/chat/history/${userId}/${classroomId}/${toolId}/${limit}/${page}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching tool chat history:", error);
    throw error;
  }
};

