import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import API from "../../services/api";

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth); // Fetch user data from Redux

  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    password: "",
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [message, setMessage] = useState(""); // For success or error messages
  const [isSuccess, setIsSuccess] = useState(false); // To style the message appropriately

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFormData = new FormData();

    // Append non-empty fields
    Object.entries(formData).forEach(([key, value]) => {
      if (value.trim() !== "") {
        updatedFormData.append(key, value);
      }
    });

    // Append profile picture if selected
    if (profilePicture) {
      updatedFormData.append("profile_picture", profilePicture);
    }

    try {
      const response = await API.put("auth/profile/update/", updatedFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(response.data.detail);
      setIsSuccess(true);

      // Fetch updated user data and update Redux
      const userResponse = await API.get("auth/user/");
      dispatch({ type: "auth/updateUser", payload: userResponse.data });

      setFormData({ ...formData, password: "" });
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Error updating profile. Please try again.");
      setIsSuccess(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl font-bold mb-4">Update Profile</h2>

      {message && (
        <p className={`text-${isSuccess ? "green" : "red"}-500 mb-4`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 w-1/2">
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          className="border p-2 rounded w-full"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          placeholder="First Name"
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          placeholder="Last Name"
          className="border p-2 rounded w-full"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="New Password (optional)"
          className="border p-2 rounded w-full"
        />
        <input
          type="file"
          name="profile_picture"
          onChange={handleFileChange}
          className="border p-2 rounded w-full"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UserProfile;
