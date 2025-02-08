import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Navbar = () => {
  const notifications = useSelector((state) => state.notifications.notifications);
  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const role = useSelector((state) => state.auth.role);

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <Link to="/" className="text-lg font-bold">Visual Arts System</Link>
      <div className="flex space-x-4">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        {role === "admin" && (
          <Link to="/admin/dashboard" className="hover:underline">Admin Panel</Link>
        )}
        {(role === "member" || role === "admin") && (
          <Link to="/member/dashboard" className="hover:underline">Member Dashboard</Link>
        )}
        <Link to="/notifications" className="relative">
          <span>Notifications: {unreadCount}</span>
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-sm px-2 py-1">
              {unreadCount}
            </span>
          )}
        </Link>
        <Link to="/profile">Profile</Link>
        <Link to="/member/portfolio">Portfolio</Link>
        <Link to="/member/event-registration">EventRegistration</Link>
      </div>
    </nav>
  );
};

export default Navbar;
