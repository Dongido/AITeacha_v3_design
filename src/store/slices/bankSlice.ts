import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../lib/apiClient";

interface BankAccount {
  id: number;
  account_number: string;
  bank_name: string;
  account_name: string;
  bank_branch: string;
  country_code?: string;
  bank_code?: string;
  currency?: string;
  bank_id?: string;
}

interface CreateBankAccount {
  id: number;
  accountNumber: string;

  bankName: string;
  accountName: string;
  bankBranch: string;
  countryCode?: string;
  bankCode?: string;
  bankId?: string;
  currency?: string;
}

interface WithdrawalRequest {
  bankaccount_id: any;
  amount: number;
}

interface Withdrawal {
  id: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  created_at: string;
}

interface BankState {
  accounts: BankAccount[];
  withdrawals: Withdrawal[];
  loading: boolean;
  requesting: boolean;
  error: string | null;
  requestError: string | null;
}

const initialState: BankState = {
  accounts: [],
  withdrawals: [],
  loading: false,
  requesting: false,
  error: null,
  requestError: null,
};

// Async Thunks
export const fetchUserBankAccounts = createAsyncThunk(
  "bank/fetchUserBankAccounts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/profile/bank/user/accounts`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data.message || "Failed to fetch bank accounts."
      );
    }
  }
);

export const addBankAccount = createAsyncThunk(
  "bank/addBankAccount",
  async (bankData: Omit<CreateBankAccount, "id">, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        `/profile/bank/add/account`,
        bankData
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data.message || "Failed to add bank account."
      );
    }
  }
);

export const updateBankAccount = createAsyncThunk(
  "bank/updateBankAccount",
  async ({ id, ...bankData }: CreateBankAccount, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(
        `/profile/bank/update/account/${id}`,
        bankData
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data.message || "Failed to update bank account."
      );
    }
  }
);

export const requestWithdrawal = createAsyncThunk(
  "bank/requestWithdrawal",
  async (withdrawalData: WithdrawalRequest, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        `/payment/account/withdrawal`,
        withdrawalData
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data.message || "Failed to request withdrawal."
      );
    }
  }
);

export const fetchWithdrawalRequests = createAsyncThunk(
  "bank/fetchWithdrawalRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `/payment/account/withdrawal/requests`
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data.message || "Failed to fetch withdrawal requests."
      );
    }
  }
);

export const bankSlice = createSlice({
  name: "bank",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchUserBankAccounts
      .addCase(fetchUserBankAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBankAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload;
      })
      .addCase(fetchUserBankAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addBankAccount.fulfilled, (state, action) => {
        state.accounts.push(action.payload);
      })
      .addCase(updateBankAccount.fulfilled, (state, action) => {
        const index = state.accounts.findIndex(
          (account) => account.id === action.payload.id
        );
        if (index !== -1) {
          state.accounts[index] = action.payload;
        }
      })
      .addCase(requestWithdrawal.pending, (state) => {
        state.requesting = true;
        state.requestError = null;
      })
      .addCase(requestWithdrawal.fulfilled, (state, action) => {
        state.requesting = false;
        state.withdrawals.push(action.payload);
      })
      .addCase(requestWithdrawal.rejected, (state, action) => {
        state.requesting = false;
        state.requestError = action.payload as string;
      })
      .addCase(fetchWithdrawalRequests.pending, (state) => {
        state.loading = true;
        state.requestError = null;
      })
      .addCase(fetchWithdrawalRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.withdrawals = action.payload;
      })
      .addCase(fetchWithdrawalRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default bankSlice.reducer;
