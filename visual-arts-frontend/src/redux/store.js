import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import artworkReducer from "./slices/artworkSlice";
import eventsReducer from "./slices/eventsSlice";
import projectsReducer from "./slices/projectsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    artwork: artworkReducer,
    events: eventsReducer,
    projects: projectsReducer,
  },
});

export default store;
