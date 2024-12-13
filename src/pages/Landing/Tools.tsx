import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ToolboxPage from "./components/ToolBox";
const EducatorTools = () => {
  return (
    <div>
      <Navbar />

      <div className="mx-auto px-8 py-6 mt-20">
        <ToolboxPage />
      </div>
      <Footer />
    </div>
  );
};

export default EducatorTools;
