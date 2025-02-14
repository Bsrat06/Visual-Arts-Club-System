import React from "react";

const Card = ({ title, value, icon, bgColor = "bg-white" }) => {
  return (
    <div className={`shadow-md p-4 rounded ${bgColor}`}>
      <div className="flex items-center space-x-4">
        <div className="text-3xl">{icon}</div>
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
