import React, { useEffect, useState } from "react";
import API from "../../services/api";

const ProfileActivities = () => {
  const [artworks, setArtworks] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const artworksResponse = await API.get("artwork/my_artworks/");
        const eventsResponse = await API.get("events/my_events/");
        setArtworks(artworksResponse.data);
        setEvents(eventsResponse.data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading activities...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Activities</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold">My Artworks</h2>
        {artworks.length > 0 ? (
          <ul className="list-disc pl-6">
            {artworks.map((art) => (
              <li key={art.id}>
                <strong>{art.title}</strong> - {art.approval_status}
              </li>
            ))}
          </ul>
        ) : (
          <p>No artworks submitted yet.</p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold">My Registered Events</h2>
        {events.length > 0 ? (
          <ul className="list-disc pl-6">
            {events.map((event) => (
              <li key={event.id}>
                <strong>{event.name}</strong> - {event.date}
              </li>
            ))}
          </ul>
        ) : (
          <p>No events registered yet.</p>
        )}
      </section>
    </div>
  );
};

export default ProfileActivities;
