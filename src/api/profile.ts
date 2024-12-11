import apiClient from "../lib/apiClient";

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  name: string;
  email: string;
  password: string;
  is_email_verified: number;
  role_id: number;
  imageurl: string;
  about: string | null;
  host_team_id: number;
  phone: string;
  organization: string | null;
  passcode: string;
  password_token: string;
  active_status: string;
  created_at: string;
  updated_at: string;
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
export const fetchUserDetailsFromAuth = async (): Promise<User> => {
  try {
    const response = await apiClient.get<{ status: string; data: User[] }>(
      `profile/get/user`
    );
    console.log(response.data.data[0]);
    return response.data.data[0];
  } catch (error: any) {
    throw new Error(
      error.response?.data ||
        "Failed to fetch user details from auth. Please try again."
    );
  }
};
export const updateUserName = async (
  firstname: string,
  lastname: string,
  about: string,
  phone: string
): Promise<void> => {
  try {
    const response = await apiClient.put(`profile/update/user`, {
      firstname,
      lastname,
      about,
      phone,
    });
    console.log("User name updated successfully:", response.data);
  } catch (error: any) {
    throw new Error(
      error.response?.data || "Failed to update user name. Please try again."
    );
  }
};
export const updateProfilePhoto = async (photo: File): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("photo", photo);

    const response = await apiClient.post(`profile/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Profile photo updated successfully:", response.data);
  } catch (error: any) {
    throw new Error(
      error.response?.data ||
        "Failed to update profile photo. Please try again."
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
export const fetchProfileImage = async (): Promise<string> => {
  try {
    const response = await apiClient.get<any>(`profile/photo`);
    // console.log(response.data.data[0].imageurl);
    return response.data.data[0].imageurl;
  } catch (error: any) {
    throw new Error(
      error.response?.data || "Failed to fetch profile image. Please try again."
    );
  }
};
