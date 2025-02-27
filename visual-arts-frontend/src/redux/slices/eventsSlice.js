import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getEvents, createEvent, updateEvent, deleteEvent } from "../../services/api";
import API from "../../services/api";

// Fetch all events
export const fetchAllEvents = createAsyncThunk(
  "events/fetchAllEvents",
  async (_, thunkAPI) => {
      try {
          let allEvents = [];
          let nextPage = "events/"; // Start with the first page

          while (nextPage) {
              const response = await API.get(nextPage);
              allEvents = [...allEvents, ...response.data.results];
              nextPage = response.data.next;
          }

          return allEvents;
      } catch (error) {
          return thunkAPI.rejectWithValue(
              error.response?.data || "Failed to fetch events"
          );
      }
  }
);

// Create new event
export const addEvent = createAsyncThunk("events/add", async (data, thunkAPI) => {
  const token = localStorage.getItem("token"); // ✅ Ensure we get the token
  
  console.log("Adding Event with Token:", token); // ✅ Debugging log
  
  try {
    const response = await API.post("events/", data, {
      headers: {
        Authorization: `Token ${token}`, // ✅ Ensure admin token is sent
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Event Submission Error:", error.response?.data); // ✅ Log exact error
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to create event");
  }
});

// Update event
export const editEvent = createAsyncThunk("events/edit", async ({ id, data }, thunkAPI) => {
  try {
    const response = await updateEvent(id, data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to update event");
  }
});

// Delete event
export const removeEvent = createAsyncThunk(
  "events/remove",
  async (id, thunkAPI) => {
      try {
          await API.delete(`events/${id}/`);
          return id;
      } catch (error) {
          return thunkAPI.rejectWithValue(
              error.response?.data || "Failed to delete event"
          );
      }
  }
);


// Redux slice
const eventsSlice = createSlice({
  name: "events",
  initialState: {
      events: [],
      loading: false,
      error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchAllEvents.pending, (state) => {
      state.loading = true;
      state.error = null;
  })
  .addCase(fetchAllEvents.fulfilled, (state, action) => {
      state.loading = false;
      state.events = action.payload;
  })
  .addCase(fetchAllEvents.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
  })
  .addCase(removeEvent.fulfilled, (state, action) => {
      state.events = state.events.filter((event) => event.id !== action.payload);
  })
      .addCase(addEvent.fulfilled, (state, action) => {
        state.events.push(action.payload);
      })
      .addCase(editEvent.fulfilled, (state, action) => {
        state.events = state.events.map((event) =>
          event.id === action.payload.id ? action.payload : event
        );
      })
  },
});

export default eventsSlice.reducer;
