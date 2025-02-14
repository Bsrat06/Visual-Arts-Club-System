import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMemberStats } from "../../redux/slices/memberStatsSlice";
import Chart from "../../components/Shared/Chart";

const MemberDashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading: statsLoading, error: statsError } = useSelector((state) => state.memberStats);

  useEffect(() => {
    dispatch(fetchMemberStats());
  }, [dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Member Dashboard</h1>

      {/* Member Analytics */}
      <h2 className="text-xl font-semibold mt-6">My Analytics</h2>
      {statsLoading && <p>Loading stats...</p>}
      {statsError && <p className="text-red-500">{statsError}</p>}
      {stats && (
        <div>
          {/* Monthly Approval Rate Chart */}
          <h3 className="text-lg mt-4">Monthly Approval Rate</h3>
          <Chart
  type="line"
  data={{
    labels: stats?.monthly_approval_rate?.map((entry) => entry.month) || [],
    datasets: [
      {
        label: "Approved Artworks",
        data: stats?.monthly_approval_rate?.map((entry) => entry.approved) || [],
        borderColor: "#ff9800",
        fill: false,
      },
    ],
  }}
/>

<Chart
  type="bar"
  data={{
    labels: stats?.category_distribution?.map((entry) => entry.category) || [],
    datasets: [
      {
        label: "Artworks",
        data: stats?.category_distribution?.map((entry) => entry.count) || [],
        backgroundColor: "#2196f3",
      },
    ],
  }}
/>;

        </div>
      )}
    </div>
  );
};

export default MemberDashboard;
