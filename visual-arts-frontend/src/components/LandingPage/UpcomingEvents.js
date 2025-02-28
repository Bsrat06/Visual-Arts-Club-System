import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllEvents } from "../../redux/slices/eventsSlice";
import { Spin, Card, Button, Empty, Modal } from "antd";
import { CalendarOutlined, EnvironmentOutlined, ClockCircleOutlined } from "@ant-design/icons";

const UpcomingEvents = () => {
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state) => state.events);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    dispatch(fetchAllEvents());
  }, [dispatch]);

  const upcomingEvents = events.filter((event) => !event.is_completed);

  const calculateTimeLeft = (eventDate) => {
    const difference = new Date(eventDate) - new Date();
    if (difference <= 0) return null;

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000)) % 60;

    return { days, hours, minutes, seconds };
  };

  const [timers, setTimers] = useState({});

  useEffect(() => {
    if (upcomingEvents.length > 0) {
      const interval = setInterval(() => {
        const newTimers = {};
        upcomingEvents.forEach((event) => {
          newTimers[event.id] = calculateTimeLeft(event.date);
        });
        setTimers(newTimers);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [upcomingEvents]);

  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-screen-xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
          Upcoming Events
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Join our upcoming events and be part of our creative journey.
        </p>
      </div>

      {loading && (
        <div className="flex justify-center mt-8">
          <Spin size="large" />
        </div>
      )}

      {error && (
        <div className="text-red-600 text-center mt-4">
          Failed to load events. Please try again later.
        </div>
      )}

      {upcomingEvents.length > 0 ? (
        <div className="grid grid-cols-1 mt-12 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingEvents.map((event) => (
            <Card
              key={event.id}
              hoverable
              className="shadow-md border border-gray-50 rounded-lg overflow-hidden flex"
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
                      <span>
                        <CalendarOutlined className="mr-2" />
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                      <span>
                        <EnvironmentOutlined className="mr-2" />
                        {event.location}
                      </span>
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
                  <Button
                    type="primary"
                    className="mt-4 bg-orange-600 w-full"
                    onClick={() => setSelectedEvent(event)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex justify-center mt-12">
          <Empty description="No upcoming events at the moment" />
        </div>
      )}

      {selectedEvent && (
        <Modal
          open={!!selectedEvent}
          onCancel={() => setSelectedEvent(null)}
          footer={null}
          centered
          width={1000} // Increased modal width
        >
          <div className="grid grid-cols-2 gap-8"> {/* Increased gap */}
            <div className="h-full">
              <img
                src={selectedEvent.event_cover || "/images/default-event.jpg"}
                alt={selectedEvent.title}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <h1>{selectedEvent.title}</h1>
                <p className="text-gray-700 text-lg">{selectedEvent.description}</p> {/* Increased font size */}
                <div className="mt-4 flex flex-col text-gray-700 space-y-2 text-lg"> {/* Increased font and space */}
                  <span>
                    <CalendarOutlined className="mr-2" />
                    {new Date(selectedEvent.date).toLocaleDateString()}
                  </span>
                  <span>
                    <EnvironmentOutlined className="mr-2" />
                    {selectedEvent.location}
                  </span>
                </div>
              </div>
              <div>
                {/* Additional info or buttons can be added here */}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
};

export default UpcomingEvents;