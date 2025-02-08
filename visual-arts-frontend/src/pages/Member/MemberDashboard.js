import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../../redux/slices/projectsSlice";
import { fetchEvents } from "../../redux/slices/eventsSlice";
import { fetchNotifications } from "../../redux/slices/notificationsSlice";

const MemberDashboard = () => {
  const dispatch = useDispatch();
  const { projects } = useSelector((state) => state.projects);
  const { events } = useSelector((state) => state.events);
  const { notifications } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchEvents());
    dispatch(fetchNotifications());
  }, [dispatch]);

  // Filter unread notifications
  const unreadNotifications = notifications.filter((notification) => !notification.read);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Member Dashboard</h1>

      {/* Notifications - Only Unread */}
      <h2 className="text-xl font-semibold mt-4">Unread Notifications</h2>
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

      {/* Ongoing Projects */}
      <h2 className="text-xl font-semibold mt-4">Ongoing Projects</h2>
      <ul className="list-disc pl-6">
        {projects.length > 0 ? (
          projects.map((project) => (
            <li key={project.id}>{project.title}</li>
          ))
        ) : (
          <p>No ongoing projects</p>
        )}
      </ul>

      {/* Upcoming Events */}
      <h2 className="text-xl font-semibold mt-4">Upcoming Events</h2>
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
