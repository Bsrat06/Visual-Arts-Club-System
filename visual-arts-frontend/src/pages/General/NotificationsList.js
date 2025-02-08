import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllAsRead,
  deleteNotification,
} from "../../redux/slices/notificationsSlice";

const NotificationsList = () => {
  const dispatch = useDispatch();
  const { notifications = [], loading, error } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAsRead = (id) => {
    dispatch(markNotificationAsRead(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  if (loading) return <p>Loading notifications...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mt-4">Notifications</h2>
      <button
        onClick={handleMarkAllAsRead}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        Mark All as Read
      </button>
      <ul className="list-disc pl-6">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <li key={notification.id} className={notification.read ? "text-gray-500" : "text-black"}>
              <div className="flex justify-between items-center">
                <div>
                  {notification.message} - {notification.notification_type} - {notification.read ? "Read" : "Unread"}
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
          ))
        ) : (
          <p>No notifications available</p>
        )}
      </ul>
    </div>
  );
};

export default NotificationsList;
