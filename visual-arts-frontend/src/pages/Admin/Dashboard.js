import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddArtworkForm from "../../components/AddArtworkForm";
import AddEventForm from "../../components/AddEventForm"; // Import AddEventForm
import AddProjectForm from "../../components/AddProjectForm"; // Import AddProjectForm
import { fetchArtworks, removeArtwork } from "../../redux/slices/artworkSlice";
import { fetchEvents, removeEvent } from "../../redux/slices/eventsSlice"; // Import removeEvent
import { fetchProjects, removeProject } from "../../redux/slices/projectsSlice"; // Import removeProject

const Dashboard = () => {
  const dispatch = useDispatch();

  const { artworks, loading: artworksLoading, error: artworksError } = useSelector((state) => state.artwork);
  const { events, loading: eventsLoading, error: eventsError } = useSelector((state) => state.events);
  const { projects, loading: projectsLoading, error: projectsError } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchArtworks());
    dispatch(fetchEvents());
    dispatch(fetchProjects());
  }, [dispatch]);

  console.log("Fetched Artworks in Redux:", artworks); // ✅ Debugging log

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {/* Add Artwork Form */}
      <h2 className="text-xl font-semibold mt-4">Add Artwork</h2>
      <AddArtworkForm />

      {/* Display Artworks */}
      <h2 className="text-xl font-semibold mt-4">Artworks</h2>
      {artworksLoading && <p>Loading artworks...</p>}
      {artworksError && <p className="text-red-500">{artworksError}</p>}
      <ul className="list-disc pl-6">
        {Array.isArray(artworks) && artworks.length > 0 ? (
          artworks.map((art) => (
            <li key={art.id}>
              {art.title}
              <button
                onClick={() => dispatch(removeArtwork(art.id))}
                className="text-red-500 ml-2"
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <p>No artworks available</p>
        )}
      </ul>

      {/* Add Event Form */}
      <h2 className="text-xl font-semibold mt-4">Add Event</h2>
      <AddEventForm />

      {/* Display Events */}
      <h2 className="text-xl font-semibold mt-4">Events</h2>
      {eventsLoading && <p>Loading events...</p>}
      {eventsError && <p className="text-red-500">{eventsError}</p>}
      <ul className="list-disc pl-6">
        {Array.isArray(events) && events.length > 0 ? (
          events.map((event) => (
            <li key={event.id}>
              {event.name} - {event.date}
              <button
                onClick={() => dispatch(removeEvent(event.id))}
                className="text-red-500 ml-2"
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <p>No events available</p>
        )}
      </ul>


      {/* Add Project Form */}
      <h2 className="text-xl font-semibold mt-4">Add Project</h2>
      <AddProjectForm />

      {/* Display Projects */}
      <h2 className="text-xl font-semibold mt-4">Projects</h2>
      {projectsLoading && <p>Loading projects...</p>}
      {projectsError && <p className="text-red-500">{projectsError}</p>}
      <ul className="list-disc pl-6">
        {Array.isArray(projects) && projects.length > 0 ? (
          projects.map((project) => (
            <li key={project.id}>
              {project.title}
              <button
                onClick={() => dispatch(removeProject(project.id))}
                className="text-red-500 ml-2"
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <p>No projects available</p>
        )}
      </ul>
    </div>
  );
};

export default Dashboard;