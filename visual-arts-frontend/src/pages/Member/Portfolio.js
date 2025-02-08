import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArtworks } from "../../redux/slices/artworkSlice";

const Portfolio = () => {
  const dispatch = useDispatch();
  const { artworks, loading, error } = useSelector((state) => state.artwork);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchArtworks());
  }, [dispatch]);


  useEffect(() => {
    console.log("Artworks fetched:", artworks); // Debugging log
  }, [artworks]);

  const userArtworks = artworks.filter(
    (art) => art.artist === user?.pk && art.approval_status === "approved"
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Portfolio</h1>
      {loading && <p>Loading artworks...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {userArtworks.length > 0 ? (
        <ul className="grid grid-cols-3 gap-4">
          {userArtworks.map((art) => (
            <li key={art.id} className="border p-4">
              <h2 className="font-semibold">{art.title}</h2>
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
