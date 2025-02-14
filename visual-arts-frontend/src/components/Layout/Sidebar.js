import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-white shadow fixed">
      <ul className="space-y-4 p-4">
        <li><Link to="/admin/dashboard" className="text-secondary">Dashboard</Link></li>
        <li><Link to="/admin/manage-artworks" className="text-secondary">Artworks</Link></li>
        <li><Link to="/admin/manage-events" className="text-secondary">Events</Link></li>
        <li><Link to="/admin/manage-projects" className="text-secondary">Projects</Link></li>
        <li><Link to="/admin/notifications" className="text-secondary">Notifications</Link></li>
      </ul>
    </aside>
  );
};

export default Sidebar;
