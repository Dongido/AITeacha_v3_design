import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "../../lib/apiClient";
interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

interface AdminResource {
  id: string;
  subject: string;
  grade: string;
  country: string;
  title: string;
  fileUrl: string;
  createdAt: string;
}

interface AdminResourcesState {
  resources: AdminResource[];
  loading: boolean;
  error: string | null;
}

interface AddAdminResourcePayload {
  file: File;
  subject: string;
  grade: string;
  country: string;
  title: string;
}

export const fetchAdminResources = createAsyncThunk(
  "adminResources/fetchAdminResources",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<ApiResponse<AdminResource[]>>(
        `/admin/openai/training/files`
      );
      return response.data.data;
    } catch (error: any) {
      const message =
        error.response?.data.message || "Failed to fetch admin resources.";
      return rejectWithValue(message);
    }
  }
);

export const addAdminResource = createAsyncThunk(
  "adminResources/addAdminResource",
  async (payload: AddAdminResourcePayload, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", payload.file);
      formData.append("subject", payload.subject);
      formData.append("grade", payload.grade);
      formData.append("country", payload.country);
      formData.append("title", payload.title);

      const response = await apiClient.post<ApiResponse<AdminResource>>(
        `/admin/openai/filestorage`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      const message =
        error.response?.data.message || "Failed to add admin resource.";
      return rejectWithValue(message);
    }
  }
);

const initialState: AdminResourcesState = {
  resources: [],
  loading: false,
  error: null,
};

const adminResourcesSlice = createSlice({
  name: "adminResources",
  initialState,
  reducers: {
    clearAdminResourcesError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminResources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAdminResources.fulfilled,
        (state, action: PayloadAction<AdminResource[]>) => {
          state.loading = false;
          state.resources = action.payload;
        }
      )
      .addCase(fetchAdminResources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addAdminResource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addAdminResource.fulfilled,
        (state, action: PayloadAction<AdminResource>) => {
          state.loading = false;
          state.resources.push(action.payload);
        }
      )
      .addCase(addAdminResource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAdminResourcesError } = adminResourcesSlice.actions;
export default adminResourcesSlice.reducer;
