import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import API from "../../services/api";

const ArtworkApprovals = () => {
    const dispatch = useDispatch();
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [feedback, setFeedback] = useState("");
    const [selectedArtwork, setSelectedArtwork] = useState(null);
    const [showModal, setShowModal] = useState(false);

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

    const handleApproval = async (id, status) => {
        try {
            if (status === "approved") {
                await API.patch(`artwork/${id}/approve/`);
            } else {
                setSelectedArtwork(id);
                setShowModal(true);
            }
            fetchAllArtworks(); // Refresh artworks after approval/rejection
        } catch (error) {
            console.error("Error updating artwork status:", error);
        }
    };

    const handleRejectWithFeedback = async () => {
        try {
            await API.patch(`artwork/${selectedArtwork}/reject/`, { feedback });
            setShowModal(false);
            setFeedback("");
            fetchAllArtworks();
        } catch (error) {
            console.error("Error rejecting artwork:", error);
        }
    };

    console.log("Fetched artworks:", artworks);
    const pendingArtworks = artworks.filter((art) => art.approval_status === "pending");
    console.log("Pending artworks:", pendingArtworks);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Artwork Approvals</h1>
            {loading && <p>Loading artworks...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <ul className="list-disc pl-6">
                {pendingArtworks.length > 0 ? (
                    pendingArtworks.map((art) => (
                        <li key={art.id} className="mb-4">
                            <h3 className="text-lg font-semibold">{art.title}</h3>
                            <p>{art.description}</p>
                            <img src={art.image} alt={art.title} className="w-48 h-auto my-2" />
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => handleApproval(art.id, "approved")}
                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleApproval(art.id, "rejected")}
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                >
                                    Reject
                                </button>
                            </div>
                        </li>
                    ))
                ) : (
                    <p>No pending artworks for approval.</p>
                )}
            </ul>
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-2">Provide Rejection Feedback</h2>
                        <textarea
                            className="w-full p-2 border rounded"
                            rows="3"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Enter feedback..."
                        ></textarea>
                        <div className="flex justify-end space-x-4 mt-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRejectWithFeedback}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ArtworkApprovals;
