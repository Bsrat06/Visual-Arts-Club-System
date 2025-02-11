import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addArtwork } from "../redux/slices/artworkSlice";


const AddArtworkForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("sketch");
  const dispatch = useDispatch();
  
  const user = useSelector((state) => state.auth.user); // 🔍 Debug this!

  console.log("Current User in Redux:", user); // ✅ Check if user exists

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to submit artwork."); // ❌ This should not trigger if user exists
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);
    formData.append("artist", user.pk); // Assign artist
    formData.append("category", category);

    console.log("Submitting Artwork Data:", {
      title,
      description,
      image,
      artist: user.pk,
    });

    dispatch(addArtwork(formData));

    setTitle("");
    setDescription("");
    setImage(null);
    setCategory("sketch");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
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
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        required
        className="border p-2 rounded w-full mb-2"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
        className="border p-2 rounded w-full"
      >
        <option value="sketch">Sketch</option>
        <option value="canvas">Canvas</option>
        <option value="wallart">Wall Art</option>
        <option value="digital">Digital</option>
        <option value="photography">Photography</option>
      </select>


      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Submit Artwork
      </button>
    </form>
  );
};

export default AddArtworkForm;
