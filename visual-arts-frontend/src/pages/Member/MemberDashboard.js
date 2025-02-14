import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../../redux/slices/projectsSlice";
import { fetchEvents } from "../../redux/slices/eventsSlice";
import { fetchNotifications } from "../../redux/slices/notificationsSlice";
import { fetchMemberStats } from "../../redux/slices/memberStatsSlice";
import Card from "../../components/Shared/Card";

const MemberDashboard = () => {
  const dispatch = useDispatch();

  const { projects } = useSelector((state) => state.projects);
  const { events } = useSelector((state) => state.events);
  const { notifications } = useSelector((state) => state.notifications);
  const { stats, loading: statsLoading, error: statsError } = useSelector((state) => state.memberStats);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchEvents());
    dispatch(fetchNotifications());
    dispatch(fetchMemberStats());
  }, [dispatch]);

  // Filter unread notifications
  const unreadNotifications = notifications.filter((notification) => !notification.read);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Member Dashboard</h1>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card title="Unread Notifications" value={unreadNotifications.length} bgColor="bg-yellow-100" />
        <Card title="Ongoing Projects" value={projects.length} bgColor="bg-green-100" />
        <Card title="Upcoming Events" value={events.length} bgColor="bg-blue-100" />
        <Card title="Total Artworks" value={stats?.total_artworks || 0} bgColor="bg-orange-100" />
      </div>

      {/* Notifications */}
      <h2 className="text-xl font-semibold mt-6">Unread Notifications</h2>
      <ul className="list-disc pl-6">
        {unreadNotifications.length > 0 ? (
          unreadNotifications.map((notification) => (
            <li key={notification.id}>
              {notification.message} - {notification.notification_type}
            </li>
          ))
        ) : (
          <p>No unread notifications</p>
        )}
      </ul>

      {/* Member Analytics */}
      <h2 className="text-xl font-semibold mt-6">My Analytics</h2>
      {statsLoading && <p>Loading stats...</p>}
      {statsError && <p className="text-red-500">{statsError}</p>}
      {stats && (
        <div>
          <p>
            <strong>Total Artworks:</strong> {stats.total_artworks}
          </p>
          <p>
            <strong>Approval Rate:</strong> {stats.approval_rate}%
          </p>
          <h3 className="text-lg mt-4">Category Distribution</h3>
          <ul className="list-disc pl-6">
            {stats.category_distribution.map((cat) => (
              <li key={cat.category}>
                {cat.category}: {cat.count}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Ongoing Projects */}
      <h2 className="text-xl font-semibold mt-6">Ongoing Projects</h2>
      <ul className="list-disc pl-6">
        {projects.length > 0 ? (
          projects.map((project) => <li key={project.id}>{project.title}</li>)
        ) : (
          <p>No ongoing projects</p>
        )}
      </ul>

      {/* Upcoming Events */}
      <h2 className="text-xl font-semibold mt-6">Upcoming Events</h2>
      <ul className="list-disc pl-6">
        {events.length > 0 ? (
          events.map((event) => (
            <li key={event.id}>
              {event.name} - {event.date}
            </li>
          ))
        ) : (
          <p>No upcoming events</p>
        )}
      </ul>
    </div>
  );
};

export default MemberDashboard;
