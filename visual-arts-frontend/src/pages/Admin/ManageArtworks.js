import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArtworks } from "../../redux/slices/artworkSlice";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Table from "../../components/Shared/Table";
import Pagination from "../../components/Shared/Pagination";

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

  // ✅ Define Table Headers
  const headers = ["Preview", "Title", "Category", "Artist", "Status", "Actions"];

  // ✅ Prepare Data for Table
  const tableData = paginatedArtworks.map((art) => [
    <img src={art.image_url} alt={art.title} className="w-16 h-16 object-cover mx-auto" />,
    art.title,
    art.category,
    art.artist,
    <span
      className={`px-3 py-1 rounded-full text-white text-sm ${
        art.approval_status === "approved"
          ? "bg-green-500"
          : art.approval_status === "pending"
          ? "bg-yellow-500"
          : "bg-red-500"
      }`}
    >
      {art.approval_status}
    </span>,
    <div className="flex justify-center gap-2">
      <button className="text-green-600">
        <FaCheck />
      </button>
      <button className="text-red-600">
        <FaTimes />
      </button>
    </div>,
  ]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Manage Artworks</h1>

      {/* ✅ Search & Filter */}
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

      {/* ✅ Add Artwork Button */}
      <button
        type="submit"
        onClick={() => navigate("/member/new-artwork/")}
        className="mb-4 px-4 bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600"
        // className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Add New Artwork
      </button>

      {/* ✅ Artworks Table */}
      {loading && <p>Loading artworks...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <Table headers={headers} data={tableData} />

      {/* ✅ Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p>
          Showing {itemsPerPage * (currentPage - 1) + 1} to{" "}
          {Math.min(itemsPerPage * currentPage, filteredArtworks.length)} of {filteredArtworks.length} entries
        </p>
        <Pagination
          totalItems={filteredArtworks.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default ManageArtworks;
