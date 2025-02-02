import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProjects, createProject, updateProject, deleteProject } from "../../services/api";

// Fetch all projects
export const fetchProjects = createAsyncThunk("projects/fetchAll", async (_, thunkAPI) => {
  try {
    const response = await getProjects();
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch projects");
  }
});

// Create new project
export const addProject = createAsyncThunk("projects/add", async (data, thunkAPI) => {
  try {
    const response = await createProject(data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to create project");
  }
});

// Update project
export const editProject = createAsyncThunk("projects/edit", async ({ id, data }, thunkAPI) => {
  try {
    const response = await updateProject(id, data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to update project");
  }
});

// Delete project
export const removeProject = createAsyncThunk("projects/remove", async (id, thunkAPI) => {
  try {
    await deleteProject(id);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to delete project");
  }
});

// Redux slice
const projectsSlice = createSlice({
  name: "projects",
  initialState: {
    projects: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.projects = action.payload;
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
      })
      .addCase(editProject.fulfilled, (state, action) => {
        state.projects = state.projects.map((project) =>
          project.id === action.payload.id ? action.payload : project
        );
      })
      .addCase(removeProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter((project) => project.id !== action.payload);
      });
  },
});

export default projectsSlice.reducer;
