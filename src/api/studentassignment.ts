import apiClient from "../lib/apiClient";

export interface Question {
  assignmentquestion_id: number;
  assignment_question: string;
  assignment_answer: string | null;
  question_type: string | null;
}

export interface Assignment {
  assignment_id: number;
  assignment_name: string;
  assignment_description: string;
  grade: string;
  status: string;
  assignment_intro: string;
  join_url: string;
  number_of_students: number;
  join_code: string;
  classroom_id: number | null;
  number_of_students_completed: number;
  assignment_thumbnail: string | null;
  submit_url: string;
  submission_code: string;
  author: string;
  questions: Question[];
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

export const fetchAssignments = async (): Promise<Assignment[]> => {
  try {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: Assignment[];
    }>(`/student/assignments`);

    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data || "Failed to fetch assignments. Please try again."
    );
  }
};
export const joinAssignment = async (
  joinCode: string
): Promise<{ status: string; message: string; data: any }> => {
  try {
    const response = await apiClient.post(
      "/assignment/validatebycode/student",
      {
        join_code: joinCode,
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to join the assignment.");
    }

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to join the assignment. Please try again."
    );
  }
};

export const fetchAssignmentById = async (id: string): Promise<any> => {
  try {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: any[];
    }>(`/assignment/questions/${id}`);
    console.log(response.data.data[0]);
    return response.data.data[0];
  } catch (error: any) {
    throw new Error(
      error.response?.data || "Failed to Assignment. Please try again."
    );
  }
};

interface Answer {
  assignment_question: string;
  assignment_answer: string;
}

interface SubmitAssignmentResponse {
  status: string;
  message: string;
}

export const submitAssignmentAnswer = async (
  assignmentId: number,
  classroomId: number,
  answers: any[]
): Promise<SubmitAssignmentResponse> => {
  try {
    const response = await apiClient.post<SubmitAssignmentResponse>(
      `/assignment/submit/answer`,
      {
        assignment_id: assignmentId,
        classroom_id: classroomId,
        answers: answers,
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to submit assignment answer."
    );
  }
};

export const submitAssignmentChatMessage = async (
  description: string,
  grade: string,
  classroomId: number,
  assignmentId: number,
  studentMessage: string,
  contentFrom: string,
  questions: string[]
): Promise<any> => {
  try {
    const response = await apiClient.post<any>(`/assistant/assignmentchat`, {
      description,
      grade,
      classroom_id: classroomId,
      assignment_id: assignmentId,
      student_message: studentMessage,
      content_from: contentFrom,
      questions: questions.join(" "),
    });
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to submit assignment chat message."
    );
  }
};
