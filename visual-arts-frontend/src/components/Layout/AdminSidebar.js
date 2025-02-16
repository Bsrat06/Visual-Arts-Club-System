import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaBars, FaTimes, FaPaintBrush, FaUserCog, FaChartPie, FaImages, FaUser } from "react-icons/fa";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true); // Expand on larger screens
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize); // Cleanup
  }, []);
  
  // Sidebar Menu Based on User Role
  const sidebarLinks = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <FaChartPie /> },
    { path: "/admin/manage-artworks", label: "Manage Artworks", icon: <FaPaintBrush /> },
    { path: "/admin/manage-users", label: "Manage Users", icon: <FaUserCog /> },
    { path: "/admin/reports", label: "Reports", icon: <FaImages /> },
  ];

  return (
    <div className={`bg-white text-black md:w-64 ${isOpen ? "w-64" : "w-16"} transition-all duration-300 min-h-screen flex flex-col pt-16`}>
      {/* Toggle Button for Mobile */}
      <button className="md:hidden p-4 text-black focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar Menu */}
      <nav className={`${isOpen ? "block" : "hidden"} md:block`}>
        <ul className="space-y-2">
          {sidebarLinks.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-2 p-4 hover:bg-gray-300 transition ${location.pathname === item.path ? "bg-orange-500" : ""}`}
              >
                {item.icon}
                {isOpen && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
