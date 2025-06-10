import apiClient from "../lib/apiClient";

export interface Tool {
  tool_id: number;
  tool_name: string;
  service_id: string;
  assign_to: string;
  slug: string;
  customized_name: string | null;
  customized_description: string | null;
  additional_instruction: string | null;
  tool_description: string;
  tool_thumbnail: string | null;
}

export interface Classroom {
  id: number;
  user_id: number;
  classroom_id: number;
  status: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  grade: string;
  number_of_students: number;
  number_of_students_joined: number | null;
  thumbnail: string | null;
  join_url: string;
  join_code: string;
  scope_restriction: number;
}

export interface ClassroomData {
  id: number;
  name: string;
  description: string;
  thumbnail: string | null;
}
export interface SubmitClassroomData {
  classroom_id: number;
  classname: string;
  description: string;
  grade: string;
  student_message: string;
  content_from: string;
}
export interface SubmitClassroomToolData {
  classroom_id: number;
  classname: string;
  description: string;
  grade: string;
  student_message: string;
  content_from: string;
  tool_name?: string;
  tool_id?: number;
  tool_description?: string;
}

export interface messageResponse {
  status: string;
  message: string;
  data: string;
}
export const sendClassroomMessage = async (
  data: SubmitClassroomData
): Promise<messageResponse> => {
  try {
    const response = await apiClient.post<messageResponse>(
      "/assistant/classchat",
      data
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data ||
      "Failed to fetch results from classroom. Please try again.";
    throw new Error(errorMessage);
  }
};
export const sendClassroomToolMessage = async (
  data: SubmitClassroomToolData
): Promise<messageResponse> => {
  try {
    const response = await apiClient.post<messageResponse>(
      "/assistant/classtoolschat",
      data
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data ||
      "Failed to fetch results from classroom. Please try again.";
    throw new Error(errorMessage);
  }
};

export const sendClassroomOutlineMessage = async (
  data: any
): Promise<messageResponse> => {
  try {
    const response = await apiClient.post<messageResponse>(
      "/assistant/classoutlinechat",
      data
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data ||
      "Failed to fetch results from classroom. Please try again.";
    throw new Error(errorMessage);
  }
};

export const fetchClassrooms = async (): Promise<Classroom[]> => {
  try {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: Classroom[];
    }>(`/student/classrooms`);
    console.log(response.data);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data || "Failed to fetch classrooms. Please try again."
    );
  }
};
export const joinClassroom = async (
  joinCode: string
): Promise<{ status: string; message: string; data: any }> => {
  try {
    const response = await apiClient.post("/classroom/validatebycode/student", {
      join_code: joinCode,
    });

    if (response.status !== 200) {
      throw new Error("Failed to join the classroom.");
    }

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to join the classroom. Please try again."
    );
  }
};
