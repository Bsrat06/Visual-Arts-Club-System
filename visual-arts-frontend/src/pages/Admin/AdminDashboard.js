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
      const eventData = events.map(event => ({
        date: dayjs(event.date).format("YYYY-MM-DD"),
        title: event.title
      }));
      setMarkedEvents(eventData);
    }
  }, [events]);

  const dateCellRender = (value) => {
    const formattedDate = value.format("YYYY-MM-DD");
    const event = markedEvents.find(event => event.date === formattedDate);
    return event ? <Text type="warning">{event.title}</Text> : null;
  };

  const monthlySubmissions = artworks.reduce((acc, artwork) => {
    const month = dayjs(artwork.created_at).format("YYYY-MM");
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(monthlySubmissions).map(([month, count]) => ({
    month,
    count
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
  };

  return (
    <div className="admin-dashboard p-6">
      <h2 className="text-black text-[22px] font-semibold font-[Poppins]">Admin Dashboard</h2>
            
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
          <Card title="Pending Artworks">{artworkLoading ? <Spin /> : artworks.filter(a => a.approval_status === "pending").length}</Card>
          <Card title="Rejected Artworks">{artworkLoading ? <Spin /> : artworks.filter(a => a.approval_status === "rejected").length}</Card>

          <div className="line-chart-container">
            <Title level={4} className="chart-title">Monthly Artwork Submissions</Title>
            {artworkLoading ? <Spin /> : <Line {...lineChartConfig} />}
          </div>
        </div>
      </div>

      {/* ✅ Floating Calendar Button */}
      <FloatButton
        icon={<CalendarOutlined style={{ color: "black" }} />}
        onClick={() => setCalendarModalOpen(true)}
        style={{
          right: 24,
          bottom: 80, // Adjusted position (moved higher)
          backgroundColor: "white",
          border: "1px solid #ddd",
        }}
      />


      {/* ✅ Calendar Modal */}
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
