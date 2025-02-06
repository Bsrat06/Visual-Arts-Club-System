import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markNotificationAsRead, deleteNotification } from "../../redux/slices/notificationsSlice";


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
      <h2 className="text-xl font-semibold mt-4">Notifications</h2>
{loading && <p>Loading notifications...</p>}
{error && <p className="text-red-500">{error}</p>}
<ul className="list-disc pl-6">
  {Array.isArray(notifications) && notifications.length > 0 ? (
    notifications.map((notification) => (
      <li key={notification.id}>
        {notification.message} - {notification.notification_type}
        <button
          onClick={() => dispatch(deleteNotification(notification.id))}
          className="text-red-500 ml-2"
        >
          Delete
        </button>
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