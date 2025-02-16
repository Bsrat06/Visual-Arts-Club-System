import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaPaintBrush,
  FaUserCog,
  FaChartPie,
  FaImages,
  FaCalendarAlt,
  FaProjectDiagram,
  FaChevronRight,
} from "react-icons/fa";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-[306px] bg-white shadow-[0_10px_60px_rgba(226,236,249,0.5)] h-screen flex flex-col p-4">
      {/* Toggle Button for Small Screens */}
      <button className="md:hidden p-4 text-gray-600 focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar Navigation */}
      <nav className={`${isOpen ? "block" : "hidden"} md:block flex flex-col justify-center flex-grow`}>
        <ul className="space-y-[15px] mt-16"> {/* Moves items slightly lower */}
          {[
            { path: "/admin/dashboard", icon: <FaChartPie />, label: "Dashboard" },
            { path: "/admin/manage-artworks", icon: <FaPaintBrush />, label: "Manage Artworks" },
            { path: "/admin/user-management", icon: <FaUserCog />, label: "Manage Users" },
            { path: "/admin/manage-events", icon: <FaCalendarAlt />, label: "Manage Events" },
            { path: "/admin/manage-projects", icon: <FaProjectDiagram />, label: "Manage Projects" },
            { path: "/admin/reports", icon: <FaImages />, label: "Reports" },
          ].map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex justify-between items-center p-4 rounded-lg text-[14px] transition-all ${
                  location.pathname === item.path
                    ? "bg-orange-500 text-white w-[250px]"
                    : "text-[#9197B3] hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  {isOpen && <span>{item.label}</span>}
                </div>
                {isOpen && <FaChevronRight />}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
