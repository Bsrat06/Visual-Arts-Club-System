import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../../redux/slices/projectsSlice";
import { fetchEvents } from "../../redux/slices/eventsSlice";
import { fetchNotifications } from "../../redux/slices/notificationsSlice";
import { fetchMemberStats } from "../../redux/slices/memberStatsSlice";
import Card from "../../components/Shared/Card";
import MemberSidebar from "../../components/Layout/MemberSidebar";


const MemberDashboard = () => {
  const dispatch = useDispatch();
  const { projects } = useSelector((state) => state.projects);
  const { events } = useSelector((state) => state.events);
  const { notifications } = useSelector((state) => state.notifications);
  const { stats, loading: statsLoading } = useSelector((state) => state.memberStats);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchEvents());
    dispatch(fetchNotifications());
    dispatch(fetchMemberStats());
  }, [dispatch]);

  const unreadNotifications = notifications.filter((notification) => !notification.read);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Member Dashboard</h1>

      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card title="Total Artworks" value={stats?.total_artworks || 0} bgColor="bg-blue-100" />
        <Card title="Approval Rate" value={`${stats?.approval_rate || 0}%`} bgColor="bg-green-100" />
        <Card title="Pending Notifications" value={unreadNotifications.length} bgColor="bg-yellow-100" />
      </div>

      {/* Projects & Events */}
      <h2 className="text-xl font-semibold mt-6">Ongoing Projects</h2>
      <ul>{projects.map((project) => <li key={project.id}>{project.title}</li>)}</ul>

      <h2 className="text-xl font-semibold mt-6">Upcoming Events</h2>
      <ul>{events.map((event) => <li key={event.id}>{event.name} - {event.date}</li>)}</ul>
    </div>
  );
};

export default MemberDashboard;
