import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMemberStats } from "../../redux/slices/memberStatsSlice";

const MemberAnalytics = () => {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.memberStats);

  useEffect(() => {
    dispatch(fetchMemberStats());
  }, [dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">My Analytics</h1>

      {loading && <p>Loading stats...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {stats && (
        <div>
          <p><strong>Total Artworks:</strong> {stats.total_artworks}</p>
          <p><strong>Approval Rate:</strong> {stats.approval_rate}%</p>
          <h2 className="text-xl mt-4">Category Distribution</h2>
          <ul>
            {stats.category_distribution.map((cat) => (
              <li key={cat.category}>
                {cat.category}: {cat.count}
              </li>
            ))}
          </ul>

          <h2 className="text-xl mt-4">Recent Activity</h2>
          <ul>
            {stats.recent_activity_logs.map((log, index) => (
              <li key={index}>
                {log.action} {log.resource && `on ${log.resource}`} at {new Date(log.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MemberAnalytics;
