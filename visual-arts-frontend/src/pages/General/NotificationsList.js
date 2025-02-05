import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markNotificationAsRead } from "../../redux/slices/notificationsSlice";

const NotificationsList = () => {
  const dispatch = useDispatch();
  const { notifications = [], loading, error } = useSelector((state) => state.notifications); // ✅ Default to []

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAsRead = (id) => {
    dispatch(markNotificationAsRead(id));
  };

  if (loading) return <p>Loading notifications...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      <ul className="space-y-4">
        {notifications.length > 0 ? ( // ✅ Check if notifications array is not empty
          notifications.map((notification) => (
            <li
              key={notification.id}
              className={`p-4 rounded shadow ${
                notification.read ? "bg-gray-200" : "bg-white"
              }`}
            >
              <p>{notification.message}</p>
              <small className="text-gray-500">
                {new Date(notification.created_at).toLocaleString()}
              </small>
              {!notification.read && (
                <button
                  onClick={() => handleMarkAsRead(notification.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                >
                  Mark as Read
                </button>
              )}
            </li>
          ))
        ) : (
          <p>No notifications to display.</p> // ✅ Handle empty notifications gracefully
        )}
      </ul>
    </div>
  );
};

export default NotificationsList;