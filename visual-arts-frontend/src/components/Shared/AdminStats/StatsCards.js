import React from "react";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const StatsCards = ({ data }) => {
  const stats = [
    {
      title: "Total Users",
      value: data.totalUsers,
      icon: "👥",
      color: "text-blue-500",
      chartData: [
        { name: "Users", value: data.totalUsers },
        { name: "Members", value: data.totalMembers },
        { name: "Active", value: data.totalActiveUsers },
      ],
    },
    {
      title: "New Artworks",
      value: data.newArtworks,
      icon: "🎨",
      color: "text-green-500",
      chartData: [
        { name: "Artworks", value: data.newArtworks },
        { name: "Pending", value: data.pendingArtworks },
      ],
    },
    {
      title: "Events",
      value: data.events,
      icon: "📅",
      color: "text-purple-500",
      chartData: [{ name: "Events", value: data.events }],
    },
    {
      title: "Projects",
      value: data.projects,
      icon: "📂",
      color: "text-yellow-500",
      chartData: [{ name: "Projects", value: data.projects }],
    },
  ];

  const renderPercentageChange = (current, previous) => {
    if (!previous) return null;
    const percentage = Math.round(((current - previous) / previous) * 100);
    const isIncrease = percentage > 0;

    return (
      <span className={`text-xs ${isIncrease ? "text-green-500" : "text-red-500"}`}>
        {percentage}% {isIncrease ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-start">
            <div className={`relative w-12 h-12 rounded-full flex items-center justify-center mr-4 bg-gray-100`}>
              <div className={`text-3xl ${stat.color}`}>{stat.icon}</div>
            </div>
            <div className="flex-1">
              <p className="text-gray-600 text-sm leading-4">{stat.title}</p>
              <p className="text-gray-400 text-xs leading-4">This month</p>
            </div>
          </div>
          <div className="flex items-center mt-2">
            <p className="text-2xl font-bold mr-2">{stat.value}</p>
            {renderPercentageChange(stat.value, stat.previousValue)}
          </div>
          <div className="mt-4 h-20">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stat.chartData}>
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="value" fill={stat.color.replace("text-", "bg-")} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;