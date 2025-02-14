import React, { useState, useEffect } from "react";
import API from "../../services/api";
import Modal from "../../components/Shared/Modal";

const VisitorGallery = () => {
  const [artworks, setArtworks] = useState([]);
  const [filteredArtworks, setFilteredArtworks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchArtworks = async () => {
      setLoading(true);
      try {
        const response = await API.get(
          `artwork/?approval_status=approved&page=${currentPage}`
        );
        console.log("Artworks:", response.data.results);
        setArtworks(response.data.results || []);
        setFilteredArtworks(response.data.results || []);
        extractCategories(response.data.results || []);
        setTotalPages(response.data.total_pages || 1);
      } catch (err) {
        setError("Failed to fetch artworks. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, [currentPage]);

  const extractCategories = (artworks) => {
    const uniqueCategories = [
      "All",
      ...new Set(artworks.map((artwork) => artwork.category)),
    ];
    setCategories(uniqueCategories);
  };

  const handleFilterByCategory = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when category changes

    if (category === "All") {
      setFilteredArtworks(artworks);
    } else {
      const filtered = artworks.filter(
        (artwork) => artwork.category === category
      );
      setFilteredArtworks(filtered);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleArtworkClick = (artwork) => {
    setSelectedArtwork(artwork);
  };

  const closeModal = () => {
    setSelectedArtwork(null);
  };

  if (loading) return <p className="p-6">Loading gallery...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Gallery</h1>

      {/* Category Filter */}
      <div className="flex gap-4 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded ${
              selectedCategory === category
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => handleFilterByCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Artwork Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredArtworks.length > 0 ? (
          filteredArtworks.map((artwork) => (
            <div
              key={artwork.id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg cursor-pointer transition"
              onClick={() => handleArtworkClick(artwork)}
            >
              <img
  src={artwork.image}
  alt={artwork.title}
  className="w-full h-48 object-cover"
/>

              <div className="p-4">
                <h2 className="text-lg font-semibold">{artwork.title}</h2>
                <p className="text-gray-500">{artwork.category}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center">No artworks found in this category.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center space-x-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-lg font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Artwork Details Modal */}
      {selectedArtwork && (
        <Modal isOpen={!!selectedArtwork} onClose={closeModal}>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{selectedArtwork.title}</h2>
            <p>
              <strong>Category:</strong> {selectedArtwork.category}
            </p>
            <p>
              <strong>Artist:</strong> {selectedArtwork.artist_name}
            </p>
            <p className="mt-4">{selectedArtwork.description}</p>
            <img
              src={selectedArtwork.image}
              alt={selectedArtwork.title}
              className="w-full h-auto mt-4"
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default VisitorGallery;
