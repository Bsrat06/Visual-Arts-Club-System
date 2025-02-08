import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../redux/slices/eventsSlice";

const VisitorEvents = () => {
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>
      {loading && <p>Loading events...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {events.length > 0 ? (
        <ul className="list-disc pl-6">
          {events.map((event) => (
            <li key={event.id}>
              <h3 className="font-semibold">{event.name}</h3>
              <p>{event.date}</p>
              <p>{event.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No upcoming events available.</p>
      )}
    </div>
  );
};

export default VisitorEvents;
