import apiClient from "../lib/apiClient";

export const fetchResources = async (): Promise<any[]> => {
  try {
    const response = await apiClient.get(`/team/get/resources`);
    return response.data.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch teams. Please try again."
      );
    } else {
      throw new Error("Failed to fetch teams. Please try again.");
    }
  }
};

export const shareResource = async (
  userId: string,
  resourceId: string
): Promise<void> => {
  try {
    await apiClient.post(`/team/share/resource`, {
      user_id: userId,
      resource_id: resourceId,
    });
    console.log("Resource shared successfully.");
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to share resource. Please try again."
      );
    } else {
      throw new Error("Failed to share resource. Please try again.");
    }
  }
};
export const getUserResourceById = async (id: string): Promise<any> => {
  try {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: any;
    }>(`/team/get/resource/${id}`);
    return response.data.data[0];
  } catch (error: any) {
    throw new Error(
      error.response?.data || "Failed to fetch the resource. Please try again."
    );
  }
};
