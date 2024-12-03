import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchUserNotifications } from "../../api/notification";

interface Notification {
  id: number;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

interface NotificationsState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationsState = {
  notifications: [],
  loading: false,
  error: null,
};

export const loadUserNotifications = createAsyncThunk(
  "notifications/loadUserNotifications",
  async () => {
    try {
      const notifications = await fetchUserNotifications();
      return notifications;
    } catch (error: any) {
      return error.message || "Failed to fetch notifications.";
    }
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    resetNotificationsState: (state) => {
      state.notifications = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUserNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loadUserNotifications.fulfilled,
        (state, action: PayloadAction<Notification[]>) => {
          state.loading = false;
          state.notifications = action.payload;
        }
      )
      .addCase(loadUserNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetNotificationsState } = notificationsSlice.actions;
export default notificationsSlice.reducer;
