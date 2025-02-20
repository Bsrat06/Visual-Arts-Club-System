import React, { useState, useEffect } from "react";
import API from "../../services/api";
import { Switch, message } from "antd";

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
            message.success("Preferences updated successfully.");
        } catch {
            message.error("Failed to save preferences.");
        }
    };

    if (loading) return <p>Loading preferences...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="space-y-4">
            {["event_update", "project_invite", "artwork_approved"].map((type) => (
                <div key={type} className="flex items-center space-x-3">
                    <Switch
                        checked={preferences[type] || false}
                        onChange={() => handleToggle(type)}
                        className="custom-switch"
                    />
                    <span className="text-lg">{type.replace("_", " ")}</span>
                </div>
            ))}
            <button onClick={handleSave} className="orange-btn mt-4">
                Save Preferences
            </button>
        </div>
    );
};

export default NotificationPreferences;
