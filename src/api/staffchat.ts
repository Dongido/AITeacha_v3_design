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


export interface MessageSetting {
  id: number;
  user_id: number;
  enable_teacher_student_chat: number;
  enable_student_teacher: number;
  enable_teacher_teacher: number;
  enable_student_student: number;
  created_at: string;
  updated_at: string;
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

export interface ChatUser {
  user_id: number;
  name: string;
  email: string;
  imageurl: string | null;
  unreadMessageCount: number;
  lastMessage: string | null;
  lastMessageTime: string | null;
}
export interface unreadChat {
  senderId:string
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
  // console.log("response api create" , response)
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to create staff topic."
    );
  }
};


export const CreateStudentTopic = async (
  data: CreateTopicPayload
): Promise<Topic> => {
  try {
    const response = await apiClient.post<{
      status: string;
      message: string;
      data: Topic;
    }>("/chat/student", data,{
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.status !== 201 && response.status !== 200) {
      throw new Error("Failed to create staff topic.");
    }
    console.log(response, "create response")
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


// get all student forum topic
export const getAllStudentTopic = async (id:string): Promise<Topics[]> => {
  try {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: Topics[];
    }>(`chat/getstudent/user/topics/${id}`);

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

    // console.log("response", response);
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching messages:", error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || "Failed to fetch messages");
  }
};



export const getParticipant = async(paylod:number):Promise<any[]> => {
  try {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: any[];
    }>(`classroom/participants/${paylod}`);

    if (response.status !== 200) {
      throw new Error("Failed to get chat");
    }

    // console.log("response", response);
    return response.data.data;
  } catch (error: any) {
    console.error("❌ Error fetching messages:", error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || "Failed to fetch messages");
  }
};


export const getuserChats = async():Promise<ChatUser[]> => {
  try {
    const response = await apiClient.get<{
      status:string;
      message:string;
      data:ChatUser[];
    }>("chat/get/retrieveuserchat")
      if (response.status !== 200) {
      throw new Error("Failed to get chat");
    }
    // console.log("response", response);
    return response.data.data;
    
  } catch (error:any) {
    console.error("❌ Error fetching user chat", error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || "Failed to fetch user chat");
  }
}

export const getmessageCount = async():Promise<any[]> => {
  try {
    const response = await apiClient.get<{
      status:string;
      message:string;
      data:any[];
    }>("chat/get/messagecount")
      if (response.status !== 200) {
      throw new Error("Failed to get chat count");
    }
    console.log("response", response);
    return response.data.data;
    
  } catch (error:any) {
    console.error("❌ Error fetching user chat count", error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || "Failed to fetch user chat count");
  }
}

export const unreadMessage = async(payload:unreadChat):Promise<any[]> => {
  try {
    const response = await apiClient.put<{
      status:string;
      message:string;
      data:any[];
    }>("chat/get/updateunreadmessage", payload)
      if (response.status !== 200) {
      throw new Error("Failed to unread message");
    }
    console.log("response", response);
    return response.data.data;
    
  } catch (error:any) {
    console.error("❌ Error unreading message", error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || "Failed to unread message");
  }
}


// message settings
export const messageSettings = async(payload:any):Promise<any[]> => {
  try {
    const response = await apiClient.post<{
      status:string;
      message:string;
      data:any[];
    }>("settings/", payload)
      if (response.status !== 200) {
      throw new Error("Failed to create settings");
    }
    console.log("response", response);
    return response.data.data;
    
  } catch (error:any) {
    console.error("❌ Failed to create settings", error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || "Failed to create settings");
  }
}

export const updateSettings = async(payload:any):Promise<any[]> => {
  try {
    const response = await apiClient.put<{
      status:string;
      message:string;
      data:any[];
    }>("settings/", payload)
      if (response.status !== 200) {
      throw new Error("Failed to update settings");
    }
    console.log("response", response);
    return response.data.data;
    
  } catch (error:any) {
    console.error("❌ Failed to update settings", error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || "Failed to update settings");
  }
}

export const getSettings = async():Promise<any> => {
  try {
    const response = await apiClient.get<{
      status:string;
      message:string;
      data:MessageSetting;
    }>("settings/")
      if (response.status !== 200) {
      throw new Error("Failed to update settings");
    }
    console.log("response", response);
    return response.data.data;
    
  } catch (error:any) {
    console.error("❌ Failed to update settings", error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || "Failed to update settings");
  }
}



