import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllArtworks } from "../../redux/slices/artworkSlice";
import { fetchAllUsers } from "../../redux/slices/userSlice";
import { fetchAllEvents } from "../../redux/slices/eventsSlice";
import { Card, Calendar, Typography, Spin, Modal } from "antd";
import { FloatButton } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "../../styles/admin-dashboard.css";
import StatsCards from "../../components/Shared/StatsCards";
import ArtworkSubmissionsChart from "../../components/Shared/ArtworkSubmissionsChart";
import MonthlyArtworkSubmissionsChart from "../../components/Shared/MonthlyArtworksSubmissionsChart";

const { Text } = Typography;

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

  const pendingArtworks = artworks.filter((artwork) => artwork.approval_status === "pending").length;

  const statsData = {
    newArtworks,
    newUsers,
    events: eventsThisMonth,
    pendingArtworks, // Total pending artworks
  };

  return (
    <div className="admin-dashboard p-6">
      <h2 className="text-black text-[22px] font-semibold font-[Poppins]">Admin Dashboard</h2>

      {/* Stats Cards */}
      <StatsCards data={statsData} />

      {/* Artwork Submissions by Category Chart */}
      <ArtworkSubmissionsChart data={artworks} />

      {/* Monthly Artwork Submissions Chart */}
      <MonthlyArtworkSubmissionsChart data={artworks} />

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