import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  deleteNotification,
  markNotificationAsRead,
  markAllAsRead,
  addNotification,
} from "../../redux/slices/notificationsSlice";
import NotificationForm from "../../components/Admin/NotificationForm";

const NotificationManagement = () => {
  const dispatch = useDispatch();
  const { notifications, loading, error } = useSelector((state) => state.notifications);

  const [message, setMessage] = useState("");
  const [role, setRole] = useState("member");

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAsRead = (id) => {
    dispatch(markNotificationAsRead(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const handleSendBulk = () => {
    if (!message.trim()) {
      alert("Message cannot be empty");
      return;
    }
    dispatch(
      addNotification({
        message,
        role,
        notification_type: "general",
      })
    );
    setMessage("");
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Notification Management</h1>

      {/* Bulk Notification Form */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Send Bulk Notifications</h2>
        <div className="space-y-4">
          <textarea
            className="w-full p-2 border rounded"
            rows="4"
            placeholder="Enter message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <select
            className="p-2 border rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="member">Members</option>
            <option value="visitor">Visitors</option>
          </select>
          <button
            onClick={handleSendBulk}
            className="bg-orange-500 text-white px-4 py-2 rounded"
          >
            Send Notification
          </button>
        </div>
      </div>

      {/* Existing Notification Form */}
      <NotificationForm />

      {/* Mark All as Read Button */}
      <button
        onClick={handleMarkAllAsRead}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        Mark All as Read
      </button>

      {/* Notification History */}
      <h2 className="text-xl font-semibold mb-4">Notification History</h2>
      {loading && <p>Loading notifications...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="list-disc pl-6">
        {notifications.map((notification) => (
          <li
            key={notification.id}
            className={notification.read ? "text-gray-500" : "text-black"}
          >
            <div className="flex justify-between items-center">
              <div>
                {notification.message} - {notification.notification_type} -{" "}
                {notification.recipient_role} - {notification.read ? "Read" : "Unread"}
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
