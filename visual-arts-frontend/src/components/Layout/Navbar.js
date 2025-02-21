import React from "react";
import { Layout, Avatar, Dropdown, Menu, Badge } from "antd";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  DownOutlined,
} from "@ant-design/icons";

const { Header } = Layout;

const Navbar = ({ onLogout, collapsed }) => {
  const user = useSelector((state) => state.auth.user);
  const userRole = useSelector((state) => state.auth.role);
  const notifications = useSelector((state) => state.notifications.notifications);

  // Count unread notifications
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const menu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/profile">
          <UserOutlined /> Profile
        </Link>
      </Menu.Item>
      <Menu.Item key="logout" onClick={onLogout}>
        <LogoutOutlined /> Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header
      className="flex justify-between items-center bg-white px-6 fixed top-0"
      style={{
        left: `${collapsed ? "80px" : "300px"}`,
        width: `calc(100% - ${collapsed ? "80px" : "300px"})`,
        height: "80px",
        transition: "all 0.3s ease",
        zIndex: 1,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Left Section - Greeting */}
      <div className="text-black font-medium" style={{ fontSize: "24px", flexGrow: 1 }}>
        Hello {user?.first_name || "User"} 👋🏼,
      </div>

      {/* Right Section - Notifications & Profile */}
      <div className="flex items-center space-x-6">
        {/* 🔔 Notifications */}
        <Link to="/notifications" className="relative mr-4">
          <Badge count={unreadCount} size="small">
            <BellOutlined style={{ fontSize: 20, color: "#333" }} />
          </Badge>
        </Link>

        {/* Profile Info & Dropdown */}
        <Dropdown overlay={menu} trigger={["click"]}>
          <div className="flex items-center cursor-pointer">
            {/* Avatar */}
            <Avatar
              src={user?.profile_picture ? `http://127.0.0.1:8000/${user.profile_picture}` : "default-avatar.jpg"}
              size={40}
              className="mr-3"
            />

            {/* User Info */}
            <div className="flex flex-col justify-center text-left">
              <span className="text-black text-[14px] font-medium leading-none">
                {user?.first_name} {user?.last_name}
              </span>
              <span className="text-[#757575] text-[12px] leading-none">
                Club {userRole?.charAt(0).toUpperCase() + userRole?.slice(1) || "Member"}
              </span>
            </div>

            {/* Dropdown Icon */}
            <DownOutlined style={{ marginLeft: "32px", fontSize: "14px", color: "#757575" }} />
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default Navbar;
