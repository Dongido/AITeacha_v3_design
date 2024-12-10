import apiClient from "../lib/apiClient";

export const changeUserPlan = async (
  package_id: number,
  user_id: number,
  duration: number,
  unit: string,
  currency: string
): Promise<void> => {
  try {
    const response = await apiClient.put(`profile/changeplans`, {
      package_id,
      user_id,
      duration,
      unit,
      currency,
    });
    console.log("User  subscribed successfully:", response.data);
  } catch (error: any) {
    throw new Error(
      error.response?.data || "Failed to update user name. Please try again."
    );
  }
};
