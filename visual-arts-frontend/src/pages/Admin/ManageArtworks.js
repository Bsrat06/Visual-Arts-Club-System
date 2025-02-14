import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArtworks } from "../../redux/slices/artworkSlice";

const ManageArtworks = () => {
  const dispatch = useDispatch();
  const { artworks, loading, error } = useSelector((state) => state.artwork);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    dispatch(fetchArtworks());
  }, [dispatch]);

  const filteredArtworks = artworks.filter(
    (art) =>
      (searchQuery === "" || art.title.includes(searchQuery)) &&
      (filterStatus === "" || art.approval_status === filterStatus)
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

      {/* Artworks Table */}
      {loading && <p>Loading artworks...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {filteredArtworks.length > 0 ? (
        <ul>
          {filteredArtworks.map((art) => (
            <li key={art.id}>
              {art.title} - {art.approval_status}
            </li>
          ))}
        </ul>
      ) : (
        <p>No artworks found</p>
      )}
    </div>
  );
};

export default ManageArtworks;
