import apiClient from "../lib/apiClient";
import { Branch } from "../store/slices/branchSlice";

export const createBranch = async (branchData: {
  teamMemberId: string;
  branch_admin_id: number;
  location: string;
}): Promise<Branch> => {
  try {
    const response = await apiClient.post(`/settings/schoolbranch`, branchData);
    return response.data.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error(
        error.response?.data?.message ||
          "Permission restricted: upgrade to premium account to gain access"
      );
    }
    throw new Error(
      error.response?.data?.message ||
        "Failed to create branch. Please try again."
    );
  }
};

export const fetchBranches = async (): Promise<Branch[]> => {
  try {
    const response = await apiClient.get(`/settings/schoolbranch`);
    return response.data.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error(
        error.response?.data?.message ||
          "Permission restricted: upgrade to premium account to gain access"
      );
    }
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch branches. Please try again."
    );
  }
};

export const updateBranch = async (updatedData: {
  id: number;
  location?: string;
  branch_admin_id: number;
}): Promise<Branch> => {
  try {
    const response = await apiClient.put(
      `/settings/schoolbranch/`,
      updatedData
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error(
        error.response?.data?.message ||
          "Permission restricted: upgrade to premium account to gain access"
      );
    }
    throw new Error(
      error.response?.data?.message ||
        "Failed to update branch. Please try again."
    );
  }
};
