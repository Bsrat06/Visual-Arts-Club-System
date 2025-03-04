import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import dayjs from "dayjs"; // Import dayjs

const ArtworkSubmissionsChart = ({ data }) => {
  const [timePeriod, setTimePeriod] = useState("monthly"); // Default to monthly view

  // Process data based on the selected time period
  const processData = (data, period) => {
    const groupedData = {};

    data.forEach((artwork) => {
      const submissionDate = dayjs(artwork.submission_date);
      if (!submissionDate.isValid()) return;

      let key;
      if (period === "monthly") {
        key = submissionDate.format("MMM YYYY"); // Group by month
      } else if (period === "yearly") {
        key = submissionDate.format("YYYY"); // Group by year
      }

      if (!groupedData[key]) {
        groupedData[key] = { period: key };
      }

      if (!groupedData[key][artwork.category]) {
        groupedData[key][artwork.category] = 0;
      }

      groupedData[key][artwork.category] += 1;
    });

    return Object.values(groupedData);
  };

  const chartData = processData(data, timePeriod);

  // Get unique categories for legend
  const categories = [...new Set(data.map((artwork) => artwork.category))];

  // Define custom colors for bars
  const barColors = ["#FFA500", "#16DBCC", "#4C78FF", "#FF82AC", "#A05195", "#F95D6A", "#D45087", "#FF7C43"];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-[70%] mx-auto"> {/* Adjusted width */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Artworks Category Chart</h3>
        <select
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* Legends placed above the chart */}
      <div className="flex flex-wrap gap-4 mb-4">
        {categories.map((category, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: barColors[index % barColors.length] }}
            ></div>
            <span className="text-sm" style={{ color: "#718EBF" }}>{category}</span>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={300}> {/* Adjusted height */}
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          {/* Horizontal grid lines (solid) */}
          <CartesianGrid
            horizontal={true}
            vertical={false} // Remove vertical grid lines
            stroke="#F3F3F5" // Custom color for horizontal lines
            strokeDasharray="0" // Solid lines
          />

          {/* X and Y axes */}
          <XAxis
            dataKey="period"
            tick={{ fill: "#718EBF", fontSize: 12 }} // Custom font color
            axisLine={false} // Remove axis line
            tickLine={false} // Remove tick lines
          />
          <YAxis
            tick={{ fill: "#718EBF", fontSize: 12 }} // Custom font color
            axisLine={false} // Remove axis line
            tickLine={false} // Remove tick lines
          />

          {/* Tooltip */}
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #ddd",
              borderRadius: "4px",
              color: "#718EBF",
            }}
          />

          {/* Bars with corner radius and custom colors */}
          {categories.map((category, index) => (
            <Bar
              key={index}
              dataKey={category}
              fill={barColors[index % barColors.length]} // Use custom colors
              radius={[5, 5, 5, 5]} // Rounded corners for bars (top and bottom)
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ArtworkSubmissionsChart;