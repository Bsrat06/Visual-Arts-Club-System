import React from "react";

const AboutSection = () => {
  return (
    <section className="bg-white">
      <div className="gap-16 items-center py-8 px-4 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-16 lg:px-6">
        <div className="font-light text-gray-600 sm:text-lg">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900">
            Empowering Artists, Showcasing Creativity
          </h2>
          <p className="mb-4">
            Our platform is a digital space for artists, designers, and creative minds to exhibit their artwork, gain 
            visibility, and connect with like-minded individuals. Whether you're a professional or a passionate beginner, 
            this is the place to share your artistic journey.
          </p>
          <p>
            We provide tools to build your portfolio, showcase your masterpieces, and participate in creative events. 
            Join a community that values artistic expression and innovation.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-8">
          <img
            className="w-full rounded-lg"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-2.png"
            alt="Artwork showcase 1"
          />
          <img
            className="mt-4 w-full lg:mt-10 rounded-lg"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-1.png"
            alt="Artwork showcase 2"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
