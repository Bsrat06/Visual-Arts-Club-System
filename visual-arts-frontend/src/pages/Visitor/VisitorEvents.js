import React, { useState, useEffect } from "react";
import API from "../../services/api";
import { Card, Input, Spin, Empty, Modal, Button, Image, Badge, Select } from "antd";
import { CalendarOutlined, EnvironmentOutlined, FilterOutlined, SortAscendingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
// import "../../styles/global.css";

const { Meta } = Card;
const { Option } = Select;

const VisitorEvents = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [selectedSort, setSelectedSort] = useState("newest");
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await API.get("events/");
                setEvents(response.data.results || []);
                setFilteredEvents(response.data.results || []);
            } catch (err) {
                setError("Failed to fetch events. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        applyFiltersAndSorting(query, selectedFilter, selectedSort);
    };

    const handleFilterChange = (value) => {
        setSelectedFilter(value);
        applyFiltersAndSorting(searchQuery, value, selectedSort);
    };

    const handleSortChange = (value) => {
        setSelectedSort(value);
        applyFiltersAndSorting(searchQuery, selectedFilter, value);
    };

    const applyFiltersAndSorting = (search, filter, sort) => {
        let updatedEvents = events;

        if (search) {
            updatedEvents = updatedEvents.filter((event) =>
                event.title.toLowerCase().includes(search)
            );
        }

        if (filter === "upcoming") {
            updatedEvents = updatedEvents.filter((event) =>
                dayjs(event.date).isAfter(dayjs())
            );
        } else if (filter === "passed") {
            updatedEvents = updatedEvents.filter((event) =>
                dayjs(event.date).isBefore(dayjs())
            );
        }

        if (sort === "newest") {
            updatedEvents.sort((a, b) => dayjs(b.date).diff(dayjs(a.date)));
        } else if (sort === "oldest") {
            updatedEvents.sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));
        } else if (sort === "az") {
            updatedEvents.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sort === "za") {
            updatedEvents.sort((a, b) => b.title.localeCompare(a.title));
        }

        setFilteredEvents([...updatedEvents]);
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event);
    };

    const closeModal = () => {
        setSelectedEvent(null);
    };

    return (
        <div className="p-6 max-w-6xl mx-auto font-poppins">
          <h2 className="text-black text-[22px] font-semibold font-[Poppins]">Events</h2>
          <p className="text-green-500 text-sm font-[Poppins] mt-1">Events &gt; All Events</p>
            <div className="shadow-lg p-6 bg-white rounded-lg">
                
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <h2 className="text-black text-[22px] font-semibold font-[Poppins]">All Events</h2>
                    <Input
                        placeholder="Search for events..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full sm:w-2/5 shadow-sm border-orange-500 focus:border-orange-500"
                    />
                    <Select
                        defaultValue="all"
                        onChange={handleFilterChange}
                        className="w-full sm:w-1/5 shadow-sm border-orange-500 focus:border-orange-500"
                        suffixIcon={<FilterOutlined style={{ color: "orange" }} />}
                    >
                        <Option value="all">All Events</Option>
                        <Option value="upcoming">Upcoming Events</Option>
                        <Option value="passed">Passed Events</Option>
                    </Select>
                    <Select
                        defaultValue="newest"
                        onChange={handleSortChange}
                        className="w-full sm:w-1/5 shadow-sm border-orange-500 focus:border-orange-500"
                        suffixIcon={<SortAscendingOutlined style={{ color: "orange" }} />}
                    >
                        <Option value="newest">Date: Newest First</Option>
                        <Option value="oldest">Date: Oldest First</Option>
                        <Option value="az">Title: A-Z</Option>
                        <Option value="za">Title: Z-A</Option>
                    </Select>
                </div>
                {loading ? (
                    <div className="flex justify-center">
                        <Spin size="large" />
                    </div>
                ) : error ? (
                    <p className="text-red-500 text-center">{error}</p>
                ) : filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {filteredEvents.map((event) => (
                            <Badge.Ribbon key={event.id} text={dayjs(event.date).isAfter(dayjs()) ? "Upcoming" : "Passed"} color={dayjs(event.date).isAfter(dayjs()) ? "green" : "red"}>
                                <Card
                                    hoverable
                                    cover={<Image alt={event.title} src={event.event_cover} className="h-[200px] w-full object-cover rounded-lg" />}
                                    className="shadow-md transition duration-300 transform hover:scale-[1.02]"
                                    onClick={() => handleEventClick(event)}
                                >
                                    <Meta
                                        title={<span className="text-lg font-semibold text-black">{event.title}</span>}
                                        description={
                                            <>
                                                <p className="flex items-center gap-2 text-gray-500">
                                                    <CalendarOutlined /> {event.date}
                                                </p>
                                                <p className="flex items-center gap-2 text-gray-500">
                                                    <EnvironmentOutlined /> {event.location}
                                                </p>
                                            </>
                                        }
                                    />
                                </Card>
                            </Badge.Ribbon>                            
                        ))}
                    </div>
                ) : (
                    <Empty description="No events found" />
                )}
            </div>
        </div>
    );
};

export default VisitorEvents;
