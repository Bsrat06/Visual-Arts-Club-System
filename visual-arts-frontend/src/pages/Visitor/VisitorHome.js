import React from "react";

const VisitorHome = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-6">
      <h1 className="text-4xl font-bold mb-6">Welcome to Visual Arts Platform</h1>
      <p className="text-lg text-center mb-6">
        Explore our gallery, events, and projects. Join us to showcase your talent.
      </p>
      <button className="bg-orange-500 text-white px-6 py-2 rounded">Join Now</button>
    </div>
  );
};

export default VisitorHome;
