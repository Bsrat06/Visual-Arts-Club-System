import React, { useState, useEffect } from "react";
import API from "../../services/api";
import { Spin, Empty, Pagination, Image, Typography, Button, Input, Select } from "antd";
import { FaHeart, FaSearchPlus, FaShareAlt } from "react-icons/fa";
import "../../styles/mansory-layout.css";


const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const VisitorGallery = () => {
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
                    nextPage = response.data.next;
                }

                setArtworks(allApprovedArtworks);
                setFilteredArtworks(allApprovedArtworks);
                extractCategories(allApprovedArtworks);
                setTotalPages(Math.ceil(allApprovedArtworks.length / 10));
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
        setTotalPages(Math.ceil(filtered.length / 10));
    };

    const displayedArtworks = filteredArtworks.slice((currentPage - 1) * 10, currentPage * 10);

    const handlePageChange = (page) => setCurrentPage(page);

    return (
        <div className="p-6 max-w-full mx-auto font-poppins">
            
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

            {/* ✅ Masonry Layout with Hover Icons */}
            <div className="mt-6 p-4 w-full">
                {loading ? (
                    <div className="flex justify-center">
                        <Spin size="large" />
                    </div>
                ) : error ? (
                    <Text type="danger">{error}</Text>
                ) : displayedArtworks.length > 0 ? (
                    <div className="masonry">
                        {displayedArtworks.map((artwork) => (
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
                    <Empty description="No artworks found in this category" />
                )}
            </div>

            {/* ✅ Pagination */}
            <Pagination
    current={currentPage}
    total={totalPages * 20} // Change 10 to 20
    pageSize={20} // Update page size
    showSizeChanger={false}
    onChange={handlePageChange}
    className="text-center mt-6"
/>

        </div>
    );
};

export default VisitorGallery;
