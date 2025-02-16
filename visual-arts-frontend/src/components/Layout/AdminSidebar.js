import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaPaintBrush, FaUserCog, FaChartPie, FaImages, FaCalendarAlt, FaProjectDiagram } from "react-icons/fa";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true); // Expand on larger screens
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`bg-gray-900 text-white md:w-64 ${isOpen ? "w-64" : "w-16"} transition-all duration-300 min-h-screen flex flex-col`}>
      <button className="md:hidden p-4 text-white focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Admin Sidebar Menu */}
      <nav className={`${isOpen ? "block" : "hidden"} md:block`}>
        <ul className="space-y-2">
          <li>
            <Link to="/admin/dashboard" className={`flex items-center space-x-2 p-4 hover:bg-gray-700 transition ${location.pathname === "/admin/dashboard" ? "bg-orange-500" : ""}`}>
              <FaChartPie />
              {isOpen && <span>Dashboard</span>}
            </Link>
          </li>
          <li>
            <Link to="/admin/manage-artworks" className={`flex items-center space-x-2 p-4 hover:bg-gray-700 transition ${location.pathname === "/admin/manage-artworks" ? "bg-orange-500" : ""}`}>
              <FaPaintBrush />
              {isOpen && <span>Manage Artworks</span>}
            </Link>
          </li>
          <li>
            <Link to="/admin/user-management" className={`flex items-center space-x-2 p-4 hover:bg-gray-700 transition ${location.pathname === "/admin/manage-users" ? "bg-orange-500" : ""}`}>
              <FaUserCog />
              {isOpen && <span>Manage Users</span>}
            </Link>
          </li>
          <li>
            <Link to="/admin/manage-events" className={`flex items-center space-x-2 p-4 hover:bg-gray-700 transition ${location.pathname === "/admin/manage-events" ? "bg-orange-500" : ""}`}>
              <FaCalendarAlt />
              {isOpen && <span>Manage Events</span>}
            </Link>
          </li>
          <li>
            <Link to="/admin/manage-projects" className={`flex items-center space-x-2 p-4 hover:bg-gray-700 transition ${location.pathname === "/admin/manage-projects" ? "bg-orange-500" : ""}`}>
              <FaProjectDiagram />
              {isOpen && <span>Manage Projects</span>}
            </Link>
          </li>
          <li>
            <Link to="/admin/reports" className={`flex items-center space-x-2 p-4 hover:bg-gray-700 transition ${location.pathname === "/admin/reports" ? "bg-orange-500" : ""}`}>
              <FaImages />
              {isOpen && <span>Reports</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
