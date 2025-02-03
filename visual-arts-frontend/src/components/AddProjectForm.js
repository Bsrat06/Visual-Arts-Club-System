import { useState } from "react";
import { useDispatch } from "react-redux";
import { addProject } from "../redux/slices/projectsSlice";
import API from "../services/api";

const AddProjectForm = () => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [start_date, setStart_date] = useState("");
  const [end_date, setEnd_date] = useState("");
  const [members, setMembers] = useState(""); //collect emails

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   dispatch(addProject({ title, description }));
  //   setTitle(""); // Clear input after submission
  //   setDescription("");
  // };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !start_date || !end_date || !members) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      // Convert emails to user IDs
      const emails = members.split(",").map((email) => email.trim());
      const response = await API.get("users/"); // ✅ Fetch all users from API
      console.log("API Response:", response.data);
      
      const users = response.data.results; // ✅ Extract the array correctly
      const userMap = {};
      users.forEach((user) => {
        userMap[user.email] = user.pk;
      });

      console.log("User Mapping:", userMap);

      const memberIds = emails.map((email) => userMap[email]).filter((id) => id !== undefined);

      console.log("Mapped Member IDs:", memberIds); // ✅ Debug log

      // ✅ Convert datetime input (`YYYY-MM-DDTHH:MM`) to `YYYY-MM-DD`
    const formattedStartDate = start_date.split("T")[0]; // ✅ Extract only YYYY-MM-DD for start_date
    const formattedEndDate = end_date.split("T")[0]; // ✅ Extract only YYYY-MM-DD for end_date

    const projectData = {
      title,
      description,
      start_date: formattedStartDate,
      end_date: formattedEndDate, // ✅ Use corrected format
      members: memberIds,
    };

      console.log("Submitting Project Data:", projectData);
      dispatch(addProject(projectData));

      setTitle("");
      setDescription("");
      setStart_date("");
      setEnd_date("");
      setMembers("");
    } catch (error) {
      console.error("Error fetching user IDs:", error);
    }
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

      <input
        type="datetime-local"  // Ensure correct date format
        value={start_date}
        onChange={(e) => setStart_date(e.target.value)}
        placeholder="Enter Project Start-Date"
        required
        className="border p-2 rounded w-full mr-2"
      />

      <input
        type="datetime-local"  // Ensure correct date format
        value={end_date}
        onChange={(e) => setEnd_date(e.target.value)}
        placeholder="Enter Project End-Date"
        required
        className="border p-2 rounded w-full mr-2"
      />

      <input
        type="text"
        value={members}
        onChange={(e) => setMembers(e.target.value)}
        placeholder="Enter Project Members (comma-separated)"
        required
        className="border p-2 rounded w-full mr-2"
      />



      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Add Project
      </button>
    </form>
  );
};

export default AddProjectForm;
