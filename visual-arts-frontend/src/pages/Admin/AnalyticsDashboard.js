import React, { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import API from "../../services/api";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoryAnalytics } from "../../redux/slices/artworkSlice";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const { categoryAnalytics } = useSelector((state) => state.artwork);

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

    dispatch(fetchCategoryAnalytics());
  }, [dispatch]);

  if (loading) return <p>Loading analytics...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // User Role Chart
  const userRoleData = {
    labels: analyticsData.user_roles.map((role) => role.role),
    datasets: [{ data: analyticsData.user_roles.map((role) => role.count), backgroundColor: ["#4caf50", "#2196f3", "#ff9800"] }],
  };

  // Artwork Submission Chart
  const artworkSubmissionData = {
    labels: analyticsData.monthly_artwork_data.map((data) => data.month),
    datasets: [{ label: "Monthly Artwork Submissions", data: analyticsData.monthly_artwork_data.map((data) => data.count), backgroundColor: "#2196f3" }],
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">User Role Distribution</h2>
          <Pie data={userRoleData} />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Monthly Artwork Submissions</h2>
          <Bar data={artworkSubmissionData} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
