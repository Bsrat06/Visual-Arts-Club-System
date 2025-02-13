import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotificationPreferences, updateNotificationPreferences } from "../../redux/slices/notificationPreferencesSlice";

const Settings = () => {
  const dispatch = useDispatch();
  const { preferences, loading, error } = useSelector((state) => state.notificationPreferences);

  const [localPreferences, setLocalPreferences] = useState({});

  useEffect(() => {
    dispatch(fetchNotificationPreferences());
  }, [dispatch]);

  useEffect(() => {
    if (preferences) {
      setLocalPreferences(preferences);
    }
  }, [preferences]);

  const handlePreferenceChange = (type, value) => {
    setLocalPreferences({ ...localPreferences, [type]: value });
  };

  const savePreferences = () => {
    dispatch(updateNotificationPreferences(localPreferences));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Settings</h1>
      
      {/* Notification Preferences Section */}
      <h2 className="text-xl font-semibold mt-4">Notification Preferences</h2>
      {loading && <p>Loading preferences...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {preferences && (
        <form onSubmit={(e) => e.preventDefault()}>
          <label className="block mt-2">
            <input
              type="checkbox"
              checked={localPreferences.artwork_approved || false}
              onChange={(e) => handlePreferenceChange("artwork_approved", e.target.checked)}
            />
            Artwork Approved Notifications
          </label>
          <label className="block mt-2">
            <input
              type="checkbox"
              checked={localPreferences.event_update || false}
              onChange={(e) => handlePreferenceChange("event_update", e.target.checked)}
            />
            Event Updates
          </label>
          <label className="block mt-2">
            <input
              type="checkbox"
              checked={localPreferences.project_invite || false}
              onChange={(e) => handlePreferenceChange("project_invite", e.target.checked)}
            />
            Project Invitations
          </label>
          <button
            type="button"
            onClick={savePreferences}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            Save Preferences
          </button>
        </form>
      )}
    </div>
  );
};

export default Settings;
