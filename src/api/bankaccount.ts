import apiClient from "../lib/apiClient";

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export const updateBankAccount = async (
  id: number,
  accountNumber: string,
  bankName: string,
  accountName: string,
  bankBranch: string
): Promise<any> => {
  try {
    const response = await apiClient.put<ApiResponse<any>>(
      `/profile/bank/update/account/${id}`,
      {
        accountNumber,
        bankName,
        accountName,
        bankBranch,
      }
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data.message ||
        "Failed to update bank account. Please try again."
    );
  }
};

export const addBankAccount = async (
  accountNumber: string,
  bankName: string,
  accountName: string,
  bankBranch: string
): Promise<any> => {
  try {
    const response = await apiClient.post<ApiResponse<any>>(
      `/profile/bank/add/account`,
      {
        accountNumber,
        bankName,
        accountName,
        bankBranch,
      }
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data.message ||
        "Failed to add bank account. Please try again."
    );
  }
};

export const getBankAccountById = async (id: number): Promise<any> => {
  try {
    const response = await apiClient.get<ApiResponse<any>>(
      `/profile/bank/account/${id}`
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data.message ||
        "Failed to fetch bank account. Please try again."
    );
  }
};

export const getUserBankAccounts = async (): Promise<any[]> => {
  try {
    const response = await apiClient.get<ApiResponse<any[]>>(
      `/profile/bank/user/accounts`
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data.message ||
        "Failed to fetch user bank accounts. Please try again."
    );
  }
};
