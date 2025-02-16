import React, { useState, useEffect } from "react";
import { FaUserCircle, FaSignOutAlt, FaCog, FaBell, FaChevronDown } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "../../styles/AdminSidebar.css";

const Navbar = ({ onLogout, isSidebarCollapsed }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const role = useSelector((state) => state.auth.role);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header
      className={`bg-white px-6 py-4 flex items-center fixed top-0 transition-all duration-300 ${
        isSidebarCollapsed ? "left-[80px] w-[calc(100%-80px)]" : "left-[306px] w-[calc(100%-306px)]"
      } z-40`}
    >

      {/* ✅ Dynamic Navbar Title */}
      <h1
        className={`text-xl font-medium text-gray-800 transition-all duration-300 ${
          isMobile ? "text-center w-full" : ""
        }`}
      >
        {role === "member" || role === "admin"
          ? "Hello " + user.first_name + " 👋🏼,"
          : "Visitor Dashboard"}
      </h1>

      {/* ✅ Profile & Notifications */}
      <div className="flex items-center ml-auto space-x-6">
        {/* 🔔 Notification Icon */}
        <Link to="/notifications" className="relative">
          <FaBell className="text-gray-600 text-[20px] cursor-pointer" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
            3
          </span>
        </Link>

        {/* 👤 Profile Section */}
        <div className="relative">
          <button
            className="flex items-center space-x-2 focus:outline-none"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {/* Profile Picture */}
            <img
              src={user?.profile_picture || "/default-avatar.png"}
              alt="Profile"
              className="w-[42px] h-[42px] rounded-full border"
            />
            {/* Show name and dropdown only on larger screens */}
            {!isMobile && (
              <>
                <div className="text-left">
                  <p className="text-[14px] text-black font-medium">
                    {user?.first_name + " " + user?.last_name || "User"}
                  </p>
                  <p className="text-[12px] text-[#757575]">{"Club " + role || "Role"}</p>
                </div>
                <FaChevronDown className="text-gray-600 text-[16px]" />
              </>
            )}
          </button>

          {/* 🔽 Dropdown Menu */}
          {dropdownOpen && !isMobile && (
            <div className="absolute right-0 mt-2 w-48 bg-white border shadow-lg rounded-md z-10">
              <ul className="py-2">
                <li>
                  <Link to="/settings" className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100">
                    <FaCog />
                    <span>Settings</span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={onLogout}
                    className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 w-full text-left"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
