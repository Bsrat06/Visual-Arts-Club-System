import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getArtworks, createArtwork, updateArtwork, deleteArtwork } from "../../services/api";
import API from "../../services/api";

// Fetch all artworks (with optional filters)
export const fetchAllArtworks = createAsyncThunk("artwork/fetchAll", async (_, thunkAPI) => {
  try {
    let allArtworks = [];
    let nextPage = "artwork/";

    while (nextPage) {
      const response = await API.get(nextPage);
      allArtworks = [...allArtworks, ...response.data.results]; // ✅ Append new results
      nextPage = response.data.next; // ✅ Move to next page
    }

    return allArtworks; // ✅ Store all artworks in Redux
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
      const response = await API.patch(`artwork/${id}/`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update artwork");
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
    .addCase(fetchAllArtworks.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchAllArtworks.fulfilled, (state, action) => {
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


