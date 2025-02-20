import React, { useState, useEffect, useRef } from "react";
import API from "../../services/api";
import { Image, Typography, Button, Input, Select, Skeleton, Empty } from "antd";
import { FaHeart, FaSearchPlus, FaShareAlt } from "react-icons/fa";
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
    
    // ✅ Start with first page
    const nextPageRef = useRef("artwork/?approval_status=approved&page=1");

    useEffect(() => {
        fetchAllArtworks();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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
                nextPageRef.current = response.data.next; // ✅ Correctly update next page
                if (!response.data.next) setHasMore(false); // ✅ Stop fetching if no more pages
            } else {
                setHasMore(false);
            }
        } catch (err) {
            setError("Failed to load artworks. Retrying...");
            setTimeout(fetchAllArtworks, 3000); // ✅ Retry fetching after 3 seconds
        } finally {
            setLoading(false);
            setIsFetching(false);
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

    return (
        <div className="p-6 max-w-full mx-auto font-poppins">
            {/* ✅ Search & Filter Section */}
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
                        <Option key={category} value={category}>
                            {category}
                        </Option>
                    ))}
                </Select>
            </div>

            {/* ✅ Masonry Layout */}
            <div className="mt-6 p-4 w-full">
                {loading && artworks.length === 0 ? (
                    <div className="masonry">
                        {[...Array(10)].map((_, index) => (
                            <div key={index} className="masonry-item">
                                <Skeleton.Button active style={{ width: "100%", height: "200px" }} />
                                <Skeleton active paragraph={{ rows: 1 }} />
                            </div>
                        ))}
                    </div>
                ) : error && artworks.length === 0 ? (
                    <Text type="danger">{error}</Text>
                ) : artworks.length > 0 ? (
                    <div className="masonry">
                        {artworks.map((artwork) => (
                            <div key={artwork.id} className="masonry-item">
                                <div className="artwork-container">
                                    <Image
                                        alt={artwork.title}
                                        src={artwork.image}
                                        className="w-full h-auto rounded-lg"
                                    />
                                    <div className="artwork-hover">
                                        <Button shape="circle" className="icon-button">
                                            <FaSearchPlus />
                                        </Button>
                                        <Button shape="circle" className="icon-button">
                                            <FaHeart />
                                        </Button>
                                        <Button shape="circle" className="icon-button">
                                            <FaShareAlt />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <Empty description="No artworks found" />
                )}
            </div>

            {/* ✅ Infinite Loading Indicator */}
            {isFetching && (
                <div className="text-center mt-6">
                    <Skeleton.Button active style={{ width: "60%", height: "50px" }} />
                </div>
            )}
        </div>
    );
};

export default VisitorGallery;
