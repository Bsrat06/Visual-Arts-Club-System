import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectStats } from "../../redux/slices/projectStatsSlice";

const ProjectAnalytics = () => {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.projectStats);

  useEffect(() => {
    dispatch(fetchProjectStats());
  }, [dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Project Analytics</h1>
      {loading && <p>Loading stats...</p>}
      {error && (
        <p className="text-red-500">
          {typeof error === "string" ? error : error.detail || "An unknown error occurred"}
        </p>
      )}

      {stats && (
        <div>
          <p><strong>Total Projects:</strong> {stats.total_projects}</p>
          <p><strong>Ongoing Projects:</strong> {stats.ongoing_projects}</p>
          <p><strong>Completed Projects:</strong> {stats.completed_projects}</p>
          <p><strong>Your Contributions:</strong> {stats.user_contributions}</p>
        </div>
      )}
    </div>
  );
};

export default ProjectAnalytics;
