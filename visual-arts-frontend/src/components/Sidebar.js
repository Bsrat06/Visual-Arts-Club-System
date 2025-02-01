import { Link } from "react-router-dom";
import { FaUser, FaImages, FaCalendar, FaProjectDiagram, FaCog } from "react-icons/fa";

export const Sidebar = () => {  // ✅ Named export
  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-5">
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      <ul className="space-y-3">
        <li><Link to="/admin/dashboard" className="flex items-center"><FaUser className="mr-2" /> Dashboard</Link></li>
        <li><Link to="/admin/artwork-approvals" className="flex items-center"><FaImages className="mr-2" /> Approve Artworks</Link></li>
        <li><Link to="/admin/manage-events" className="flex items-center"><FaCalendar className="mr-2" /> Manage Events</Link></li>
        <li><Link to="/admin/projects" className="flex items-center"><FaProjectDiagram className="mr-2" /> Projects</Link></li>
        <li><Link to="/settings" className="flex items-center"><FaCog className="mr-2" /> Settings</Link></li>
      </ul>
    </aside>
  );
};
