import React from "react";

const HeroSection = () => {
  return (
    <section className="bg-white">
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
        {/* Hidden Alert Banner (Preserves Space) */}
        <div className="invisible py-1 px-1 pr-4 mb-7">
          <span className="text-xs bg-[#FF9933] rounded-full text-white px-4 py-1.5 mr-3">
            New
          </span>
          <span className="text-sm font-medium">
            Discover the latest features on our Visual Arts Platform!
          </span>
          <svg
            className="ml-2 w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>

        {/* Title */}
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl">
          Showcase Your Art, Connect with Creatives
        </h1>
        {/* Subtitle */}
        <p className="mb-8 text-lg font-normal text-gray-600 lg:text-xl sm:px-16 xl:px-48">
          Join our Visual Arts Platform to share your artwork, build your portfolio, and collaborate with artists worldwide.
        </p>
        {/* Buttons */}
        <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
          <a
            href="/visitor/gallery"
            className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-white rounded-lg bg-[#FF9933] hover:bg-[#FF9933]/90 hover:text-white focus:ring-4 focus:ring-[#FF9933]/50 transition-colors duration-200"
          >
            Explore Gallery
            <svg
              className="ml-2 -mr-1 w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </a>
          <a
            href="/login"
            className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-600 focus:ring-4 focus:ring-gray-100 transition-colors duration-200"
          >
            Join the Community
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;