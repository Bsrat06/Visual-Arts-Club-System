import React from "react";
import { Layout, Avatar, Dropdown, Menu } from "antd";
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
        left: `${collapsed ? "80px" : "300px"}`, // Adjust based on sidebar width
        width: `calc(100% - ${collapsed ? "80px" : "300px"})`, // Adjust width dynamically
        height: "80px",
        transition: "all 0.3s ease", // Smooth transition
        zIndex: 100, // Ensure it's above sidebar
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Left Section - Greeting */}
      <div
        className="text-black font-medium"
        style={{
          fontStyle: "poppins",
          fontSize: "24px",
          letterSpacing: "0%",
          flexGrow: 1,
        }}
      >
        Hello {user?.first_name || "User"} 👋🏼,
      </div>

      {/* Right Section - Notifications & Profile */}
      <div className="flex items-center space-x-6">
        {/* 🔔 Notifications */}
        <Link to="/notifications" className="relative mr-4">
          <BellOutlined style={{ fontSize: 20, color: "#333" }} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
            3
          </span>
        </Link>

        {/* Profile Info & Dropdown */}
        <Dropdown overlay={menu} trigger={["click"]}>
          <div className="flex items-center cursor-pointer">
            {/* Avatar */}
            <Avatar
              src={user?.profile_picture || "/default-avatar.png"}
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
            <DownOutlined
              style={{
                width: "40px",
                color: "#757575",
                fontSize: "14px",
                fontWeight: "bold",
                marginLeft: "32px",
              }}
            />
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default Navbar;
