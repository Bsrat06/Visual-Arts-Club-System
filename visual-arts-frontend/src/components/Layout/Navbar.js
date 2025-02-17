import React from "react";
import { Layout, Avatar, Dropdown, Menu } from "antd";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { SettingOutlined, LogoutOutlined, BellOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";

const { Header } = Layout;

const Navbar = ({ onLogout, collapsed, setCollapsed }) => {
  const user = useSelector((state) => state.auth.user);
  const userRole = useSelector((state) => state.auth.role);

  const menu = (
    <Menu>
      <Menu.Item key="settings">
        <Link to="/settings">
          <SettingOutlined /> Settings
        </Link>
      </Menu.Item>
      <Menu.Item key="logout" onClick={onLogout}>
        <LogoutOutlined /> Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header
      className="flex justify-between items-center bg-white shadow-sm px-6 fixed w-full z-10"
      style={{
        left: collapsed ? 80 : 200, // ✅ Adjust navbar position when sidebar collapses
        transition: "left 0.3s ease",
        width: `calc(100% - ${collapsed ? 80 : 200}px)`,
      }}
    >
      {/* Sidebar Toggle Button */}
      <div
        className="cursor-pointer text-lg"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </div>

      {/* Navbar Title */}
      <h1 className="text-xl font-bold">
        {userRole === "admin" ? "Admin Panel" : "Member Panel"}
      </h1>

      <div className="flex items-center space-x-6">
        {/* 🔔 Notifications */}
        <Link to="/notifications" className="relative">
          <BellOutlined style={{ fontSize: 20, color: "#333" }} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
            3
          </span>
        </Link>

        {/* Profile Dropdown */}
        <Dropdown menu={menu} trigger={["click"]}>
          <Avatar src={user?.profile_picture || "/default-avatar.png"} className="cursor-pointer" />
        </Dropdown>
      </div>
    </Header>
  );
};

export default Navbar;
