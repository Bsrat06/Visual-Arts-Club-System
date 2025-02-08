import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArtworks, removeArtwork } from "../../redux/slices/artworkSlice";

const Portfolio = () => {
  const dispatch = useDispatch();
  const { artworks, loading, error } = useSelector((state) => state.artwork);

  useEffect(() => {
    dispatch(fetchArtworks());
  }, [dispatch]);

  const handleDelete = (artworkId) => {
    dispatch(removeArtwork(artworkId));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">My Portfolio</h1>
      {loading && <p>Loading artworks...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="list-disc pl-6">
        {Array.isArray(artworks) && artworks.length > 0 ? (
          artworks.map((art) => (
            <li key={art.id}>
              {art.title}
              <button
                onClick={() => handleDelete(art.id)}
                className="text-red-500 ml-2"
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <p>No artworks available</p>
        )}
      </ul>
    </div>
  );
};

export default Portfolio;
