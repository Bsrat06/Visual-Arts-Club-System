import React from "react";

const Navbar = () => {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
      <div className="flex items-center space-x-4">
        <img
          src="/path/to/profile-picture.jpg"
          alt="Profile"
          className="w-8 h-8 rounded-full"
        />
      </div>
    </header>
  );
};

export default Navbar;
