import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddProjectForm from "../../components/AddProjectForm";
import EditProjectForm from "../../components/EditProjectForm";
import { fetchProjects, removeProject } from "../../redux/slices/projectsSlice";

const ManageProjects = () => {
  const dispatch = useDispatch();
  const { projects, loading, error } = useSelector((state) => state.projects);

  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleEdit = (project) => {
    setEditingProject(project);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Manage Projects</h1>

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

