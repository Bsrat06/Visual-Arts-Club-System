import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, updateProfile } from "../../redux/slices/profileSlice";
import { useForm } from "react-hook-form";

const UserProfile = () => {
  const dispatch = useDispatch();
  const profileState = useSelector((state) => state.profile) || {};  
  const { user, loading } = profileState;
  const [profilePicPreview, setProfilePicPreview] = useState(null);

  const {
    register,
    handleSubmit,
    setValue, // ✅ Allows setting form field values dynamically
    formState: { errors, isSubmitting },
  } = useForm();

  // ✅ Fetch user data when component loads
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  // ✅ Pre-fill form when user data is available
  useEffect(() => {
    if (user) {
      setValue("username", user.username);
      setValue("email", user.email);
      setValue("first_name", user.first_name);
      setValue("last_name", user.last_name);
      setProfilePicPreview(user.profile_picture);
    }
  }, [user, setValue]);

  // ✅ Handle Profile Update
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      if (data.username) formData.append("username", data.username);
      if (data.email) formData.append("email", data.email);
      if (data.first_name) formData.append("first_name", data.first_name);
      if (data.last_name) formData.append("last_name", data.last_name);
      if (data.password) formData.append("password", data.password);
      if (data.profile_picture.length > 0) {
        formData.append("profile_picture", data.profile_picture[0]); // ✅ Profile picture update is optional
      }

      await dispatch(updateProfile(formData)).unwrap();
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Profile update failed.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">My Profile</h2>

      {loading ? (
        <p>Loading profile...</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Profile Picture Preview */}
          {profilePicPreview && (
            <img src={profilePicPreview} alt="Profile" className="w-24 h-24 rounded-full mx-auto" />
          )}

          {/* Profile Picture Upload */}
          <div>
            <label className="block text-sm font-medium">Profile Picture</label>
            <input type="file" {...register("profile_picture")} className="w-full p-2 border rounded-md" />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium">Username</label>
            <input
              type="text"
              {...register("username")}
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium">First Name</label>
            <input
              type="text"
              {...register("first_name")}
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium">Last Name</label>
            <input
              type="text"
              {...register("last_name")}
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Password (Optional) */}
          <div>
            <label className="block text-sm font-medium">New Password (optional)</label>
            <input
              type="password"
              {...register("password")}
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600"
          >
            {isSubmitting ? "Updating..." : "Update Profile"}
          </button>
        </form>
      )}
    </div>
  );
};

export default UserProfile;
