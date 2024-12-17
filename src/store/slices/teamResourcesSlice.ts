import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchResources,
  shareResource,
  getUserResourceById,
} from "../../api/resources";

interface Resource {
  id: string;
  name: string;
  description: string;
  resource_id?: string;
  title?: string;
  answer?: string;
}

interface ResourcesState {
  resources: Resource[];
  selectedResource: any | null;
  loading: boolean;
  error: string | null;
  shareResourceLoading: boolean;
  shareResourceError: string | null;
}

const initialState: ResourcesState = {
  resources: [],
  loading: false,
  selectedResource: null,
  error: null,
  shareResourceLoading: false,
  shareResourceError: null, // Initialize error state
};

export const loadResources = createAsyncThunk(
  "resources/loadResources",
  async (_, { rejectWithValue }) => {
    try {
      const resources = await fetchResources();
      return resources;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch resources.");
    }
  }
);

export const loadUserResourceById = createAsyncThunk(
  "resources/loadUserResourceById",
  async (id: string) => {
    const resource = await getUserResourceById(id);
    return resource;
  }
);

export const shareResourceThunk = createAsyncThunk(
  "resources/shareResource",
  async (
    { userId, resourceId }: { userId: string; resourceId: string },
    { rejectWithValue }
  ) => {
    try {
      await shareResource(userId, resourceId);
      return { userId, resourceId };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to share resource.");
    }
  }
);

const teamResourcesSlice = createSlice({
  name: "teamResources",
  initialState,
  reducers: {
    resetResourcesState: (state) => {
      state.resources = [];
      state.loading = false;
      state.error = null;
      (state.selectedResource = null), (state.shareResourceLoading = false);
      state.shareResourceError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadResources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loadResources.fulfilled,
        (state, action: PayloadAction<Resource[]>) => {
          state.loading = false;
          state.resources = action.payload;
        }
      )
      .addCase(loadResources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(shareResourceThunk.pending, (state) => {
        state.shareResourceLoading = true;
        state.shareResourceError = null; // Clear error on new request
      })
      .addCase(shareResourceThunk.fulfilled, (state) => {
        state.shareResourceLoading = false;
        state.shareResourceError = null; // Clear error on success
      })
      .addCase(shareResourceThunk.rejected, (state, action) => {
        state.shareResourceLoading = false;
        state.shareResourceError = action.payload as string; // Set error message on failure
      });
    builder
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

export const { resetResourcesState } = teamResourcesSlice.actions;
export default teamResourcesSlice.reducer;
