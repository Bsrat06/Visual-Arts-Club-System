import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";

// Fetch all users
export const fetchUsers = createAsyncThunk("users/fetchAll", async (_, thunkAPI) => {
  try {
    const response = await API.get("users/");
    return response.data.results || [];
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch users");
  }
});

// Update user role
export const updateUserRole = createAsyncThunk("users/updateRole", async ({ id, role }, thunkAPI) => {
  try {
    const response = await API.patch(`users/${id}/update-role/`, { role });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to update role");
  }
});


export const updateProfile = createAsyncThunk("user/updateProfile", async (formData, thunkAPI) => {
  try {
    const response = await API.put("auth/profile/update/", formData, {
      headers: { "Content-Type": "multipart/form-data" }, // ✅ Allow file uploads
    });

    return response.data.data; // Return updated user data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Profile update failed");
  }
});


// Activate user
export const activateUser = createAsyncThunk("users/activate", async (id, thunkAPI) => {
  try {
    const response = await API.patch(`/users/${id}/activate/`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to activate user");
  }
});

// Deactivate user
export const deactivateUser = createAsyncThunk("users/deactivate", async (id, thunkAPI) => {
  try {
    const response = await API.patch(`/users/${id}/deactivate/`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to deactivate user");
  }
});




// Users Slice
const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
  
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        state.users = state.users.map((user) =>
          user.pk === updatedUser.pk ? updatedUser : user
        );
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(activateUser.fulfilled, (state, action) => {
        state.users = state.users.map((user) =>
          user.pk === action.meta.arg ? { ...user, is_active: true } : user
        );
      })
      .addCase(deactivateUser.fulfilled, (state, action) => {
        state.users = state.users.map((user) =>
          user.pk === action.meta.arg ? { ...user, is_active: false } : user
        );
      });
  },
});



export const { logout } = userSlice.actions;
export default userSlice.reducer;
