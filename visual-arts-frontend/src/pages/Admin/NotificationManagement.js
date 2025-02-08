import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, deleteNotification } from "../../redux/slices/notificationsSlice";
import NotificationForm from "../../components/NotificationForm";

const NotificationManagement = () => {
  const dispatch = useDispatch();
  const { notifications, loading, error } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Notifications</h1>
      <NotificationForm />
      {loading && <p>Loading notifications...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="list-disc pl-6">
        {notifications.map((notification) => (
          <li key={notification.id}>
            {notification.message} - {notification.notification_type}
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
