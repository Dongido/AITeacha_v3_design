import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { createBranch, fetchBranches, updateBranch } from "../../api/branch";

export interface Branch {
  id: number;
  branch_admin_id: number;
  location: string;
  team_member_id: number;
}

interface BranchState {
  branches: Branch[];
  loading: boolean;
  error: string | null;
}

const initialState: BranchState = {
  branches: [],
  loading: false,
  error: null,
};

export const createBranchThunk = createAsyncThunk(
  "branches/createBranch",
  async (
    branchData: {
      teamMemberId: string;
      branch_admin_id: number;
      location: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const newBranch = await createBranch(branchData);
      return newBranch;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBranchesThunk = createAsyncThunk(
  "branches/fetchBranches",
  async (_, { rejectWithValue }) => {
    try {
      const branches = await fetchBranches();
      return branches;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateBranchThunk = createAsyncThunk(
  "branches/updateBranch",
  async (
    {
      updatedData,
    }: {
      updatedData: { location?: string; id: number; branch_admin_id: number };
    },
    { rejectWithValue }
  ) => {
    try {
      const updatedBranch = await updateBranch(updatedData);
      return updatedBranch;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const branchSlice = createSlice({
  name: "branches",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle createBranchThunk
      .addCase(createBranchThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createBranchThunk.fulfilled,
        (state, action: PayloadAction<Branch>) => {
          state.loading = false;
          state.branches.push(action.payload);
        }
      )
      .addCase(createBranchThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Handle fetchBranchesThunk
      .addCase(fetchBranchesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchBranchesThunk.fulfilled,
        (state, action: PayloadAction<Branch[]>) => {
          state.loading = false;
          state.branches = action.payload;
        }
      )
      .addCase(fetchBranchesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Handle updateBranchThunk
      .addCase(updateBranchThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateBranchThunk.fulfilled,
        (state, action: PayloadAction<Branch>) => {
          state.loading = false;
          const index = state.branches.findIndex(
            (branch) => branch.id === action.payload.id
          );
          if (index !== -1) {
            state.branches[index] = action.payload;
          }
        }
      )
      .addCase(updateBranchThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default branchSlice.reducer;
