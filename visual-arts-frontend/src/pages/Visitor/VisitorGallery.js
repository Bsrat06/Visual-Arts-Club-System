import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import API from "../../services/api";
import { Image, Typography, Button, Input, Select, Skeleton, Empty } from "antd";
import { HeartFilled, DownloadOutlined } from "@ant-design/icons";
import "../../styles/mansory-layout.css";

const { Text } = Typography;
const { Search } = Input;
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
    const [likedArtworks, setLikedArtworks] = useState(new Set());

    const user = useSelector((state) => state.auth.user);
    const nextPageRef = useRef("artwork/?approval_status=approved&page=1&page_size=20"); // Increase page_size

    useEffect(() => {
        fetchAllArtworks();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (user) fetchLikedArtworks();
    }, [user]);

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

    const fetchLikedArtworks = async () => {
        try {
            const response = await API.get("users/liked-artworks/");
            const likedIds = new Set(response.data.map((artwork) => artwork.id));
            setLikedArtworks(likedIds);
        } catch (error) {
            console.error("Error fetching liked artworks:", error);
        }
    };

    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop + 200 >=
            document.documentElement.offsetHeight
        ) {
            fetchAllArtworks();
        }
    };

    const extractCategories = (artworks) => {
        const uniqueCategories = ["All", ...new Set(artworks.map((artwork) => artwork.category))];
        setCategories(uniqueCategories);
    };

    const handleLikeToggle = async (artworkId) => {
        if (!user) {
            alert("Please log in to like artworks!");
            return;
        }

        try {
            const isLiked = likedArtworks.has(artworkId);
            if (isLiked) {
                await API.delete(`artwork/${artworkId}/unlike/`);
                setLikedArtworks((prev) => {
                    const updatedLikes = new Set(prev);
                    updatedLikes.delete(artworkId);
                    return updatedLikes;
                });
            } else {
                await API.post(`artwork/${artworkId}/like/`);
                setLikedArtworks((prev) => new Set(prev).add(artworkId));
            }
        } catch (error) {
            console.error("Error liking artwork:", error);
        }
    };

    const handleDownload = (imageUrl) => {
        const a = document.createElement("a");
        a.href = imageUrl;
        a.download = "artwork-image.jpg";
        a.click();
    };

    return (
        <div className="p-6 max-w-full mx-auto font-poppins">
            <div className="flex flex-wrap gap-4 mt-6">
                <Search
                    placeholder="Search artworks..."
                    onSearch={(value) => setSearchQuery(value)}
                    enterButton
                    className="w-full md:w-1/2 lg:w-1/3"
                />
                <Select
                    value={selectedCategory}
                    onChange={(value) => setSelectedCategory(value)}
                    className="w-full md:w-1/3 lg:w-1/4"
                >
                    {categories.map((category) => (
                        <Option key={category} value={category}>{category}</Option>
                    ))}
                </Select>
            </div>

            <div className="mt-6 p-4 w-full">
                {artworks.length > 0 ? (
                    <div className="masonry">
                        {artworks.map((artwork) => (
                            <div key={artwork.id} className="masonry-item">
                                <div className="artwork-container">
                                    <Image alt={artwork.title} src={artwork.image} className="w-full h-auto rounded-lg" />
                                    <div className="artwork-hover">
                                        <Button shape="circle" className="icon-button" onClick={() => handleDownload(artwork.image)}>
                                            <DownloadOutlined />
                                        </Button>
                                        <Button shape="circle" className="icon-button" onClick={() => handleLikeToggle(artwork.id)}>
                                            <HeartFilled className={likedArtworks.has(artwork.id) ? "text-red-500" : "text-gray-500"} />
                                        </Button>
                                    </div>
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