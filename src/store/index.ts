import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import toolsReducer from "./slices/toolsSlice";
import classroomsReducer from "./slices/classroomSlice";
import studentClassroomsReducer from "./slices/studentClassroomSlice";
import studentAssignmentsReducer from "./slices/studentAssignmentSlice";
import profileReducer from "./slices/profileSlice";
import resourcesReducer from "./slices/resourcesSlice";
import assignmentsReducer from "./slices/assignmentSlice";
import notificationsReducer from "./slices/notificationsSlice";
import teamReducer from "./slices/teamSlice";
import teamResourcesReducer from "./slices/teamResourcesSlice";
import heroesWallReducer from "./slices/HeroesWallSlice";
import userReducer from "./slices/userSlice";
import teamClassroomReducer from "./slices/teamClassroomSlice";
import responseReducer from "./slices/responseSlice";
import archivedAssistantsReducer from "./slices/archivedAssistantsSlice";
import bankReducer from "./slices/bankSlice";
import testReducer from "./slices/testSlice";
import studentTestsReducer from "./slices/studentTestsSlice";
import schoolStudentReducer from "./slices/schoolStudentSlice";
import staffChatSlice from "./slices/staffchats";
import uiReducer from "./slices/uiSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    tools: toolsReducer,
    classrooms: classroomsReducer,
    studentClassrooms: studentClassroomsReducer,
    studentAssignments: studentAssignmentsReducer,
    profile: profileReducer,
    resources: resourcesReducer,
    assignments: assignmentsReducer,
    notifications: notificationsReducer,
    team: teamReducer,
    teamResources: teamResourcesReducer,
    heroesWall: heroesWallReducer,
    users: userReducer,
    teamClassroom: teamClassroomReducer,
    response: responseReducer,
    archivedAssistants: archivedAssistantsReducer,
    bank: bankReducer,
    tests: testReducer,
    studentTests: studentTestsReducer,
    schoolStudent: schoolStudentReducer,
    staffChats: staffChatSlice,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
