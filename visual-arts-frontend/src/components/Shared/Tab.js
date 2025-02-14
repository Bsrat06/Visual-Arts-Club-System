import React, { useState } from "react";

const Tabs = ({ tabs, children }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div className="flex space-x-4 border-b mb-4">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`pb-2 ${
              activeTab === index
                ? "border-b-2 border-primary text-primary"
                : "text-secondary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div>{children[activeTab]}</div>
    </div>
  );
};

export default Tabs;
