// components/Shared/TopArtists.js

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card } from "antd";
import dayjs from "dayjs";

const TopArtists = () => {
  const { artworks, loading: artworkLoading } = useSelector((state) => state.artwork);
  const { users, loading: userLoading } = useSelector((state) => state.users);
  const [topArtists, setTopArtists] = useState([]);

  useEffect(() => {
    if (artworks.length > 0 && users.length > 0) {
      const artistUploadCounts = {};
      artworks.forEach((artwork) => {
        if (artwork.artist) {
          const artistId = artwork.artist;
          artistUploadCounts[artistId] = (artistUploadCounts[artistId] || 0) + 1;
        }
      });

      const artistsWithUploads = Object.keys(artistUploadCounts).map((artistId) => {
        const user = users.find((u) => u.id === parseInt(artistId));
        return {
          id: parseInt(artistId),
          name: user ? `${user.first_name} ${user.last_name}` : "Unknown Artist",
          profilePic: user ? user.profile_picture : "https://via.placeholder.com/150", // Placeholder if no profile pic
          uploads: artistUploadCounts[artistId],
          engagements: 0, // Placeholder for engagement logic
          artworkSamples: artworks
            .filter((artwork) => artwork.artist === parseInt(artistId))
            .slice(0, 3)
            .map((artwork) => artwork.image),
        };
      });

      const sortedArtists = artistsWithUploads.sort((a, b) => b.uploads - a.uploads).slice(0, 3);
      setTopArtists(sortedArtists);
    }
  }, [artworks, users]);

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Top Performing Artists</h3>
      <div className="flex space-x-4">
        {topArtists.map((artist) => (
          <Card key={artist.id} className="w-80">
            <div className="flex flex-col items-center">
              <img
                src={artist.profilePic}
                alt={artist.name}
                className="rounded-full w-24 h-24 mb-4"
              />
              <h4 className="text-lg font-semibold">{artist.name}</h4>
              <p className="text-sm text-gray-600">Uploads: {artist.uploads}</p>
              <p className="text-sm text-gray-600">Engagements: {artist.engagements}</p>
              <div className="flex mt-4 space-x-2">
                {artist.artworkSamples.map((sample, index) => (
                  <img key={index} src={sample} alt="Artwork Sample" className="w-16 h-16 rounded" />
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TopArtists;