import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import toolsReducer from "./slices/toolsSlice";
import classroomsReducer from "./slices/classroomSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    tools: toolsReducer,
    classrooms: classroomsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
