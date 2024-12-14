import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import StudentToolboxPage from "./components/StudentToolBox";
const StudentTools = () => {
  return (
    <div>
      <Navbar />

      <StudentToolboxPage />

      <Footer />
    </div>
  );
};

export default StudentTools;
