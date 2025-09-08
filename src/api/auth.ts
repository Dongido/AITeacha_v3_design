import apiClient from "../lib/apiClient";

export interface LoginResponse {
  status: string;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface SignupResponse {
  success: boolean;
  message: string;
  userId?: string;
}

export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>("auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    return error.response?.data || "Login failed. Please try again.";
  }
};

export const loginWithGoogle = async (): Promise<LoginResponse> => {
  try {
    const response = await apiClient.get<LoginResponse>("/auth/google");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Google login failed. Please try again."
    );
  }
};

export const registerUser = async (
  email: string,
  firstname: string,
  lastname: string,
  password: string,
  role_id: number,
  confirm_policy: boolean,
  confirm_newsletter: boolean,
  phone: string,
  organization: string | undefined,
  country: string,
  city: string,
  gender: "Male" | "Female" | "Other",
  ageRange: string,
  disabilityDetails: string | undefined,
  referred_by: string | undefined,
  assigned_number: string | undefined,
  state: string
): Promise<SignupResponse> => {
  try {
    // console.log("payload",email,firstname, role_id,"id",country,city,state)
    const response = await apiClient.post<SignupResponse>("auth/register", {
      email,
      firstname,
      lastname,
      password,
      role_id,
      confirm_policy,
      confirm_newsletter,
      phone,
      organization,
      country,
      city,
      gender,
      age_range: ageRange,
      disability_details: disabilityDetails,
      referred_by,
      assigned_number,
      state,
    });
    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error("Signup failed. Please try again.");
    }
  } catch (error: any) {
    throw new Error(error.response?.data || "Signup failed. Please try again.");
  }
};

export const verifyEmail = async (email: string, code: string) => {
  try {
    const response = await apiClient.put("/auth/verify/email", {
      email,
      code,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data || "Verification failed. Please try again."
    );
  }
};
export const sendCode = async (email: string) => {
  try {
    const response = await apiClient.put("/auth/send/verificationcode", {
      email,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data ||
        "Failed to send verification code. Please try again."
    );
  }
};
export const requestPasswordReset = async (email: string): Promise<void> => {
  try {
    await apiClient.post("/auth/password/check", { email });
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to send reset link. Please try again."
    );
  }
};

export const verifyResetToken = async (
  email: string,
  token: string
): Promise<void> => {
  try {
    await apiClient.post("/auth/password/verifytoken", { email, token });
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Token verification failed."
    );
  }
};

export const resetPassword = async (
  email: string,
  newPassword: string
): Promise<any> => {
  try {
    await apiClient.put("/auth/password/reset", {
      email,
      password: newPassword,
    });
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to reset password. Please try again."
    );
  }
};



export const contactUs = async (payload:any): Promise<any> => {
  try {
    const response = await apiClient.post("/auth/contactus",payload);
      if (response.status !== 201 && response.status !== 200) {
      throw new Error("Failed to send contact message");
    }
  console.log("response contact message" , response)
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to send contact message."
    );
  }
};
