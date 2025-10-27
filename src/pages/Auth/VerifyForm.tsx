import { VerifyAuthEmail } from "./components/verifyEmail";
import { Link } from "react-router-dom";
import authImg from "../../assets/img/5c879d43-15bc-40d9-97d3-5bef9f59eda7 1.png";
import Logo from "../../assets/img/logo.png";import loginImage from "../../assets/img/login.jpg";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const slides = [
  {
    title: "Explore the most advanced AI tools",
    desc: "Built with all AI tools to aid teachers day-to-day tasks to improve students outcome.",
    image: loginImage,
  },
  {
    title: "Connect With Mentors",
    desc: "Find guidance and support from experienced educators and peers.",
    image:
      "https://mir-s3-cdn-cf.behance.net/project_modules/fs/8591c430607151.5fdbc0cc8345f.jpg",
  },
  {
    title: "Achieve Your Goals",
    desc: "Track your progress and unlock new opportunities with our tools.",
    image:
      "https://img.freepik.com/premium-photo/robot-teaches-students-school-ai-teacher-robot-school_451189-3847.jpg",
  },
];

const VerifyForm = () => {
   const [currentSlide, setCurrentSlide] = useState(0);

   useEffect(() => {
           const interval = setInterval(() => {
             setCurrentSlide((prev) => (prev + 1) % slides.length);
           }, 6000);
       
           return () => clearInterval(interval); //
         }, []);

  return (
    <div className="w-full h-screen flex">
      <div className="hidden flex-1 md:flex relative overflow-hidden ">
        <AnimatePresence mode="wait">
          <motion.div
            key={slides[currentSlide].image}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${slides[currentSlide].image}')`,
            }}
          ></motion.div>
        </AnimatePresence>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#000000]/30 to-[#290064]" />

        {/* Logo */}
        <div className="absolute flex items-center gap-3  top-12 left-[88px] text-white text-2xl font-bold">
          <img src={Logo} className="w-12" alt="" />
          AiTeacha
        </div>

        {/* Bottom Slide Text */}
        <div className="absolute bottom-40 left-[88px]  max-w-[433px]  text-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-semibold mb-3">
                {slides[currentSlide].title}
              </h2>
              <p className="text-gray-300 test-base">
                {slides[currentSlide].desc}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Slide Dots */}
          <div className="flex  mt-3 space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                  currentSlide === index
                    ? "bg-[#E630F0] scale-110"
                    : "bg-gray-500"
                }`}
              />
            ))}
          </div>
        </div>
      </div>



      <div className="flex-1 flex items-center justify-center h-full overflow-y-auto bg-white ">
        <div className="w-full max-w-md p-4">
          <div className="lg:hidden flex items-center justify-center gap-1 text-black text-2xl font-bold mb-4">
            <Link
              to="/"
              className="flex items-center gap-1 text-black text-2xl font-bold"
            >
              <img className="h-8 w-auto" src={Logo} alt="AI-Teacha Logo" />
              <span className="text-sm">AiTeacha</span>
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
            A Verification Code Was Sent to Your Email
          </h1>
          <p className="text-lg text-gray-600 text-center mb-8">
            Please enter the verification code sent to your email to complete
            the process.
          </p>

          <VerifyAuthEmail />
        </div>
      </div>
    </div>
  );
};

export default VerifyForm;
