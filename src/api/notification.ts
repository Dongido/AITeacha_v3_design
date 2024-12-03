import apiClient from "../lib/apiClient";

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
