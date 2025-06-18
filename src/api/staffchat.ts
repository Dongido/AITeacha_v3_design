import apiClient from "../lib/apiClient";

type CreateTopicPayload = {
  category: string;
  topic: string;
};

interface Topic {
  category: string;
  topic: string;
  description: string,
  thumbnail?: File | null
}


 export interface Topics {
  id?: number;
  user_id?: number;
  team_host_id?: number;
  topic: string;
  category: string;
  created_at?: string;
  updated_at?: string;
  description: string,
  thumbnail?: File | null
}

export const CreateStaffTopic = async (
  data: CreateTopicPayload
): Promise<Topic> => {
  try {
    const response = await apiClient.post<{
      status: string;
      message: string;
      data: Topic;
    }>("chat/", data,{
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status !== 201 && response.status !== 200) {
      throw new Error("Failed to create staff topic.");
    }
  console.log("response api" , response)
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to create staff topic."
    );
  }
};


export const getAllStaffTopic = async (): Promise<Topics[]> => {
  try {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: Topics[];
    }>("chat/user/topics");

    if (response.status !== 200) {
      throw new Error("Failed to fetch staff topics.");
    }
  // console.log("response", response)
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch staff topics."
    );
  }
};


// ✅ R a single topic
export const getforumConversationById = async (id: string): Promise<Topics> => {
  try {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: Topics;
    }>(`chat/${id}`);

   console.log("response api", response)
    if (response.status !== 200) {
      throw new Error("Failed to fetch topic.");
    }
   

    return response.data.data; // should be a single topic
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch topic.");
  }
};




//  getcoversationByformId

export const getforumConversationByforumId = async (id: string): Promise<any> => {
  try {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: any;
    }>(`chat/allchats/${id}`);

   console.log("response api", response)
    if (response.status !== 200) {
      throw new Error("Failed to fetch topic.");
    }
    console.log("conversation response" , response)

    return response.data.data; // should be a single topic
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch topic.");
  }
};





