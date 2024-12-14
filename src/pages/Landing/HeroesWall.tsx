import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
const HeroesWall = () => {
  return (
    <div>
      <Navbar />
      <section className="relative bg-blight w-full mt-24 h-[60vh] pt-[5rem] flex justify-center bg-[#c1bad4] items-center overflow-hidden overlow-hidden">
        <span className="absolute inse=t-0 z-0 p-5  justif-center top-[rem]"></span>
        <section>
          <figcaption className="desc z-10 relative">
            <h1 className="text-6xl font-bold text-center my-6 text-header">
              {" "}
              Heroes Wall
            </h1>
          </figcaption>
        </section>
      </section>
      <Footer />
    </div>
  );
};

export default HeroesWall;
