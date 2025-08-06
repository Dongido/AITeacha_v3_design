import apiClient from "../lib/apiClient";


 export type NotificationPayload = {
  id?:string
  title: string;
  expiry_date: string;
  who_views: string;
  status: string;
};

 export type statuspayload = {
  id:number,
  status:string
 }

  export type viewspayload = {
  id:number,
  who_views:string
 }

export const fetchUserNotifications = async (): Promise<any> => {
  try {
    const response = await apiClient.get<any>(`profile/user/notifications`);

    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data || "Failed to fetch notifications. Please try again."
    );
  }
};


export const createNotifications = async (
  payload: NotificationPayload
): Promise<any> => {
  try {
    const response = await apiClient.post<{
      status: string;
      message: string;
      data: any;
    }>("/notification", payload);

     if (response.status !== 201 && response.status !== 200) {
      throw new Error("Failed to create staff topic.");
    }
  // console.log("response api create" , response)

    return response.data;
  } catch (error: any) {
    console.error("Error creating notification:", error?.response?.data || error.message);
    throw error;
  }
};



export const updateadminNotification = async (
  payload: NotificationPayload
): Promise<any> => {

   console.log("idpayload", payload)
  try {
    const response = await apiClient.put<{
      status: string;
      message: string;
      data: any;
    }>("/notification", payload);

    return response.data;
  } catch (error: any) {
    console.error("Error creating notification:", error?.response?.data || error.message);
    throw error;
  }
};


  export const getNotifications = async (): Promise<any[]> => {
  try {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: any[];
    }>("/notification");

      if (response.status !== 201 && response.status !== 200) {
      throw new Error("Failed to create staff topic.");
    }
      // console.log(" get  notification response" , response)

    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching notification:", error?.response?.data || error.message);
    throw error;
  }
  };


   export const delectNotifications = async (payload:string): Promise<any> => {
  try {
    const response = await apiClient.delete<{
      status: string;
      message: string;
      data: any;
    }>(`/notification/${payload}`);

      if (response.status !== 201 && response.status !== 200) {
      throw new Error("Failed to delect notification.");
    }
      console.log("response delete" , response)

    return response.data.data;
  } catch (error: any) {
    console.error("Error delecting notification:", error?.response?.data || error.message);
    throw error;
  }
  };

  
   export const updatestatus = async (payload:statuspayload): Promise<any> => {
  try {
    const response = await apiClient.put<{
      status: string;
      message: string;
      data: any;
    }>(`/notification/status`, payload);

      if (response.status !== 201 && response.status !== 200) {
      throw new Error("Failed to update notification status .");
    }
      console.log("response delete" , response)

    return response.data.data;
  } catch (error: any) {
    console.error("Error delecting notification:", error?.response?.data || error.message);
    throw error;
  }
  };


 export const updatewhoviews = async (payload:viewspayload): Promise<any> => {
  try {
    const response = await apiClient.put<{
      status: string;
      message: string;
      data: any;
    }>(`/notification/views`, payload);

      if (response.status !== 201 && response.status !== 200) {
      throw new Error("Failed to update notification status ");
    }
      // console.log(" status response " , response)

    return response.data.data;
  } catch (error: any) {
    console.error("Error notification:", error?.response?.data || error.message);
    throw error;
  }
  };


  
 export const getNotificationById = async (payload:string): Promise<any> => {
  try {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: any;
    }>(`/notification/${payload}`,);

      if (response.status !== 201 && response.status !== 200) {
      throw new Error("Failed to get notification  .");
    }
      console.log("update response" , response)

    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching notification:", error?.response?.data || error.message);
    throw error;
  }
  };



