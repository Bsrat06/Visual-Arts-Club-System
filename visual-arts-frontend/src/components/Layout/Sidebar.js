import React from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  PieChartOutlined,
  UserOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  ProjectOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const Sidebar = ({ collapsed, setCollapsed }) => {
  const userRole = useSelector((state) => state.auth?.role);

  const adminMenu = [
    { key: "1", path: "/admin/dashboard", label: "Dashboard", icon: <PieChartOutlined /> },
    { key: "2", path: "/admin/user-management", label: "Manage Users", icon: <UserOutlined /> },
    { key: "3", path: "/admin/manage-artworks", label: "Manage Artworks", icon: <AppstoreOutlined /> },
    { key: "4", path: "/admin/manage-events", label: "Manage Events", icon: <CalendarOutlined /> },
    { key: "5", path: "/admin/project-management", label: "Manage Projects", icon: <ProjectOutlined /> },
    { key: "6", path: "/settings", label: "Settings", icon: <SettingOutlined /> },
  ];

  const memberMenu = [
    { key: "1", path: "/member/dashboard", label: "My Dashboard", icon: <PieChartOutlined /> },
    { key: "2", path: "/member/portfolio", label: "My Portfolio", icon: <AppstoreOutlined /> },
    { key: "3", path: "/member/events", label: "My Events", icon: <CalendarOutlined /> },
    { key: "4", path: "/member/projects", label: "My Projects", icon: <ProjectOutlined /> },
    { key: "5", path: "/profile", label: "My Profile", icon: <UserOutlined /> },
    { key: "6", path: "/settings", label: "Settings", icon: <SettingOutlined /> },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      style={{ height: "100vh", transition: "width 0.3s ease" }} // ✅ Smooth transition
    >
      <div
        className="logo"
        style={{
          height: 64,
          textAlign: "center",
          padding: 16,
          color: "white",
          fontSize: 20,
          transition: "opacity 0.3s ease",
        }}
      >
        {collapsed ? "🖼️" : "ArtClub"}
      </div>

      <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
        {(userRole === "admin" ? adminMenu : memberMenu).map((item) => (
          <Menu.Item key={item.key} icon={item.icon}>
            <Link to={item.path}>{item.label}</Link>
          </Menu.Item>
        ))}
      </Menu>
    </Sider>
  );
};

export default Sidebar;
