import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import API from "../../services/api";
import { Image, Button, Select, Skeleton, Empty } from "antd";
import { HeartFilled, DownloadOutlined } from "@ant-design/icons";
import "../../styles/mansory-layout.css";
import "../../styles/visitorgallery.css";
import SearchBar from "../../components/Shared/SearchBar";

const { Option } = Select;

const VisitorGallery = () => {
    const [artworks, setArtworks] = useState([]);
    const [categories, setCategories] = useState(["All"]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isFetching, setIsFetching] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [userLikedArtworks, setUserLikedArtworks] = useState({}); // Initialize as empty object
    const [allArtworksLikes, setAllArtworksLikes] = useState({});
    const [hoveredArtworkId, setHoveredArtworkId] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const user = useSelector((state) => state.auth.user);
    const nextPageRef = useRef("artwork/?approval_status=approved&page=1&page_size=20");
    const lastTap = useRef(null);
    const initialLoad = useRef(true);
    const [likesLoading, setLikesLoading] = useState(true);

    // Fetch all artworks
    const fetchAllArtworks = async () => {
        if (!hasMore || isFetching || !nextPageRef.current) return;

        setIsFetching(true);
        try {
            const response = await API.get(nextPageRef.current);
            if (response.data.results.length > 0) {
                setArtworks((prev) => {
                    const newArtworks = response.data.results.filter(
                        (art) => !prev.some((existing) => existing.id === art.id)
                    );
                    return [...prev, ...newArtworks];
                });

                extractCategories([...artworks, ...response.data.results]);
                nextPageRef.current = response.data.next;
                if (!response.data.next) setHasMore(false);

                const likesPromises = response.data.results.map((artwork) =>
                    API.get(`artwork/${artwork.id}/likes/`).then((res) => ({
                        artworkId: artwork.id,
                        likes: res.data.likes,
                    }))
                );
                const likesData = await Promise.all(likesPromises);

                setAllArtworksLikes((prev) => {
                    const updatedLikes = likesData.reduce((acc, curr) => {
                        acc[curr.artworkId] = curr.likes;
                        return acc;
                    }, {});

                    return { ...prev, ...updatedLikes };
                });
            } else {
                setHasMore(false);
            }
        } catch (err) {
            setError("Failed to load artworks. Retrying...");
            setTimeout(fetchAllArtworks, 3000);
        } finally {
            setLoading(false);
            setIsFetching(false);
        }
    };

    // Fetch user's liked artworks
    const fetchUserLikedArtworks = async () => {
        try {
            const response = await API.get("/artworks/liked/");
            console.log("User Liked Artworks Response:", response.data); // Log the response data
            const likedIds = response.data.reduce((acc, artwork) => {
                acc[artwork.id] = 1; // Mark the artwork as liked
                return acc;
            }, {});
            setUserLikedArtworks(likedIds);
            localStorage.setItem('likedArtworks', JSON.stringify(likedIds)); // Store in localStorage
        } catch (error) {
            console.error("Error fetching user liked artworks:", error);
            setUserLikedArtworks({});
            localStorage.setItem('likedArtworks', JSON.stringify({})); // Fallback to empty object
        } finally {
            setLikesLoading(false);
        }
    };

    // Handle scroll for infinite loading
    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop + 200 >=
            document.documentElement.offsetHeight
        ) {
            fetchAllArtworks();
        }
    };

    // Extract unique categories
    const extractCategories = (artworks) => {
        const uniqueCategories = ["All", ...new Set(artworks.map((artwork) => artwork.category))];
        setCategories(uniqueCategories);
    };

    // Handle like/unlike toggle
    const handleLikeToggle = async (artworkId) => {
        if (!user) {
            alert("Please log in to like artworks!");
            return;
        }

        try {
            const isLiked = userLikedArtworks[artworkId] > 0;
            if (isLiked) {
                await API.delete(`artwork/${artworkId}/unlike/`);
                setUserLikedArtworks((prev) => {
                    const updatedLikes = { ...prev, [artworkId]: (prev[artworkId] || 1) - 1 };
                    return updatedLikes;
                });
            } else {
                await API.post(`artwork/${artworkId}/like/`);
                setUserLikedArtworks((prev) => {
                    const updatedLikes = { ...prev, [artworkId]: (prev[artworkId] || 0) + 1 };
                    return updatedLikes;
                });
            }
        } catch (error) {
            console.error("Error liking artwork:", error);
        }
    };

    // Handle download
    const handleDownload = (imageUrl) => {
        const a = document.createElement("a");
        a.href = imageUrl;
        a.download = "artwork-image.jpg";
        a.click();
    };

    // Handle window resize
    const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
    };

    // Handle double tap (for mobile)
    const handleDoubleTap = (artworkId) => {
        const now = Date.now();
        const DOUBLE_PRESS_DELAY = 300;
        if (lastTap.current && (now - lastTap.current) < DOUBLE_PRESS_DELAY) {
            handleLikeToggle(artworkId);
        } else {
            lastTap.current = now;
        }
    };

    // Initialize userLikedArtworks from localStorage or fetch from backend
    useEffect(() => {
        const storedLikes = JSON.parse(localStorage.getItem('likedArtworks')) || {};
        setUserLikedArtworks(storedLikes); // Initialize from localStorage
        setLikesLoading(false);

        if (user) {
            fetchUserLikedArtworks(); // Fetch fresh data if user is logged in
        }
    }, [user]);

    // Persist userLikedArtworks to localStorage
    useEffect(() => {
        if (!initialLoad.current && user) {
            localStorage.setItem('likedArtworks', JSON.stringify(userLikedArtworks));
        }
        initialLoad.current = false;
    }, [userLikedArtworks, user]);

    // Handle scroll and resize events
    useEffect(() => {
        fetchAllArtworks();
        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="p-6 max-w-full mx-auto font-poppins">
            {/* Search and category filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <SearchBar onSearch={(query) => setSearchQuery(query)} />
                <Select
                    defaultValue="All"
                    style={{ width: 200 }}
                    onChange={(value) => setSelectedCategory(value)}
                >
                    {categories.map((category) => (
                        <Option key={category} value={category}>
                            {category}
                        </Option>
                    ))}
                </Select>
            </div>

            {/* Artworks grid */}
            <div className="mt-6 p-4 w-full">
                {artworks.length > 0 ? (
                    <div className="masonry">
                        {artworks
                            .filter((artwork) =>
                                (selectedCategory === "All" || artwork.category === selectedCategory) &&
                                (searchQuery === "" || artwork.title.toLowerCase().includes(searchQuery.toLowerCase()))
                            )
                            .map((artwork) => (
                                <div
                                    key={artwork.id}
                                    className="masonry-item"
                                    onMouseEnter={() => setHoveredArtworkId(artwork.id)}
                                    onMouseLeave={() => setHoveredArtworkId(null)}
                                    onTouchStart={() => handleDoubleTap(artwork.id)}
                                >
                                    <div className="artwork-container">
                                        <Image alt={artwork.title} src={artwork.image} className="w-full h-auto rounded-lg" />
                                        {(isMobile || hoveredArtworkId === artwork.id) && (
                                            <div className="artwork-actions">
                                                <Button shape="circle" className="icon-button" onClick={() => handleDownload(artwork.image)}>
                                                    <DownloadOutlined />
                                                </Button>
                                                <Button
                                                    shape="circle"
                                                    className="icon-button"
                                                    onClick={() => handleLikeToggle(artwork.id)}
                                                >
                                                    <HeartFilled className={!likesLoading && userLikedArtworks && userLikedArtworks[artwork.id] > 0 ? "text-red-500" : ""} />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                    </div>
                ) : loading ? (
                    <Skeleton active />
                ) : (
                    <Empty description="No artworks found" />
                )}
            </div>
        </div>
    );
};

export default VisitorGallery;