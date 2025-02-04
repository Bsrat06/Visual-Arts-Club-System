// src/components/EditArtworkForm.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { editArtwork } from "../redux/slices/artworkSlice";

const EditArtworkForm = ({ artwork, onClose }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(artwork.title);
  const [description, setDescription] = useState(artwork.description);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(editArtwork({ id: artwork.id, title, description }));
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Edit Artwork</h3>
      <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      <input value={description} onChange={(e) => setDescription(e.target.value)} required />
      <button type="submit">Save</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
};

export default EditArtworkForm;
