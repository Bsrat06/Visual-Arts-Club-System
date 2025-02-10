import React, { useState, useEffect } from "react";
import API from "../../services/api";

const NotificationPreferences = () => {
  const [preferences, setPreferences] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await API.get("users/preferences/");
        setPreferences(response.data);
      } catch (error) {
        console.error("Error fetching preferences:", error);
      } finally {
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
    } catch (error) {
      console.error("Error updating preferences:", error);
    }
  };

  if (loading) return <p>Loading preferences...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Notification Preferences</h1>
      <div className="space-y-4">
        {["event_update", "project_invite", "artwork_approved"].map((type) => (
          <div key={type}>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences[type] || false}
                onChange={() => handleToggle(type)}
                className="mr-2"
              />
              {type.replace("_", " ")}
            </label>
          </div>
        ))}
      </div>
      <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
        Save Preferences
      </button>
    </div>
  );
};

export default NotificationPreferences;
