import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getArtworks, createArtwork, updateArtwork, deleteArtwork } from "../../services/api";
import API from "../../services/api";

// Fetch all artworks (with optional filters)
export const fetchArtworks = createAsyncThunk("artwork/fetchAll", async (filters = {}, thunkAPI) => {
  try {
    const params = new URLSearchParams(filters).toString(); // Convert filters to query string
    const response = await API.get(`artwork/?${params}`); // Pass filters as query parameters
    return response.data.results || [];
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch artworks");
  }
});

// Create new artwork
export const addArtwork = createAsyncThunk("artwork/add", async (formData, thunkAPI) => {
  try {
    const response = await API.post("artwork/", formData, {
        headers: { "Content-Type": "multipart/form-data" }, // ✅ Required for file uploads
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to create artwork");
  }
});

// Update artwork
export const editArtwork = createAsyncThunk(
  "artwork/editArtwork",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      // Check ID and Data before making API call
      console.log("Updating Artwork ID:", id);
      console.log("Data being sent:", data);
      
      // Ensure ID is valid before making request
      if (!id) throw new Error("Artwork ID is required for updating.");

      // API Call
      const response = await updateArtwork(id, data);
      return response.data;
    } catch (error) {
      console.error("Error updating artwork:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete artwork
export const removeArtwork = createAsyncThunk("artwork/remove", async (id, thunkAPI) => {
  try {
    await deleteArtwork(id);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to delete artwork");
  }
});

export const fetchCategoryAnalytics = createAsyncThunk(
  "artwork/fetchCategoryAnalytics",
  async (_, thunkAPI) => {
    try {
      const response = await API.get("artwork/category_analytics/");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch category analytics");
    }
  }
);


// Redux slice
const artworkSlice = createSlice({
  name: "artwork",
  initialState: {
    artworks: [],
    categoryAnalytics: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchArtworks.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchArtworks.fulfilled, (state, action) => {
        state.loading = false;
        state.artworks = action.payload; // ✅ Now only stores the artworks
      })
      .addCase(fetchCategoryAnalytics.fulfilled, (state, action) => {
        state.categoryAnalytics = action.payload;
      })
      .addCase(addArtwork.fulfilled, (state, action) => {
        state.artworks.push(action.payload);
      })
      .addCase(editArtwork.fulfilled, (state, action) => {
        state.artworks = state.artworks.map((art) =>
          art.id === action.payload.id ? action.payload : art
        );
      })
      .addCase(removeArtwork.fulfilled, (state, action) => {
        state.artworks = state.artworks.filter((art) => art.id !== action.payload);
      })
  },
});

export default artworkSlice.reducer;














