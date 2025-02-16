import React, { useState } from "react";
import { FaUserCircle, FaSignOutAlt, FaCog } from "react-icons/fa";
import { useSelector } from "react-redux";

const Navbar = ({ onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const role = useSelector((state) => state.auth.role); // Get the role from Redux
  
  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center fixed top-0 left-0 w-full z-50">
      {/* ✅ Dynamic Navbar Title Based on Role */}
      <h1 className="text-xl font-bold text-gray-800">
        {role === "admin" ? "Admin Panel" : "Member Dashboard"}
      </h1>

      {/* ✅ Profile Section */}
      <div className="relative">
        <button
          className="flex items-center space-x-2 focus:outline-none"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <img
            src={user?.profile_picture || "/default-avatar.png"}
            alt="Profile"
            className="w-8 h-8 rounded-full border"
          />
          <span className="hidden md:inline">{user?.first_name + " " + user?.last_name || "User"}</span>
        </button>

        {/* ✅ Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border shadow-lg rounded-md z-10">
            <ul className="py-2">
              <li>
                <a href="/settings" className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100">
                  <FaCog />
                  <span>Settings</span>
                </a>
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
    </header>
  );
};

export default Navbar;
