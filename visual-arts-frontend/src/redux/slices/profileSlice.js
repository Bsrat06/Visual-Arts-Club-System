import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";

// ✅ Fetch user profile from API
export const fetchUserProfile = createAsyncThunk("profile/fetch", async (_, thunkAPI) => {
  try {
    console.log("🟢 Sending API Request...");
    const response = await API.get("auth/user/");
    console.log("🟢 API Response Data:", response.data);
    return response.data;
  } catch (error) {
    console.error("🔴 API Request Failed:", error.response?.data || error.message);
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch user profile");
  }
});

// ✅ Update user profile
export const updateProfile = createAsyncThunk("profile/update", async (formData, thunkAPI) => {
  try {
    const response = await API.put("auth/profile/update/", formData, {
      headers: { "Content-Type": "multipart/form-data" }, // ✅ Ensure multipart form data
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to update profile");
  }
});

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ Handle fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        
        console.log("🟢 Redux Before Update:", JSON.parse(JSON.stringify(state))); // Deep copy to avoid mutation issues
        console.log("🟢 Fetch Success, Data:", action.payload);
        
        state.loading = false;
        state.user = action.payload;

        console.log("🟢 Redux After Update:", JSON.parse(JSON.stringify(state))); // Log final state
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        
        console.log("🟢 Redux State Before:", state);
        console.log("🟢 Fetched User Data:", action.payload);
        
        state.loading = false;
        state.error = action.payload;


        console.log("🟢 Redux State After:", state);
      })

      // ✅ Handle profile update
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default profileSlice.reducer;
