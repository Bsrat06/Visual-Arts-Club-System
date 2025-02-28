import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";

const API_URL = "http://127.0.0.1:8000/api/auth/";

// Async action for logging in
// authSlice.js
export const loginUser = createAsyncThunk("auth/login", async (credentials, thunkAPI) => {
  try {
    console.log("Sending login request with:", credentials);
    const response = await API.post("auth/login/", credentials);
    
    console.log("Login Response:", response.data);  // Log API response

    const { token } = response.data;

    if (!token) {
      throw new Error("No token received");
    }

    localStorage.setItem("token", token);

    const userResponse = await API.get("auth/user/", {
      headers: { Authorization: `Token ${token}` },
    });

    console.log("User Data Response:", userResponse.data);  // Log user details

    const { role, ...userData } = userResponse.data;

    localStorage.setItem("role", role);
    localStorage.setItem("user", JSON.stringify(userData));
    console.log("userROOLLEE: ", role);
    return { token, role, user: userData };
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    return thunkAPI.rejectWithValue(error.response?.data || "Login failed");
  }
});



// Async action for registering a new user
export const registerUser = createAsyncThunk("auth/register", async (userData, thunkAPI) => {
  try {
    console.log("User Data:", userData);
    const response = await API.post("auth/registration/", userData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token") || null,
    role: localStorage.getItem("role") || null,
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.role = action.payload.role;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
