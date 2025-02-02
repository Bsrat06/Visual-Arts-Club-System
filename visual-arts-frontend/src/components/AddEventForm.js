import { useState } from "react";
import { useDispatch } from "react-redux";
import { addEvent } from "../redux/slices/eventsSlice";

const AddEventForm = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addEvent({ name, date }));
    setName(""); // Clear input after submission
    setDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter Event Name"
        required
        className="border p-2 rounded mr-2"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        className="border p-2 rounded mr-2"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Add Event
      </button>
    </form>
  );
};

export default AddEventForm;
