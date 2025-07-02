import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchUserDetails } from "../../api/bankaccount";
interface AdminUser {
  id: number;
  google_id: string | null;
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  is_email_verified: number;
  role_id: number;
  imageurl?: string;
  about?: string;
  host_team_id?: number;
  phone?: string;
  organization?: string | null;
  passcode?: string;
  password_token?: string;
  active_status?: string;
  email_verification_code?: string;
  referral_code?: string;
  referred_by?: string | null;
  country?: string | null;
  city?: string | null;
  gender?: string | null;
  age_range?: string | null;
  disability_details?: string | null;
  confirm_policy?: number;
  confirm_newsletter?: number;
  assigned_number?: string | null;
  device_id?: string;
  batchno?: string | null;
  created_at: string;
  updated_at: string;
  wallet_balance_usd: number;
  wallet_balance_ngn: number;
  wallet_balance_gbp: number;
  expiry_date?: string;
  package?: string;
}
interface AdminUserState {
  users: AdminUser[];
  currentAdminUser: AdminUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminUserState = {
  users: [],
  currentAdminUser: null,
  loading: false,
  error: null,
};

export const fetchSingleAdminUser = createAsyncThunk(
  "adminUser/fetchSingleAdminUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      const data = await fetchUserDetails(userId);
      return data as AdminUser;
    } catch (error: any) {
      return rejectWithValue(
        error.message || `Failed to fetch user details for ID: ${userId}.`
      );
    }
  }
);

const adminUserSlice = createSlice({
  name: "adminUser",
  initialState,
  reducers: {
    clearCurrentAdminUser: (state) => {
      state.currentAdminUser = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSingleAdminUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentAdminUser = null;
      })
      .addCase(
        fetchSingleAdminUser.fulfilled,
        (state, action: PayloadAction<AdminUser>) => {
          state.loading = false;
          state.currentAdminUser = action.payload;
        }
      )
      .addCase(fetchSingleAdminUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.currentAdminUser = null;
      });
  },
});

export const { clearCurrentAdminUser } = adminUserSlice.actions;
export default adminUserSlice.reducer;
