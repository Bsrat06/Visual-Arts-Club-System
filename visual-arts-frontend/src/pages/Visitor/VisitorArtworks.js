import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArtworks } from "../../redux/slices/artworkSlice";

const VisitorArtworks = () => {
  const dispatch = useDispatch();
  const { artworks, loading, error } = useSelector((state) => state.artwork);
  
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchArtworks());
  }, [dispatch]);

  const approvedArtworks = artworks.filter((art) => art.approval_status === "approved");

  // Filter artworks based on search query
  const filteredArtworks = approvedArtworks.filter((art) =>
    art.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Artworks Gallery</h1>
      {loading && <p>Loading artworks...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {/* Search Input */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search artworks..."
        className="border p-2 rounded w-full mb-4"
      />
      
      {filteredArtworks.length > 0 ? (
        <ul className="grid grid-cols-3 gap-4">
          {filteredArtworks.map((art) => (
            <li key={art.id} className="border p-4">
              <h2 className="font-semibold">{art.title}</h2>
              <img src={art.image} alt={art.title} className="w-full h-auto mt-2" />
              <p>{art.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No artworks available.</p>
      )}
    </div>
  );
};

export default VisitorArtworks;
