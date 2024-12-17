import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import toolsReducer from "./slices/toolsSlice";
import classroomsReducer from "./slices/classroomSlice";
import studentClassroomsReducer from "./slices/studentClassroomSlice";
import profileReducer from "./slices/profileSlice";
import resourcesReducer from "./slices/resourcesSlice";
import assignmentsReducer from "./slices/assignmentSlice";
import notificationsReducer from "./slices/notificationsSlice";
import teamReducer from "./slices/teamSlice";
import teamResourcesReducer from "./slices/teamResourcesSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    tools: toolsReducer,
    classrooms: classroomsReducer,
    studentClassrooms: studentClassroomsReducer,
    profile: profileReducer,
    resources: resourcesReducer,
    assignments: assignmentsReducer,
    notifications: notificationsReducer,
    team: teamReducer,
    teamResources: teamResourcesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
