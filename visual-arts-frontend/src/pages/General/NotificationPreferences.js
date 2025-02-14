import React, { useState, useEffect } from "react";
import API from "../../services/api";
import Loading from "../../components/Shared/Loading";
import Error from "../../components/Shared/Error";

const NotificationPreferences = () => {
  const [preferences, setPreferences] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await API.get("users/preferences/");
        setPreferences(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to load preferences.");
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  const handleToggle = (type) => {
    setPreferences((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleSave = async () => {
    try {
      await API.patch("users/preferences/", preferences);
      alert("Preferences updated successfully.");
    } catch {
      alert("Failed to save preferences.");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Notification Preferences</h1>
      <div className="space-y-4">
        {["event_update", "project_invite", "artwork_approved"].map((type) => (
          <div key={type} className="flex items-center">
            <label className="flex-grow">{type.replace("_", " ")}</label>
            <input
              type="checkbox"
              checked={preferences[type] || false}
              onChange={() => handleToggle(type)}
              className="ml-4"
            />
          </div>
        ))}
      </div>
      <button onClick={handleSave} className="bg-orange-500 text-white px-4 py-2 rounded mt-4">
        Save Preferences
      </button>
    </div>
  );
};

export default NotificationPreferences;
