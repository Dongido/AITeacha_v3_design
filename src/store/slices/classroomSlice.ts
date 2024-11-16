import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchClassroomsByUser,
  deleteClassroom,
  createClassroom,
  fetchClassroomById,
  Classroom,
} from "../../api/classrooms";

interface ClassroomsState {
  classrooms: Classroom[];
  selectedClassroom: Classroom | null;
  loading: boolean;
  creating: boolean;
  deleting: boolean;
  fetchingClassroom: boolean;
  error: string | null;
}

const initialState: ClassroomsState = {
  classrooms: [],
  selectedClassroom: null,
  loading: false,
  creating: false,
  fetchingClassroom: false,
  deleting: false,
  error: null,
};

export const loadClassrooms = createAsyncThunk(
  "classrooms/loadClassrooms",
  async (_, { rejectWithValue }) => {
    try {
      const classrooms = await fetchClassroomsByUser();
      return classrooms;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to load classrooms.");
    }
  }
);
export const fetchClassroomByIdThunk = createAsyncThunk(
  "classrooms/fetchClassroomById",
  async (classroomId: number, { rejectWithValue }) => {
    try {
      const classroom = await fetchClassroomById(classroomId);
      return classroom;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch classroom details."
      );
    }
  }
);

export const deleteClassroomThunk = createAsyncThunk(
  "classrooms/deleteClassroom",
  async (classroomId: number, { rejectWithValue }) => {
    try {
      await deleteClassroom(classroomId);
      return classroomId;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete classroom.");
    }
  }
);

export const createClassroomThunk = createAsyncThunk(
  "classrooms/createClassroom",
  async (
    data: {
      user_id: number;
      name: string;
      description?: string;
      grade: string;
      status: string;
      number_of_students: number;
      tools: {
        tools_id: number;
        customized_name: string | null;
        customized_description: string | null;
        additional_instruction: string | null;
      }[];
    },
    { rejectWithValue }
  ) => {
    try {
      const classroom = await createClassroom(data);
      return classroom;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create classroom.");
    }
  }
);

const classroomsSlice = createSlice({
  name: "classrooms",
  initialState,
  reducers: {
    clearClassrooms: (state) => {
      state.classrooms = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadClassrooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loadClassrooms.fulfilled,
        (state, action: PayloadAction<Classroom[]>) => {
          state.loading = false;
          state.classrooms = action.payload;
        }
      )
      .addCase(loadClassrooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteClassroomThunk.pending, (state) => {
        state.deleting = true;
      })
      .addCase(deleteClassroomThunk.fulfilled, (state, action) => {
        state.deleting = false;
        state.classrooms = state.classrooms.filter(
          (classroom) => classroom.classroom_id !== action.payload
        );
      })
      .addCase(deleteClassroomThunk.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload as string;
      })
      .addCase(fetchClassroomByIdThunk.pending, (state) => {
        state.fetchingClassroom = true;
        state.error = null;
      })
      .addCase(
        fetchClassroomByIdThunk.fulfilled,
        (state, action: PayloadAction<Classroom>) => {
          state.fetchingClassroom = false;
          state.selectedClassroom = action.payload;
        }
      )
      .addCase(fetchClassroomByIdThunk.rejected, (state, action) => {
        state.fetchingClassroom = false;
        state.error = action.payload as string;
      })
      .addCase(createClassroomThunk.pending, (state) => {
        state.creating = true;
      })
      .addCase(createClassroomThunk.fulfilled, (state, action) => {
        state.creating = false;
        state.classrooms.push(action.payload);
      })
      .addCase(createClassroomThunk.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearClassrooms } = classroomsSlice.actions;
export default classroomsSlice.reducer;
