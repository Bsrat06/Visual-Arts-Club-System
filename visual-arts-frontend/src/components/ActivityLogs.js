import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchActivityLogs } from "../redux/slices/activityLogSlice";

const ActivityLogs = () => {
  const dispatch = useDispatch();
  const { logs, loading, error } = useSelector((state) => state.activityLogs);

  useEffect(() => {
    dispatch(fetchActivityLogs());
  }, [dispatch]);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold">User Activity Logs</h2>
      {loading && <p>Loading activity logs...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="list-disc pl-6">
        {Array.isArray(logs) && logs.length > 0 ? (
          logs.map((log) => (
            <li key={log.id}>
              {log.user} performed {log.action} on {log.resource || "N/A"} at{" "}
              {new Date(log.timestamp).toLocaleString()}
            </li>
          ))
        ) : (
          <p>No activity logs available.</p>
        )}
      </ul>
    </div>
  );
};

export default ActivityLogs;
