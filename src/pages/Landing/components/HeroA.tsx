import { useState, useEffect } from "react";
import dashboardImg from "../../../assets/img/IMG_4968.gif";
import Header from "./Header";
import Navbar from "./Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import rescillience from "../../../assets/img/resilienc.svg";
import cfirst from "../../../assets/img/csfirst lag.jpg";
import openAi from "../../../assets/img/OpenAI_Logo.svg";
import icedt from "../../../assets/img/icedt-removebg-preview.png";
import nvidia from "../../../assets/img/NVIDIA_logo.svg.png";

export default () => {
  const [text, setText] = useState(
    "Customizable, effortless lesson plans with"
  );

  const texts = [
    "Customizable, effortless lesson plans with",
    "Tailored, standards-aligned curriculum with",
    "Generate streamlined student assessments with",
    "Interactive, vibrant teaching visuals with",
    "Solve Instant, step-by-step solutions with",
    "Generate Beautiful Newsletters with",
    "Create AI Powered Classroom with",
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setText((prevText) => {
        const currentIndex = texts.indexOf(prevText);
        const nextIndex = (currentIndex + 1) % texts.length;
        return texts[nextIndex];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const scrollToSectionOnHome = (id: string) => {
    if (window.location.pathname === "/") {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section
      style={{
        background:
          "linear-gradient(180deg, rgba(192, 132, 252, 0) 20.79%, rgba(232, 121, 249, 0.26) 40.92%, rgba(204, 171, 238, 0) 70.35%)",
      }}
    >
      <Navbar />
      <div className="max-w-screen-2xl mx-auto px-4 pt-32 pb-12 gap-12 text-gray-600 md:px-8">
        <div className="relative space-y-5 max-w-4xl mx-auto text-center">
          <a
            href="#"
            className="inline-flex justify-between items-center py-2 px-3   text-sm text-primary bg-gray-50 rounded-full dark:text-white border border-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            role="alert"
          >
            <span className="text-lg font-medium">❤️ Teachers Are Heroes</span>
          </a>
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-4xl md:text-5xl lg:text-7xl text-black  primary-bold mx-auto"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={text}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {text}
                </motion.div>
              </AnimatePresence>
              <motion.span
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%"],
                }}
                transition={{
                  duration: 4, // Adjust for smoothness
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#E114E5] bg-[length:200%_200%]"
                style={{
                  display: "inline-block",
                  backgroundPosition: "0% 50%",
                }}
              >
                AI Teacha
              </motion.span>
            </motion.h2>
          </div>

          <p className="max-w-2xl mx-auto text-lg font-medium text-gray-900">
            Built with all AI tools to aid teachers day-to-day tasks to improve
            students outcome
          </p>
          <div className="items-center justify-center gap-x-3 space-y-3 sm:flex sm:space-y-0">
            <Link
              to={"/auth/onboarding"}
              className="block py-2 px-4 text-white font-medium bg-primary duration-150 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg shadow-lg hover:shadow-none"
            >
              Get Started for Free
            </Link>
            <Link
              to="/#tools"
              className={`block py-2 px-4 text-gray-900 hover:text-gray-500 font-medium duration-150 active:bg-gray-100 border border-[#5c3cbb] text-primary rounded-lg block py-2 font-bold pr-2 pl-2 lg:p-2 ${
                location.hash === "#tools" ? "text-primary" : "text-gray-900"
              }`}
              onClick={() =>
                setTimeout(() => scrollToSectionOnHome("tools"), 50)
              }
            >
              Browse Tools
            </Link>
          </div>
          <span className="absolute bottom-12 left-0">
            <svg
              width="16"
              height="16"
              viewBox="0 0 12 12"
              fill="#7B61FF"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polygon points="0,6 12,12 12,0" />
            </svg>
          </span>
          <span className="absolute top-2 right-16">
            <svg
              width="16"
              height="16"
              viewBox="0 0 14 14"
              fill="#FF16D4"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polygon points="7,0 14,7 7,14 0,7" />
            </svg>
          </span>
        </div>
        <div className="mt-14">
          <img
            className="w-full shadow-lg rounded-lg border"
            src={dashboardImg}
          ></img>
        </div>
      </div>
      <div className="py-12">
        <p className="text-center text-xl text-gray-900 font-bold">Backed By</p>
        <div className="flex justify-center items-center flex-wrap gap-x-12 gap-y-6 mt-6 mb-6">
          <a
            href="https://icedt.org"
            className="mr-5 mb-5 lg:mb-0 hover:text-gray-800"
            target="_blank"
          >
            <img src={icedt} alt="Microsoft Logo" className="h-16" />
          </a>
          <a
            href="https://nvidia.com"
            className="mr-5 mb-5 lg:mb-0 hover:text-gray-800"
            target="_blank"
          >
            <img src={nvidia} alt="Apple Logo" className="h-8" />
          </a>
          <a
            href="https://openai.com"
            className="mr-5 mb-5 lg:mb-0 hover:text-gray-800"
            target="_blank"
          >
            <img src={openAi} alt="IBM Logo" className="h-10" />
          </a>
          <a
            href="https://resilience17.com"
            className="mr-5 mb-5 lg:mb-0 hover:text-gray-800"
            target="_blank"
          >
            <img src={rescillience} alt="Google Logo" className="h-8" />
          </a>
          <a
            href="https://cfirstlagos.com.ng"
            target="_blank"
            className="mr-5 mb-5 lg:mb-0 hover:text-gray-800"
          >
            <img src={cfirst} alt="Google Logo" className="h-16" />
          </a>
        </div>
      </div>
    </section>
  );
};
