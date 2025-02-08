import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddArtworkForm from "../../components/AddArtworkForm";
import EditArtworkForm from "../../components/EditArtworkForm";
import { fetchArtworks, removeArtwork } from "../../redux/slices/artworkSlice";

const ManageArtworks = () => {
  const dispatch = useDispatch();
  const { artworks, loading, error } = useSelector((state) => state.artwork);

  const [editingArtwork, setEditingArtwork] = useState(null);

  useEffect(() => {
    dispatch(fetchArtworks());
  }, [dispatch]);

  const handleEdit = (artwork) => {
    setEditingArtwork(artwork);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Manage Artworks</h1>

      {/* Add Artwork */}
      <h2 className="text-xl font-semibold mt-4">Add Artwork</h2>
      <AddArtworkForm />

      {/* Edit Artwork */}
      {editingArtwork && (
        <EditArtworkForm
          artwork={editingArtwork}
          onClose={() => setEditingArtwork(null)}
        />
      )}

      {/* Display Artworks */}
      <h2 className="text-xl font-semibold mt-4">Artworks List</h2>
      {loading && <p>Loading artworks...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="list-disc pl-6">
        {Array.isArray(artworks) && artworks.length > 0 ? (
          artworks.map((art) => (
            <li key={art.id}>
              <p>{art.title} - {art.approval_status}</p>
              <button
                onClick={() => handleEdit(art)}
                className="text-blue-500 ml-2"
              >
                Edit
              </button>
              <button
                onClick={() => dispatch(removeArtwork(art.id))}
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

export default ManageArtworks;
