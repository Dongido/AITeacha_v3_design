import apiClient from "../lib/apiClient";

export const getTeamMembers = async (): Promise<any[]> => {
  try {
    const response = await apiClient.get("/team/myteam/members");
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

export const inviteTeamMember = async (inviteeEmail: string): Promise<void> => {
  try {
    const response = await apiClient.post("/team", {
      invitee_email: inviteeEmail,
    });
    console.log("Team member invited successfully:", response.data);
  } catch (error: any) {
    console.log(error);
    throw new Error(
      error.response?.data.message ||
        "Failed to invite team member. Please try again."
    );
  }
};

export const deleteTeamMember = async (email: string): Promise<void> => {
  try {
    const response = await apiClient.delete(`/team/delete/${email}`);
    console.log("Team member deleted successfully:", response.data);
  } catch (error: any) {
    console.log(error);
    throw new Error(
      error.response?.data.message ||
        "Failed to delete team member. Please try again."
    );
  }
};
