import React from "react";

const Button = ({ children, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-black rounded-lg shadow-md hover:shadow-lg transition ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
