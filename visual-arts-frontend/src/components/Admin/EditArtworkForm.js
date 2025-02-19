// src/components/EditArtworkForm.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editArtwork } from "../../redux/slices/artworkSlice";
import API from "../../services/api";
import "../../styles/custom-ant.css";

const EditArtworkForm = ({ artwork, onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user); // Get current user

  const [title, setTitle] = useState(artwork?.title || "");
  const [description, setDescription] = useState(artwork?.description || "");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(artwork?.image || null);

  useEffect(() => {
    if (artwork?.image) {
      setPreviewImage(artwork.image);
    }
  }, [artwork]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to edit artwork.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }
    formData.append("artist", user.pk); // Assign artist

    console.log("Updating Artwork ID:", artwork.id); // Debugging log
    console.log("Payload Sent:", { title, description, image, artist: user.pk }); // Debugging log

    try {
      dispatch(editArtwork({ id: artwork.id, data: formData }));
      if (onClose) onClose();
    } catch (error) {
      console.error("Error updating artwork:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file)); // Preview the new image
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h3 className="text-xl font-bold mb-4">Edit Artwork</h3>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter Artwork Title"
        required
        className="border p-2 rounded w-full mb-2"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter Artwork Description"
        required
        className="border p-2 rounded w-full mb-2"
      />
      <div className="mb-2">
        {previewImage && (
          <img
            src={previewImage}
            alt="Artwork Preview"
            className="w-full h-32 object-cover mb-2 rounded"
          />
        )}
        <input
          type="file"
          onChange={handleImageChange}
          className="border p-2 rounded w-full"
        />
      </div>
      <button
        type="submit"
        className="add-artwork-btn"
      >
        Update Artwork
      </button>
      <button
        type="button"
        onClick={onClose}
        className="bg-gray-500 text-white px-4 py-2 rounded"
      >
        Cancel
      </button>
    </form>
  );
};

export default EditArtworkForm;