import { string } from "zod";
import apiClient from "../lib/apiClient";

export const createTest = async (testData: any): Promise<any> => {
   console.log(" response testData", testData)
  try {
    const response = await apiClient.post<any>(`/examination`, testData);
    return response.data.data;
  } catch (error: any) {
    if (error.response?.status >= 400 && error.response?.status < 500) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to create test. Please check your input."
      );
    } else {
      throw new Error("Failed to create test. Please try again.");
    }
  }
};

export const getExamReport = async (examId: string): Promise<any> => {
  try {
    const response = await apiClient.get<any>(
      `/examination/students/report/${examId}`
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response?.status >= 400 && error.response?.status < 500) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch exam report. Please check the Exam ID."
      );
    } else {
      throw new Error("Failed to fetch exam report. Please try again.");
    }
  }
};

export const fetchTests = async (): Promise<any[]> => {
  try {
    const response = await apiClient.get<any>(`/examination/creator/all`);
    return response.data.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch tests. You might not have permission."
      );
    } else {
      throw new Error("Failed to fetch tests. Please try again.");
    }
  }
};

export const fetchTestAnswerDetails = async (
  examId: string,
  userId: any
): Promise<any> => {
  try {
    const response = await apiClient.get<any>(
      `/student/submitted/examination/${examId}/${userId}`
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error("Test not found.");
    } else {
      throw new Error("Failed to fetch test details. Please try again.");
    }
  }
};

export const suggestExaminationQuestions = async (
  subject: string,
  grade?: string,
  no_of_question?: number,
  document_content?: string
): Promise<any[]> => {
  try {
    const response = await apiClient.post<any>(
      `/assistant/suggest/examination/questions`,
      {
        subject,
        grade,
        no_of_question,
        document_content,
      }
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response?.status >= 400 && error.response?.status < 500) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to suggest questions. Please check your input."
      );
    } else {
      throw new Error("Failed to suggest questions. Please try again.");
    }
  }
};

export const suggestTheoryExaminationQuestions = async (
  subject: string,
  grade?: string,
  no_of_question?: number,
  document_content?: string,
  topics?: any,
  question_type?: any
): Promise<any[]> => {
  try {
    const response = await apiClient.post<any>(
      `/assistant/suggest/examination/questions`,
      {
        subject,
        grade,
        no_of_question,
        document_content,
        topics,
        question_type,
      }
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response?.status >= 400 && error.response?.status < 500) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to suggest questions. Please check your input."
      );
    } else {
      throw new Error("Failed to suggest questions. Please try again.");
    }
  }
};

export const fetchTestDetails = async (examinationId: number): Promise<any> => {
  try {
    const response = await apiClient.get<any>(`/examination/${examinationId}`);
    return response.data.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error(error.response?.data?.message || "Test not found.");
    } else {
      throw new Error("Failed to fetch test details. Please try again.");
    }
  }
};

export const fetchExamStudents = async (
  examinationId: number
): Promise<any[]> => {
  try {
    const response = await apiClient.get<any>(
      `/examination/students/${examinationId}`
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error(error.response?.data?.message || "Test not found.");
    } else if (error.response?.status === 403) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch students for this test. You might not have permission."
      );
    } else {
      throw new Error(
        "Failed to fetch students for this test. Please try again."
      );
    }
  }
};

export const fetchStudentExaminations = async (): Promise<any[]> => {
  try {
    const response = await apiClient.get<any>(`/student/examinations`);
    return response.data.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch your examinations. You might not have permission."
      );
    } else {
      throw new Error("Failed to fetch your examinations. Please try again.");
    }
  }
};

export const joinTest = async (data: {
  join_url: string;
  join_code: string;
}): Promise<any> => {
  try {
    const response = await apiClient.post<any>(
      `/examination/validate/student`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to validate student. Please try again."
    );
  }
};
export const deleteTest = async (testId: number): Promise<void> => {
  try {
    const response = await apiClient.delete(`/examination/${testId}`);
    if (response.status !== 200) {
      throw new Error("Failed to delete exam.");
    }
  } catch (error: any) {
    throw new Error(
      error.response?.data || "Failed to delete examm. Please try again."
    );
  }
};

export const validateByCode = async (join_code: string): Promise<any> => {
  try {
    const response = await apiClient.post<any>(
      `/examination/validatebycode/student`,
      {
        join_code,
      }
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to validate by code. Please try again."
    );
  }
};

export const checkStudent = async (join_code: string): Promise<any> => {
  try {
    const response = await apiClient.post<any>(`/examination/current`, {
      join_code,
    });
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to join student. Please try again."
    );
  }
};

export const submitExamination = async (submissionData: {
  examination_id: number;
  answers: {
    examination_question_id: number;
    question: string;
    student_answer: string;
  }[];
}): Promise<any> => {
  try {
    const response = await apiClient.post<any>(
      `/examination/student/submission`,
      submissionData
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response?.status >= 400 && error.response?.status < 500) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to submit examination. Please check your input."
      );
    } else {
      throw new Error("Failed to submit examination. Please try again.");
    }
  }
};


export const getExamType = async () => {
  try {
     const response = await apiClient.get<{
      status:string,
      message:string,
      data:any[]
     }>("/examination/get/examtype");
    //  console.log(response, "exam type response");
     return response.data.data;
  } catch (error:any) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch examination types. Please try again."
    );
  }
}

 export const getSession = async () => {
  try {
     const response = await apiClient.get<{
      status:string,
      message:string,
      data:any[],
     }>("/examination/get/schoolsession");
    //  console.log(response, "session response");
     return response.data.data;
  } catch (error:any) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch examination session. Please try again."
    );
  }
 }

 export const getTerm = async () => {
  try {
     const response = await apiClient.get<{
      status:string,
      message:string,
      data:any[]

     }>("/examination/get/schoolterm");
    //  console.log(response, "term response");
     return response.data.data;
  } catch (error:any) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch examination term. Please try again."
    );
  }
 }