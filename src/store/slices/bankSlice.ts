import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../lib/apiClient";
interface BankAccount {
  id: number;
  acoountNumber: string;

  bankName: string;
  accountName: string;
  bankBranch: string;
}

interface BankState {
  accounts: any[];
  loading: boolean;
  error: string | null;
}

const initialState: BankState = {
  accounts: [],
  loading: false,
  error: null,
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
  async (bankData: Omit<BankAccount, "id">, { rejectWithValue }) => {
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
  async ({ id, ...bankData }: BankAccount, { rejectWithValue }) => {
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

export const bankSlice = createSlice({
  name: "bank",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export default bankSlice.reducer;
