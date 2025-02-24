import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProjects, createProject, updateProject, deleteProject } from "../../services/api";
import API from "../../services/api";


// Fetch all projects
export const fetchProjects = createAsyncThunk("projects/fetchAll", async (_, thunkAPI) => {
  try {
    const response = await getProjects();
    return response.data.results || []; // ✅ Extract `results`
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch projects");
  }
});

// Create new project
export const addProject = createAsyncThunk("projects/add", async (data, thunkAPI) => {
  const token = localStorage.getItem("token"); // ✅ Ensure we get the token

  console.log("Adding Project with Token:", token); // ✅ Debug log
  
  
  try {
    const response = await API.post("projects/", data, {
      headers: {
        Authorization: `Token ${token}`, // ✅ Ensure token is sent
      },
    });
    return response.data;
  } catch (error) {
    console.error("Project Submission Error:", error.response?.data); // ✅ Log exact error
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to create project");
  }
});

// Update project
export const editProject = createAsyncThunk("projects/edit", async ({ id, data }, thunkAPI) => {
  try {
    console.log("Updating Project:", id, data); // ✅ Debugging log
    const response = await API.put(`projects/${id}/`, data, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    });
    return response.data;

  } catch (error) {
    console.error("Update Project Error:", error.response?.data || error.message);
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

// ✅ Fetch project progress
export const fetchProjectProgress = createAsyncThunk("projects/fetchProgress", async (projectId, thunkAPI) => {
  try {
    const response = await API.get(`projects/${projectId}/progress/`);
    return { projectId, progress: response.data };
  } catch (error) {
    return thunkAPI.rejectWithValue("Failed to fetch project progress");
  }
});

// Fetch single project details
export const fetchProjectDetails = createAsyncThunk("projects/fetchDetails", async (id, thunkAPI) => {
  try {
      const response = await API.get(`projects/${id}/`);
      return response.data;
  } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch project details");
  }
});

// Add a progress update
export const addProjectUpdate = createAsyncThunk("projects/addUpdate", async ({ projectId, data }, thunkAPI) => {
  try {
      const response = await API.post(`projects/${projectId}/add-update/`, data, {
          headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
  } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Failed to add progress update");
  }
});

// Mark project as completed
export const completeProject = createAsyncThunk("projects/complete", async (id, thunkAPI) => {
  try {
      const response = await API.post(`projects/${id}/complete/`);
      return response.data;
  } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Failed to complete project");
  }
});

// Redux slice
const projectsSlice = createSlice({
  name: "projects",
  initialState: {
    projects: [],
    progress: {},
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
      })
      .addCase(fetchProjectProgress.fulfilled, (state, action) => {
        state.progress[action.payload.projectId] = action.payload.progress;
      })
      .addCase(fetchProjectDetails.fulfilled, (state, action) => { state.selectedProject = action.payload; })
      .addCase(addProjectUpdate.fulfilled, (state, action) => { state.selectedProject.updates.push(action.payload); })
      .addCase(completeProject.fulfilled, (state, action) => { state.selectedProject.is_completed = true; });
  },
});

export default projectsSlice.reducer;
