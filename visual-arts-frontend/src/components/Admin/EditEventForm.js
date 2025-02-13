import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { editEvent } from "../../redux/slices/eventsSlice";
import API from "../../services/api";

const EditEventForm = ({ event, onClose }) => {
  const dispatch = useDispatch();
  
  const [title, setTitle] = useState(event?.title || "");
  const [description, setDescription] = useState(event?.description || "");
  const [location, setLocation] = useState(event?.location || "");
  const [date, setDate] = useState(event?.date?.split("T")[0] || "");
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    const fetchAttendeeEmails = async () => {
      if (!event?.attendees || event.attendees.length === 0) return;
      
      try {
        const response = await API.get("users/");
        const users = response.data.results;
        
        const userMap = users.reduce((map, user) => {
          map[user.pk] = user.email;
          return map;
        }, {});

        setAttendees(event.attendees.map(id => userMap[id] || "").filter(email => email));
      } catch (error) {
        console.error("Error fetching attendees:", error);
      }
    };

    fetchAttendeeEmails();
  }, [event]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !location || !date) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const emails = attendees.flatMap(email => email.split(",").map(e => e.trim()));
      const response = await API.get("users/");
      const users = response.data.results;

      const userMap = users.reduce((map, user) => {
        map[user.email] = user.pk;
        return map;
      }, {});

      const attendeeIds = emails.map(email => userMap[email]).filter(id => id);

      const eventData = {
        id: event.id,
        title,
        description,
        location,
        date,
        attendees: attendeeIds,
      };

      console.log("Updating Event ID:", event.id); // ✅ Debugging log
      console.log("Payload Sent:", eventData); // ✅ Debugging log

      dispatch(editEvent({ id: event.id, data: eventData }));
      if (onClose) onClose();
    } catch (error) {
      console.error("Error updating event:", error);
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
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        className="border p-2 rounded w-full mb-2"
      />
      <input
        type="text"
        value={attendees.join(", ")}
        onChange={(e) => setAttendees(e.target.value.split(",").map(email => email.trim()))}
        placeholder="Enter Attendee Emails (comma-separated)"
        className="border p-2 rounded w-full mb-2"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Update Event
      </button>
    </form>
  );
};

export default EditEventForm;

