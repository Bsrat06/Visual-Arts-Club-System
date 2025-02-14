import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoryAnalytics } from "../../redux/slices/artworkSlice";
import BarChart from "../../components/Shared/BarChart";
import PieChart from "../../components/Shared/PieChart";
import Loading from "../../components/Shared/Loading";
import Error from "../../components/Shared/Error";
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

  // Fetch admin analytics
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

  useEffect(() => {
    dispatch(fetchCategoryAnalytics());
  }, [dispatch]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  // Prepare data for charts
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

      {/* User Role Distribution */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">User Role Distribution</h2>
        <PieChart data={userRoleData} />
      </div>

      {/* Monthly Artwork Submissions */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Monthly Artwork Submissions</h2>
        <BarChart data={artworkSubmissionData} />
      </div>

      {/* Artworks by Category */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Artworks by Category</h2>
        {categoryLoading && <Loading />}
        {categoryError && <Error message={categoryError} />}
        {categoryAnalytics.length > 0 && <BarChart data={categoryChartData} options={categoryChartOptions} />}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
