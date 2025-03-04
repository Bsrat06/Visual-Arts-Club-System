// components/Shared/UserStatsCards.js

import React from "react";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

const UserStatsCards = ({ stats }) => {
  const getPercentageChange = (current, previous) => {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }
    return Math.round(((current - previous) / previous) * 100);
  };

  const renderPercentageChange = (current, previous) => {
    const percentage = getPercentageChange(current, previous);
    const isIncrease = percentage > 0;

    return (
      <span className={`text-xs align-middle ${isIncrease ? "text-green-500" : "text-red-500"}`}>
        {percentage}% {isIncrease ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-2">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-3 rounded-lg shadow-md">
          <div className="flex items-start">
            <div className={`relative w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-gray-100`}>
              <div className={`text-2xl ${stat.color}`}>{stat.icon}</div>
            </div>
            <div className="flex-1">
              <p className="text-gray-600 text-xs leading-4">{stat.title}</p>
              {stat.subtitle && <p className="text-gray-400 text-xs leading-4">{stat.subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center mt-1">
            <div className="w-10 mr-3"></div>
            <p className="text-xl font-bold mr-1">{stat.value}</p>
            {stat.previousValue !== undefined && renderPercentageChange(stat.value, stat.previousValue)}
          </div>
          {stat.progress !== undefined && (
            <div className="mt-1">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${stat.color}`}
                  style={{ width: `${stat.progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserStatsCards;