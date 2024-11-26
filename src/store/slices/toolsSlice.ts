import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTools } from "../../api/tools";

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
  created_at: string;
  updated_at: string;
}

interface ToolsState {
  tools: Tool[];
  loading: boolean;
  error: string | null;
}

const initialState: ToolsState = {
  tools: [],
  loading: false,
  error: null,
};

export const loadTools = createAsyncThunk("tools/loadTools", async () => {
  const tools = await fetchTools();
  return tools;
});

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
      });
  },
});

export default toolsSlice.reducer;
