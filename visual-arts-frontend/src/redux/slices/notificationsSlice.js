import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";

// Fetch notifications
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await API.get("notifications/");
      return response.data; // Returns list of notifications
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch notifications");
    }
  }
);

// Create a notification
export const addNotification = createAsyncThunk(
  "notifications/add",
  async (data, thunkAPI) => {
    try {
      const response = await API.post("notifications/", data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Failed to create notification");
    }
  }
);

// Mark notification as read/unread
export const updateNotification = createAsyncThunk(
  "notifications/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await API.patch(`notifications/${id}/`, data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Failed to update notification");
    }
  }
);

// Delete a notification
export const deleteNotification = createAsyncThunk(
  "notifications/delete",
  async (id, thunkAPI) => {
    try {
      await API.delete(`notifications/${id}/`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Failed to delete notification");
    }
  }
);

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
    notifications: [],
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
        state.notifications = action.payload.results || [];
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addNotification.fulfilled, (state, action) => {
        state.notifications.push(action.payload);
      })
      .addCase(updateNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.map((notification) =>
          notification.id === action.payload.id ? action.payload : notification
        );
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(
          (notification) => notification.id !== action.payload
        );
      });
  },
});

export default notificationsSlice.reducer;
