import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getTeamMembers,
  inviteTeamMember,
  deleteTeamMember,
} from "../../api/teams";

interface TeamState {
  members: any[];
  loading: boolean;
  inviteLoading: boolean;
  deleting: boolean;
  error: string | null;
  inviteError: string | null;
  deleteError: string | null;
}

const initialState: TeamState = {
  members: [],
  loading: false,
  deleting: false,
  inviteLoading: false,
  error: null,
  inviteError: null,
  deleteError: null,
};

export const loadTeamMembers = createAsyncThunk(
  "team/loadTeamMembers",
  async (_, { rejectWithValue }) => {
    try {
      const members = await getTeamMembers();
      return members;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch team members.");
    }
  }
);

export const inviteTeamMemberThunk = createAsyncThunk(
  "team/inviteTeamMember",
  async (inviteeEmail: string, { rejectWithValue }) => {
    try {
      await inviteTeamMember(inviteeEmail);
      return inviteeEmail;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to invite team member.");
    }
  }
);

export const deleteTeamMemberThunk = createAsyncThunk(
  "team/deleteTeamMember",
  async (email: string, { rejectWithValue }) => {
    try {
      await deleteTeamMember(email);
      return email;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete team member.");
    }
  }
);

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    resetTeamState: (state) => {
      state.members = [];
      state.loading = false;
      state.deleting = false;
      state.inviteLoading = false;
      state.error = null;
      state.inviteError = null;
      state.deleteError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTeamMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loadTeamMembers.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.loading = false;
          state.members = action.payload;
        }
      )
      .addCase(loadTeamMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(inviteTeamMemberThunk.pending, (state) => {
        state.inviteLoading = true;
        state.inviteError = null;
      })
      .addCase(
        inviteTeamMemberThunk.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.inviteLoading = false;
          state.members.push({ email: action.payload });
        }
      )
      .addCase(inviteTeamMemberThunk.rejected, (state, action) => {
        state.inviteLoading = false;
        state.inviteError = action.payload as string;
      })

      .addCase(deleteTeamMemberThunk.pending, (state) => {
        state.deleting = true;
        state.deleteError = null;
      })
      .addCase(
        deleteTeamMemberThunk.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.deleting = false;
          state.members = state.members.filter(
            (member) => member.id !== action.payload
          );
        }
      )
      .addCase(deleteTeamMemberThunk.rejected, (state, action) => {
        state.deleting = false;
        state.deleteError = action.payload as string;
      });
  },
});

export const { resetTeamState } = teamSlice.actions;
export default teamSlice.reducer;
