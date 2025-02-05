import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API from "../../services/api";

const API_URL = "http://127.0.0.1:8000/api/auth/";

// Create an Axios instance for authenticated requests
// const API = axios.create({
//   baseURL: API_URL,
// });

// Async action for logging in
export const loginUser = createAsyncThunk("auth/login", async (credentials, thunkAPI) => {
  try {
    const response = await axios.post("http://127.0.0.1:8000/api/auth/login/", credentials); // Use direct Axios for login
    localStorage.setItem("token", response.data.key); // ✅ Store token in localStorage

    // After login, set the token dynamically for subsequent requests
    const userResponse = await API.get("auth/user/");
    localStorage.setItem("user", JSON.stringify(userResponse.data)); // ✅ Store user in localStorage
    return { token: response.data.key, user: userResponse.data };
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message); // Debugging log
    return thunkAPI.rejectWithValue(error.response?.data || "Login failed");
  }
});


// Async action for registering a new user
export const registerUser = createAsyncThunk("auth/register", async (userData, thunkAPI) => {
  try {
    const response = await API.post("registration/", userData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Redux slice for authentication
const authSlice = createSlice({
  name: "auth",
  initialState: {
    // user: null,
    token: localStorage.getItem("token") || null,
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null, // ✅ Load user from storage
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token"); // ✅ Clear token on logout
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
