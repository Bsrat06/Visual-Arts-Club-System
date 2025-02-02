import { useState } from "react";
import { useDispatch } from "react-redux";
import { addProject } from "../redux/slices/projectsSlice";

const AddProjectForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addProject({ title, description }));
    setTitle(""); // Clear input after submission
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter Project Title"
        required
        className="border p-2 rounded mr-2"
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter Project Description"
        required
        className="border p-2 rounded mr-2"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Add Project
      </button>
    </form>
  );
};

export default AddProjectForm;
