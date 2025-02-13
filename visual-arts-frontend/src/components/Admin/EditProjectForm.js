import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { editProject } from "../../redux/slices/projectsSlice";
import API from "../../services/api";

const EditProjectForm = ({ project, onClose }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [startDate, setStartDate] = useState(project.start_date);
  const [endDate, setEndDate] = useState(project.end_date);
  const [members, setMembers] = useState(""); // Comma-separated emails
  const [userMap, setUserMap] = useState({}); // Map emails to user IDs
  

  // Fetch users and create a mapping of emails to user IDs
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await API.get("users/");
        const users = response.data.results;
        const map = {};
        users.forEach((user) => {
          map[user.email] = user.pk;
        });
        setUserMap(map);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Pre-fill members with existing emails when the form is opened
  useEffect(() => {
    if (project.members && project.members.length > 0) {
      const memberEmails = project.members
        .map((memberId) => {
          const email = Object.keys(userMap).find((key) => userMap[key] === memberId);
          return email;
        })
        .filter((email) => email !== undefined)
        .join(", ");
      setMembers(memberEmails);
    }
  }, [project.members, userMap]);

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !startDate || !endDate || !members) {
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
    const formattedStartDate = startDate.split("T")[0]; // ✅ Extract only YYYY-MM-DD for start_date
    const formattedEndDate = endDate.split("T")[0]; // ✅ Extract only YYYY-MM-DD for end_date

    const projectData = {
      id: project.id,  
      title,
      description,
      startDate: formattedStartDate,
      endDate: formattedEndDate, // ✅ Use corrected format
      members: memberIds,
    };

      console.log("Editing project:", project.id);

      console.log("Submitting Edited Project Data:", projectData);
      dispatch(editProject({ id: project.id, data: projectData }));


      setTitle("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setMembers("");
    } catch (error) {
      console.error("Error fetching user IDs:", error);
    }
  };







//     console.log("Submitting Edited Project Data:", projectData);
  
//     dispatch(editProject({ id: project.id, data: projectData })); // Pass the project ID and data
//   };
  

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h3 className="text-xl font-semibold mb-2">Edit Project</h3>
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
        type="datetime-local"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        placeholder="Enter Project Start Date"
        required
        className="border p-2 rounded mr-2"
      />
      <input
        type="datetime-local"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        placeholder="Enter Project End Date"
        required
        className="border p-2 rounded mr-2"
      />
      <input
        type="text"
        value={members}
        onChange={(e) => setMembers(e.target.value)}
        placeholder="Enter Project Members (comma-separated emails)"
        required
        className="border p-2 rounded mr-2"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Save
      </button>
      <button
        type="button"
        onClick={onClose}
        className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
      >
        Cancel
      </button>
    </form>
  );
};

export default EditProjectForm;