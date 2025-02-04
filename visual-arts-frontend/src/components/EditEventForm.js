// src/components/EditEventForm.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { editEvent } from "../redux/slices/eventsSlice";

const EditEventForm = ({ event, onClose }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(event.title);
  const [location, setLocation] = useState(event.location);
  const [date, setDate] = useState(event.date);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(editEvent({ id: event.id, title, location, date }));
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Edit Event</h3>
      <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      <input value={location} onChange={(e) => setLocation(e.target.value)} required />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      <button type="submit">Save</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
};

export default EditEventForm;
