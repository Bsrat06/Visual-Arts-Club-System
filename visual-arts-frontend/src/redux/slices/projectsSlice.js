import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";

// Fetch all projects
export const fetchProjects = createAsyncThunk("projects/fetchAll", async (_, thunkAPI) => {
  try {
    const response = await API.get("projects/");
    return response.data;  // ✅ Ensure the response is an array
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch projects");
  }
});

// Redux slice
const projectsSlice = createSlice({
  name: "projects",
  initialState: {
    projects: [],  // ✅ Set initial state as an empty array
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = Array.isArray(action.payload) ? action.payload : [];  // ✅ Ensure it's an array
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.projects = [];  // ✅ Reset to empty array on error
      });
  },
});

export default projectsSlice.reducer;
