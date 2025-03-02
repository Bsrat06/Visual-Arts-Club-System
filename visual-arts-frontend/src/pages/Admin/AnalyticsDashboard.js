// analyticsdashboard.js
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
import dayjs from "dayjs";

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

  const userRoleData = {
    labels: analyticsData.user_roles.map((role) => role.role),
    datasets: [
      {
        data: analyticsData.user_roles.map((role) => role.count),
        backgroundColor: ["#4CAF50", "#2196F3", "#FF9800", "#E91E63", "#9C27B0"],
        hoverBackgroundColor: ["#45A049", "#1976D2", "#FB8C00", "#D81B60", "#7B1FA2"],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const userRoleOptions = {
    plugins: {
      legend: { position: "bottom", labels: { font: { size: 14 } } },
      tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.raw} users` } },
    },
  };

  const artworkSubmissionData = {
    labels: analyticsData.monthly_artwork_data.map((data) =>
      dayjs(data.month, "YYYY-MM").format("MMM YYYY")
    ),
    datasets: [
      {
        label: "Monthly Artwork Submissions",
        data: analyticsData.monthly_artwork_data.map((data) => data.count),
        backgroundColor: ["#2196F3", "#4CAF50", "#FF9800", "#E91E63", "#9C27B0"],
        hoverBackgroundColor: "#1E88E5",
        borderColor: "#1976D",// analyticsdashboard.js (continued)
        borderWidth: 1,
        barThickness: 40,
      },
    ],
  };

  const artworkSubmissionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.raw} submissions` } },
    },
    scales: {
      x: {
        title: { display: true, text: "Month", font: { size: 14, weight: "bold" } },
        ticks: { font: { size: 12 } },
      },
      y: {
        title: { display: true, text: "Number of Submissions", font: { size: 14, weight: "bold" } },
        ticks: { stepSize: 1, font: { size: 12 } },
      },
    },
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">User Role Distribution</h2>
          <Pie data={userRoleData} options={userRoleOptions} />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-lg h-[400px]">
          <h2 className="text-xl font-semibold mb-4">Monthly Artwork Submissions</h2>
          <Bar data={artworkSubmissionData} options={artworkSubmissionOptions} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;