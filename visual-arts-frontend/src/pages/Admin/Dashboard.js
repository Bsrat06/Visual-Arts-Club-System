import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArtworks } from "../../redux/slices/artworkSlice";
import { fetchEvents } from "../../redux/slices/eventsSlice";
import { fetchProjects } from "../../redux/slices/projectsSlice";
import { fetchNotifications } from "../../redux/slices/notificationsSlice";
import { fetchUsers } from "../../redux/slices/userSlice";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { artworks } = useSelector((state) => state.artwork);
  const { events } = useSelector((state) => state.events);
  const { projects } = useSelector((state) => state.projects);
  const { notifications } = useSelector((state) => state.notifications);
  const { users } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchArtworks());
    dispatch(fetchEvents());
    dispatch(fetchProjects());
    dispatch(fetchNotifications());
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Link to="/admin/manage-artworks" className="bg-blue-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Artworks</h2>
          <p>Total: {artworks.length}</p>
        </Link>
        <Link to="/admin/manage-events" className="bg-green-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Events</h2>
          <p>Total: {events.length}</p>
        </Link>
        <Link to="/admin/project-management" className="bg-yellow-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Projects</h2>
          <p>Total: {projects.length}</p>
        </Link>
        <Link to="/admin/notifications" className="bg-red-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Notifications</h2>
          <p>Total: {notifications.length}</p>
        </Link>
        <Link to="/admin/user-management" className="bg-purple-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Users</h2>
          <p>Total: {users.length}</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
