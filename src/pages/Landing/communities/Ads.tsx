import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "../../../components/ui/Button";
import { Link } from "react-router-dom";
import AdsPhoto from "../../../assets/img/adsphoto.jpg";

const Ads = () => {
  return (
    <div>
      <section>
        <Navbar />
      </section>
      <section className="mt-24">
        <section className="relative bg-blight w-full h-[60vh] pt-[5rem] flex justify-center bg-gradient-to-r from-[#07052D] to-[#171093] items-center overflow-hidden overlow-hidden">
          <span className="absolute inse=t-0 z-0 p-5  justif-center top-[rem]"></span>
          <section className="px-2">
            <figcaption className="desc z-10 relative px-2 text-center">
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-center my-6 text-header text-white">
                {" "}
                Ai In Education Lagos Conference For School Leaders{" "}
              </h1>
              <center>
                <h2 className="text-md md:text-lg text-center  lg:text-xl text-gray-100 max-w-3xl ">
                  Welcome to the AI in Education Lagos Conference for School
                  Leaders
                </h2>
              </center>
            </figcaption>
          </section>
        </section>
      </section>
      <div className="mt-16 mx-auto max-w-screen-lg pb-4 px-4 items-center md:px-8 text-center">
        <p className="text-lg text-gray-700">
          A transformative event dedicated to ushering in the future of
          schooling. Discover how Artificial Intelligence can revolutionize your
          institution by streamlining operations, enhancing teaching, and
          significantly boosting student performance. Engage with industry
          experts, share insights with fellow leaders, and explore innovative
          strategies to transform traditional schools into dynamic, AI-enabled
          learning environments. Join us as we reshape education for a smarter,
          more efficient future.
        </p>

        <div className="mt-10 flex justify-center">
          <img
            src="/adsphoto.jpg"
            alt="Event Banner"
            className="rounded-lg shadow-md max-w-full h-auto border"
          />
        </div>

        <div className="mt-14 flex justify-center">
          <video
            className="w-full shadow-lg rounded-lg max-h-[500px] max-w-[1000px] border"
            src="/ads.mp4"
            controls
            autoPlay
            muted
            loop
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Button Link */}
        <div className="mt-6">
          <Link to="https://icedt.org/event-details.php?id=27#">
            <Button variant="gradient" className="rounded-full">
              Register here
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Ads;
