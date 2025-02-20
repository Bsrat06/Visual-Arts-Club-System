import React, { useEffect, useState } from "react";
import { Layout, Menu, Button } from "antd";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  PieChartOutlined,
  UserOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  ProjectOutlined,
  SettingOutlined,
  RightOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const Sidebar = ({ collapsed, setCollapsed }) => {
  const userRole = useSelector((state) => state.auth?.role);
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const adminMenu = [
    { key: "1", path: "/admin/dashboard", label: "Dashboard", icon: <PieChartOutlined /> },
    { key: "2", path: "/admin/user-management", label: "Manage Users", icon: <UserOutlined /> },
    { key: "3", path: "/admin/manage-artworks", label: "Manage Artworks", icon: <AppstoreOutlined /> },
    { key: "4", path: "/admin/manage-events", label: "Manage Events", icon: <CalendarOutlined /> },
    { key: "5", path: "/admin/project-management", label: "Manage Projects", icon: <ProjectOutlined /> },
    { key: "6", path: "/settings", label: "Settings", icon: <SettingOutlined /> },
  ];

  const memberMenu = [
    { key: "1", path: "/member/dashboard", label: "Dashboard", icon: <PieChartOutlined /> },
    { key: "2", path: "/member/portfolio", label: "My Portfolio", icon: <AppstoreOutlined /> },
    { key: "3", path: "/visitor/events", label: "Events", icon: <CalendarOutlined /> },
    { key: "4", path: "/visitor/projects", label: "Projects", icon: <ProjectOutlined /> },
    { key: "5", path: "/settings", label: "Settings", icon: <SettingOutlined /> },
  ];

  const menuItems = userRole === "admin" ? adminMenu : memberMenu;

  return (
    <>
      {/* Overlay Background on Small Screens */}
      {isMobile && !collapsed && (
        <div
          className="overlay"
          onClick={() => setCollapsed(true)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 99,
          }}
        ></div>
      )}

      <Sider
  width={300} // Full width when expanded
  collapsedWidth={80} // Ensure collapsed state is visible
  collapsed={collapsed}
  onCollapse={setCollapsed}
  breakpoint="md" // Collapse automatically on small screens
  style={{
    position: "fixed",
    height: "100vh",
    background: "#FFFFFF",
    boxShadow: "0px 10px 60px rgba(226, 236, 249, 0.5)",
    transition: "width 0.3s ease, left 0.3s ease",
    zIndex: 100,
    left: collapsed ? 0 : "0px", // Keep the sidebar visible in collapsed state
  }}
>

        {/* Collapse Button */}
        <div style={{ padding: "16px", display: "flex", justifyContent: "flex-start" }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "16px", color: "#333", padding: 0 }}
          />
        </div>

        {/* Sidebar Menu */}
        <Menu mode="inline" defaultSelectedKeys={["1"]} style={{ fontFamily: "Poppins, sans-serif", border: "none", fontSize: "14px", fontWeight: "500", letterSpacing: "-1%" }}>
          {menuItems.map((item) => (
            <Menu.Item
              key={item.key}
              icon={item.icon}
              style={{
                marginBottom: "15px",
                color: location.pathname === item.path ? "#FFFFFF" : "#9197B3",
                backgroundColor: location.pathname === item.path ? "#FFA500" : "transparent",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Link to={item.path} style={{ color: "inherit", display: "flex", alignItems: "center", width: "100%" }}>
                <span>{item.label}</span>
                <RightOutlined style={{ marginLeft: "auto", color: location.pathname === item.path ? "#FFFFFF" : "#9197B3" }} />
              </Link>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
    </>
  );
};

export default Sidebar;
