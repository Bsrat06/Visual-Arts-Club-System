import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";

export const fetchEventStats = createAsyncThunk("eventStats/fetch", async (_, thunkAPI) => {
  try {
    const response = await API.get("events/stats/");
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch event stats");
  }
});

const eventStatsSlice = createSlice({
  name: "eventStats",
  initialState: {
    stats: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchEventStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default eventStatsSlice.reducer;
