import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";

// Fetch all artwork
export const fetchArtworks = createAsyncThunk("artwork/fetchAll", async (_, thunkAPI) => {
  try {
    const response = await API.get("artwork/");
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
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
        state.artworks = action.payload;
      })
      .addCase(fetchArtworks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default artworkSlice.reducer;
