import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";

// Fetch notification preferences
export const fetchNotificationPreferences = createAsyncThunk(
  "notificationPreferences/fetch",
  async (_, thunkAPI) => {
    try {
      const response = await API.get("users/preferences/");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch preferences");
    }
  }
);

// Update notification preferences
export const updateNotificationPreferences = createAsyncThunk(
  "notificationPreferences/update",
  async (preferences, thunkAPI) => {
    try {
      const response = await API.patch("users/preferences/", preferences);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Failed to update preferences");
    }
  }
);

const notificationPreferencesSlice = createSlice({
  name: "notificationPreferences",
  initialState: {
    preferences: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificationPreferences.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotificationPreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.preferences = action.payload;
      })
      .addCase(fetchNotificationPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateNotificationPreferences.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateNotificationPreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.preferences = action.payload;
      })
      .addCase(updateNotificationPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default notificationPreferencesSlice.reducer;
