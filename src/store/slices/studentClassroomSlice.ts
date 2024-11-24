import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchClassrooms, Classroom } from "../../api/studentclassroom";

interface StudentClassroomsState {
  classrooms: Classroom[];
  loading: boolean;
  error: string | null;
}

const initialState: StudentClassroomsState = {
  classrooms: [],
  loading: false,
  error: null,
};

export const loadStudentClassrooms = createAsyncThunk(
  "studentClassrooms/loadStudentClassrooms",
  async (_, { rejectWithValue }) => {
    try {
      const classrooms = await fetchClassrooms();
      return classrooms;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to load classrooms.");
    }
  }
);

const studentClassroomsSlice = createSlice({
  name: "studentClassrooms",
  initialState,
  reducers: {
    clearClassrooms: (state) => {
      state.classrooms = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadStudentClassrooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loadStudentClassrooms.fulfilled,
        (state, action: PayloadAction<Classroom[]>) => {
          state.loading = false;
          state.classrooms = action.payload;
        }
      )
      .addCase(loadStudentClassrooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearClassrooms } = studentClassroomsSlice.actions;
export default studentClassroomsSlice.reducer;
