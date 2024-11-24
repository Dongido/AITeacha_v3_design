import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchClassroomsByUser,
  deleteClassroom,
  createClassroom,
  fetchClassroomById,
  removeStudentFromClassroom,
  fetchStudentsInClassroom,
} from "../../api/classrooms";
import { Student, Classroom } from "../../api/interface";

interface ClassroomsState {
  classrooms: Classroom[];
  selectedClassroom: Classroom | null;
  students: Student[];
  loading: boolean;
  creating: boolean;
  deleting: boolean;
  fetchingClassroom: boolean;
  fetchingStudents: boolean;
  error: string | null;
}

const initialState: ClassroomsState = {
  classrooms: [],
  selectedClassroom: null,
  students: [],
  loading: false,
  creating: false,
  fetchingClassroom: false,
  deleting: false,
  fetchingStudents: false,
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

export const fetchStudentsForClassroomThunk = createAsyncThunk(
  "classrooms/fetchStudentsForClassroom",
  async (classroomId: number, { rejectWithValue }) => {
    try {
      const students = await fetchStudentsInClassroom(classroomId);
      return students;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch students for this classroom."
      );
    }
  }
);

export const removeStudentFromClassroomThunk = createAsyncThunk(
  "classrooms/removeStudentFromClassroom",
  async (
    { classroomId, studentId }: { classroomId: number; studentId: number },
    { rejectWithValue }
  ) => {
    try {
      await removeStudentFromClassroom(classroomId, studentId);
      return studentId;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to remove student.");
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
      scope_restriction: boolean;
      tools: {
        tools_id: number;
        customized_name: string | null;
        customized_description: string | null;
        additional_instruction: string | null;
      }[];
      resources: File[];
    },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("user_id", data.user_id.toString());
      formData.append("name", data.name);
      if (data.description) formData.append("description", data.description);
      formData.append("grade", data.grade);
      formData.append("status", data.status);
      formData.append("scope_restriction", data.scope_restriction.toString());
      formData.append("number_of_students", data.number_of_students.toString());
      formData.append("tools", JSON.stringify(data.tools));
      data.resources.forEach((file) => {
        formData.append("resources", file);
      });

      const classroom = await createClassroom(formData);
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
      state.students = [];
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
      .addCase(fetchStudentsForClassroomThunk.pending, (state) => {
        state.fetchingStudents = true;
      })
      .addCase(
        fetchStudentsForClassroomThunk.fulfilled,
        (state, action: PayloadAction<Student[]>) => {
          state.fetchingStudents = false;
          state.students = action.payload;
        }
      )
      .addCase(fetchStudentsForClassroomThunk.rejected, (state, action) => {
        state.fetchingStudents = false;
        state.error = action.payload as string;
      })

      .addCase(removeStudentFromClassroomThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeStudentFromClassroomThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.students = state.students.filter(
          (student) => student.student_id !== action.payload
        );
      })
      .addCase(removeStudentFromClassroomThunk.rejected, (state, action) => {
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
