import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import artworkReducer from "./slices/artworkSlice";
import eventsReducer from "./slices/eventsSlice";
import projectsReducer from "./slices/projectsSlice";
import notificationsReducer from "./slices/notificationsSlice";
import userReducer from "./slices/userSlice";
import activityLogReducer from "./slices/activityLogSlice";
import memberStatsReducer from "./slices/memberStatsSlice";
import eventStatsReducer from "./slices/eventStatsSlice";
import projectStatsReducer from "./slices/projectStatsSlice";


const store = configureStore({
  reducer: {
    auth: authReducer,
    artwork: artworkReducer,
    events: eventsReducer,
    projects: projectsReducer,
    notifications: notificationsReducer,
    users: userReducer,
    activityLogs: activityLogReducer,
    memberStats: memberStatsReducer,
    eventStats: eventStatsReducer,
    projectStats: projectStatsReducer,
  },
});

export default store;
