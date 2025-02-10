import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../redux/slices/userSlice";
import API from "../../services/api";

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    password: "",
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(user?.profile_picture_url || "");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        password: "",
      });
      setProfilePicturePreview(user.profile_picture_url || "");
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
    setProfilePicturePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updateData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value.trim() !== "") {
        updateData.append(key, value);
      }
    });
    if (profilePicture) {
      updateData.append("profile_picture", profilePicture);
    }

    try {
      dispatch(updateProfile(updateData));
      setMessage("Profile updated successfully");
      setIsSuccess(true);
      setFormData({ ...formData, password: "" });
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Error updating profile. Please try again.");
      setIsSuccess(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      {message && <p className={`text-${isSuccess ? "green" : "red"}-500`}>{message}</p>}
      {error && <p className="text-red-500">{error}</p>}
      {loading && <p>Loading...</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Profile Picture</label>
          {profilePicturePreview && (
            <img src={profilePicturePreview} alt="Profile" className="w-32 h-32 rounded-full my-2" />
          )}
          <input type="file" accept="image/*" onChange={handleFileChange} className="border p-2 rounded w-full" />
        </div>

        <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" className="border p-2 rounded w-full" />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded w-full" />
        <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" className="border p-2 rounded w-full" />
        <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" className="border p-2 rounded w-full" />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="New Password (optional)" className="border p-2 rounded w-full" />

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Update Profile</button>
      </form>
    </div>
  );
};

export default UserProfile;
