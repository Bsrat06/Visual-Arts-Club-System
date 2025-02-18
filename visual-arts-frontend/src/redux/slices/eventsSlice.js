import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getEvents, createEvent, updateEvent, deleteEvent } from "../../services/api";
import API from "../../services/api";

// Fetch all events
export const fetchEvents = createAsyncThunk("events/fetchAll", async (_, thunkAPI) => {
  try {
    const response = await getEvents();
    return response.data.results || []; // ✅ Extract `results`
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch events");
  }
});

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
export const removeEvent = createAsyncThunk("events/remove", async (id, thunkAPI) => {
  try {
    await deleteEvent(id);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to delete event");
  }
});

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
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.events = action.payload;
      })
      .addCase(addEvent.fulfilled, (state, action) => {
        state.events.push(action.payload);
      })
      .addCase(editEvent.fulfilled, (state, action) => {
        state.events = state.events.map((event) =>
          event.id === action.payload.id ? action.payload : event
        );
      })
      .addCase(removeEvent.fulfilled, (state, action) => {
        state.events = state.events.filter((event) => event.id !== action.payload);
      });
  },
});

export default eventsSlice.reducer;
