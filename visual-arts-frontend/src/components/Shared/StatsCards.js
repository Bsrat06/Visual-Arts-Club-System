import React, { useEffect, useState } from "react";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

const StatsCards = ({ data }) => {
  const [previousMonthData, setPreviousMonthData] = useState({
    newArtworks: 0,
    newUsers: 0,
    events: 0,
    pendingArtworks: 0, // Add pending artworks to previous month data
  });

  useEffect(() => {
    const fetchPreviousMonthData = async () => {
      const previousMonth = new Date();
      previousMonth.setMonth(previousMonth.getMonth() - 1);
      const previousMonthString = `${previousMonth.getFullYear()}-${(
        previousMonth.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}`;

      const currentMonth = new Date();
      const currentMonthString = `${currentMonth.getFullYear()}-${(
        currentMonth.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}`;

      const fetchArtworks = async () => {
        let allArtworks = [];
        let nextPage = "artwork/";

        while (nextPage) {
          const response = await fetch(nextPage);
          const data = await response.json();
          allArtworks = [...allArtworks, ...data.results];
          nextPage = data.next;
        }

        const prevMonthArtworks = allArtworks.filter((artwork) => {
          const submissionDate = new Date(artwork.submission_date);
          const submissionMonthString = `${submissionDate.getFullYear()}-${(
            submissionDate.getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}`;
          return submissionMonthString === previousMonthString;
        }).length;

        const pendingArtworks = allArtworks.filter(
          (artwork) => artwork.approval_status === "pending"
        ).length;

        return { artworks: prevMonthArtworks, pendingArtworks };
      };

      const fetchUsers = async () => {
        let allUsers = [];
        let nextPage = "users/";

        while (nextPage) {
          const response = await fetch(nextPage);
          const data = await response.json();
          allUsers = [...allUsers, ...data.results];
          nextPage = data.next;
        }

        const prevMonthUsers = allUsers.filter((user) => {
          const joinDate = new Date(user.date_joined);
          const joinMonthString = `${joinDate.getFullYear()}-${(
            joinDate.getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}`;
          return joinMonthString === previousMonthString;
        }).length;

        return prevMonthUsers;
      };

      const fetchEvents = async () => {
        let allEvents = [];
        let nextPage = "events/";

        while (nextPage) {
          const response = await fetch(nextPage);
          const data = await response.json();
          allEvents = [...allEvents, ...data.results];
          nextPage = data.next;
        }

        const prevMonthEvents = allEvents.filter((event) => {
          const eventDate = new Date(event.date);
          const eventMonthString = `${eventDate.getFullYear()}-${(
            eventDate.getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}`;
          return eventMonthString === previousMonthString;
        }).length;

        return prevMonthEvents;
      };

      const [artworksData, usersData, eventsData] = await Promise.all([
        fetchArtworks(),
        fetchUsers(),
        fetchEvents(),
      ]);

      setPreviousMonthData({
        newArtworks: artworksData.artworks,
        newUsers: usersData,
        events: eventsData,
        pendingArtworks: artworksData.pendingArtworks, // Set total pending artworks
      });
    };

    fetchPreviousMonthData();
  }, []);

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
      <span className={`text-xs ${isIncrease ? "text-green-500" : "text-red-500"}`}>
        {percentage}% {isIncrease ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
      </span>
    );
  };

  const stats = [
    {
      title: "New Artworks",
      value: data.newArtworks,
      icon: "🎨",
      progress: data.newArtworks,
      color: "text-blue-500",
      previousValue: previousMonthData.newArtworks,
    },
    {
      title: "New Users",
      value: data.newUsers,
      icon: "👤",
      progress: data.newUsers,
      color: "text-green-500",
      previousValue: previousMonthData.newUsers,
    },
    {
      title: "Events",
      value: data.events,
      icon: "📅",
      progress: data.events,
      color: "text-purple-500",
      previousValue: previousMonthData.events,
    },
    {
      title: "Pending Artworks",
      value: data.pendingArtworks, // Use total pending artworks
      icon: "⏳",
      progress: data.pendingArtworks,
      color: "text-yellow-500",
      previousValue: previousMonthData.pendingArtworks,
    },
  ];

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
          <div className="w-12 mr-4"></div> {/* Spacer to align numbers */}
          <div className="flex items-center">
            <p className="text-2xl font-bold mr-2">{stat.value}</p>
            {typeof stat.value === "string"
              ? renderPercentageChange(stat.value.replace("%", ""), stat.previousValue)
              : renderPercentageChange(stat.value, stat.previousValue)}
          </div>
          <div className="mt-1">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${stat.color}`}
                style={{ width: `${stat.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;