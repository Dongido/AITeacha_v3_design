import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../lib/apiClient";
export const fetchStudentExaminations = createAsyncThunk(
  "studentTests/fetchStudentExaminations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<any>(`/student/examinations`);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch your examinations. You might not have permission."
        );
      } else {
        return rejectWithValue(
          "Failed to fetch your examinations. Please try again."
        );
      }
    }
  }
);

interface StudentTestsState {
  examinations: any[];
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

const initialState: StudentTestsState = {
  examinations: [],
  loading: "idle",
  error: null,
};

const studentTestsSlice = createSlice({
  name: "studentTests",
  initialState,
  reducers: {
    setExaminations: (state, action) => {
      state.examinations = action.payload;
      state.loading = "succeeded";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentExaminations.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchStudentExaminations.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.examinations = action.payload;
        state.error = null;
      })
      .addCase(fetchStudentExaminations.rejected, (state, action) => {
        state.loading = "failed";
        state.error = (action.payload as string) || "An error occurred";
      });
  },
});

export const { setExaminations } = studentTestsSlice.actions;
export default studentTestsSlice.reducer;

export const selectStudentExaminations = (state: {
  studentTests: StudentTestsState;
}) => state.studentTests.examinations;
export const selectStudentExaminationsLoading = (state: {
  studentTests: StudentTestsState;
}) => state.studentTests.loading;
export const selectStudentExaminationsError = (state: {
  studentTests: StudentTestsState;
}) => state.studentTests.error;
