import React from "react";
import HeroSection from "../../components/LandingPage/HeroSection";
import AboutSection from "../../components/LandingPage/AboutSection";
import FeaturedArtworks from "../../components/LandingPage/FeaturedArtworks";

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      {/* Add more sections here */}
      <AboutSection />
      <FeaturedArtworks />
    </div>
  );
};

export default HomePage;
