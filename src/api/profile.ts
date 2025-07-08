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
  country: string | null;
  state: string | null;
  city: string | null;
  host_team_id: number;
  country_isoCode: string | null;
  state_isoCode: string | null;
  gender: string | null;
  phone: string;
  organization: string | null;
  passcode: string;
  password_token: string;
  referral_code: string;
  active_status: string;
  wallet_balance_usd?: string;
  wallet_balance_ngn?: string;
  wallet_balance_gbp?: string;
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

export const fetchUserProfile = async (): Promise<any> => {
  try {
    const response = await apiClient.get<any>(`/profile/get/user`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch user profile. Please try again."
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
export interface UpdateProfilePayload {
  firstname?: string;
  lastname?: string;
  about?: string;
  phone?: string;
  gender?: string;
  country?: string;
  state?: string;
  city?: string;
}

export const updateUserName = async (
  userData: UpdateProfilePayload
): Promise<void> => {
  try {
    const response = await apiClient.put(`profile/update/user`, userData);
    console.log("User profile updated successfully:", response.data);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to update user profile. Please try again."
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

export const generateReferralCode = async (): Promise<string> => {
  try {
    const response = await apiClient.put<any>(`profile/generatereferralcode`);
    return response.data.referralCode;
  } catch (error: any) {
    throw new Error(
      error.response?.data ||
        "Failed to generate referral code. Please try again."
    );
  }
};

// change pasword
export const changeUserPassword = async (
  oldPassword: string,
  password: string
): Promise<void> => {
  try {
    const response = await apiClient.put(`profile/changepassword`, {
      oldPassword,
      password,
    });

    console.log("Password changed successfully:", response.data);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to change password. Please try again."
    );
  }
};
