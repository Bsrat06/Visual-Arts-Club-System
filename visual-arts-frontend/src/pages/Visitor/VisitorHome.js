import React from "react";
import HeroSection from "../../components/LandingPage/HeroSection";
import AboutSection from "../../components/LandingPage/AboutSection";
import FeaturedArtworks from "../../components/LandingPage/FeaturedArtworks";
import OurContributions from "../../components/LandingPage/OurContributions";
import UpcomingEvents from "../../components/LandingPage/UpcomingEvents";
import Team from "../../components/LandingPage/Team";

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      {/* Add more sections here */}
      <AboutSection />
      <FeaturedArtworks />
      <UpcomingEvents/>
      <OurContributions />
      <Team />
    </div>
  );
};

export default HomePage;
