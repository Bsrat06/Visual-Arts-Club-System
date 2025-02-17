// Portfolio.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllArtworks } from "../../redux/slices/artworkSlice";
import { Link } from "react-router-dom";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const Portfolio = () => {
  const dispatch = useDispatch();
  const { artworks, loading, error } = useSelector((state) => state.artwork);
  const user = useSelector((state) => state.auth.user);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const artworksPerPage = 5;

  useEffect(() => {
    dispatch(fetchAllArtworks(selectedCategory ? { category: selectedCategory, artist: user?.pk } : { artist: user?.pk }));
  }, [dispatch, selectedCategory, user]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reset to first page when category changes
  };

  const userArtworks = artworks.filter((art) => art.approval_status === "approved");
  
  // Pagination Logic
  const indexOfLastArtwork = currentPage * artworksPerPage;
  const indexOfFirstArtwork = indexOfLastArtwork - artworksPerPage;
  const currentArtworks = userArtworks.slice(indexOfFirstArtwork, indexOfLastArtwork);
  const totalPages = Math.ceil(userArtworks.length / artworksPerPage);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Portfolio</h1>
      
      {/* Add Artwork Button */}
      <div className="mb-4 flex justify-between">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          <option value="sketch">Sketch</option>
          <option value="canvas">Canvas</option>
          <option value="wallart">Wall Art</option>
          <option value="digital">Digital</option>
          <option value="photography">Photography</option>
        </select>
        <Link to="/member/new-artwork" className="bg-blue-500 text-white px-4 py-2 rounded">Add New Artwork</Link>
      </div>
      
      {/* Artworks Table */}
      {loading && <p>Loading artworks...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {currentArtworks.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Preview</th>
              <th className="border p-2">Title</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentArtworks.map((art) => (
              <tr key={art.id} className="text-center">
                <td className="border p-2">
                  <img src={art.image} alt={art.title} className="w-16 h-16 object-cover mx-auto" />
                </td>
                <td className="border p-2">{art.title}</td>
                <td className="border p-2 truncate max-w-xs">{art.description}</td>
                <td className="border p-2">{art.category}</td>
                <td className="border p-2 capitalize">{art.approval_status}</td>
                <td className="border p-2 flex justify-center gap-2">
                  <button className="text-blue-500 hover:text-blue-700">
                    <FiEdit size={20} />
                  </button>
                  <button className="text-red-500 hover:text-red-700">
                    <FiTrash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>You have no approved artworks yet for the selected category.</p>
      )}
      
      {/* Pagination */}
      {userArtworks.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm">Showing {indexOfFirstArtwork + 1} of {userArtworks.length}</p>
          <div className="flex gap-2">
            <button 
              className="px-3 py-1 border rounded" 
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button 
                key={i + 1} 
                className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : ""}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button 
              className="px-3 py-1 border rounded" 
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;