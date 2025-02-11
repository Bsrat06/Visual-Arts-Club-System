// VisitorGallery.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArtworks } from "../../redux/slices/artworkSlice";

const VisitorGallery = () => {
  const dispatch = useDispatch();
  const { artworks, loading, error } = useSelector((state) => state.artwork);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    dispatch(fetchArtworks(selectedCategory ? { category: selectedCategory } : {}));
  }, [dispatch, selectedCategory]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const approvedArtworks = artworks.filter((art) => art.approval_status === "approved");

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Visitor Gallery</h1>

      {/* Category Filter */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Filter by Category:</label>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="border p-2 rounded w-1/3"
        >
          <option value="">All Categories</option>
          <option value="sketch">Sketch</option>
          <option value="canvas">Canvas</option>
          <option value="wallart">Wall Art</option>
          <option value="digital">Digital</option>
          <option value="photography">Photography</option>
        </select>
      </div>

      {/* Artworks List */}
      {loading && <p>Loading artworks...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {approvedArtworks.length > 0 ? (
        <ul className="grid grid-cols-4 gap-4">
          {approvedArtworks.map((art) => (
            <li key={art.id} className="border p-4">
              <h2 className="font-semibold">{art.title}</h2>
              <p>Category: {art.category}</p>
              <img src={art.image} alt={art.title} className="w-full h-auto mt-2" />
              <p>{art.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No artworks available for the selected category.</p>
      )}
    </div>
  );
};

export default VisitorGallery;
