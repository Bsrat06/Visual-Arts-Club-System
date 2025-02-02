import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getArtworks, createArtwork, updateArtwork, deleteArtwork } from "../../services/api";
import API from "../../services/api";

// Fetch all artworks
export const fetchArtworks = createAsyncThunk("artwork/fetchAll", async (_, thunkAPI) => {
  try {
    const response = await getArtworks();
    console.log("API Response (Artworks):", response.data); // ✅ Debugging log
    return response.data.results || []; // ✅ Extract `results` array
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
export const editArtwork = createAsyncThunk("artwork/edit", async ({ id, data }, thunkAPI) => {
  try {
    const response = await updateArtwork(id, data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to update artwork");
  }
});

// Delete artwork
export const removeArtwork = createAsyncThunk("artwork/remove", async (id, thunkAPI) => {
  try {
    await deleteArtwork(id);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to delete artwork");
  }
});

// Redux slice
const artworkSlice = createSlice({
  name: "artwork",
  initialState: {
    artworks: [],
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
      });
  },
});

export default artworkSlice.reducer;














