import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../../redux/slices/projectsSlice";

const VisitorProjects = () => {
  const dispatch = useDispatch();
  const { projects, loading, error } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Our Projects</h1>
      {loading && <p>Loading projects...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {projects.length > 0 ? (
        <ul className="list-disc pl-6">
          {projects.map((project) => (
            <li key={project.id}>
              <h3 className="font-semibold">{project.title}</h3>
              <p>{project.description}</p>
              <p>{project.status}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No projects available.</p>
      )}
    </div>
  );
};

export default VisitorProjects;
