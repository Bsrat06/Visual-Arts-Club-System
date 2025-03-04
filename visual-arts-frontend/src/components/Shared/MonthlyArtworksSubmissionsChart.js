import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import dayjs from "dayjs";

const MonthlyArtworkSubmissionsChart = ({ data }) => {
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
        groupedData[key] = { period: key, submissions: 0 };
      }

      groupedData[key].submissions += 1;
    });

    return Object.values(groupedData);
  };

  const chartData = processData(data, timePeriod);

  return (
    <div className="bg-white p-6 rounded-lg w-[40%]"> {/* Adjusted width */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Monthly Artwork Submissions</h3>
        <select
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}> {/* Adjusted height */}
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: -35, bottom: 5 }}> {/* Changed left margin to 0 */}
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

          {/* Line with data points */}
          <Line
            type="monotone"
            dataKey="submissions"
            stroke="#FFA500" // Custom line color
            strokeWidth={2} // Line thickness
            dot={{ fill: "#FFA500", r: 2 }} // Custom data points
            activeDot={{ r: 6 }} // Larger dot on hover
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyArtworkSubmissionsChart;