import apiClient from "../lib/apiClient";

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export const fetchBanksByCountry = async (
  countryCode: string
): Promise<any[]> => {
  try {
    const response = await apiClient.get<ApiResponse<any[]>>(
      `/payment/get/country/banks/${countryCode}`
    );
    return response.data.data;
  } catch (error: any) {
    console.log(error.response?.data.message.message);
    throw new Error(
      error.response?.data.message.message ||
        "Failed to fetch banks. Please try again."
    );
  }
};

export const verifyAccountNumber = async (
  accountNumber: string,
  accountBankCode: string
): Promise<any> => {
  try {
    const response = await apiClient.get<ApiResponse<any>>(
      `/payment/verify/bankaccount/${accountNumber}/${accountBankCode}`
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data.message ||
        "Failed to verify account. Please try again."
    );
  }
};

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

export const requestWithdrawal = async (
  bankAccountId: any,
  amount: number
): Promise<any> => {
  try {
    const response = await apiClient.post<ApiResponse<any>>(
      `/payment/account/withdrawal`,
      {
        bankAccountId,
        amount,
      }
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data.message ||
        "Failed to request withdrawal. Please try again."
    );
  }
};

export const fetchWithdrawalRequests = async (): Promise<any[]> => {
  try {
    const response = await apiClient.get<ApiResponse<any[]>>(
      `/payment/account/withdrawal/requests`
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data.message ||
        "Failed to fetch withdrawal requests. Please try again."
    );
  }
};

export const fetchAdminWithdrawalRequests = async (): Promise<any[]> => {
  try {
    const response = await apiClient.get<ApiResponse<any[]>>(
      `/payment/withdrawal/requests`
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data.message ||
        "Failed to fetch withdrawal requests. Please try again."
    );
  }
};
export const updateWithdrawalStatus = async (
  withdrawalId: string,
  withdrawal_detail: any,
  status: "paid" | "declined"
): Promise<any> => {
  try {
    const response = await apiClient.put<ApiResponse<any>>(
      `/payment/withdrawal/request/${withdrawalId}`,
      { status, withdrawal_detail }
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data.message ||
        `Failed to update withdrawal status to '${status}'. Please try again.`
    );
  }
};

export const fetchUserDetails = async (userId: string): Promise<any> => {
  try {
    const response = await apiClient.get<ApiResponse<any>>(
      `/profile/get/user/${userId}`
    );
    return response.data.data[0];
  } catch (error: any) {
    throw new Error(
      error.response?.data.message ||
        "Failed to fetch user details. Please try again."
    );
  }
};

interface BulkUpdateRequestBody {
  status: any;
  lists: any;
}

export const updateBulkWithdrawalStatus = async (
  payload: BulkUpdateRequestBody
): Promise<any> => {
  try {
    const response = await apiClient.put<ApiResponse<any>>(
      "/payment/update/withdrawal/requests",
      payload
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data.message ||
        "Failed to update withdrawal status. Please try again."
    );
  }
};
