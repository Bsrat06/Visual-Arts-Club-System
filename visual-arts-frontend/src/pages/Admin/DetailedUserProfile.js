import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";

const DetailedUserProfile = () => {
  const { id } = useParams(); // Extract user ID from the URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user details from the API
    API.get(`/users/${id}/`)
      .then((response) => {
        setUser(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data || "Failed to fetch user details");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading user details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">User Profile</h1>
      <div className="border p-4 rounded">
        <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Status:</strong> {user.is_active ? "Active" : "Inactive"}</p>
        <p><strong>Joined On:</strong> {new Date(user.date_joined).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default DetailedUserProfile;
