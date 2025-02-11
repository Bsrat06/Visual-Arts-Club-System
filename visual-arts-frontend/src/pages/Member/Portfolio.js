import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import API from "../../services/api";
import NewArtworkForm from "./NewArtworkForm";

const Portfolio = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.auth.user);

  // Function to fetch all artworks (handling pagination)
  const fetchAllArtworks = async () => {
    try {
      let allArtworks = [];
      let nextPage = "http://127.0.0.1:8000/api/artwork/"; // Change URL if needed

      while (nextPage) {
        const response = await API.get(nextPage);
        allArtworks = [...allArtworks, ...response.data.results];
        nextPage = response.data.next; // Get the next page URL
      }

      setArtworks(allArtworks);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch artworks.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllArtworks();
  }, []);

  const userArtworks = artworks.filter(
    (art) => art.artist === user?.pk && art.approval_status === "approved"
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Portfolio</h1>

      {/* Submit New Artwork Form */}
      <h2 className="text-xl font-semibold mb-2">Submit New Artwork</h2>
      <NewArtworkForm />

      {loading && <p>Loading artworks...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {userArtworks.length > 0 ? (
        <ul className="grid grid-cols-3 gap-4 mt-6">
          {userArtworks.map((art) => (
            <li key={art.id} className="border p-4">
              <h2 className="font-semibold">Title: {art.title}</h2>
              <h2 className="font-semibold">Category: {art.category}</h2>
              <img src={art.image} alt={art.title} className="w-full h-auto mt-2" />
              <p>{art.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no approved artworks yet.</p>
      )}
    </div>
  );
};

export default Portfolio;
