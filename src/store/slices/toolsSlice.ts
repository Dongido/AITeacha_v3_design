import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchTools,
  fetchStudentTools,
  fetchToolsCategory,
} from "../../api/tools";

interface Tool {
  id: number;
  name: string;
  description: string;
  service_id: string;
  prompt: string | null;
  purpose?: string;
  thumbnail: string;
  assign_to: string;
  slug: string;
  is_customizable: number;
  req_param: string;
  category: string;
  label: string;
  tag: string;
  created_at: string;
  editable: string;
  updated_at: string;
}

interface ToolsState {
  tools: Tool[];
  studentTools: Tool[];
  categories: any[];
  loading: boolean;
  studentLoading: boolean;
  error: string | null;
  studentError: string | null;
  categoryError: string | null;
  categoryLoading: boolean;
}

const initialState: ToolsState = {
  tools: [],
  studentTools: [],
  studentLoading: false,
  categories: [],
  loading: false,
  error: null,
  studentError: null,
  categoryLoading: false,
  categoryError: null,
};

export const loadTools = createAsyncThunk("tools/loadTools", async () => {
  const tools = await fetchTools();
  return tools;
});

export const loadStudentTools = createAsyncThunk(
  "tools/loadStudentTools",
  async () => {
    const studentTools = await fetchStudentTools();
    return studentTools;
  }
);

export const loadToolsCategory = createAsyncThunk(
  "tools/loadToolsCategory",
  async () => {
    const categories = await fetchToolsCategory();
    return categories;
  }
);
const toolsSlice = createSlice({
  name: "tools",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadTools.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadTools.fulfilled, (state, action: PayloadAction<Tool[]>) => {
        state.loading = false;
        state.tools = action.payload;
      })
      .addCase(loadTools.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load tools.";
      })
      .addCase(loadStudentTools.pending, (state) => {
        state.studentLoading = true;
        state.studentError = null;
      })
      .addCase(
        loadStudentTools.fulfilled,
        (state, action: PayloadAction<Tool[]>) => {
          state.studentLoading = false;
          state.studentTools = action.payload;
        }
      )
      .addCase(loadStudentTools.rejected, (state, action) => {
        state.studentLoading = false;
        state.studentError =
          action.error.message || "Failed to load student tools.";
      })
      .addCase(loadToolsCategory.pending, (state) => {
        state.categoryLoading = true;
        state.categoryError = null;
      })
      .addCase(
        loadToolsCategory.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.categoryLoading = false;
          state.categories = action.payload;
        }
      )
      .addCase(loadToolsCategory.rejected, (state, action) => {
        state.categoryLoading = false;
        state.categoryError =
          action.error.message || "Failed to load tools categories.";
      });
  },
});

export default toolsSlice.reducer;
