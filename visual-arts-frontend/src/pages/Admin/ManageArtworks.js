import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArtworks } from "../../redux/slices/artworkSlice";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ManageArtworks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { artworks, loading, error } = useSelector((state) => state.artwork);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    dispatch(fetchArtworks());
  }, [dispatch]);

  const filteredArtworks = artworks.filter(
    (art) =>
      (searchQuery === "" || art.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (filterStatus === "" || art.approval_status === filterStatus)
  );

  const totalPages = Math.ceil(filteredArtworks.length / itemsPerPage);
  const paginatedArtworks = filteredArtworks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Manage Artworks</h1>
      
      
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded w-full md:w-1/2"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border p-2 rounded w-full md:w-1/4"
        >
          <option value="">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      {/* Add Artwork Button */}
      <button
        onClick={() => navigate("/member/new-artwork/")}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Add New Artwork
      </button>

      {/* Artworks Table */}
      {loading && <p>Loading artworks...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {filteredArtworks.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Preview</th>
              <th className="border p-2">Title</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Artist</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedArtworks.map((art) => (
              <tr key={art.id} className="text-center border">
                <td className="border p-2">
                  <img src={art.image_url} alt={art.title} className="w-16 h-16 object-cover" />
                </td>
                <td className="border p-2">{art.title}</td>
                <td className="border p-2">{art.category}</td>
                <td className="border p-2">{art.artist}</td>
                <td className="border p-2">{art.approval_status}</td>
                <td className="border p-2 flex justify-center gap-2">
                  <button className="text-green-600"><FaCheck /></button>
                  <button className="text-red-600"><FaTimes /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No artworks found</p>
      )}

      {/* Pagination & Total Count */}
      <div className="flex justify-between items-center mt-4">
        <p>Showing data {itemsPerPage * (currentPage - 1) + 1} to {Math.min(itemsPerPage * currentPage, filteredArtworks.length)} of {filteredArtworks.length} entries</p>
        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageArtworks;
