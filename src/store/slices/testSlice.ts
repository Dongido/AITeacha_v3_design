import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createTest as createTestAPI,
  fetchTests as fetchTestsAPI,
  fetchTestDetails as fetchTestDetailsAPI,
  fetchExamStudents as fetchExamStudentsAPI,
  deleteTest as deleteTestAPI, // Import the deleteTest API function
} from "../../api/test";

interface TestState {
  tests: any[];
  loading: boolean;
  error: string | null;
  creating: boolean;
  createError: string | null;
  testDetails: any | null;
  testDetailsLoading: boolean;
  testDetailsError: string | null;
  examStudents: any[];
  examStudentsLoading: boolean;
  examStudentsError: string | null;
  deleting: boolean; // Add the deleting state
  deleteError: string | null; // Add potential delete error
}

const initialState: TestState = {
  tests: [],
  loading: false,
  error: null,
  creating: false,
  createError: null,
  testDetails: null,
  testDetailsLoading: false,
  testDetailsError: null,
  examStudents: [],
  examStudentsLoading: false,
  examStudentsError: null,
  deleting: false, // Initialize deleting to false
  deleteError: null, // Initialize deleteError to null
};

export const createTest = createAsyncThunk(
  "tests/createTest",
  async (testData: any, { rejectWithValue }) => {
    try {
      const response = await createTestAPI(testData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create test.");
    }
  }
);

export const fetchTests = createAsyncThunk(
  "tests/fetchTests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchTestsAPI();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch tests.");
    }
  }
);

export const fetchTestDetails = createAsyncThunk(
  "tests/fetchTestDetails",
  async (examinationId: number, { rejectWithValue }) => {
    try {
      const response = await fetchTestDetailsAPI(examinationId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch test details.");
    }
  }
);

export const fetchExamStudents = createAsyncThunk(
  "tests/fetchExamStudents",
  async (examinationId: number, { rejectWithValue }) => {
    try {
      const response = await fetchExamStudentsAPI(examinationId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch exam students.");
    }
  }
);

export const deleteTest = createAsyncThunk(
  // Create the deleteTest async thunk
  "tests/deleteTest",
  async (testId: number, { rejectWithValue }) => {
    try {
      await deleteTestAPI(testId);
      return testId; // Optionally return the deleted ID
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete test.");
    }
  }
);

const testSlice = createSlice({
  name: "tests",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTest.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(createTest.fulfilled, (state, action) => {
        state.creating = false;
      })
      .addCase(createTest.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload as string;
      })
      .addCase(fetchTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTests.fulfilled, (state, action) => {
        state.loading = false;
        state.tests = action.payload;
      })
      .addCase(fetchTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTestDetails.pending, (state) => {
        state.testDetailsLoading = true;
        state.testDetailsError = null;
        state.testDetails = null;
      })
      .addCase(fetchTestDetails.fulfilled, (state, action) => {
        state.testDetailsLoading = false;
        state.testDetails = action.payload;
      })
      .addCase(fetchTestDetails.rejected, (state, action) => {
        state.testDetailsLoading = false;
        state.testDetailsError = action.payload as string;
        state.testDetails = null;
      })
      .addCase(fetchExamStudents.pending, (state) => {
        state.examStudentsLoading = true;
        state.examStudentsError = null;
        state.examStudents = [];
      })
      .addCase(fetchExamStudents.fulfilled, (state, action) => {
        state.examStudentsLoading = false;
        state.examStudents = action.payload;
      })
      .addCase(fetchExamStudents.rejected, (state, action) => {
        state.examStudentsLoading = false;
        state.examStudentsError = action.payload as string;
        state.examStudents = [];
      })
      .addCase(deleteTest.pending, (state) => {
        // Handle the deleteTest lifecycle
        state.deleting = true;
        state.deleteError = null;
      })
      .addCase(deleteTest.fulfilled, (state, action) => {
        state.deleting = false;
        // Optionally update the tests array upon successful deletion
        state.tests = state.tests.filter((test) => test.id !== action.payload);
      })
      .addCase(deleteTest.rejected, (state, action) => {
        state.deleting = false;
        state.deleteError = action.payload as string;
      });
  },
});

export const selectTests = (state: any) => state.tests.tests;
export const selectTestsLoading = (state: any) => state.tests.loading;
export const selectTestsError = (state: any) => state.tests.error;
export const selectIsCreatingTest = (state: any) => state.tests.creating;
export const selectCreateTestError = (state: any) => state.tests.createError;
export const selectTestDetails = (state: any) => state.tests.testDetails;
export const selectTestDetailsLoading = (state: any) =>
  state.tests.testDetailsLoading;
export const selectTestDetailsError = (state: any) =>
  state.tests.testDetailsError;
export const selectExamStudents = (state: any) => state.tests.examStudents;
export const selectExamStudentsLoading = (state: any) =>
  state.tests.examStudentsLoading;
export const selectExamStudentsError = (state: any) =>
  state.tests.examStudentsError;
export const selectIsDeletingTest = (state: any) => state.tests.deleting; // Export the deleting state
export const selectDeleteTestError = (state: any) => state.tests.deleteError; // Export the delete error

export default testSlice.reducer;
