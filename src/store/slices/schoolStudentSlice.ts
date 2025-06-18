import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../lib/apiClient";

interface StudentData {
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  student_id?: string;
}

interface SchoolStudentState {
  students: any;
  uploading: boolean;
  loadingStudents: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: SchoolStudentState = {
  students: [],
  uploading: false,
  loadingStudents: false,
  error: null,
  successMessage: null,
};

export const uploadStudentsBatch = createAsyncThunk(
  "schoolStudent/uploadStudentsBatch",
  async (students: any, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        "/profile/add/students/batch",
        students
      );
      return response.data.message || "Students uploaded successfully!";
    } catch (error: any) {
      if (error.response?.status === 400) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to upload students due to invalid data. Please check your CSV."
        );
      } else if (error.response?.status === 403) {
        return rejectWithValue(
          error.response?.data?.message || "Unauthorized to upload students."
        );
      } else {
        return rejectWithValue(
          "Failed to upload students. Please try again later."
        );
      }
    }
  }
);

export const getSchoolStudents = createAsyncThunk(
  "schoolStudent/getSchoolStudents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/profile/get/school/students");
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        return rejectWithValue(
          error.response?.data?.message || "Unauthorized to fetch students."
        );
      } else {
        return rejectWithValue(
          "Failed to fetch students. Please try again later."
        );
      }
    }
  }
);

const schoolStudentSlice = createSlice({
  name: "schoolStudent",
  initialState,
  reducers: {
    clearUploadState: (state) => {
      state.uploading = false;
      state.error = null;
      state.successMessage = null;
    },
    clearStudentsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadStudentsBatch.pending, (state) => {
        state.uploading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(uploadStudentsBatch.fulfilled, (state, action) => {
        state.uploading = false;
        state.successMessage = action.payload;
        state.error = null;
      })
      .addCase(uploadStudentsBatch.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload as string;
        state.successMessage = null;
      })
      .addCase(getSchoolStudents.pending, (state) => {
        state.loadingStudents = true;
        state.error = null;
      })
      .addCase(getSchoolStudents.fulfilled, (state, action) => {
        state.loadingStudents = false;
        state.students = action.payload;
        state.error = null;
      })
      .addCase(getSchoolStudents.rejected, (state, action) => {
        state.loadingStudents = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUploadState, clearStudentsError } =
  schoolStudentSlice.actions;
export default schoolStudentSlice.reducer;
