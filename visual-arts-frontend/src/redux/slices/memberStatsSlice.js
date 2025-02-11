import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";

export const fetchMemberStats = createAsyncThunk("memberStats/fetch", async (_, thunkAPI) => {
  try {
    const response = await API.get("users/member-stats/");
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch member stats");
  }
});

const memberStatsSlice = createSlice({
  name: "memberStats",
  initialState: {
    stats: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMemberStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMemberStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchMemberStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default memberStatsSlice.reducer;
