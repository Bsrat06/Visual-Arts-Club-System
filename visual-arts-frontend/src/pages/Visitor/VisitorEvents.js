import React, { useState, useEffect } from "react";
import API from "../../services/api";
import { Card, Input, Spin, Empty, Modal, Button, Image, Badge } from "antd";
import { CalendarOutlined, EnvironmentOutlined } from "@ant-design/icons";
import dayjs from "dayjs"; // ✅ Import Day.js for Date Handling

const { Meta } = Card;

const VisitorEvents = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
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
        const filtered = events.filter((event) => event.title.toLowerCase().includes(query));
        setFilteredEvents(filtered);
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event);
    };

    const closeModal = () => {
        setSelectedEvent(null);
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>

            {/* ✅ Search Bar */}
            <Input
                placeholder="Search for events..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full mb-6 shadow-sm"
            />

            {/* ✅ Loading & Error Handling */}
            {loading ? (
                <div className="flex justify-center">
                    <Spin size="large" />
                </div>
            ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => {
                        const isUpcoming = dayjs(event.date).isAfter(dayjs()); // ✅ Check if event is in the future
                        return (
                            <Badge.Ribbon 
                                text={isUpcoming ? "Upcoming" : "Passed"} 
                                color={isUpcoming ? "green" : "red"}
                                key={event.id}
                            >
                                <Card
                                    hoverable
                                    cover={
                                        <Image 
                                            alt={event.title} 
                                            src={event.event_cover} 
                                            className="h-[200px] w-full object-cover" 
                                        />
                                    }
                                    className="shadow-md transition duration-300 transform hover:scale-[1.02]"
                                    onClick={() => handleEventClick(event)}
                                >
                                    <Meta
                                        title={<span className="text-lg font-semibold">{event.title}</span>}
                                        description={
                                            <>
                                                <p className="flex items-center gap-2">
                                                    <CalendarOutlined /> {event.date}
                                                </p>
                                                <p className="flex items-center gap-2">
                                                    <EnvironmentOutlined /> {event.location}
                                                </p>
                                            </>
                                        }
                                    />
                                </Card>
                            </Badge.Ribbon>
                        );
                    })}
                </div>
            ) : (
                <Empty description="No events found" />
            )}

            {/* ✅ Event Details Modal */}
            <Modal
                title={selectedEvent?.title}
                open={!!selectedEvent}
                onCancel={closeModal}
                footer={[
                    <Button key="close" type="primary" onClick={closeModal}>
                        Close
                    </Button>,
                ]}
            >
                {selectedEvent && (
                    <div>
                        <Image
                            alt={selectedEvent.title}
                            src={selectedEvent.event_cover}
                            className="w-full h-[250px] object-cover mb-4"
                        />
                        <p><strong>Date:</strong> {selectedEvent.date}</p>
                        <p><strong>Location:</strong> {selectedEvent.location}</p>
                        <p className="mt-4">{selectedEvent.description}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default VisitorEvents;
