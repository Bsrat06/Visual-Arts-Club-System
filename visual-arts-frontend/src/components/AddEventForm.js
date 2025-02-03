import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addEvent } from "../redux/slices/eventsSlice";
import API from "../services/api"; // ✅ Import API for fetching attendee IDs

const AddEventForm = () => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [attendees, setAttendees] = useState(""); // Collect emails

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !location || !date) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      // Convert emails to user IDs
      const emails = attendees.split(",").map((email) => email.trim());
      const response = await API.get("users/"); // ✅ Fetch all users from API
      console.log("API Response:", response.data);
      
      const users = response.data.results; // ✅ Extract the array correctly
      const userMap = {};
      users.forEach((user) => {
        userMap[user.email] = user.pk;
      });

      console.log("User Mapping:", userMap);

      const attendeeIds = emails.map((email) => userMap[email]).filter((id) => id !== undefined);

      console.log("Mapped Attendee IDs:", attendeeIds); // ✅ Debug log

      // ✅ Convert datetime input (`YYYY-MM-DDTHH:MM`) to `YYYY-MM-DD`
    const formattedDate = date.split("T")[0]; // ✅ Extract only YYYY-MM-DD

    const eventData = {
      title,
      description,
      location,
      date: formattedDate, // ✅ Use corrected format
      attendees: attendeeIds,
    };

      console.log("Submitting Event Data:", eventData);
      dispatch(addEvent(eventData));

      setTitle("");
      setDescription("");
      setLocation("");
      setDate("");
      setAttendees("");
    } catch (error) {
      console.error("Error fetching user IDs:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter Event Title"
        required
        className="border p-2 rounded w-full mb-2"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter Event Description"
        required
        className="border p-2 rounded w-full mb-2"
      />
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter Location"
        required
        className="border p-2 rounded w-full mb-2"
      />
      <input
        type="datetime-local" // ✅ Ensure correct date format
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        className="border p-2 rounded w-full mb-2"
      />
      <input
        type="text"
        value={attendees}
        onChange={(e) => setAttendees(e.target.value)}
        placeholder="Enter Attendee Emails (comma-separated)"
        className="border p-2 rounded w-full mb-2"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Submit Event
      </button>
    </form>
  );
};

export default AddEventForm;
