import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../redux/slices/eventsSlice";

const EventRegistration = () => {
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleRegister = (eventId) => {
    // Add your registration logic here
    console.log(`Registering for event ID: ${eventId}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Event Registration</h1>
      {loading && <p>Loading events...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="list-disc pl-6">
        {Array.isArray(events) && events.length > 0 ? (
          events.map((event) => (
            <li key={event.id}>
              <p>{event.name} - {event.date}</p>
              <button
                onClick={() => handleRegister(event.id)}
                className="text-blue-500 ml-2"
              >
                Register
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

export default EventRegistration;
