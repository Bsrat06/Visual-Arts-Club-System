import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddEventForm from "../../components/AddEventForm";
import EditEventForm from "../../components/EditEventForm";
import { fetchEvents, removeEvent } from "../../redux/slices/eventsSlice";

const ManageEvents = () => {
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state) => state.events);

  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleEdit = (event) => {
    setEditingEvent(event);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Manage Events</h1>

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
