import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaChartPie, FaPaintBrush, FaProjectDiagram, FaCalendarAlt, FaUser } from "react-icons/fa";

const MemberSidebar = () => {
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
    <div className={`bg-gray-900 text-white md:w-64 ${isOpen ? "w-64" : "w-16"} transition-all duration-300 min-h-screen flex flex-col`}>
      <button className="md:hidden p-4 text-white focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Member Sidebar Menu */}
      <nav className={`${isOpen ? "block" : "hidden"} md:block`}>
        <ul className="space-y-2">
          <li>
            <Link to="/member/dashboard" className={`flex items-center space-x-2 p-4 hover:bg-gray-700 transition ${location.pathname === "/member/dashboard" ? "bg-orange-500" : ""}`}>
              <FaChartPie />
              {isOpen && <span>Dashboard</span>}
            </Link>
          </li>
          <li>
            <Link to="/member/portfolio" className={`flex items-center space-x-2 p-4 hover:bg-gray-700 transition ${location.pathname === "/member/portfolio" ? "bg-orange-500" : ""}`}>
              <FaPaintBrush />
              {isOpen && <span>My Portfolio</span>}
            </Link>
          </li>
          <li>
            <Link to="/member/events" className={`flex items-center space-x-2 p-4 hover:bg-gray-700 transition ${location.pathname === "/member/events" ? "bg-orange-500" : ""}`}>
              <FaCalendarAlt />
              {isOpen && <span>My Events</span>}
            </Link>
          </li>
          <li>
            <Link to="/member/projects" className={`flex items-center space-x-2 p-4 hover:bg-gray-700 transition ${location.pathname === "/member/projects" ? "bg-orange-500" : ""}`}>
              <FaProjectDiagram />
              {isOpen && <span>My Projects</span>}
            </Link>
          </li>
          <li>
            <Link to="/profile" className={`flex items-center space-x-2 p-4 hover:bg-gray-700 transition ${location.pathname === "/profile" ? "bg-orange-500" : ""}`}>
              <FaUser />
              {isOpen && <span>My Profile</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default MemberSidebar;
