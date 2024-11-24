import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import toolsReducer from "./slices/toolsSlice";
import classroomsReducer from "./slices/classroomSlice";
import studentClassroomsReducer from "./slices/studentClassroomSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    tools: toolsReducer,
    classrooms: classroomsReducer,
    studentClassrooms: studentClassroomsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
