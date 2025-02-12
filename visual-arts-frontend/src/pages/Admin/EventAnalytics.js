import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventStats } from "../../redux/slices/eventStatsSlice";

const EventAnalytics = () => {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.eventStats);

  useEffect(() => {
    dispatch(fetchEventStats());
  }, [dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Event Analytics</h1>
      {loading && <p>Loading stats...</p>}
      {error && (
        <p className="text-red-500">
          {typeof error === "string" ? error : error.detail || "An unknown error occurred"}
        </p>
      )}

      {stats && (
        <div>
          <p><strong>Total Events:</strong> {stats.total_events}</p>
          <p><strong>Completed Events:</strong> {stats.completed_events}</p>
          <p><strong>Upcoming Events:</strong> {stats.upcoming_events}</p>

          <h2 className="text-xl mt-4">Participation Stats</h2>
          <ul>
            {stats.participation_stats.map((stat, index) => (
              <li key={index}>
                {stat.event__name}: {stat.participants || "You are participating"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EventAnalytics;
