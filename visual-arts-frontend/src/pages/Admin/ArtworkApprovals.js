import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArtworks } from "../../redux/slices/artworkSlice";
import API from "../../services/api";

const ArtworkApprovals = () => {
    const dispatch = useDispatch();
    const { artworks, loading, error } = useSelector((state) => state.artwork);

    useEffect(() => {
        dispatch(fetchArtworks());
    }, [dispatch]);

    const handleApproval = async (id, status) => {
        try {
            const endpoint = status === "approved" ? `artwork/${id}/approve/` : `artwork/${id}/reject/`;
            await API.patch(endpoint);
            dispatch(fetchArtworks()); // Refresh the list
        } catch (error) {
            console.error("Error updating artwork status:", error);
        }
    };

    const pendingArtworks = artworks.filter((art) => art.approval_status === "pending");

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
        </div>
    );
};

export default ArtworkApprovals;
