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

export const getTeamMemberClasses = async (userId: string): Promise<any[]> => {
  try {
    const response = await apiClient.get(`/team/user/classrooms/${userId}`);
    return response.data.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error(
        error.response?.data?.message ||
          "Permission denied to view this member's classrooms."
      );
    } else if (error.response?.status === 404) {
      throw new Error("Team member or classrooms not found.");
    } else {
      throw new Error(
        "Failed to fetch team member classrooms. Please try again."
      );
    }
  }
};

export const changeTeamMemberRole = async (
  teamId: string,
  userId: string,
  newRole: string
): Promise<any> => {
  try {
    const response = await apiClient.put(`/team/changerole/${teamId}`, {
      userId,
      teamRole: newRole,
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error(
        error.response?.data?.message ||
          "You are not authorized to change roles."
      );
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to change team member role. Please try again.");
    }
  }
};
export const assignToClassroom = async (
  email: string,
  classroomId: string
): Promise<any> => {
  try {
    const response = await apiClient.post("/api/classroom/assign/classroom", {
      email,
      classroom_id: classroomId,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to assign to classroom."
    );
  }
};

export const getAssignedClassrooms = async (): Promise<any[]> => {
  try {
    const response = await apiClient.get(
      "/api/classroom/get/assigned/classrooms"
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch assigned classrooms."
    );
  }
};
export const getTeacherAssignedClassrooms = async (): Promise<any[]> => {
  try {
    const response = await apiClient.get(
      "/api/classroom/get/teacher/assigned/classrooms"
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch teacher assigned classrooms."
    );
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
export const deleteTeacherAssignedClassroom = async (
  classroomId: string
): Promise<void> => {
  try {
    const response = await apiClient.delete(
      `/classroom/delete/teacher/assigned/${classroomId}`
    );
    console.log(
      "Teacher assigned classroom deleted successfully:",
      response.data
    );
  } catch (error: any) {
    console.log(error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to delete teacher assigned classroom. Please try again."
    );
  }
};
