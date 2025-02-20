import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markNotificationAsRead,
  deleteNotification,
  markAllAsRead,
} from "../../redux/slices/notificationsSlice";
import { List, Card, Button, Typography, Space, Tag, Dropdown, Menu, Empty, Spin } from "antd";
import { BellOutlined, CheckOutlined, DeleteOutlined, FilterOutlined } from "@ant-design/icons";
import "../../styles/notifications.css";

const { Title, Text } = Typography;

const NotificationsList = () => {
  const dispatch = useDispatch();
  const { notifications, loading, error } = useSelector((state) => state.notifications);

  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true;
    return filter === "unread" ? !notification.read : notification.read;
  });

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const menu = (
    <Menu>
      <Menu.Item key="all" onClick={() => setFilter("all")}>
        <FilterOutlined /> All
      </Menu.Item>
      <Menu.Item key="unread" onClick={() => setFilter("unread")}>
        <FilterOutlined /> Unread
      </Menu.Item>
      <Menu.Item key="read" onClick={() => setFilter("read")}>
        <FilterOutlined /> Read
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="notifications-container p-6">
      {/* ✅ Page Title */}
      <Title level={2} className="page-title">Notifications</Title>

      {/* ✅ Action Buttons */}
      <div className="flex justify-between items-center mb-6">
        <Dropdown overlay={menu} trigger={["click"]}>
          <Button icon={<FilterOutlined />} className="filter-btn">
            Filter: {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </Button>
        </Dropdown>

        <Button onClick={handleMarkAllAsRead} type="primary" className="mark-all-btn">
          <CheckOutlined /> Mark All as Read
        </Button>
      </div>

      {/* ✅ Notifications List */}
      {loading ? (
        <Spin size="large" className="flex justify-center" />
      ) : error ? (
        <Text type="danger">{error}</Text>
      ) : filteredNotifications.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={filteredNotifications}
          renderItem={(notification) => (
            <Card className={`notification-card ${notification.read ? "read" : "unread"}`}>
              <List.Item>
                <List.Item.Meta
                  avatar={<BellOutlined className="notification-icon" />}
                  title={<Text className={`${notification.read ? "text-gray-500" : "text-black"} font-medium`}>{notification.message}</Text>}
                  description={<Tag color={notification.read ? "green" : "orange"}>{notification.read ? "Read" : "Unread"}</Tag>}
                />
                <Space>
                  {!notification.read && (
                    <Button
                      type="default"
                      className="mark-read-btn"
                      icon={<CheckOutlined />}
                      onClick={() => dispatch(markNotificationAsRead(notification.id))}
                    >
                      Mark as Read
                    </Button>
                  )}
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => dispatch(deleteNotification(notification.id))}
                  >
                    Delete
                  </Button>
                </Space>
              </List.Item>
            </Card>
          )}
        />
      ) : (
        <Empty description="No notifications available" />
      )}
    </div>
  );
};

export default NotificationsList;
