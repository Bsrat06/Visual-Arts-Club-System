import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaUser, FaImages, FaCalendar, FaProjectDiagram, FaCog } from "react-icons/fa";
import AddArtworkForm from "../../components/AddArtworkForm";
import EditArtworkForm from "../../components/EditArtworkForm";
import { fetchArtworks, removeArtwork, editArtwork } from "../../redux/slices/artworkSlice";

const ManageArtworks = () => {
  const dispatch = useDispatch();
  const { artworks, loading, error } = useSelector((state) => state.artwork);

  const [feedback, setFeedback] = useState("");
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  const handleApproval = (artwork, status) => {
    console.log("Selected Artwork:", artwork); // Debugging log
    const data = { approval_status: status };
  
    if (status === "rejected") {
      data.feedback = feedback; // Include feedback for rejection
    }
  
    // Ensure artwork.id is defined
    if (!artwork.id) {
      console.error("Artwork ID is missing!");
      return;
    }
  
    dispatch(editArtwork({ id: artwork.id, data }))
      .then(() => {
        dispatch(fetchArtworks());
        setFeedback(""); // Clear feedback after submission
        setSelectedArtwork(null); // Clear selected artwork
      })
      .catch((error) => console.error("Error updating artwork:", error));
  };
  
    
  
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

      <Link to="/admin/artwork-approvals" className="flex items-center"><FaImages className="mr-2" /> Approve Artworks</Link>

      {/* Display Artworks */}
      <h2 className="text-xl font-semibold mt-4">Artworks List</h2>
      {loading && <p>Loading artworks...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      
      
      <ul className="list-disc pl-6">
        {Array.isArray(artworks) && artworks.length > 0 ? (
          artworks.map((art) => (
            <li key={art.id}>
              <p>Title: {art.title}</p>
              <p>Category: {art.category}</p>
              <p>Status: {art.approval_status}</p>
              <p>Artist: {art.artist}</p>
              <p>Feedback: {art.feedback}</p>

            {selectedArtwork?.id === art.id && (
              <div>
                <textarea
                  placeholder="Enter feedback for rejection"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="border p-2 w-full"
                ></textarea>
                <button
                  onClick={() => handleApproval(art, "rejected")}
                  className="bg-red-500 text-white px-4 py-2 mt-2"
                >
                  Submit Rejection
                </button>
              </div>
            )}
              
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
