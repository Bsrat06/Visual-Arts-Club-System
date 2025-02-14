import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Visual Arts</h1>
      <ul className="flex space-x-4">
        <li><Link to="/" className="text-primary">Home</Link></li>
        <li><Link to="/about" className="text-secondary">About</Link></li>
        <li><Link to="/contact" className="text-secondary">Contact</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
