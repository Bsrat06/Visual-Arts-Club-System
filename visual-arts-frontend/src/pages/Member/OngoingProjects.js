import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../../redux/slices/projectsSlice";

const OngoingProjects = () => {
  const dispatch = useDispatch();
  const { projects, loading, error } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Ongoing Projects</h1>
      {loading && <p>Loading projects...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="list-disc pl-6">
        {Array.isArray(projects) && projects.length > 0 ? (
          projects.map((project) => (
            <li key={project.id}>{project.title}</li>
          ))
        ) : (
          <p>No ongoing projects</p>
        )}
      </ul>
    </div>
  );
};

export default OngoingProjects;
