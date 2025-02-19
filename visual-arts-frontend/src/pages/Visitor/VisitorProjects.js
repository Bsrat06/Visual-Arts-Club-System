import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../../redux/slices/projectsSlice";
import { Card, Input, Spin, Empty, Select, Badge, Image } from "antd";
import { FilterOutlined, SortAscendingOutlined } from "@ant-design/icons";

const { Meta } = Card;
const { Option } = Select;

const VisitorProjects = () => {
    const dispatch = useDispatch();
    const { projects, loading, error } = useSelector((state) => state.projects);
    
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [selectedSort, setSelectedSort] = useState("newest");
    const [filteredProjects, setFilteredProjects] = useState([]);

    useEffect(() => {
        dispatch(fetchProjects());
    }, [dispatch]);

    useEffect(() => {
        applyFiltersAndSorting(searchQuery, selectedFilter, selectedSort);
    }, [projects, searchQuery, selectedFilter, selectedSort]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const handleFilterChange = (value) => {
        setSelectedFilter(value);
    };

    const handleSortChange = (value) => {
        setSelectedSort(value);
    };

    const applyFiltersAndSorting = (search, filter, sort) => {
        let updatedProjects = [...projects]; // Avoid mutating state

        if (search) {
            updatedProjects = updatedProjects.filter((project) =>
                project.title.toLowerCase().includes(search)
            );
        }

        if (filter === "completed") {
            updatedProjects = updatedProjects.filter((project) => project.status === "completed");
        } else if (filter === "ongoing") {
            updatedProjects = updatedProjects.filter((project) => project.status === "ongoing");
        }

        if (sort === "newest") {
            updatedProjects.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
        } else if (sort === "oldest") {
            updatedProjects.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
        } else if (sort === "az") {
            updatedProjects.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sort === "za") {
            updatedProjects.sort((a, b) => b.title.localeCompare(a.title));
        }

        setFilteredProjects(updatedProjects);
    };

    return (
        <div className="p-6 max-w-[1400px] mx-auto font-poppins">
            {/* ✅ Outer Title */}
            <h2 className="text-black text-[22px] font-semibold">Projects</h2>
            <p className="text-green-500 text-sm">Projects &gt; All Projects</p>

            {/* ✅ Projects Container */}
            <div className="bg-white shadow-lg p-6 rounded-lg mt-4 max-w-full">
                {/* ✅ Title, Search, Filter & Sort Section */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-4 border-b border-gray-300">
                    <h2 className="text-black text-[20px] font-semibold self-start">All Projects</h2>
                    
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Input
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="w-full sm:w-60 shadow-sm border-green-500 focus:border-green-500"
                        />
                        <Select
                            defaultValue="all"
                            onChange={handleFilterChange}
                            className="w-full sm:w-44 shadow-sm border-green-500 focus:border-green-500"
                            suffixIcon={<FilterOutlined style={{ color: "green" }} />}
                        >
                            <Option value="all">All Projects</Option>
                            <Option value="completed">Completed</Option>
                            <Option value="ongoing">Ongoing</Option>
                        </Select>
                        <Select
                            defaultValue="newest"
                            onChange={handleSortChange}
                            className="w-full sm:w-44 shadow-sm border-green-500 focus:border-green-500"
                            suffixIcon={<SortAscendingOutlined style={{ color: "green" }} />}
                        >
                            <Option value="newest">Start Date: Newest First</Option>
                            <Option value="oldest">Start Date: Oldest First</Option>
                            <Option value="az">Title: A-Z</Option>
                            <Option value="za">Title: Z-A</Option>
                        </Select>
                    </div>
                </div>

                {/* ✅ Projects List (Everything Scrolls) */}
                <div className="mt-4">
                    {loading ? (
                        <div className="flex justify-center">
                            <Spin size="large" />
                        </div>
                    ) : error ? (
                        <p className="text-red-500 text-center">{error}</p>
                    ) : filteredProjects.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {filteredProjects.map((project) => (
                                <Badge.Ribbon
                                    key={project.id}
                                    text={project.status === "completed" ? "Completed" : "Ongoing"}
                                    color={project.status === "completed" ? "green" : "orange"}
                                >
                                    <Card
                                        hoverable
                                        cover={
                                            project.image ? (
                                                <Image
                                                    alt={project.title}
                                                    src={project.image}
                                                    className="h-[200px] w-full object-cover rounded-lg"
                                                />
                                            ) : null
                                        }
                                        className="shadow-md transition duration-300 transform hover:scale-[1.02]"
                                    >
                                        <Meta
                                            title={<span className="text-lg font-semibold text-black">{project.title}</span>}
                                            description={<p className="text-gray-500">{project.description}</p>}
                                        />
                                    </Card>
                                </Badge.Ribbon>
                            ))}
                        </div>
                    ) : (
                        <Empty description="No projects found" />
                    )}
                </div>
            </div>
        </div>
    );
};

export default VisitorProjects;
