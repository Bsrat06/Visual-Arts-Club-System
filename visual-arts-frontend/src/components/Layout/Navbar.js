import React, { useState, useEffect } from "react";
import { Layout, Avatar, Dropdown, Menu, Badge, Modal, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import {
    UserOutlined,
    LogoutOutlined,
    BellOutlined,
    DownOutlined,
    HeartOutlined,
    HomeOutlined,
    InfoCircleOutlined,
    PictureOutlined,
    CalendarOutlined,
    ProjectOutlined
} from "@ant-design/icons";
import { fetchNotifications } from "../../redux/slices/notificationsSlice";
import API from "../../services/api";

const { Header } = Layout;

const Navbar = ({ onLogout, collapsed, selectedMenu }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const userRole = useSelector((state) => state.auth.role);
    const notifications = useSelector((state) => state.notifications.notifications);
    const [isLoggedIn, setIsLoggedIn] = useState(!!user);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const location = useLocation();

    useEffect(() => {
        setIsLoggedIn(!!user);
    }, [user]);

    useEffect(() => {
        setUnreadCount(notifications.filter((notification) => !notification.read).length);
    }, [notifications]);

    useEffect(() => {
        dispatch(fetchNotifications());
    }, [dispatch]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const confirmLogout = () => {
        Modal.confirm({
            title: "Are you sure you want to log out?",
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk() {
                onLogout();
                setIsLoggedIn(false);
            },
        });
    };

    const menu = (
        <Menu style={{ fontFamily: "'Poppins', sans-serif" }}>
            <Menu.Item key="profile">
                <Link to="/profile" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <UserOutlined /> Profile
                </Link>
            </Menu.Item>
            <Menu.Item key="liked">
                <Link to="/member/portfolio?tab=liked" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <HeartOutlined /> Liked Artworks
                </Link>
            </Menu.Item>
            <Menu.Item key="logout" onClick={confirmLogout} danger style={{ fontFamily: "'Poppins', sans-serif" }}>
                <LogoutOutlined /> Logout
            </Menu.Item>
        </Menu>
    );

    // Conditionally render the logo based on the user's login status and current page
    const showLogo = !isLoggedIn || location.pathname === "/home";

    return (
        <Header
            className="flex justify-between items-center bg-white px-6 fixed top-0"
            style={{
                left: isLoggedIn ? `${collapsed ? "80px" : "300px"}` : "0",
                width: isLoggedIn ? `calc(100% - ${collapsed ? "80px" : "300px"})` : "100%",
                height: "80px",
                transition: "all 0.3s ease",
                zIndex: 1,
                fontFamily: "'Poppins', sans-serif",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            {/* Left-aligned Logo */}
            {showLogo && (
                <div className="text-black font-semibold" style={{ fontSize: "22px", padding: "24px" }}>
                    <img src="/images/your-logo.png" alt="Logo" style={{ height: "40px" }} />
                </div>
            )}

            {/* Centered links */}
            <div className="flex items-center justify-center flex-grow">
                {!isLoggedIn && (
                    <div className="flex items-center space-x-4 md:space-x-10">
                        <Link to="/home" className="text-black hover:text-orange-500 text-sm md:text-base">
                            Home
                        </Link>
                        <Link to="/about" className="text-black hover:text-orange-500 text-sm md:text-base">
                            About
                        </Link>
                        <Link to="/visitor/gallery" className="text-black hover:text-orange-500 text-sm md:text-base">
                            Gallery
                        </Link>
                        <Link to="/visitor/events" className="text-black hover:text-orange-500 text-sm md:text-base">
                            Events
                        </Link>
                        <Link to="/visitor/projects" className="text-black hover:text-orange-500 text-sm md:text-base">
                            Projects
                        </Link>
                    </div>
                )}
            </div>

            {/* Right-aligned content (e.g., notifications, profile dropdown, login/register buttons) */}
            <div className="flex items-center space-x-6">
                {isLoggedIn && (
                    <Link to="/notifications" className="relative mr-4">
                        <Badge count={unreadCount} size="small">
                            <BellOutlined style={{ fontSize: 20, color: "#333" }} />
                        </Badge>
                    </Link>
                )}

                {isLoggedIn ? (
                    <Dropdown overlay={menu} trigger={["click"]}>
                        <div className="cursor-pointer flex items-center">
                            <Avatar
                                src={user?.profile_picture ? `http://127.0.0.1:8000/${user.profile_picture}` : "/default-avatar.png"}
                                size={40}
                                className="mr-3"
                            />
                            {!isMobile && (
                                <div className="flex flex-col justify-center text-left">
                                    <span className="text-black text-[14px] font-medium leading-none">
                                        {user?.first_name} {user?.last_name}
                                    </span>
                                    <span className="text-[#757575] text-[12px] leading-none">
                                        Club {userRole?.charAt(0).toUpperCase() + userRole?.slice(1) || "Member"}
                                    </span>
                                </div>
                            )}
                            {/* Hide the arrow on small screens */}
                            {!isMobile && (
                                <DownOutlined style={{ marginLeft: "32px", fontSize: "14px", color: "#757575" }} />
                            )}
                        </div>
                    </Dropdown>
                ) : (
                    <div className="flex items-center space-x-2 md:space-x-6">
                        <Link to="/login">
                            <Button className="add-artwork-btn" type="primary">Login</Button>
                        </Link>
                        <Link to="/register">
                            <Button type="default">Register</Button>
                        </Link>
                    </div>
                )}
            </div>
        </Header>
    );
};

export default Navbar;