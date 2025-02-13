import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddProjectForm from "../../components/Admin/AddProjectForm";
import EditProjectForm from "../../components/Admin/EditProjectForm";
import { fetchProjects, removeProject } from "../../redux/slices/projectsSlice";
import API from "../../services/api"; // Import API service for fetching stats

const ManageProjects = () => {
  const dispatch = useDispatch();
  const { projects, loading, error } = useSelector((state) => state.projects);

  const [editingProject, setEditingProject] = useState(null);
  const [projectStats, setProjectStats] = useState(null); // State for project stats
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  useEffect(() => {
    dispatch(fetchProjects());
    fetchProjectStats();
  }, [dispatch]);

  const fetchProjectStats = async () => {
    try {
      const response = await API.get("/project-stats/");
      setProjectStats(response.data);
      setStatsLoading(false);
    } catch (err) {
      setStatsError(err.response?.data || "Failed to load project statistics.");
      setStatsLoading(false);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Manage Projects</h1>

      {/* Project Statistics */}
      <h2 className="text-xl font-semibold mt-4">Project Statistics</h2>
      {statsLoading ? (
        <p>Loading project statistics...</p>
      ) : statsError ? (
        <p className="text-red-500">{statsError}</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded shadow">
            <h2 className="text-xl font-semibold">Total Projects</h2>
            <p className="text-2xl">{projectStats.total_projects}</p>
          </div>
          <div className="bg-green-100 p-4 rounded shadow">
            <h2 className="text-xl font-semibold">Completed Projects</h2>
            <p className="text-2xl">{projectStats.completed_projects}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded shadow">
            <h2 className="text-xl font-semibold">Ongoing Projects</h2>
            <p className="text-2xl">{projectStats.ongoing_projects}</p>
          </div>
        </div>
      )}

      {/* Add Project */}
      <h2 className="text-xl font-semibold mt-4">Add Project</h2>
      <AddProjectForm />

      {/* Edit Project */}
      {editingProject && (
        <EditProjectForm
          project={editingProject}
          onClose={() => setEditingProject(null)}
        />
      )}

      {/* Display Projects */}
      <h2 className="text-xl font-semibold mt-4">Projects List</h2>
      {loading && <p>Loading projects...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="list-disc pl-6">
        {Array.isArray(projects) && projects.length > 0 ? (
          projects.map((project) => (
            <li key={project.id}>
              <p>{project.title}</p>
              <button
                onClick={() => handleEdit(project)}
                className="text-blue-500 ml-2"
              >
                Edit
              </button>
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

export default ManageProjects;
