import React, { useState } from "react";
import { Modal, Button } from "antd";

const contributions = [
  {
    id: 1,
    title: "Community Mural Project",
    description: "Designed and painted murals in public spaces to beautify the city and promote culture.",
    details: "Our team collaborated with local artists to create a series of murals reflecting Ethiopian heritage and modern creativity.",
    image: "/images/mural.jpg", // Replace with actual image path
  },
  {
    id: 2,
    title: "Charity Art Auction",
    description: "Organized an auction to sell artworks and donate proceeds to charity.",
    details: "The event raised funds to support underprivileged children, offering them access to art education and materials.",
    image: "/images/charity-auction.jpg",
  },
  {
    id: 3,
    title: "School Art Workshops",
    description: "Conducted free art workshops in schools to inspire young artists.",
    details: "Workshops included painting, digital art, and sculpture, encouraging students to explore their creativity.",
    image: "/images/workshop.jpg",
  },
];

const OurContributions = () => {
  const [selectedContribution, setSelectedContribution] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = (contribution) => {
    setSelectedContribution(contribution);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-screen-xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
          Our Contributions
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Making an impact through art and creativity in our community.
        </p>
      </div>

      <div className="grid grid-cols-1 mt-12 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {contributions.map((contribution) => (
          <div
            key={contribution.id}
            className="space-y-4 bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-300"
          >
            <img
              src={contribution.image}
              alt={contribution.title}
              className="w-full h-40 object-cover rounded-lg"
            />
            <h3 className="text-2xl font-bold text-gray-900">{contribution.title}</h3>
            <p className="text-gray-600">{contribution.description}</p>
            <Button
              type="primary"
              className="bg-[#FF9933] hover:bg-[#FF9933]/90 hover:text-white border-none transition-colors duration-200"
              onClick={() => showModal(contribution)}
            >
              Learn More
            </Button>
          </div>
        ))}
      </div>

      {/* Modal Pop-up */}
      <Modal
        title={selectedContribution?.title}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button
            key="close"
            className="bg-[#FF9933] hover:bg-[#FF9933]/90 hover:text-white border-none transition-colors duration-200"
            onClick={handleCancel}
          >
            Close
          </Button>,
        ]}
      >
        <img
          src={selectedContribution?.image}
          alt={selectedContribution?.title}
          className="w-full h-60 object-cover rounded-lg mb-4"
        />
        <p className="text-gray-700">{selectedContribution?.details}</p>
      </Modal>
    </section>
  );
};

export default OurContributions;