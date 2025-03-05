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
import TopPerformingArtists from "../../components/Shared/TopPerformingArtists";

const { Text } = Typography;

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const { artworks, loading: artworkLoading } = useSelector((state) => state.artwork);
    const { users, loading: userLoading } = useSelector((state) => {
        console.log("Users from Redux:", state.users);
        return state.users;
    });
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
        pendingArtworks,
    };

    const artistsData = users.map((user) => {
        // Filter artworks created by the current user
        const artistArtworks = artworks.filter((artwork) => {
            return artwork.artist && user.pk && Number(artwork.artist) === Number(user.pk);
        });
    
        // Calculate total likes for the user's artworks
        const likes = artistArtworks.reduce((acc, artwork) => {
            return acc + (artwork.likes_count || 0); // Use likes_count from the backend
        }, 0);
    
        return {
            id: user.pk,
            name: user.first_name + " " + user.last_name || "Unknown Artist",
            profilePicture: user.profile_picture || "https://via.placeholder.com/40",
            uploads: artistArtworks.length,
            likes,
        };
    });

    return (
        <div className="admin-dashboard p-6">
            <h2 className="text-black text-[22px] font-semibold font-[Poppins]">Admin Dashboard</h2>
    
            <StatsCards data={statsData} />
            <TopPerformingArtists artists={artistsData} />
            <MonthlyArtworkSubmissionsChart data={artworks} />
            <ArtworkSubmissionsChart data={artworks} />
    
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