import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import StudentToolboxPage from "./components/StudentToolBox";
const StudentTools = () => {
  return (
    <div>
      <Navbar />

      <div className="mx-auto px-8 py-6 mt-20">
        <StudentToolboxPage />
      </div>
      <Footer />
    </div>
  );
};

export default StudentTools;
