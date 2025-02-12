import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddEventForm from "../../components/AddEventForm";
import EditEventForm from "../../components/EditEventForm";
import { fetchEvents, removeEvent } from "../../redux/slices/eventsSlice";
import API from "../../services/api"; // Import API service for fetching stats

const ManageEvents = () => {
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state) => state.events);

  const [editingEvent, setEditingEvent] = useState(null);
  const [eventStats, setEventStats] = useState(null); // State for event stats
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  useEffect(() => {
    dispatch(fetchEvents());
    fetchEventStats();
  }, [dispatch]);

  const fetchEventStats = async () => {
    try {
      const response = await API.get("/event-stats/");
      setEventStats(response.data);
      setStatsLoading(false);
    } catch (err) {
      setStatsError(err.response?.data || "Failed to load event statistics.");
      setStatsLoading(false);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Manage Events</h1>

      {/* Event Statistics */}
      <h2 className="text-xl font-semibold mt-4">Event Statistics</h2>
      {statsLoading ? (
        <p>Loading event statistics...</p>
      ) : statsError ? (
        <p className="text-red-500">{statsError}</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded shadow">
            <h2 className="text-xl font-semibold">Total Events</h2>
            <p className="text-2xl">{eventStats.total_events}</p>
          </div>
          <div className="bg-green-100 p-4 rounded shadow">
            <h2 className="text-xl font-semibold">Completed Events</h2>
            <p className="text-2xl">{eventStats.completed_events}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded shadow">
            <h2 className="text-xl font-semibold">Upcoming Events</h2>
            <p className="text-2xl">{eventStats.upcoming_events}</p>
          </div>
        </div>
      )}

      {/* Add Event */}
      <h2 className="text-xl font-semibold mt-4">Add Event</h2>
      <AddEventForm />

      {/* Edit Event */}
      {editingEvent && (
        <EditEventForm
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
        />
      )}

      {/* Display Events */}
      <h2 className="text-xl font-semibold mt-4">Events List</h2>
      {loading && <p>Loading events...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="list-disc pl-6">
        {Array.isArray(events) && events.length > 0 ? (
          events.map((event) => (
            <li key={event.id}>
              <p>{event.name} - {event.date}</p>
              <button
                onClick={() => handleEdit(event)}
                className="text-blue-500 ml-2"
              >
                Edit
              </button>
              <button
                onClick={() => dispatch(removeEvent(event.id))}
                className="text-red-500 ml-2"
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <p>No events available</p>
        )}
      </ul>
    </div>
  );
};

export default ManageEvents;
