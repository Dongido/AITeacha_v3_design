import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { createNotifications, delectNotifications, fetchUserNotifications, getNotificationById, getNotifications, 
  NotificationPayload, statuspayload, updateadminNotification, updatestatus, updatewhoviews, viewspayload } from "../../api/notification";
import { create } from "node:domain";
import { getPaymentId} from "../../api/subscription";

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
  notification: any;
  notificationList: any[],
  notificationloading:boolean 
  isloading:boolean 
  payment:any 
}

const initialState: NotificationsState = {
  notifications: [],
  loading: false,
  error: null,
  notification: null,
  notificationList: [] ,
  notificationloading:false,
  isloading:false,
  payment:null
};

export const loadUserNotifications = createAsyncThunk(
  "notifications/loadUserNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const notifications = await fetchUserNotifications();
      return Array.isArray(notifications) ? notifications : notifications.data ?? [];
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch notifications.");
    }
  }
);


export const createNotification = createAsyncThunk(
  "notifications/create", async (payload: NotificationPayload) => {
    try {
      const notification = await createNotifications(payload)
      return notification
    } catch (error: any) {
      return error.message || "Failed to create notifications.";
    }

  }
)

 export const getNotification = createAsyncThunk(
  "notifications/get", async() => {
    try {
       const notification = await getNotifications()
       return notification
    } catch (error:any) {

      return error.message || "Failed to get notification"
      
    } 
  }
 )

 
 export const delectNotification = createAsyncThunk(
  "notifications/delete", async(payload:string) => {
    try {
       const notification = await delectNotifications(payload)
       return notification
    } catch (error:any) {
      return error.message || "Failed to get notification"
      
    } 
  }
 )


  export const updateNotificationStatus = createAsyncThunk(
  "notifications/status", async(payload:statuspayload) => {
    try {
       const notification = await updatestatus(payload)
       return notification
    } catch (error:any) {
      return error.message || "Failed to get notification"
      
    } 
  }
 )

   export const updateNotificationViews = createAsyncThunk(
  "notifications/views", async(payload:viewspayload) => {
    try {
       const notification = await updatewhoviews(payload)
       return notification
    } catch (error:any) {
      return error.message || "Failed to get notification"
      
    } 
  }
 )


    export const getNotificationbyId = createAsyncThunk(
  "notifications/id", async(payload:string) => {
    try {
       const notification = await getNotificationById(payload)
       return notification
    } catch (error:any) {
      return error.message || "Failed to get notification"
      
    } 
  }
 )

 export const updateNofication = createAsyncThunk( "notifications/update", 
  async (payload:NotificationPayload) => {
    try {
       const notification = await  updateadminNotification(payload)
       return notification
    } catch (error:any) {
       return error.message || "Failed to get notification"
    }
  })

  export const getPaymentplan = createAsyncThunk(
  "payment/paymentplan",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await getPaymentId(payload);
      return  response
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch notifications.");
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
      })
      .addCase(createNotification.pending, (state) => {
        state.loading = true,
        state.error = null
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.loading = false
        state.notification = action.payload
        
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(getNotification.pending, (state, action) => {
         state.isloading = true
         state.error  = null
      })
      .addCase(getNotification.fulfilled, (state, action) => {
        state.isloading = false
        state.notificationList = action.payload 
      })
      .addCase(getNotification.rejected, (state, action) => {
        state.isloading = false
        state.error = action.payload as string
      })
      .addCase(delectNotification.pending, (state) => {
        state.loading = true
      })
      .addCase(delectNotification.fulfilled, (state, action) => {
        state.notification = action.payload
        state.loading = false
      })
      .addCase(delectNotification.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(updateNotificationStatus.pending, (state) => {
        state.loading = true
      })
      .addCase(updateNotificationStatus.fulfilled, (state, action) => {
        state.loading = false
        state.notification = action.payload
      })
      .addCase(updateNotificationStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(updateNotificationViews.pending, (state) => {
        state.loading = true
      })
      .addCase(updateNotificationViews.fulfilled, (state, action) => {
        state.loading = true 
        state.notification = action.payload
      })
      .addCase(updateNotificationViews.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
       .addCase(getNotificationbyId.pending, (state) => {
        state.notificationloading = true
      })
        .addCase(getNotificationbyId.fulfilled, (state, action) => {
        state.notificationloading = false;
        if (Array.isArray(action.payload) && action.payload.length > 0) {
          state.notification = action.payload[0]; 
        } else {
          state.notification = null;
          state.error = "Notification not found";
        }
      })
      .addCase(getNotificationbyId.rejected, (state, action) => {
        state.notificationloading = false
        state.error = action.payload as string
      })
      .addCase(updateNofication.pending, (state) =>{
        state.loading = true
      })
      .addCase(updateNofication.fulfilled, (state, action) => {
        state.loading = false
        state.notification = action.payload
      })
      .addCase(updateNofication.rejected, (state , action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(getPaymentplan .pending, (state) => {
        state.loading = true
        state.error =  null
      })
      .addCase(getPaymentplan .fulfilled, (state, action) => {
        state.loading = false
        state.payment = action.payload
      })
      .addCase(getPaymentplan.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
});

export const { resetNotificationsState } = notificationsSlice.actions;
export default notificationsSlice.reducer;
