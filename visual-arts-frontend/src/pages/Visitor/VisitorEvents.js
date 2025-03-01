import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllEvents } from "../../redux/slices/eventsSlice";
import { Card, Input, Spin, Empty, Modal, Badge, Select, Button } from "antd";
import { SearchOutlined, FilterOutlined, SortAscendingOutlined, CalendarOutlined, EnvironmentOutlined, ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;

const VisitorEvents = () => {
    const dispatch = useDispatch();
    const { events, loading, error } = useSelector((state) => state.events);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [timers, setTimers] = useState({});

    useEffect(() => {
        dispatch(fetchAllEvents());
    }, [dispatch]);

    useEffect(() => {
        if (events.length > 0) {
            const interval = setInterval(() => {
                const newTimers = {};
                events.forEach((event) => {
                    newTimers[event.id] = calculateTimeLeft(event.date);
                });
                setTimers(newTimers);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [events]);

    const calculateTimeLeft = (eventDate) => {
        const difference = new Date(eventDate) - new Date();
        if (difference <= 0) return null;

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000)) % 60;

        return { days, hours, minutes, seconds };
    };

    const filteredEvents = useMemo(() => {
        let updatedEvents = [...events];

        // Apply search filter
        if (searchQuery) {
            updatedEvents = updatedEvents.filter(event =>
                event.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply event status filter (Completed or Pending)
        if (filterStatus !== null) {
            updatedEvents = updatedEvents.filter(event =>
                event.is_completed === filterStatus
            );
        }

        return updatedEvents;
    }, [events, searchQuery, filterStatus]);

    const handleEventClick = (event) => {
        setSelectedEvent(event);
    };

    const closeModal = () => {
        setSelectedEvent(null);
    };

    return (
        <div className="p-6 space-y-8">
            <div className="max-w-screen-xl mx-auto text-center">
                <h2 className="text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
                    Upcoming Events
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                    Join our upcoming events and be part of our creative journey.
                </p>
            </div>

            <div className="bg-white shadow-md rounded-2xl p-6">
                <div className="flex justify-between items-center pb-4">
                    <div className="flex items-center gap-4 ml-auto">
                        
                        <Input
                            placeholder="Search by event name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-40"
                            prefix={<SearchOutlined />}
                        />
                    </div>
                    <div className="flex gap-4">
                        <Select
                            placeholder="Filter by status"
                            onChange={(value) => setFilterStatus(value)}
                            allowClear
                            suffixIcon={<FilterOutlined />}
                        >
                            <Option value={true}>Completed</Option>
                            <Option value={false}>Pending</Option>
                        </Select>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center">
                        <Spin size="large" />
                    </div>
                ) : filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {filteredEvents.map((event) => (
                            <Badge.Ribbon
                                key={event.id}
                                text={event.is_completed ? "Completed" : "Pending"}
                                color={event.is_completed ? "green" : "orange"}
                            >
                                <Card
                                    hoverable
                                    onClick={() => handleEventClick(event)}
                                    cover={
                                        event.event_cover ? (
                                            <img
                                                alt={event.title}
                                                src={event.event_cover}
                                                className="h-[200px] w-full object-cover rounded-lg"
                                            />
                                        ) : null
                                    }
                                    className="shadow-md transition duration-300 transform hover:scale-[1.02] cursor-pointer"
                                >
                                    <Card.Meta
                                        title={<span className="text-lg font-semibold text-black">{event.title}</span>}
                                        description={
                                            <div className="text-gray-500">
                                                <p>{dayjs(event.date).format("MMMM D, YYYY")}</p>
                                                <p>{event.location}</p>
                                            </div>
                                        }
                                    />
                                </Card>
                            </Badge.Ribbon>
                        ))}
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <Empty description="No events found" />
                    </div>
                )}
            </div>

            {selectedEvent && (
                <Modal
                    title={selectedEvent.title}
                    open={!!selectedEvent}
                    onCancel={closeModal}
                    footer={null}
                    centered
                    width={1000}
                >
                    <div className="grid grid-cols-2 gap-8">
                        <div className="h-full">
                            <img
                                src={selectedEvent.event_cover || "/images/default-event.jpg"}
                                alt={selectedEvent.title}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                        <div className="flex flex-col justify-between">
                            <div>
                                <p className="text-gray-700 text-lg">{selectedEvent.description}</p>
                                <div className="mt-4 flex flex-col text-gray-700 space-y-2 text-lg">
                                    <span>
                                        <CalendarOutlined className="mr-2" />
                                        {dayjs(selectedEvent.date).format("MMMM D, YYYY")}
                                    </span>
                                    <span>
                                        <EnvironmentOutlined className="mr-2" />
                                        {selectedEvent.location}
                                    </span>
                                </div>
                                {timers[selectedEvent.id] && (
                                    <div className="mt-3 text-center text-gray-700 text-sm">
                                        <ClockCircleOutlined className="mr-2 text-[#FF9933]" />
                                        <span className="font-semibold">
                                            {timers[selectedEvent.id].days}d {timers[selectedEvent.id].hours}h {timers[selectedEvent.id].minutes}m {timers[selectedEvent.id].seconds}s
                                        </span>
                                        <span className="text-gray-500"> until event starts</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default VisitorEvents;