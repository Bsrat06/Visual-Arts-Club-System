import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`bg-gray-800 text-white md:w-64 ${isOpen ? "w-64" : "w-16"} transition-all duration-300`}>
      <button
        className="block md:hidden p-4"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <FaBars />
      </button>
      <nav className={`${isOpen ? "block" : "hidden"} md:block`}>
        <ul>
          <li>
            <Link to="/admin/dashboard" className="block p-4 hover:bg-gray-700">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/manage-artworks" className="block p-4 hover:bg-gray-700">
              Manage Artworks
            </Link>
          </li>
          {/* Add other links as needed */}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
