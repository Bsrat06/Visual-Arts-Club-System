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
    HomeOutlined,
    PictureOutlined,
    ProfileOutlined,
} from "@ant-design/icons";
import logo from '../../assets/images/logo.png';

const { Sider } = Layout;

const Sidebar = ({ collapsed, setCollapsed, onMenuSelect }) => {
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
        { key: "6", path: "/member/portfolio", label: "Portfolio", icon: <ProfileOutlined /> },
    ];

    const memberMenu = [
        { key: "1", path: "/member/dashboard", label: "Dashboard", icon: <PieChartOutlined /> },
        { key: "2", path: "/member/portfolio", label: "Portfolio", icon: <ProfileOutlined /> },
        { key: "3", path: "/visitor/events", label: "Events", icon: <CalendarOutlined /> },
        { key: "4", path: "/visitor/projects", label: "Projects", icon: <ProjectOutlined /> },
    ];

    const commonMenu = [
        { key: "8", path: "/", label: "Home", icon: <HomeOutlined /> },
        { key: "9", path: "/visitor/gallery", label: "Gallery", icon: <PictureOutlined /> },
        { key: "11", path: "/settings", label: "Settings", icon: <SettingOutlined /> },
    ];

    const handleMenuSelect = (key) => {
        const selectedItem = [...adminMenu, ...memberMenu, ...commonMenu].find((item) => item.key === key);
        if (selectedItem && onMenuSelect) {
            onMenuSelect(selectedItem.label);
        }
    };

    return (
        <>
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
                width={300}
                collapsedWidth={80}
                collapsed={collapsed}
                onCollapse={setCollapsed}
                breakpoint="md"
                style={{
                    position: "fixed",
                    height: "100vh",
                    background: "#FFFFFF",
                    boxShadow: "0px 10px 60px rgba(226, 236, 249, 0.5)",
                    transition: "left 0.3s ease",
                    zIndex: 100,
                    left: isMobile && collapsed ? "-300px" : 0,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: collapsed ? "column" : "row",
                        alignItems: "center",
                        justifyContent: collapsed ? "center" : "space-between",
                        padding: "0px",
                        paddingBottom: collapsed ? "10px" : "0px",
                    }}
                >
                    <div className="text-black font-semibold" style={{ fontSize: "24px", padding: "0px" }}>
                        <img src={logo} style={{ height: "80px" }} alt="Logo" />
                    </div>

                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: "16px", color: "#333", padding: 0 }}
                    />
                </div>

                <Menu
                    mode="inline"
                    defaultSelectedKeys={[location.pathname]}
                    selectedKeys={[location.pathname]}
                    onSelect={({ key }) => handleMenuSelect(key)}
                    style={{
                        fontFamily: "Poppins, sans-serif",
                        border: "none",
                        fontSize: "14px",
                        fontWeight: "500",
                        letterSpacing: "-1%",
                        marginTop: collapsed ? "10px" : "20px",
                    }}
                >
                    {!collapsed && (
                        <div style={{ padding: "10px 20px", fontWeight: "bold", fontSize: "14px", color: "#9197B3" }}>
                            General
                        </div>
                    )}
                    {commonMenu.map((item) => (
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
                                <RightOutlined
                                    style={{
                                        marginLeft: "auto",
                                        color: location.pathname === item.path ? "#FFFFFF" : "#9197B3",
                                    }}
                                />
                            </Link>
                        </Menu.Item>
                    ))}

                    {(userRole === "admin" || userRole === "manager") && !collapsed && (
                        <div style={{ padding: "10px 20px", fontWeight: "bold", fontSize: "14px", color: "#9197B3" }}>
                            Admin
                        </div>
                    )}
                    {(userRole === "admin" || userRole === "manager") &&
                        adminMenu.map((item) => (
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
                                    <RightOutlined
                                        style={{
                                            marginLeft: "auto",
                                            color: location.pathname === item.path ? "#FFFFFF" : "#9197B3",
                                        }}
                                    />
                                </Link>
                            </Menu.Item>
                        ))}

                    {userRole !== "admin" && userRole !== "manager" &&
                        memberMenu.map((item) => (
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
                                    <RightOutlined
                                        style={{
                                            marginLeft: "auto",
                                            color: location.pathname === item.path ? "#FFFFFF" : "#9197B3",
                                        }}
                                    />
                                </Link>
                            </Menu.Item>
                        ))}
                </Menu>
            </Sider>
        </>
    );
};

export default Sidebar;