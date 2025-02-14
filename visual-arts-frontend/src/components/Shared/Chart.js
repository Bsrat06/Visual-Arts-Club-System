import React from "react";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const Chart = ({ type, data, options }) => {
  if (type === "line") return <Line data={data} options={options} />;
  if (type === "bar") return <Bar data={data} options={options} />;
  return null;
};

export default Chart;
