import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTools, fetchStudentTools } from "../../api/tools";

interface Tool {
  id: number;
  name: string;
  description: string;
  service_id: string;
  prompt: string | null;
  thumbnail: string;
  assign_to: string;
  slug: string;
  is_customizable: number;
  req_param: string;
  label: string;
  tag: string;
  created_at: string;
  updated_at: string;
}

interface ToolsState {
  tools: Tool[];
  studentTools: Tool[];
  loading: boolean;
  studentLoading: boolean;
  error: string | null;
  studentError: string | null;
}

const initialState: ToolsState = {
  tools: [],
  studentTools: [],
  studentLoading: false,
  loading: false,
  error: null,
  studentError: null,
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
      });
  },
});

export default toolsSlice.reducer;
