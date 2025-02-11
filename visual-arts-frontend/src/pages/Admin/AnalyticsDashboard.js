import React, { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import API from "../../services/api";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoryAnalytics } from "../../redux/slices/artworkSlice";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title
);

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const { categoryAnalytics, loading: categoryLoading, error: categoryError } = useSelector(
    (state) => state.artwork
  );

  // Fetch existing analytics data
  useEffect(() => {
    API.get("analytics/")
      .then((response) => {
        setAnalyticsData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data || "Failed to fetch analytics data");
        setLoading(false);
      });
  }, []);

  // Fetch category analytics data
  useEffect(() => {
    dispatch(fetchCategoryAnalytics());
  }, [dispatch]);

  if (loading) return <p>Loading analytics...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // Prepare Data for Charts
  const userRoleData = {
    labels: analyticsData.user_roles.map((role) => role.role),
    datasets: [
      {
        data: analyticsData.user_roles.map((role) => role.count),
        backgroundColor: ["#4caf50", "#2196f3", "#ff9800"], // Colors for roles
      },
    ],
  };

  const artworkSubmissionData = {
    labels: analyticsData.monthly_artwork_data.map((data) => data.month),
    datasets: [
      {
        label: "Monthly Artwork Submissions",
        data: analyticsData.monthly_artwork_data.map((data) => data.count),
        backgroundColor: "#2196f3",
      },
    ],
  };

  // Prepare Data for Category Analytics Chart
  const categoryChartData = {
    labels: categoryAnalytics.map((item) => item.category || "Unknown"),
    datasets: [
      {
        label: "Approved Artworks",
        data: categoryAnalytics.map((item) => item.approved),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Pending Artworks",
        data: categoryAnalytics.map((item) => item.pending),
        backgroundColor: "rgba(255, 205, 86, 0.6)",
      },
      {
        label: "Rejected Artworks",
        data: categoryAnalytics.map((item) => item.rejected),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const categoryChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Artworks by Category",
      },
    },
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

      {/* Artworks by Category Chart */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Artworks by Category</h2>
        {categoryLoading && <p>Loading category analytics...</p>}
        {categoryError && <p className="text-red-500">{categoryError}</p>}
        {categoryAnalytics.length > 0 && (
          <Bar data={categoryChartData} options={categoryChartOptions} />
        )}
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-green-100 rounded">
          <h2 className="font-semibold">Total Users</h2>
          <p>{analyticsData.user_roles.reduce((sum, role) => sum + role.count, 0)}</p>
        </div>
        <div className="p-4 bg-blue-100 rounded">
          <h2 className="font-semibold">Total Artworks</h2>
          <p>{analyticsData.total_artworks}</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded">
          <h2 className="font-semibold">Pending Artworks</h2>
          <p>{analyticsData.pending_artworks}</p>
        </div>
        <div className="p-4 bg-red-100 rounded">
          <h2 className="font-semibold">Total Projects</h2>
          <p>{analyticsData.total_projects}</p>
        </div>
      </div>

      {/* User Role Distribution Chart */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">User Role Distribution</h2>
        <Pie data={userRoleData} />
      </div>

      {/* Monthly Artwork Submissions Chart */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Monthly Artwork Submissions</h2>
        <Bar data={artworkSubmissionData} />
      </div>

      

      {/* Recent Activity Logs */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
        <ul className="list-disc pl-6">
          {analyticsData.recent_logs.map((log) => (
            <li key={log.id}>
              {log.user.email} performed {log.action} on {log.resource || "N/A"} at{" "}
              {new Date(log.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;