import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Pie, Bar } from "react-chartjs-2";
import API from "../../services/api";
import { fetchArtworks, fetchCategoryAnalytics } from "../../redux/slices/artworkSlice";
import { fetchEvents } from "../../redux/slices/eventsSlice";
import { fetchProjects } from "../../redux/slices/projectsSlice";
import { fetchNotifications } from "../../redux/slices/notificationsSlice";
import { fetchUsers } from "../../redux/slices/userSlice";

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

const AdminDashboard = () => {
  const dispatch = useDispatch();

  // Redux State
  const { artworks } = useSelector((state) => state.artwork);
  const { events } = useSelector((state) => state.events);
  const { projects } = useSelector((state) => state.projects);
  const { notifications } = useSelector((state) => state.notifications);
  const { users } = useSelector((state) => state.users);
  const { categoryAnalytics, loading: categoryLoading, error: categoryError } = useSelector(
    (state) => state.artwork
  );

  // Local State for Analytics
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState(null);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchArtworks());
    dispatch(fetchEvents());
    dispatch(fetchProjects());
    dispatch(fetchNotifications());
    dispatch(fetchUsers());
    dispatch(fetchCategoryAnalytics());
    fetchAnalytics();
  }, [dispatch]);

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      const response = await API.get("analytics/");
      setAnalyticsData(response.data);
      setAnalyticsLoading(false);
    } catch (err) {
      setAnalyticsError(err.response?.data || "Failed to fetch analytics data");
      setAnalyticsLoading(false);
    }
  };

  // Prepare Data for Charts
  const userRoleData = analyticsData
    ? {
        labels: analyticsData.user_roles.map((role) => role.role),
        datasets: [
          {
            data: analyticsData.user_roles.map((role) => role.count),
            backgroundColor: ["#4caf50", "#2196f3", "#ff9800"],
          },
        ],
      }
    : null;

  const artworkSubmissionData = analyticsData
    ? {
        labels: analyticsData.monthly_artwork_data.map((data) => data.month),
        datasets: [
          {
            label: "Monthly Artwork Submissions",
            data: analyticsData.monthly_artwork_data.map((data) => data.count),
            backgroundColor: "#2196f3",
          },
        ],
      }
    : null;

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
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Link to="/admin/manage-artworks" className="bg-blue-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Artworks</h2>
          <p>Total: {artworks.length}</p>
        </Link>
        <Link to="/admin/manage-events" className="bg-green-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Events</h2>
          <p>Total: {events.length}</p>
        </Link>
        <Link to="/admin/project-management" className="bg-yellow-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Projects</h2>
          <p>Total: {projects.length}</p>
        </Link>
        <Link to="/admin/notifications" className="bg-red-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Notifications</h2>
          <p>Total: {notifications.length}</p>
        </Link>
        <Link to="/admin/user-management" className="bg-purple-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Users</h2>
          <p>Total: {users.length}</p>
        </Link>
      </div>

      {/* Artworks by Category Chart */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Artworks by Category</h2>
        {categoryLoading && <p>Loading category analytics...</p>}
        {categoryError && <p className="text-red-500">{categoryError}</p>}
        {categoryAnalytics.length > 0 && (
          <Bar data={categoryChartData} options={categoryChartOptions} />
        )}
      </div>

      {/* User Role Distribution Chart */}
      {analyticsLoading ? (
        <p>Loading analytics...</p>
      ) : analyticsError ? (
        <p className="text-red-500">{analyticsError}</p>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">User Role Distribution</h2>
            <Pie data={userRoleData} />
          </div>

          {/* Monthly Artwork Submissions Chart */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Monthly Artwork Submissions</h2>
            <Bar data={artworkSubmissionData} />
          </div>
        </>
      )}

      {/* Recent Activity Logs */}
      {analyticsData && (
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
      )}
    </div>
  );
};

export default AdminDashboard;
