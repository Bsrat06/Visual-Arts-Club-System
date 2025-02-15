import React from "react";

const Card = ({ title, value }) => {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg text-center">
      <h2 className="text-xl font-bold mt-2">{title}</h2>
      <p className="text-lg">{value}</p>
    </div>
  );
};


export default Card;
