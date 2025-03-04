// admindashboard.js

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllArtworks } from "../../redux/slices/artworkSlice";
import { fetchAllUsers } from "../../redux/slices/userSlice";
import { fetchAllEvents } from "../../redux/slices/eventsSlice";
import { Card, Tabs, Calendar, Typography, Spin, Modal } from "antd";
import { Line } from "@ant-design/plots";
import { FloatButton } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "../../styles/admin-dashboard.css";
import AnalyticsDashboard from "./AnalyticsDashboard";
import StatsCards from "../../components/Shared/StatsCards";

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { artworks, loading: artworkLoading } = useSelector((state) => state.artwork);
  const { users, loading: userLoading } = useSelector((state) => state.users);
  const { events, loading: eventsLoading } = useSelector((state) => state.events);

  const [markedEvents, setMarkedEvents] = useState([]);
  const [isCalendarModalOpen, setCalendarModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAllArtworks());
    dispatch(fetchAllUsers());
    dispatch(fetchAllEvents());
  }, [dispatch]);

  useEffect(() => {
    if (events.length > 0) {
      const eventData = events.map((event) => ({
        date: dayjs(event.date).format("YYYY-MM-DD"),
        title: event.title,
      }));
      setMarkedEvents(eventData);
    }
  }, [events]);

  const dateCellRender = (value) => {
    const formattedDate = value.format("YYYY-MM-DD");
    const event = markedEvents.find((event) => event.date === formattedDate);
    return event ? <Text type="warning">{event.title}</Text> : null;
  };

  const monthlySubmissions = artworks.reduce((acc, artwork) => {
    if (artwork.submission_date) {
      try {
        const submissionDate = dayjs(artwork.submission_date);
        if (submissionDate.isValid()) {
          const month = submissionDate.format("YYYY-MM");
          acc[month] = (acc[month] || 0) + 1;
        } else {
          console.error("Invalid date:", artwork.submission_date);
        }
      } catch (error) {
        console.error("Date parsing error:", error);
      }
    } else {
      console.warn("submission_date is undefined for artwork:", artwork.id);
    }
    return acc;
  }, {});

  const chartData = Object.entries(monthlySubmissions).map(([month, count]) => ({
    month,
    count,
  }));

  const lineChartConfig = {
    data: chartData,
    xField: "month",
    yField: "count",
    height: 300,
    width: 500,
    smooth: true,
    color: "#FFA500",
    point: {
      size: 5,
      shape: "circle",
      style: {
        fill: "#FFA500",
        stroke: "#FFF",
        lineWidth: 2,
      },
    },
    xAxis: {
      label: {
        formatter: (val) => dayjs(val, "YYYY-MM").format("MMM YYYY"),
      },
    },
  };

  // Calculate stats for the StatsCards component
  const currentMonth = dayjs().format("YYYY-MM");
  const newArtworks = artworks.filter((artwork) => {
    const submissionDate = dayjs(artwork.submission_date);
    return submissionDate.isValid() && submissionDate.format("YYYY-MM") === currentMonth;
  }).length;

  const newUsers = users.filter((user) => {
    const joinDate = dayjs(user.date_joined);
    return joinDate.isValid() && joinDate.format("YYYY-MM") === currentMonth;
  }).length;

  const eventsThisMonth = events.filter((event) => {
    const eventDate = dayjs(event.date);
    return eventDate.isValid() && eventDate.format("YYYY-MM") === currentMonth;
  }).length;

  const approvedArtworks = artworks.filter((artwork) => artwork.approval_status === "approved").length;
  const approvalRate = artworks.length > 0 ? Math.round((approvedArtworks / artworks.length) * 100) : 0;

  const statsData = {
    newArtworks,
    newUsers,
    events: eventsThisMonth,
    approvalRate,
  };

  return (
    <div className="admin-dashboard p-6">
      <h2 className="text-black text-[22px] font-semibold font-[Poppins]">Admin Dashboard</h2>

      {/* Add StatsCards component here */}
      <StatsCards data={statsData} />

      <Tabs defaultActiveKey="1" className="custom-tabs">
        <TabPane tab="Overview" key="1">
          <p>Detailed Overview of Activities...</p>
        </TabPane>
        <TabPane tab="Analytics" key="2">
          <AnalyticsDashboard />
        </TabPane>
      </Tabs>

      <div className="dashboard-grid">
        <div className="stats-section">
          <Card title="Total Artworks">{artworkLoading ? <Spin /> : artworks.length}</Card>
          <Card title="Total Users">{userLoading ? <Spin /> : users.length}</Card>
          <Card title="Pending Artworks">
            {artworkLoading ? (
              <Spin />
            ) : (
              artworks.filter((a) => a.approval_status === "pending").length
            )}
          </Card>
          <Card title="Rejected Artworks">
            {artworkLoading ? (
              <Spin />
            ) : (
              artworks.filter((a) => a.approval_status === "rejected").length
            )}
          </Card>

          <div className="line-chart-container">
            <Title level={4} className="chart-title">
              Monthly Artwork Submissions
            </Title>
            {artworkLoading ? <Spin /> : <Line {...lineChartConfig} />}
          </div>
        </div>
      </div>

      {/* Floating Calendar Button */}
      <FloatButton
        icon={<CalendarOutlined style={{ color: "black" }} />}
        onClick={() => setCalendarModalOpen(true)}
        style={{
          right: 24,
          bottom: 80,
          backgroundColor: "white",
          border: "1px solid #ddd",
        }}
      />

      {/* Calendar Modal */}
      <Modal
        title="Upcoming Events Calendar"
        visible={isCalendarModalOpen}
        onCancel={() => setCalendarModalOpen(false)}
        footer={null}
        centered
      >
        <Calendar dateCellRender={dateCellRender} className="custom-calendar" />
      </Modal>
    </div>
  );
};

export default AdminDashboard;