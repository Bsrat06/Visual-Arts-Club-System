import React, { useState, useEffect } from "react";
import API from "../../services/api";
import { Card, Input, Spin, Empty, Modal, Button, Image, Badge, Select } from "antd";
import { FaCalendarAlt, FaMapMarkerAlt, FaCheckCircle, FaClock } from "react-icons/fa";
import { FilterOutlined, SortAscendingOutlined, CalendarOutlined, EnvironmentOutlined, ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

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
  const [timers, setTimers] = useState({});

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

  useEffect(() => {
    if (filteredEvents.length > 0) {
      const interval = setInterval(() => {
        const newTimers = {};
        filteredEvents.forEach((event) => {
          newTimers[event.id] = calculateTimeLeft(event.date);
        });
        setTimers(newTimers);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [filteredEvents]);

  const calculateTimeLeft = (eventDate) => {
    const difference = new Date(eventDate) - new Date();
    if (difference <= 0) return null;

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000)) % 60;

    return { days, hours, minutes, seconds };
  };

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

    
  
    // Apply search filter
    if (search) {
      updatedEvents = updatedEvents.filter(event => 
        event.title.toLowerCase().includes(search)
      );
    }
  
    // Apply event status filter (Upcoming, Passed, or All)
    if (filter === "upcoming") {
      updatedEvents = updatedEvents.filter(event => 
        dayjs(event.date).isAfter(dayjs(), 'day')
      );
    } else if (filter === "passed") {
      updatedEvents = updatedEvents.filter(event => 
        dayjs(event.date).isBefore(dayjs(), 'day')
      );
    }
  
    // Apply sorting logic
    if (sort === "newest") {
      updatedEvents.sort((a, b) => dayjs(b.date).diff(dayjs(a.date)));
    } else if (sort === "oldest") {
      updatedEvents.sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));
    } else if (sort === "az") {
      updatedEvents.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "za") {
      updatedEvents.sort((a, b) => b.title.localeCompare(a.title));
    }
  
    // Update filtered events state
    setFilteredEvents(updatedEvents);
  };
  

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="p-6 space-y-8 max-w-[1400px] mx-auto font-poppins">
      <h2 className="text-black text-[22px] font-semibold">Events</h2>
      <p className="text-green-500 text-sm">Events &gt; All Events</p>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {filteredEvents.length > 0 ? (
        filteredEvents.map((event) => (
            <Badge.Ribbon key={event.id} text={dayjs(event.date).isAfter(dayjs()) ? "Upcoming" : "Passed"} color={dayjs(event.date).isAfter(dayjs()) ? "green" : "red"}>
                <Card
                    key={event.id}
                    hoverable
                    className="shadow-md border border-gray-200 rounded-lg overflow-hidden flex"
                    onClick={() => handleEventClick(event)}
                >
                    <div className="grid grid-cols-2 w-full h-full">
                        <div className="h-full">
                            <img
                                alt={event.title}
                                src={event.event_cover || "/images/default-event.jpg"}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="p-4 flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                                <div className="mt-2 flex flex-col text-gray-700 space-y-1 text-sm">
                                    <span><CalendarOutlined className="mr-2" /> {dayjs(event.date).format("MMMM D, YYYY")}</span>
                                    <span><EnvironmentOutlined className="mr-2" /> {event.location}</span>
                                </div>
                                {timers[event.id] && (
                                    <div className="mt-3 text-center text-gray-700 text-sm">
                                        <ClockCircleOutlined className="mr-2 text-orange-600" />
                                        <span className="font-semibold">
                                            {timers[event.id].days}d {timers[event.id].hours}h {timers[event.id].minutes}m {timers[event.id].seconds}s
                                        </span>
                                        <span className="text-gray-500"> until event starts</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
            </Badge.Ribbon>
        ))
    ) : (
        <div className="flex justify-center w-full col-span-full">
            <Empty description="No events found" />
        </div>
    )}
</div>
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
                    <ClockCircleOutlined className="mr-2 text-orange-600" />
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