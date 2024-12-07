import Header from "./Header";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import rescillience from "../../../assets/img/resilienc.svg";
import cfirst from "../../../assets/img/csfirst lag.jpg";
import openAi from "../../../assets/img/OpenAI_Logo.svg";
import icedt from "../../../assets/img/icedt.png";
import nvidia from "../../../assets/img/NVIDIA_logo.svg.png";
const Hero = () => {
  const [textIndex, setTextIndex] = useState(0);
  // const [isDeleting, setIsDeleting] = useState(false);
  // const [displayText, setDisplayText] = useState("");
  // const fullText = "AI Teacha";
  // const typingSpeed = isDeleting ? 50 : 150;
  // const pauseDuration = 1000;

  // useEffect(() => {
  //   const typingInterval = setTimeout(() => {
  //     if (!isDeleting && displayText === fullText) {
  //       setTimeout(() => setIsDeleting(true), pauseDuration);
  //     } else if (isDeleting && displayText === "") {
  //       setIsDeleting(false);
  //       setTextIndex(0);
  //     } else {
  //       setDisplayText((prev) =>
  //         isDeleting
  //           ? fullText.substring(0, prev.length - 1)
  //           : fullText.substring(0, prev.length + 1)
  //       );
  //     }
  //   }, typingSpeed);

  //   return () => clearTimeout(typingInterval);
  // }, [displayText, isDeleting]);

  return (
    <section
      style={{
        background: "linear-gradient(135deg, #CEBDFF0D 50%, #5C3CBB1A 100%)",
      }}
    >
      <Header />
      <div className="relative py-6 mt-20 px-4 mx-auto max-w-screen-xl text-center lg:py-12 lg:px-12">
        <a
          href="#"
          className="inline-flex justify-between items-center py-1 px-3  mb-7 text-sm text-gray-700 bg-gray-100 rounded-full dark:bg-gray-800 dark:text-white border border-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          role="alert"
        >
          <span className="text-sm font-medium">
            ❤️ by +2,000 students and educators
          </span>
        </a>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          <span className="bg-gradient-to-r from-[#FF16D4] to-[#5C3CBB] bg-clip-text text-transparent mr-2">
            10x
          </span>
          Your Teaching Goals With <br />
          <motion.span
            className="whitespace-nowrap text-primary font-extrabold py-1 px-3 rounded-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {"AI Teacha"}
          </motion.span>
        </h1>
        <p className="mb-8 text-lg font-normal text-gray-800 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
          Built with all AI tools to aid teachers day-to-day tasks to improve
          students outcome
        </p>
        <div className="flex flex-col items-center mb-6 lg:mb-12">
          <Link
            to="/auth/onboarding"
            className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-full bg-primary focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
          >
            Get started for free
            <svg
              className="ml-2 -mr-1 w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </Link>
          <p className="mt-2 text-sm text-gray-700">No credit card required</p>
        </div>
        <div className="px-4 mx-auto text-center md:max-w-screen-md lg:max-w-screen-xl lg:px-36 overflow-hidden">
          <span className="font-semibold text-gray-700">
            Simplify your day to day administrative task by 80% and improve your
            students outcome.
          </span>
          <div className="relative flex overflow-hidden items-center mt-8 text-gray-500 marquee">
            <div className="flex marquee-track">
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
        </div>
      </div>
    </section>
  );
};

export default Hero;
