import apiClient from "../lib/apiClient";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
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
    throw new Error(error.response?.data || "Login failed. Please try again.");
  }
};

export const registerUser = async (
  email: string,
  firstname: string,
  lastname: string,
  password: string
): Promise<SignupResponse> => {
  try {
    const response = await apiClient.post<SignupResponse>("auth/register", {
      email,
      firstname,
      lastname,
      password,
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
