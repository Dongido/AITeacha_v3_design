import apiClient from "../lib/apiClient";
import { PremiumUsertype } from "../store/slices/staffchats";

type CreateTopicPayload = {
  category: string;
  topic: string;
  content_from:string,
  classroom_id?:string,
  team_host_id?:string,
};
 export interface getZaraChats {
  senderId:number,
  receiverId:number
 }

interface Topic {
  category: string;
  topic: string;
  description: string,
  thumbnail?: File | null
  firstname:string;
  lastname:string 
}

 export interface ZyraType {
  main_post:string,
  reply?:string,
  question:string
 }

 export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  mark_as_read: number; 
  created_at:string
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
  console.log("response api create" , response)
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
  // console.log("response fetch", response)
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
      data: PremiumUsertype | PremiumUsertype[]
    }>(`chat/get/premiumuser`);
    const result = response.data.data;
    if (!response || response.status !== 200) {
      throw new Error("Failed to fetch premium users");
    }
    return Array.isArray(result) ? result : [result];

  } catch (error) {
    throw new Error("Failed to fetch premium users");
  }
};


// get all  user roles
 export const getUserRoles  = async(id:string):Promise<any> => {

   try {
     const response = await apiClient.get<{
      status:string,
      message:string,
      data:any
     }>(`chat/get/userrole/${id}`)
      console.log(response, "userrole")
      if(response.status !== 200){
         throw new Error("Failed to get user role")
      }
      // console.log(response.data.data, "userrole")
        return response.data.data;
   } catch (error) {
     throw new Error("failed to get user role")
   }
  
 }

   //  create zyra chat
 export const ZyraChat = async(payload:ZyraType):Promise<string> => {
    try {
    const response = await apiClient.post<{
    status:string,
    message:string,
    data:string
    }>('assistant/zyra/chat/response', payload)
    if(response.status !== 200){
        throw new Error("Failed to get user role")
    }
    // console.log("response", response)
      return response.data.data;
  } catch (error) {
     throw new Error("failed to get user role") 
  }
 }

export const getMessage = async(paylod:getZaraChats):Promise<Message[]> => {
  try {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: Message[];
    }>(`chat/get/retrieveMessage/${paylod.senderId}/${paylod.receiverId}`);

    if (response.status !== 200) {
      throw new Error("Failed to get chat");
    }

    console.log("response", response);
    return response.data.data;
  } catch (error: any) {
    console.error("❌ Error fetching messages:", error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || "Failed to fetch messages");
  }
};



