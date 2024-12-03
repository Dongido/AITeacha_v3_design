import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  saveResource,
  getUserResources,
  getUserResourceById,
} from "../../api/tools";

interface SaveResourceData {
  category: string;
  prompt_q: string;
  returned_answer: string;
}

interface Resource {
  id: number;
  category: string;
  prompt: string;
  returned_answer: string;
  created_at: string;
  updated_at: string;
}

interface ResourcesState {
  resources: Resource[];
  selectedResource: Resource | null;
  loading: boolean;
  error: string | null;
}

const initialState: ResourcesState = {
  resources: [],
  selectedResource: null,
  loading: false,
  error: null,
};
export const loadUserResourceById = createAsyncThunk(
  "resources/loadUserResourceById",
  async (id: string) => {
    const resource = await getUserResourceById(id);
    return resource;
  }
);

export const loadUserResources = createAsyncThunk(
  "resources/loadUserResources",
  async () => {
    const resources = await getUserResources();
    return resources;
  }
);

export const saveNewResource = createAsyncThunk(
  "resources/saveNewResource",
  async (data: SaveResourceData) => {
    const response = await saveResource(data);
    return response.data;
  }
);

const resourcesSlice = createSlice({
  name: "resources",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadUserResources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loadUserResources.fulfilled,
        (state, action: PayloadAction<Resource[]>) => {
          state.loading = false;
          state.resources = action.payload;
        }
      )
      .addCase(loadUserResources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load resources.";
      })

      .addCase(saveNewResource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        saveNewResource.fulfilled,
        (state, action: PayloadAction<Resource>) => {
          state.loading = false;
          state.resources.push(action.payload);
        }
      )
      .addCase(saveNewResource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to save resource.";
      })

      .addCase(loadUserResourceById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedResource = null;
      })
      .addCase(
        loadUserResourceById.fulfilled,
        (state, action: PayloadAction<Resource>) => {
          state.loading = false;
          state.selectedResource = action.payload;
        }
      )
      .addCase(loadUserResourceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch the resource.";
      });
  },
});

export default resourcesSlice.reducer;
