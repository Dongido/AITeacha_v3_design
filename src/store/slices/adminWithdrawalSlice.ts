import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchAdminWithdrawalRequests,
  updateWithdrawalStatus,
} from "../../api/bankaccount";

interface Withdrawal {
  id: string;
  amount: number;
  status: "pending" | "completed" | "failed" | "processing";
  created_at: string;
  currency: string;
}

interface AdminWithdrawalState {
  withdrawals: Withdrawal[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminWithdrawalState = {
  withdrawals: [],
  loading: false,
  error: null,
};

export const fetchAdminWithdrawals = createAsyncThunk(
  "adminWithdrawals/fetchAdminWithdrawals",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchAdminWithdrawalRequests();
      return data as Withdrawal[];
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch admin withdrawal requests."
      );
    }
  }
);

export const updateAdminWithdrawalStatus = createAsyncThunk(
  "adminWithdrawals/updateAdminWithdrawalStatus",
  async (
    {
      withdrawalId,
      withdrawal,
      status,
    }: { withdrawalId: string; withdrawal: any; status: "paid" | "declined" },
    { rejectWithValue }
  ) => {
    try {
      const data = await updateWithdrawalStatus(
        withdrawalId,
        withdrawal,
        status
      );
      return data as Withdrawal;
    } catch (error: any) {
      return rejectWithValue(
        error.message ||
          `Failed to update withdrawal status for ID: ${withdrawalId}.`
      );
    }
  }
);

const adminWithdrawalsSlice = createSlice({
  name: "adminWithdrawals",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminWithdrawals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAdminWithdrawals.fulfilled,
        (state, action: PayloadAction<Withdrawal[]>) => {
          state.loading = false;
          state.withdrawals = action.payload;
        }
      )
      .addCase(fetchAdminWithdrawals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateAdminWithdrawalStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateAdminWithdrawalStatus.fulfilled,
        (state, action: PayloadAction<Withdrawal>) => {
          state.loading = false;
          const index = state.withdrawals.findIndex(
            (withdrawal) => withdrawal.id === action.payload.id
          );
          if (index !== -1) {
            state.withdrawals[index] = {
              ...state.withdrawals[index],
              ...action.payload,
            };
          }
        }
      )
      .addCase(updateAdminWithdrawalStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default adminWithdrawalsSlice.reducer;
