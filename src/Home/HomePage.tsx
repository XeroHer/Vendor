import React from "react";

import { Categories } from "./catgoriees";


import { HeroSection } from "./heroSection";


const Homepage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 p-6 font-sans text-gray-800 relative">
     
      <HeroSection />
      <Categories />

      
    </div>
  );
};

export default Homepage;
