import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markNotificationAsRead,
  deleteNotification,
  markAllAsRead,
} from "../../redux/slices/notificationsSlice";
import NotificationBadge from "../../components/Shared/NotificationBadge";
import Loading from "../../components/Shared/Loading";
import Error from "../../components/Shared/Error";

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

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>

      {loading && <Loading />}
      {error && <Error message={error} />}

      <div className="flex justify-between items-center mb-4">
        <div className="space-x-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded ${filter === "all" ? "bg-orange-500 text-white" : "bg-gray-200"}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded ${filter === "unread" ? "bg-orange-500 text-white" : "bg-gray-200"}`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilter("read")}
            className={`px-4 py-2 rounded ${filter === "read" ? "bg-orange-500 text-white" : "bg-gray-200"}`}
          >
            Read
          </button>
        </div>
        <button
          onClick={handleMarkAllAsRead}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Mark All as Read
        </button>
      </div>

      <ul className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <li key={notification.id} className="p-4 bg-white shadow rounded flex justify-between items-center">
              <div>
                <NotificationBadge type={notification.notification_type} />
                <p className={`${notification.read ? "text-gray-500" : "text-black"} mt-2`}>
                  {notification.message}
                </p>
              </div>
              <div className="space-x-2">
                {!notification.read && (
                  <button
                    onClick={() => dispatch(markNotificationAsRead(notification.id))}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Mark as Read
                  </button>
                )}
                <button
                  onClick={() => dispatch(deleteNotification(notification.id))}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <p>No notifications available.</p>
        )}
      </ul>
    </div>
  );
};

export default NotificationsList;
