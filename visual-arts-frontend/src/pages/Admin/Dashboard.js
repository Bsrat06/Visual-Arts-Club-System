import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArtworks } from "../../redux/slices/artworkSlice";
import { fetchEvents } from "../../redux/slices/eventsSlice";
import { fetchProjects } from "../../redux/slices/projectsSlice";

const Dashboard = () => {
  const dispatch = useDispatch();

  // Get data from Redux store
  const { artworks, loading: artworksLoading, error: artworksError } = useSelector((state) => state.artwork);
  const { events, loading: eventsLoading, error: eventsError } = useSelector((state) => state.events);
  const { projects, loading: projectsLoading, error: projectsError } = useSelector((state) => state.projects);

  // Fetch data when component mounts
  useEffect(() => {
    dispatch(fetchArtworks());
    dispatch(fetchEvents());
    dispatch(fetchProjects());
  }, [dispatch]);

  // Debugging logs
  console.log("Fetched Artworks:", artworks);
  console.log("Fetched Events:", events);
  console.log("Fetched Projects:", projects);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {/* Display Artwork */}
      <h2 className="text-xl font-semibold mt-4">Artworks</h2>
      {artworksLoading && <p>Loading artworks...</p>}
      {artworksError && <p className="text-red-500">{artworksError}</p>}
      <ul className="list-disc pl-6">
        {Array.isArray(artworks) && artworks.length > 0 ? (
          artworks.map((art) => <li key={art.id}>{art.title}</li>)
        ) : (
          <p>No artworks available</p>
        )}
      </ul>

      {/* Display Events */}
      <h2 className="text-xl font-semibold mt-4">Events</h2>
      {eventsLoading && <p>Loading events...</p>}
      {eventsError && <p className="text-red-500">{eventsError}</p>}
      <ul className="list-disc pl-6">
        {Array.isArray(events) && events.length > 0 ? (
          events.map((event) => <li key={event.id}>{event.name} - {event.date}</li>)
        ) : (
          <p>No events available</p>
        )}
      </ul>

      {/* Display Projects */}
      <h2 className="text-xl font-semibold mt-4">Projects</h2>
      {projectsLoading && <p>Loading projects...</p>}
      {projectsError && <p className="text-red-500">{projectsError}</p>}
      <ul className="list-disc pl-6">
        {Array.isArray(projects) && projects.length > 0 ? (
          projects.map((project) => <li key={project.id}>{project.title}</li>)
        ) : (
          <p>No projects available</p>
        )}
      </ul>
    </div>
  );
};

export default Dashboard;
