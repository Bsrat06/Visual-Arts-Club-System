import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  deleteNotification,
  markAllAsRead,
} from "../../redux/slices/notificationsSlice";
import NotificationForm from "../../components/NotificationForm";
import "../../styles/styles.css"; // Adjust the path if necessary



const NotificationManagement = () => {
  const dispatch = useDispatch();
  const { notifications, loading, error } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Notifications</h1>
      <NotificationForm />
      <button
        onClick={handleMarkAllAsRead}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        Mark All as Read
      </button>
      {loading && <p>Loading notifications...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="list-disc pl-6">
        {notifications.map((notification) => (
          <li key={notification.id} className={notification.read ? "text-gray-500" : "text-black"}>
            {notification.message} - {notification.notification_type} -{" "}
            {notification.read ? "Read" : "Unread"}
            <button
              onClick={() => dispatch(deleteNotification(notification.id))}
              className="text-red-500 ml-2"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

    </div>
  );
};

export default NotificationManagement;
