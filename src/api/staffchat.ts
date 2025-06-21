import apiClient from "../lib/apiClient";
import { PremiumUsertype } from "../store/slices/staffchats";

type CreateTopicPayload = {
  category: string;
  topic: string;
 
};

interface Topic {
  category: string;
  topic: string;
  description: string,
  thumbnail?: File | null
  firstname:string;
  lastname:string 
}


 export interface Topics {
  id?: number;
  user_id?: number;
  team_host_id?: number;
  topic: string;
  category: string;
  created_at?: string;
  updated_at?: string;
  description: string;
  thumbnail?: File | null;
   firstname:string;
  lastname:string ;
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
  // console.log("response api" , response)
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to create staff topic."
    );
  }
};


export const getAllStaffTopic = async (id:string): Promise<Topics[]> => {
  try {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: Topics[];
    }>(`chat/get/user/topics/${id}`);

    if (response.status !== 200) {
      throw new Error("Failed to fetch staff topics.");
    }
  console.log("response fetch", response)
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

  //  console.log("response api", response)
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
  //  console.log("response api", response)
    if (response.status !== 200) {
      throw new Error("Failed to fetch topic.");
    }
    // console.log("conversation response" , response)
    return response.data.data; // should be a single topic
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch topic.");
  }
};


// getpremium user
export const getpremiumUser = async (): Promise<PremiumUsertype[]> => {
  try {
    const response = await apiClient.get<{
      status: string,
      message: string,
      data: PremiumUsertype[]
    }>(`chat/get/premiumuser/test`);
    
    if (response.status !== 200) {
      throw new Error("Failed to fetch premium users");
    }

    console.log("premium users response", response.data.data);
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to fetch premium users");
  }
}





