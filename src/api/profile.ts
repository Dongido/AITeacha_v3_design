import apiClient from "../lib/apiClient";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  active_status: string;
  unit_balance: string;
  total_credit_amount: number;
  total_debit_amount: number;
}

export const fetchUserDetails = async (userId: number): Promise<User> => {
  try {
    const response = await apiClient.get<User>(
      `profile/accountdetails/${userId}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data || "Failed to fetch user details. Please try again."
    );
  }
};

export const updateUserRole = async (roleId: number): Promise<void> => {
  try {
    const response = await apiClient.put(`profile/changeuserrole/${roleId}`);
    console.log("User role updated successfully:", response.data);
  } catch (error: any) {
    throw new Error(
      error.response?.data || "Failed to update user role. Please try again."
    );
  }
};
