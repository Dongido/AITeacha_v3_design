import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { contactUs } from "../../api/auth";

interface User {
  id: number;
  email: string;
  role: number;
}

interface AuthState {
  token: string | null;
  user: User | null;
  contact: null;
  error: string | null;
  loading: boolean
}

const initialState: AuthState = {
  token: null,
  user: null,
  contact: null,
  error: null,
  loading: false
};

export const contactSlice = createAsyncThunk("staffTopic/participant", async (payload: any, { rejectWithValue }) => {
  try {
    const response = await contactUs(payload)
    return response
  } catch (error: any) {
    return rejectWithValue(error.message || "failed send contactmessage");
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    clearAuthData: (state) => {
      state.token = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(contactSlice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(contactSlice.fulfilled, (state, action) => {
        state.loading = false;
        state.contact = action.payload;
      })
      .addCase(contactSlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  }
});

export const { setAuthData, clearAuthData } = authSlice.actions;
export default authSlice.reducer;
