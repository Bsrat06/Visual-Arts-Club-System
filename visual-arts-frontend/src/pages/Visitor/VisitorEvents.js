import React, { useState, useEffect } from "react";
import API from "../../services/api";
import Modal from "../../components/Shared/Modal";

const VisitorEvents = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await API.get("events/");
        setEvents(response.data.results || []);
        setFilteredEvents(response.data.results || []);
      } catch (err) {
        setError("Failed to fetch events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = events.filter((event) =>
      event.name.toLowerCase().includes(query)
    );
    setFilteredEvents(filtered);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  if (loading) return <p className="p-6">Loading events...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>

      {/* Search Bar */}
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search for events..."
        className="border rounded-lg p-2 w-full mb-6"
      />

      {/* Event List */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <li
              key={event.id}
              className="bg-white border rounded-lg p-4 shadow cursor-pointer hover:shadow-md transition"
              onClick={() => handleEventClick(event)}
            >
              <h2 className="text-lg font-semibold">{event.name}</h2>
              <p className="text-gray-600">{event.date}</p>
            </li>
          ))
        ) : (
          <p className="col-span-full text-center">No events found.</p>
        )}
      </ul>

      {/* Event Details Modal */}
      {selectedEvent && (
        <Modal isOpen={!!selectedEvent} onClose={closeModal}>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{selectedEvent.name}</h2>
            <p>
              <strong>Date:</strong> {selectedEvent.date}
            </p>
            <p>
              <strong>Location:</strong> {selectedEvent.location}
            </p>
            <p className="mt-4">{selectedEvent.description}</p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default VisitorEvents;
