import React, { useEffect, useState } from "react";
import API from "../../services/api"; // Ensure this is your API utility

const EventStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventStats = async () => {
      try {
        const response = await API.get("/event-stats/"); // Fetch data from the backend
        setStats(response.data); // Set the response data to state
        setLoading(false);
      } catch (err) {
        console.error("Error fetching event stats:", err);
        setError(err.response?.data || "Failed to load event statistics.");
        setLoading(false);
      }
    };

    fetchEventStats();
  }, []);

  if (loading) {
    return <p>Loading event statistics...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error.detail || "An error occurred."}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Event Statistics</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Total Events</h2>
          <p className="text-2xl">{stats.total_events}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Completed Events</h2>
          <p className="text-2xl">{stats.completed_events}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Upcoming Events</h2>
          <p className="text-2xl">{stats.upcoming_events}</p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mt-6">Participation Stats</h2>
      {stats.participation_stats.length > 0 ? (
        <ul className="mt-4">
          {stats.participation_stats.map((event, index) => (
            <li key={index} className="border p-4 mb-2 rounded shadow">
              <h3 className="text-lg font-semibold">{event.event__title}</h3>
              <p>Participants: {event.participant_count}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No participation data available.</p>
      )}
    </div>
  );
};

export default EventStats;
