import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../lib/apiClient";

interface TeamClassroomState {
  assignedClassrooms: any[];
  teacherAssignedClassrooms: any[];
  loading: boolean;
  assigningClassroomLoading: boolean;
  error: string | null;
}

const initialState: TeamClassroomState = {
  assignedClassrooms: [],
  teacherAssignedClassrooms: [],
  loading: false,
  assigningClassroomLoading: false,
  error: null,
};

export const assignToTeamClassroom = createAsyncThunk(
  "teamClassroom/assign",
  async (
    { email, classroomId }: { email: string; classroomId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post("/classroom/assign/classroom", {
        email,
        classroom_id: classroomId,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to assign to classroom."
      );
    }
  }
);

export const getAssignedTeamClassrooms = createAsyncThunk(
  "teamClassroom/getAssigned",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        "/classroom/get/assigned/classrooms"
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch assigned classrooms."
      );
    }
  }
);

export const getTeacherAssignedTeamClassrooms = createAsyncThunk(
  "teamClassroom/getTeacherAssigned",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        "/classroom/get/teacher/assigned/classrooms"
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch teacher assigned classrooms."
      );
    }
  }
);

const teamClassroomSlice = createSlice({
  name: "teamClassroom",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(assignToTeamClassroom.pending, (state) => {
        state.assigningClassroomLoading = true;
        state.error = null;
      })
      .addCase(assignToTeamClassroom.fulfilled, (state) => {
        state.assigningClassroomLoading = false;
      })
      .addCase(assignToTeamClassroom.rejected, (state, action) => {
        state.assigningClassroomLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getAssignedTeamClassrooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAssignedTeamClassrooms.fulfilled, (state, action) => {
        state.loading = false;
        state.assignedClassrooms = action.payload;
      })
      .addCase(getAssignedTeamClassrooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getTeacherAssignedTeamClassrooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTeacherAssignedTeamClassrooms.fulfilled, (state, action) => {
        state.loading = false;
        state.teacherAssignedClassrooms = action.payload;
      })
      .addCase(getTeacherAssignedTeamClassrooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default teamClassroomSlice.reducer;
