import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../lib/apiClient";
export interface User {
  id: number;
  name: string;
  email: string;
  status: string;
  created_at: string;
  updated_at: string;
  wallet_balance_usd?: string;
  wallet_balance_ngn?: string;
  wallet_balance_gbp?: string;
}

interface UsersState {
  freeUsers: any[];
  pastSubscribers: any[];
  currentSubscribers: any[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: UsersState = {
  freeUsers: [],
  pastSubscribers: [],
  currentSubscribers: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchFreeUsers = createAsyncThunk(
  "users/fetchFreeUsers",
  async () => {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: any[];
    }>("/admin/view/free/users");
    return response.data.data;
  }
);

export const fetchPastSubscribers = createAsyncThunk(
  "users/fetchPastSubscribers",
  async () => {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: any[];
    }>("/admin/view/past/subscribers");
    return response.data.data;
  }
);

export const fetchCurrentSubscribers = createAsyncThunk(
  "users/fetchCurrentSubscribers",
  async () => {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: any[];
    }>("/admin/view/current/subscribers");
    return response.data.data;
  }
);

// Create slice
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFreeUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFreeUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.freeUsers = action.payload;
      })
      .addCase(fetchFreeUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch free users.";
      })

      .addCase(fetchPastSubscribers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPastSubscribers.fulfilled, (state, action) => {
        state.loading = false;
        state.pastSubscribers = action.payload;
      })
      .addCase(fetchPastSubscribers.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch past subscribers.";
      })

      .addCase(fetchCurrentSubscribers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentSubscribers.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSubscribers = action.payload;
      })
      .addCase(fetchCurrentSubscribers.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch current subscribers.";
      });
  },
});

export default userSlice.reducer;
