import React from "react";

const Button = ({ children, onClick, type = "button", className = "" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 bg-primary text-white rounded hover:bg-primaryHover transition ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
