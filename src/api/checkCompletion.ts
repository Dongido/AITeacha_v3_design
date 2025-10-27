
import apiClient from "../lib/apiClient";


export const checkProfileCompletion = async (userId: string) => {
  try {
    const res = await apiClient.get(`/auth/complete/profile/${userId}`);

    if (res.data?.status === "success") {
      return true;
    } else {
      return false;
    }
  } catch (error: any) {
    console.warn("Profile completion check failed:", error.response?.data || error);
    return false;
  }
};

export const checkInterestCompletion = async (userId: string) => {
  try {
    const res = await apiClient.get(`/auth/complete/interest/${userId}`);

    if (res.data?.status === "success") {
      return true; 
    } else {
      return false;
    }
  } catch (error: any) {
    console.warn("Interest completion check failed:", error.response?.data || error);
    return false;
  }
};



