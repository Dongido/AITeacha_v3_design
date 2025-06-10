import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchArchivedAssistants,
  removeArchivedAssistant,
  uploadArchivedAssistant,
} from "../../api/archive";

interface AssistantState {
  archivedAssistants: any[];
  loading: boolean;
  error: any | null;
}
interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}
const parseApiError = (error: any): string => {
  if (error.isAxiosError && error.response && error.response.data) {
    const apiError = error.response.data as ApiResponse<any>;
    if (apiError.message) {
      return apiError.message;
    }
  }
  return "Failed to fetch data. Please try again.";
};

const initialState: AssistantState = {
  archivedAssistants: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchArchivedAssistantsThunk = createAsyncThunk(
  "assistants/fetchArchived",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchArchivedAssistants();
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const removeArchivedAssistantThunk = createAsyncThunk(
  "assistants/removeArchived",
  async (ref: string, { rejectWithValue }) => {
    try {
      await removeArchivedAssistant(ref);
      return ref; // Return ref to remove from state
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const uploadArchivedAssistantThunk = createAsyncThunk(
  "assistants/uploadArchived",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      return await uploadArchivedAssistant(formData);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to upload assistant.");
    }
  }
);

// Slice
const archivedAssistantsSlice = createSlice({
  name: "archivedAssistants",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArchivedAssistantsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchArchivedAssistantsThunk.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.loading = false;
          state.archivedAssistants = action.payload;
        }
      )
      .addCase(fetchArchivedAssistantsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(
        removeArchivedAssistantThunk.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.archivedAssistants = state.archivedAssistants.filter(
            (a) => a.ref !== action.payload
          );
        }
      )
      .addCase(
        uploadArchivedAssistantThunk.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.archivedAssistants.push(action.payload);
        }
      );
  },
});

export default archivedAssistantsSlice.reducer;
