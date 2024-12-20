import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchAssignments,
  fetchAssignmentById,
  Assignment,
} from "../../api/studentassignment";

interface StudentAssignmentsState {
  assignments: Assignment[];
  assignment: Assignment | null;
  loading: boolean;
  error: string | null;
}

const initialState: StudentAssignmentsState = {
  assignments: [],
  assignment: null,
  loading: false,
  error: null,
};

export const loadStudentAssignments = createAsyncThunk(
  "studentAssignments/loadStudentAssignments",
  async (_, { rejectWithValue }) => {
    try {
      const assignments = await fetchAssignments();
      return assignments;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to load assignments.");
    }
  }
);

export const fetchAssignmentByIdThunk = createAsyncThunk(
  "studentAssignments/fetchAssignmentById",
  async (assignmentId: string, { rejectWithValue }) => {
    try {
      const assignment = await fetchAssignmentById(assignmentId);
      return assignment;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch assignment.");
    }
  }
);

const studentAssignmentsSlice = createSlice({
  name: "studentAssignments",
  initialState,
  reducers: {
    clearAssignments: (state) => {
      state.assignments = [];
      state.assignment = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadStudentAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loadStudentAssignments.fulfilled,
        (state, action: PayloadAction<Assignment[]>) => {
          state.loading = false;
          state.assignments = action.payload;
        }
      )
      .addCase(loadStudentAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAssignmentByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.assignment = null;
      })
      .addCase(
        fetchAssignmentByIdThunk.fulfilled,
        (state, action: PayloadAction<Assignment>) => {
          state.loading = false;
          state.assignment = action.payload;
        }
      )
      .addCase(fetchAssignmentByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAssignments } = studentAssignmentsSlice.actions;
export default studentAssignmentsSlice.reducer;
