import React, { useState, useEffect } from "react";
import API from "../../services/api";
import { Spin, Empty, Pagination, Image, Grid, Typography, Avatar, Button, Input, Select } from "antd";
import { FaHeart, FaSearchPlus, FaShareAlt } from "react-icons/fa";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;
const { Search } = Input;
const { Option } = Select;

const VisitorGallery = () => {
    const screens = useBreakpoint();
    const [artworks, setArtworks] = useState([]);
    const [filteredArtworks, setFilteredArtworks] = useState([]);
    const [categories, setCategories] = useState(["All"]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchAllArtworks = async () => {
            setLoading(true);
            try {
                let allApprovedArtworks = [];
                let nextPage = `artwork/?approval_status=approved&page=1`;

                while (nextPage) {
                    const response = await API.get(nextPage);
                    allApprovedArtworks = [...allApprovedArtworks, ...response.data.results];
                    nextPage = response.data.next; // Fetch next page if available
                }

                setArtworks(allApprovedArtworks);
                setFilteredArtworks(allApprovedArtworks);
                extractCategories(allApprovedArtworks);
                setTotalPages(Math.ceil(allApprovedArtworks.length / 10)); // Adjust pagination based on total artworks
            } catch (err) {
                setError("Failed to fetch artworks. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllArtworks();
    }, []);

    const extractCategories = (artworks) => {
        const uniqueCategories = [...new Set(artworks.map((artwork) => artwork.category))];
        setCategories(["All", ...uniqueCategories]);
    };

    const handleFilterByCategory = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
        filterArtworks(searchQuery, category);
    };

    const handleSearch = (value) => {
        setSearchQuery(value);
        filterArtworks(value, selectedCategory);
    };

    const filterArtworks = (query, category) => {
        let filtered = artworks;

        if (category !== "All") {
            filtered = filtered.filter((artwork) => artwork.category === category);
        }

        if (query) {
            filtered = filtered.filter((artwork) =>
                artwork.title.toLowerCase().includes(query.toLowerCase())
            );
        }

        setFilteredArtworks(filtered);
        setTotalPages(Math.ceil(filtered.length / 10)); // Update pagination dynamically
    };

    const displayedArtworks = filteredArtworks.slice((currentPage - 1) * 10, currentPage * 10);

    const handlePageChange = (page) => setCurrentPage(page);

    return (
        <div className="p-6 max-w-full mx-auto font-poppins">
            <Title level={2}>Gallery</Title>
            <Text type="secondary">Gallery &gt; Public Artworks</Text>

            {/* ✅ Search & Filter Section */}
            <div className="flex flex-wrap gap-4 mt-6">
                <Search
                    placeholder="Search artworks..."
                    onSearch={handleSearch}
                    enterButton
                    className="w-full md:w-1/2 lg:w-1/3"
                />
                <Select
                    value={selectedCategory}
                    onChange={handleFilterByCategory}
                    className="w-full md:w-1/3 lg:w-1/4"
                >
                    {categories.map((category) => (
                        <Option key={category} value={category}>
                            {category}
                        </Option>
                    ))}
                </Select>
            </div>

            {/* ✅ Masonry Grid Layout */}
            <div className="mt-6 p-4 w-full">
                {loading ? (
                    <div className="flex justify-center">
                        <Spin size="large" />
                    </div>
                ) : error ? (
                    <Text type="danger">{error}</Text>
                ) : displayedArtworks.length > 0 ? (
                    <div className="columns-2 md:columns-3 lg:columns-5 xl:columns-6 gap-4 space-y-4">
                        {displayedArtworks.map((artwork) => (
                            <div key={artwork.id} className="relative group overflow-hidden rounded-lg">
                                {/* ✅ Artwork Image */}
                                <Image
                                    alt={artwork.title}
                                    src={artwork.image}
                                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                                />

                                {/* ✅ Overlay on Hover */}
                                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                    <div className="flex items-center space-x-3">
                                        <Avatar
                                            src={artwork.artist?.profile_picture} // ✅ Ensure artist profile picture is handled safely
                                            size="large"
                                        />
                                        <Text className="text-white text-lg font-semibold">{artwork.artist?.name}</Text>
                                    </div>
                                    {/* ✅ Action Icons */}
                                    <div className="flex justify-between mt-3">
                                        <Button
                                            type="primary"
                                            shape="circle"
                                            icon={<FaSearchPlus />}
                                            className="bg-orange-500 border-none"
                                        />
                                        <Button
                                            type="primary"
                                            shape="circle"
                                            icon={<FaHeart />}
                                            className="bg-orange-500 border-none"
                                        />
                                        <Button
                                            type="primary"
                                            shape="circle"
                                            icon={<FaShareAlt />}
                                            className="bg-orange-500 border-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <Empty description="No artworks found in this category" />
                )}
            </div>

            {/* ✅ Pagination */}
            <Pagination
                current={currentPage}
                total={totalPages * 10}
                pageSize={10}
                showSizeChanger={false}
                onChange={handlePageChange}
                className="text-center mt-6"
            />
        </div>
    );
};

export default VisitorGallery;
