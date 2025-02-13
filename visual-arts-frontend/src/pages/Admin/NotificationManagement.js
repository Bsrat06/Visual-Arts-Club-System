import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  deleteNotification,
  markNotificationAsRead,
  markAllAsRead,
} from "../../redux/slices/notificationsSlice";
import NotificationForm from "../../components/Admin/NotificationForm";

const NotificationManagement = () => {
  const dispatch = useDispatch();
  const { notifications, loading, error } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAsRead = (id) => {
    dispatch(markNotificationAsRead(id));
  };

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
            <div className="flex justify-between items-center">
              <div>
                {notification.message} - {notification.notification_type} -{" "}
                {notification.read ? "Read" : "Unread"}
              </div>
              <div>
                {!notification.read && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="bg-blue-500 text-white px-2 py-1 rounded ml-2"
                  >
                    Mark as Read
                  </button>
                )}
                <button
                  onClick={() => dispatch(deleteNotification(notification.id))}
                  className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationManagement;
