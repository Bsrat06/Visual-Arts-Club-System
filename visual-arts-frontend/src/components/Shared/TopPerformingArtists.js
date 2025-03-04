import React from "react";

const TopPerformingArtists = ({ artists }) => {
    const sortedArtists = artists
        .sort((a, b) => b.uploads - a.uploads || b.likes - a.likes)
        .slice(0, 3);

    const trophies = ["🥇", "🥈", "🥉"];

    return (
        <div className="bg-white p-6 rounded-lg shadow-md w-[475px] float-right"> {/* Smaller width */}
            <h3 className="text-lg font-semibold mb-4">Top Performing Artists</h3>
            <div className="space-y-4">
                {sortedArtists.map((artist, index) => (
                    <div
                        key={artist.id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200" // Hover effect
                    >
                        <div className="flex items-center flex-1">
                            <div className="w-10 h-10 rounded-full overflow-hidden mr-4">
                                <img
                                    src={artist.profilePicture || "https://via.placeholder.com/40"}
                                    alt={artist.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">{artist.name}</p>
                                <p className="text-xs text-gray-500">
                                    {artist.uploads} Uploads • {artist.likes} Likes
                                </p>
                            </div>
                        </div>
                        <div className="text-4xl"> {/* Larger trophies without background */}
                            {trophies[index]}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopPerformingArtists;