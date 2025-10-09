
import apiClient from "../lib/apiClient";

interface FilterExamPayload {
    grade: string;
    session: number;
    term: number;
    source?: string;
    subject?: string;
}

export const filterExam = async ({
    grade,
    session,
    term,
    source,
    subject,
}: FilterExamPayload): Promise<any[]> => {
    try {
        // console.log("PAYLOAD", grade,session, term, source, subject)
        const params = new URLSearchParams();
        params.append("grade", grade);
        params.append("session", String(session));
        params.append("term", String(term));

        if (source) params.append("source", source);
        if (subject) params.append("subject", subject);

        const url = `examination/result/exam?${params.toString()}`;

        const response = await apiClient.get<{
            status: string;
            message: string;
            data: any[];
        }>(url);

        return response.data.data;
    } catch (error) {
        console.error("Failed to fetch exam results:", error);
        return [];
    }
};


export const getAllSubject = async (): Promise<any[]> => {
    try {
        const response = await apiClient.get<{
            status: string,
            message: string,
            data: any[]
        }>("examination/result/subject")
        // console.log(response,"subject")
         return response.data.data;
    } catch (error) {
        console.error("Failed to fetch exam results:", error);
        return [];
    }
}