// pages/Other/Unauthorized.js
import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Unauthorized Access</h1>
      <p className="mb-4">You don't have permission to view this page.</p>
      <Link
        to="/"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Go Back to Home
      </Link>
    </div>
  );
};

export default Unauthorized;
