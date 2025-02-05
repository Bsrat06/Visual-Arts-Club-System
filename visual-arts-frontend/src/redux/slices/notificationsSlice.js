import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";

export const fetchNotifications = createAsyncThunk("notifications/fetchAll", async (_, thunkAPI) => {
  try {
    const response = await API.get("notifications/");
    console.log("Notifications API Response:", response.data); // ✅ Debugging log
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch notifications");
  }
});

export const markNotificationAsRead = createAsyncThunk("notifications/markAsRead", async (id, thunkAPI) => {
  try {
    await API.patch(`notifications/${id}/mark_as_read/`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to mark notification as read");
  }
});

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [], // ✅ Ensure this is an empty array
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.results || []; // ✅ Fallback to an empty array
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch notifications";
      });
  },
});

export default notificationsSlice.reducer;
