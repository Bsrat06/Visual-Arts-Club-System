import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications } from "../../redux/slices/notificationsSlice";

const NotificationsList = () => {
  const dispatch = useDispatch();
  const { notifications, loading, error } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Public Notifications</h1>
      {loading && <p>Loading notifications...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="list-disc pl-6">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <li key={notification.id}>
              {notification.message} - {notification.notification_type}
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
