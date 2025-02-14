import React from "react";

const NotificationBadge = ({ type }) => {
  const colors = {
    event_update: "bg-blue-100 text-blue-500",
    project_invite: "bg-green-100 text-green-500",
    artwork_approved: "bg-orange-100 text-orange-500",
    default: "bg-gray-100 text-gray-500",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${colors[type] || colors.default}`}
    >
      {type.replace("_", " ").toUpperCase()}
    </span>
  );
};

export default NotificationBadge;
