import Header from "./Header";
import rescillience from "../../../assets/img/resilienc.svg";
import cfirst from "../../../assets/img/csfirst lag.jpg";
import openAi from "../../../assets/img/OpenAI_Logo.svg";
import icedt from "../../../assets/img/icedt-removebg-preview.png";
import nvidia from "../../../assets/img/NVIDIA_logo.svg.png";
import { motion } from "framer-motion";
import Navbar from "./Navbar";

const HeroD = () => {
  return (
    <>
      <div
        style={{
          background:
            "linear-gradient(143.6deg, rgba(192, 132, 252, 0) 20.79%, rgba(232, 121, 249, 0.26) 40.92%, rgba(204, 171, 238, 0) 70.35%)",
        }}
      >
        <Navbar />
        <section className="py-28">
          <div className="max-w-screen-2xl mx-auto text-gray-600 gap-x-12 items-center justify-between overflow-hidden md:flex md:px-8">
            <div className="flex-none space-y-5 px-4 sm:max-w-lg md:px-0 lg:max-w-xl">
              <h1 className="text-sm text-indigo-600 font-medium">
                Over 2,000 students and educators
              </h1>
              <h2 className="text-4xl text-gray-800 font-extrabold md:text-5xl">
                <span className="bg-gradient-to-r from-[#FF16D4] to-[#5C3CBB] bg-clip-text text-transparent mr-2">
                  10x
                </span>{" "}
                Your Teaching Goals With AI Teacha
              </h2>
              <p>
                Built with all AI tools to aid teachers day-to-day tasks to
                improve students outcome
              </p>
              <div className="items-center gap-x-3 space-y-3 sm:flex sm:space-y-0">
                <a
                  href="javascript:void(0)"
                  className="block py-2 px-4 text-center text-white font-medium bg-primary duration-150 hover:bg-indigo-500 active:bg-indigo-700 rounded-full shadow-lg hover:shadow-none"
                >
                  Let's get started
                </a>
                <a
                  href="javascript:void(0)"
                  className="flex items-center justify-center gap-x-2 py-2 px-4 text-gray-700 hover:text-gray-500 font-medium duration-150 active:bg-gray-100 border rounded-full md:inline-flex"
                >
                  Get access
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div className="flex-none mt-14 md:mt-0 md:max-w-xl">
              <img
                src="https://img.freepik.com/free-photo/ordinary-human-job-performed-by-robot_23-2151008311.jpg?semt=ais_hybrid"
                className=" md:rounded-tl-[108px]"
                alt=""
              />
            </div>
          </div>
          <div className="mt-14 px-4 md:px-8">
            <p className="text-center text-sm text-gray-700 font-semibold">
              Backed By
            </p>
            <div className="flex justify-center items-center flex-wrap gap-x-12 gap-y-6 mt-6">
              <a href="#" className="mr-5 mb-5 lg:mb-0 hover:text-gray-800">
                <img src={icedt} alt="Microsoft Logo" className="h-16" />
              </a>
              <a href="#" className="mr-5 mb-5 lg:mb-0 hover:text-gray-800">
                <img src={nvidia} alt="Apple Logo" className="h-8" />
              </a>
              <a href="#" className="mr-5 mb-5 lg:mb-0 hover:text-gray-800">
                <img src={openAi} alt="IBM Logo" className="h-10" />
              </a>
              <a href="#" className="mr-5 mb-5 lg:mb-0 hover:text-gray-800">
                <img src={rescillience} alt="Google Logo" className="h-8" />
              </a>
              <a href="#" className="mr-5 mb-5 lg:mb-0 hover:text-gray-800">
                <img src={cfirst} alt="Google Logo" className="h-16" />
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
export default HeroD;
