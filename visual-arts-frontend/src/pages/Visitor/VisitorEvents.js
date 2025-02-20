import React, { useState, useEffect } from "react";
import API from "../../services/api";
import {
    Card,
    Input,
    Spin,
    Empty,
    Modal,
    Button,
    Image,
    Badge,
    Select,
} from "antd";
import {
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaCheckCircle,
    FaClock,
} from "react-icons/fa";
import { FilterOutlined, SortAscendingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

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
    const [statsLoading, setStatsLoading] = useState(true);

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
                setStatsLoading(false);
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
        let updatedEvents = [...events];

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

        setFilteredEvents(updatedEvents);
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event);
    };

    const closeModal = () => {
        setSelectedEvent(null);
    };

    // **Event Statistics**
    const statistics = [
        {
            title: "Total Events",
            value: events.length,
            icon: <FaCalendarAlt className="text-[#FFA500] text-5xl" />,
        },
        {
            title: "Upcoming Events",
            value: events.filter((event) => dayjs(event.date).isAfter(dayjs())).length,
            icon: <FaClock className="text-[#FFA500] text-5xl" />,
        },
        {
            title: "Completed Events",
            value: events.filter((event) => dayjs(event.date).isBefore(dayjs())).length,
            icon: <FaCheckCircle className="text-[#FFA500] text-5xl" />,
        },
    ];

    return (
        <div className="p-6 space-y-8 max-w-[1400px] mx-auto font-poppins">
            <h2 className="text-black text-[22px] font-semibold">Events</h2>
            <p className="text-green-500 text-sm">Events &gt; All Events</p>

            {/* ✅ Enhanced Statistics Container */}
            {/* <div className="bg-white rounded-2xl shadow-[0px_10px_60px_0px_rgba(226,236,249,0.5)] p-8 flex items-center justify-between">
                {statsLoading ? (
                    <Spin size="large" />
                ) : (
                    statistics.map((stat, index) => (
                        <div key={index} className="flex items-start space-x-6">
                            <div className="w-24 h-24 flex items-center justify-center rounded-full bg-[#FFA5001F]">
                                {stat.icon}
                            </div>

                            <div className="text-left">
                                <p className="text-[#ACACAC] text-[14px] font-[Poppins]">
                                    {stat.title}
                                </p>
                                <p className="text-[#333333] text-[34px] font-semibold font-[Poppins]">
                                    {stat.value}
                                </p>
                            </div>

                            {index < statistics.length - 1 && (
                                <div className="h-16 w-[1px] bg-[#F0F0F0] mx-8"></div>
                            )}
                        </div>
                    ))
                )}
            </div> */}

            {/* ✅ Events Table */}
            <div className="bg-white shadow-md rounded-2xl p-6">
                <h2 className="text-black text-[22px] font-semibold">All Events</h2>

                <div className="flex flex-col md:flex-row justify-between items-center pb-4">
                    <Input
                        placeholder="Search events..."
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
                        <Option value="all">All Events</Option>
                        <Option value="upcoming">Upcoming Events</Option>
                        <Option value="passed">Passed Events</Option>
                    </Select>
                    <Select
                        defaultValue="newest"
                        onChange={handleSortChange}
                        className="w-full sm:w-44 shadow-sm border-green-500 focus:border-green-500"
                        suffixIcon={<SortAscendingOutlined style={{ color: "green" }} />}
                    >
                        <Option value="newest">Date: Newest First</Option>
                        <Option value="oldest">Date: Oldest First</Option>
                        <Option value="az">Title: A-Z</Option>
                        <Option value="za">Title: Z-A</Option>
                    </Select>
                </div>

                {/* ✅ Event Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map((event) => (
                            <Badge.Ribbon key={event.id} text={dayjs(event.date).isAfter(dayjs()) ? "Upcoming" : "Passed"} color={dayjs(event.date).isAfter(dayjs()) ? "green" : "red"}>
                                <Card hoverable cover={<Image alt={event.title} src={event.event_cover} className="h-[200px] w-full object-cover rounded-lg" />} className="shadow-md transition duration-300 transform hover:scale-[1.02]" onClick={() => handleEventClick(event)}>
                                    <Meta title={event.title} description={<p className="flex items-center gap-2"><FaMapMarkerAlt /> {event.location}</p>} />
                                </Card>
                            </Badge.Ribbon>
                        ))
                    ) : (
                        <Empty description="No events found" />
                    )}
                </div>
            </div>
        </div>
    );
};

export default VisitorEvents;
