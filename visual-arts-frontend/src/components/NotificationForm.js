import { useState } from "react";
import { useDispatch } from "react-redux";
import { addNotification } from "../redux/slices/notificationsSlice";

const NotificationForm = () => {
  const [message, setMessage] = useState("");
  const [notificationType, setNotificationType] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addNotification({ message, notification_type: notificationType }));
    setMessage("");
    setNotificationType("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Notification Message"
        required
        className="border p-2 rounded"
      />
      <select
        value={notificationType}
        onChange={(e) => setNotificationType(e.target.value)}
        required
        className="border p-2 rounded"
      >
        <option value="">Select Notification Type</option>
        <option value="artwork_approved">Artwork Approved</option>
        <option value="event_update">Event Update</option>
        <option value="project_invite">Project Invitation</option>
      </select>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Create Notification
      </button>
    </form>
  );
};

export default NotificationForm;
