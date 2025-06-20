import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchUserDetailsFromAuth,
  updateUserRole,
  updateUserName,
  updateProfilePhoto,
  fetchProfileImage,
  User,
  changeUserPassword,
} from "../../api/profile";

interface ProfileState {
  user: User | null;
  imageUrl: string | null;
  loading: boolean;
  updateNameLoading: boolean;
  updatePhotoLoading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  user: null,
  imageUrl: null,
  loading: false,
  updateNameLoading: false,
  updatePhotoLoading: false,
  error: null,
};

export const loadProfileImage = createAsyncThunk(
  "profile/loadProfileImage",
  async () => {
    const imageUrl = await fetchProfileImage();
    return imageUrl;
  }
);

export const loadUserProfile = createAsyncThunk(
  "profile/loadUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const userDetails = await fetchUserDetailsFromAuth();
      return userDetails;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch user details.");
    }
  }
);

// updatepassword
export const changePasswordThunk = createAsyncThunk(
  "profile/changePassword",
  async (
    {
      oldPassword,
      password,
    }: { oldPassword: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      await changeUserPassword(oldPassword, password);
      return "Password updated successfully.";
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to change password."
      );
    }
  }
);


// Async thunk for updating user's name
export const updateUserNameThunk = createAsyncThunk(
  "profile/updateUserName",
  async (
    {
      firstname,
      lastname,
      about,
      phone,
    }: { firstname: string; lastname: string; about: string; phone: string },
    { rejectWithValue }
  ) => {
    try {
      await updateUserName(firstname, lastname, about, phone);
      return { firstname, lastname };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update user name.");
    }
  }
);

// Async thunk for updating profile photo
export const updateProfilePhotoThunk = createAsyncThunk(
  "profile/updateProfilePhoto",
  async (photo: File, { rejectWithValue }) => {
    try {
      await updateProfilePhoto(photo);
      return photo; // Optionally return the photo for confirmation
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to update profile photo."
      );
    }
  }
);

// Create the slice
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    // Optional: Reset profile state
    resetProfileState: (state) => {
      state.user = null;
      state.loading = false;
      state.updateNameLoading = false;
      state.updatePhotoLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load user profile
      .addCase(loadUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loadUserProfile.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = false;
          state.user = action.payload;
        }
      )
      .addCase(loadUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // change password
     .addCase(changePasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePasswordThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update user name
      .addCase(updateUserNameThunk.pending, (state) => {
        state.updateNameLoading = true;
        state.error = null;
      })
      .addCase(
        updateUserNameThunk.fulfilled,
        (
          state,
          action: PayloadAction<{ firstname: string; lastname: string }>
        ) => {
          state.updateNameLoading = false;
          if (state.user) {
            state.user.name = `${action.payload.firstname} ${action.payload.lastname}`;
          }
        }
      )
      .addCase(updateUserNameThunk.rejected, (state, action) => {
        state.updateNameLoading = false;
        state.error = action.payload as string;
      })
      // Update profile photo
      .addCase(updateProfilePhotoThunk.pending, (state) => {
        state.updatePhotoLoading = true;
        state.error = null;
      })
      .addCase(updateProfilePhotoThunk.fulfilled, (state) => {
        state.updatePhotoLoading = false;
      })
      .addCase(updateProfilePhotoThunk.rejected, (state, action) => {
        state.updatePhotoLoading = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(loadProfileImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loadProfileImage.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.imageUrl = action.payload;
        }
      )
      .addCase(loadProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load profile image.";
      });
  },
});

export const { resetProfileState } = profileSlice.actions;

// Selector for user
export const selectUser = (state: any) => state.profile.user;

export default profileSlice.reducer;
