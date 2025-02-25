import React, { useState, useEffect } from "react";
import { Layout, Avatar, Dropdown, Menu, Badge, Modal, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { UserOutlined, LogoutOutlined, BellOutlined, DownOutlined, HeartOutlined } from "@ant-design/icons";
import { fetchNotifications } from "../../redux/slices/notificationsSlice";

const { Header } = Layout;

const Navbar = ({ onLogout, collapsed }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const userRole = useSelector((state) => state.auth.role);
  const notifications = useSelector((state) => state.notifications.notifications);

  const [isLoggedIn, setIsLoggedIn] = useState(!!user);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

  useEffect(() => {
    setUnreadCount(notifications.filter((notification) => !notification.read).length);
  }, [notifications]);

  // 🔹 Fetch notifications on component mount
  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

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
    <Menu>
      <Menu.Item key="profile">
        <Link to="/profile">
          <UserOutlined /> Profile
        </Link>
      </Menu.Item>
      <Menu.Item key="liked">
        <Link to="/member/portfolio?tab=liked">
          <HeartOutlined /> Liked Artworks
        </Link>
      </Menu.Item>
      <Menu.Item key="logout" onClick={confirmLogout} danger>
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
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div className="text-black font-medium" style={{ fontSize: "24px", flexGrow: 1 }}>
        {isLoggedIn && userRole !== "visitor" && `Hello ${user?.first_name || "User"} 👋🏼`}
      </div>

      <div className="flex items-center space-x-6">
        {/* 🔔 Notifications */}
        <Link to="/notifications" className="relative mr-4">
          <Badge count={unreadCount} size="small">
            <BellOutlined style={{ fontSize: 20, color: "#333" }} />
          </Badge>
        </Link>

        {/* Profile Info */}
        {isLoggedIn ? (
          <Dropdown overlay={menu} trigger={["click"]}>
            <div className="cursor-pointer flex items-center">
              <Avatar
                src={user?.profile_picture ? `http://127.0.0.1:8000/${user.profile_picture}` : "default-avatar.jpg"}
                size={40}
                className="mr-3"
              />
              <div className="flex flex-col justify-center text-left">
                <span className="text-black text-[14px] font-medium leading-none">
                  {user?.first_name} {user?.last_name}
                </span>
                <span className="text-[#757575] text-[12px] leading-none">
                  Club {userRole?.charAt(0).toUpperCase() + userRole?.slice(1) || "Member"}
                </span>
              </div>
              <DownOutlined style={{ marginLeft: "32px", fontSize: "14px", color: "#757575" }} />
            </div>
          </Dropdown>
        ) : (
          <div className="flex items-center space-x-6">
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
