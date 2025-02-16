import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  FaBars, 
  FaTimes, 
  FaChartPie, 
  FaPaintBrush, 
  FaProjectDiagram, 
  FaCalendarAlt, 
  FaUser, 
  FaChevronRight 
} from "react-icons/fa";
import "../../styles/MemberSidebar.css";

const MemberSidebar = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`fixed left-0 top-0 h-screen flex flex-col p-4 z-50 transition-all ${isOpen ? "w-[306px] bg-white shadow-[4px_0px_10px_rgba(0,0,0,0.1)]" : "w-[80px] bg-white shadow-md"}`}>
      {/* Toggle Button */}
      <button className="md:hidden p-4 text-gray-600 focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar Navigation */}
      <nav className="flex flex-col flex-grow">
        {isOpen && <h1 className="text-xl font-bold text-gray-800">Member</h1>}
        <ul className="space-y-[12px] mt-6">
          {[
            { path: "/member/dashboard", icon: <FaChartPie />, label: "Dashboard" },
            { path: "/member/portfolio", icon: <FaPaintBrush />, label: "My Portfolio" },
            { path: "/member/events", icon: <FaCalendarAlt />, label: "My Events" },
            { path: "/member/projects", icon: <FaProjectDiagram />, label: "My Projects" },
            { path: "/profile", icon: <FaUser />, label: "My Profile" },
          ].map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center p-4 rounded-lg text-[14px] transition-all ${
                  location.pathname === item.path
                    ? "bg-orange-500 text-white"
                    : "text-[#9197B3] hover:bg-gray-100"
                } ${isOpen ? "justify-between w-[250px]" : "justify-center w-[50px]"}`}
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

export default MemberSidebar;
