import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchAssignmentsByUser,
  fetchAssignmentById,
  createAssignment,
  deleteAssignment,
  fetchStudentsInAssignment,
  CreateAssignmentData,
} from "../../api/assignment";
import { Assignment, Student } from "../../api/interface";

interface AssignmentsState {
  assignments: Assignment[];
  selectedAssignment: Assignment | null;
  loading: boolean;
  students: Student[];
  creating: boolean;
  deleting: boolean;
  fetchingAssignment: boolean;
  fetchingStudents: boolean;
  error: string | null;
}

// Initial state
const initialState: AssignmentsState = {
  assignments: [],
  selectedAssignment: null,
  loading: false,
  students: [],
  creating: false,
  deleting: false,
  fetchingAssignment: false,
  fetchingStudents: false,
  error: null,
};

// Async Thunks
export const loadAssignments = createAsyncThunk(
  "assignments/loadAssignments",
  async (_, { rejectWithValue }) => {
    try {
      const assignments = await fetchAssignmentsByUser();
      return assignments;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to load assignments.");
    }
  }
);

export const fetchAssignmentByIdThunk = createAsyncThunk(
  "assignments/fetchAssignmentById",
  async (assignmentId: number, { rejectWithValue }) => {
    try {
      const assignment = await fetchAssignmentById(assignmentId);
      return assignment;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch assignment details."
      );
    }
  }
);

export const createAssignmentThunk = createAsyncThunk(
  "assignments/createAssignment",
  async (data: CreateAssignmentData, { rejectWithValue }) => {
    try {
      const assignment = await createAssignment(data);
      return assignment;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create assignment.");
    }
  }
);

export const deleteAssignmentThunk = createAsyncThunk(
  "assignments/deleteAssignment",
  async (assignmentId: number, { rejectWithValue }) => {
    try {
      await deleteAssignment(assignmentId);
      return assignmentId;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete assignment.");
    }
  }
);
export const fetchStudentsForAssignmentThunk = createAsyncThunk(
  "classrooms/fetchStudentsForClassroom",
  async (
    {
      classroomId,
      assignmentId,
    }: { classroomId: number; assignmentId: number },
    { rejectWithValue }
  ) => {
    try {
      const students = await fetchStudentsInAssignment(
        classroomId,
        assignmentId
      );
      return students;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch students for this assignment."
      );
    }
  }
);

const assignmentSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    clearAssignments: (state) => {
      state.assignments = [];
      state.error = null;
      state.selectedAssignment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load assignments
      .addCase(loadAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loadAssignments.fulfilled,
        (state, action: PayloadAction<Assignment[]>) => {
          state.loading = false;
          state.assignments = action.payload;
        }
      )
      .addCase(loadAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAssignmentByIdThunk.pending, (state) => {
        state.fetchingAssignment = true;
        state.error = null;
      })
      .addCase(
        fetchAssignmentByIdThunk.fulfilled,
        (state, action: PayloadAction<Assignment>) => {
          state.fetchingAssignment = false;
          state.selectedAssignment = action.payload;
        }
      )
      .addCase(fetchAssignmentByIdThunk.rejected, (state, action) => {
        state.fetchingAssignment = false;
        state.error = action.payload as string;
      })
      // Create assignment
      .addCase(createAssignmentThunk.pending, (state) => {
        state.creating = true;
      })
      .addCase(
        createAssignmentThunk.fulfilled,
        (state, action: PayloadAction<Assignment>) => {
          state.creating = false;
          state.assignments.push(action.payload);
        }
      )
      .addCase(createAssignmentThunk.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload as string;
      })
      // Delete assignment
      .addCase(deleteAssignmentThunk.pending, (state) => {
        state.deleting = true;
      })
      .addCase(deleteAssignmentThunk.fulfilled, (state, action) => {
        state.deleting = false;
        state.assignments = state.assignments.filter(
          (assignment) => assignment.assignment_id !== action.payload
        );
      })
      .addCase(deleteAssignmentThunk.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload as string;
      })
      .addCase(fetchStudentsForAssignmentThunk.pending, (state) => {
        state.fetchingStudents = true;
      })
      .addCase(
        fetchStudentsForAssignmentThunk.fulfilled,
        (state, action: PayloadAction<Student[]>) => {
          state.fetchingStudents = false;
          state.students = action.payload;
        }
      )
      .addCase(fetchStudentsForAssignmentThunk.rejected, (state, action) => {
        state.fetchingStudents = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const { clearAssignments } = assignmentSlice.actions;
export default assignmentSlice.reducer;
