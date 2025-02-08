import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArtworks } from "../../redux/slices/artworkSlice";
import { fetchEvents } from "../../redux/slices/eventsSlice";
import { fetchProjects } from "../../redux/slices/projectsSlice";

const HomePage = () => {
  const dispatch = useDispatch();
  const { artworks } = useSelector((state) => state.artwork);
  const { events } = useSelector((state) => state.events);
  const { projects } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchArtworks());
    dispatch(fetchEvents());
    dispatch(fetchProjects());
  }, [dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to Our Platform: Visual Arts</h1>
      
      {/* Featured Artworks */}
      <h2 className="text-xl font-semibold mt-4">Featured Artworks</h2>
      <ul className="list-disc pl-6">
        {artworks.slice(0, 5).map((art) => (
          <li key={art.id}>{art.title}</li>
        ))}
      </ul>

      {/* Upcoming Events */}
      <h2 className="text-xl font-semibold mt-4">Upcoming Events</h2>
      <ul className="list-disc pl-6">
        {events.slice(0, 5).map((event) => (
          <li key={event.id}>
            {event.name} - {event.date}
          </li>
        ))}
      </ul>

      {/* Active Projects */}
      <h2 className="text-xl font-semibold mt-4">Active Projects</h2>
      <ul className="list-disc pl-6">
        {projects.slice(0, 5).map((project) => (
          <li key={project.id}>{project.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
