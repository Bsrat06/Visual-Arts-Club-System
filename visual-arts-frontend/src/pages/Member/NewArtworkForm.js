import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addArtwork } from "../../redux/slices/artworkSlice";

const NewArtworkForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user); // 🔍 Debug this!

  console.log("Current User in Redux:", user); // ✅ Check if user exists

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to submit artwork."); // ❌ This should not trigger if user exists
      return;
    }

    // Create FormData for file upload
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);
    formData.append("artist", user.pk); // Assign artist

    console.log("Submitting Artwork Data:", {
      title,
      description,
      image,
      artist: user.pk,
    });
    
    
    dispatch(addArtwork(formData));

    // Reset form
    setTitle("");
    setDescription("");
    setImage(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Artwork Title"
        required
        className="border p-2 rounded w-full"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Artwork Description"
        required
        className="border p-2 rounded w-full"
      ></textarea>
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        required
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Submit Artwork
      </button>
    </form>
  );
};

export default NewArtworkForm;
