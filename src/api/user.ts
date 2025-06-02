import apiClient from "../lib/apiClient";

export interface User {
  id: number;
  name: string;
  email: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const fetchFreeUsers = async (): Promise<any[]> => {
  try {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: any[];
    }>("/admin/view/free/users");
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data || "Failed to fetch free users. Please try again."
    );
  }
};

export const fetchPastSubscribers = async (): Promise<any[]> => {
  try {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: any[];
    }>("/admin/view/past/subscribers");
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data ||
        "Failed to fetch past subscribers. Please try again."
    );
  }
};

export const fetchCurrentSubscribers = async (): Promise<any[]> => {
  try {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: any[];
    }>("/admin/view/current/subscribers");
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data ||
        "Failed to fetch current subscribers. Please try again."
    );
  }
};
