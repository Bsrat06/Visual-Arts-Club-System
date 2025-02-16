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
    <div
      className={`fixed left-0 top-0 h-screen bg-white shadow-[4px_0px_10px_rgba(0,0,0,0.1)] p-4 z-50 transition-all ${
        isOpen ? "w-[306px]" : "w-[80px]"
      }`}
    >
      {/* Toggle Button for Small Screens */}
      <button
        className="md:hidden p-4 text-gray-600 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar Navigation */}
      <nav className="flex flex-col flex-grow">
        <h1 className={`text-xl font-bold text-gray-800 ${!isOpen && "hidden"}`}>
          Admin
        </h1>
        <ul className="space-y-[12px] mt-16">
          {[
            { path: "/admin/dashboard", icon: <FaChartPie />, label: "Dashboard" },
            { path: "/admin/manage-artworks", icon: <FaPaintBrush />, label: "Manage Artworks" },
            { path: "/admin/user-management", icon: <FaUserCog />, label: "Manage Users" },
            { path: "/admin/manage-events", icon: <FaCalendarAlt />, label: "Manage Events" },
            { path: "/admin/project-management", icon: <FaProjectDiagram />, label: "Manage Projects" },
            { path: "/admin/reports", icon: <FaImages />, label: "Reports" },
          ].map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center p-4 rounded-lg text-[14px] transition-all ${
                  location.pathname === item.path
                    ? "bg-orange-500 text-white w-full"
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
