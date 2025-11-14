// import "react";
// import { motion } from "framer-motion";
// import LayoutTextFlip from "../../../pages/Landing/components/layout-text-flip";
// import Icedt from "../../../assets/img/Icedt.svg";
// import Nvidia from "../../../assets/img/nvidia.svg";
// import OpenAI from "../../../assets/img/openai.svg";
// import Resilience7 from "../../../assets/img/resilience.svg";
// import Lastimg from "../../../assets/img/Lastimg.svg";
// import Bg from "../../../assets/img/bglines3.png"
// import Avatar from "../../../assets/img/avatar.webp";
// import Lines from "../../../assets/img/lines.svg";
// import HLine from "../../../assets/img/h-line.svg"; 

// const LayoutTextFlipDemo = () => {
//   return (
//     <div
//       className="w-full flex flex-col justify-center items-center overflow-hidden"
//       style={{
//         backgroundImage: `url(${Bg})`,
//         backgroundSize: "contain",
//         backgroundPosition: "center",
//       }}
//     >
//       {/* Hero Text */}
//       <p className="text-center font-Vibur text-lg sm:text-xl md:text-2xl text-[#3B3A3A]">
//         teachers are heroes ❤️
//       </p>

//       {/* Floating Avatar */}
//       <motion.div className="absolute top-[15%] right-2 sm:top-[15%] sm:right-[10%] md:top-[24%] md:right-[10%] w-20 sm:w-32 md:w-20 lg:w-28">
//         <motion.img
//           src={Avatar}
//           alt="avatar"
//           className="w-full h-auto"
//           initial={{ y: 0, x: 0, rotate: 0 }}
//           animate={{
//             y: [0, -18, -8, -18, 0],
//             x: [0, -6, 0, 6, 0],
//             rotate: [0, -4, 2, -4, 0],
//           }}
//           transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
//         />
//       </motion.div>

//       {/* Text Animation Section */}
//       <motion.div className="relative mx-4 flex flex-col md:flex-row items-center justify-center text-center">
//         <LayoutTextFlip
//           words={[
//             "Interactive",
//             "AI Powered",
//             "Tailored",
//             "Customizable",
//             "Step-by-step",
//           ]}
//         />

//         <p className="text-5xl sm:text-3xl md:text-5xl lg:text-[64px] font-bold max-w-full md:max-w-lg">
//           teaching
//         </p>
//       </motion.div>

//       {/* Heading */}
//       <div className="text-5xl sm:text-4xl md:text-5xl lg:text-[64px] font-bold text-center">
//         visuals with AiTeacha
//       </div>

//       {/* lines */}
//       <div className="absolute lg:left-[13%] md:left-[8%] top-[40%] lg:flex md:flex hidden">
//         <img src={HLine} alt="" />
//       </div>

//       <div>
//         <img src={Lines} alt="" className="w-32 lg:w-full" />
//       </div>

//       {/* Description */}
//       <p className="mt-4 text-center text-base sm:text-lg md:text-xl text-[#3B3A3A] max-w-xl sm:max-w-2xl mx-auto px-4">
//         Built with all AI tools to aid teachers’ day-to-day tasks and improve
//         student outcomes.
//       </p>

//       {/* CTA Button */}
//       <div className="flex justify-center mt-6 mb-10">
//         <a
//           href="/auth/login"
//           className="shadow-lg shadow-[#6200EE]/40 bg-[#6200EE] hover:bg-[#4d00c9] text-white py-3 px-8 sm:py-4 sm:px-10 font-medium text-base sm:text-lg rounded-full transition-all duration-200"
//         >
//           Get Started For Free
//         </a>
//       </div>

//       {/* Partner Logos and Scroll Indicator */}
//       <section className="absolute lg:bottom-10 bottom-[10%] w-full flex flex-col items-center justify-center">
//         {/* Partner Logos */}
//         <div className="text-center">
//           <p className="font-semibold text-sm sm:text-base mb-4">Backed by</p>
//           <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8">
//             {[Icedt, Nvidia, OpenAI, Resilience7, Lastimg].map((logo, i) => (
//               <img
//                 key={i}
//                 src={logo}
//                 alt={`Partner ${i}`}
//                 className="h-4 sm:h-5 md:h-6 opacity-70"
//               />
//             ))}
//           </div>
//         </div>

//         {/* Scroll Indicator */}
//         <div className="absolute bottom-4 left-6 sm:left-10 md:left-[7%] lg:left-[13%] rotate-180">
//           <div className="w-4 h-8 sm:w-5 sm:h-10 border-2 border-purple-500 rounded-full flex justify-center items-start p-1">
//             <motion.div
//               className="w-1.5 h-1.5 bg-[#6200EE] rounded-full"
//               initial={{ y: 0 }}
//               animate={{ y: [-6, 0, -6] }}
//               transition={{
//                 duration: 1.0,
//                 repeat: Infinity,
//                 ease: "easeInOut",
//               }}
//             />
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default LayoutTextFlipDemo;


import "react";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import LayoutTextFlip from "../../../pages/Landing/components/layout-text-flip";
import Icedt from "../../../assets/img/Icedt.svg";
import Nvidia from "../../../assets/img/nvidia.svg";
import OpenAI from "../../../assets/img/openai.svg";
import Resilience7 from "../../../assets/img/resilience.svg";
import Lastimg from "../../../assets/img/Lastimg.svg";
import Bg from "../../../assets/img/bglines3.png";
import Avatar from "../../../assets/img/avatar.svg";
import Lines from "../../../assets/img/lines.svg";
import HLine from "../../../assets/img/h-line.svg";

const LayoutTextFlipDemo = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get("at-accessToken");
    if (token) setIsLoggedIn(true);
    else setIsLoggedIn(false);
  }, []);

  return (
    <div
      className="w-full flex flex-col justify-center items-center overflow-hidden"
      style={{
        backgroundImage: `url(${Bg})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
      }}
    >
      {/* Hero Text */}
      <p className="text-center font-Vibur text-lg sm:text-xl md:text-2xl text-[#3B3A3A]">
        teachers are heroes ❤️
      </p>

      {/* Floating Avatar */}
      <motion.div className="absolute top-[15%] right-2 sm:top-[15%] sm:right-[10%] md:top-[24%] md:right-[10%] w-20 sm:w-32 md:w-20 lg:w-28">
        <motion.img
          src={Avatar}
          alt="avatar"
          className="w-full h-auto"
          initial={{ y: 0, x: 0, rotate: 0 }}
          animate={{
            y: [0, -18, -8, -18, 0],
            x: [0, -6, 0, 6, 0],
            rotate: [0, -4, 2, -4, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Text Animation Section */}
      <motion.div className="relative mx-4 flex flex-col md:flex-row items-center justify-center text-center">
        <LayoutTextFlip
          words={[
            "Interactive",
            "AI Powered",
            "Tailored",
            "Customizable",
            "Step-by-step",
          ]}
        />
        <p className="text-5xl sm:text-3xl md:text-5xl lg:text-[64px] font-bold max-w-full md:max-w-lg">
          teaching
        </p>
      </motion.div>

      {/* Heading */}
      <div className="text-5xl sm:text-4xl md:text-5xl lg:text-[64px] font-bold text-center">
        visuals with AiTeacha
      </div>

      {/* lines */}
      <div className="absolute lg:left-[13%] md:left-[8%] top-[40%] lg:flex md:flex hidden">
        <img src={HLine} alt="" />
      </div>

      <div>
        <img src={Lines} alt="" className="w-32 lg:w-full" />
      </div>

      {/* Description */}
      <p className="mt-4 text-center text-base sm:text-lg md:text-xl text-[#3B3A3A] max-w-xl sm:max-w-2xl mx-auto px-4">
        Built with all AI tools to aid teachers’ day-to-day tasks and improve
        student outcomes.
      </p>

      {/* CTA Buttons */}
      <div className="flex justify-center mt-6 mb-10 gap-4">
        <a
          href="/auth/onboarding"
          className="shadow-lg shadow-[#6200EE]/40 bg-[#6200EE] hover:bg-[#4d00c9] text-white py-3 px-5 sm:py-4 sm:px-10 font-medium text-base sm:text-lg rounded-full transition-all duration-200"
        >
          Get Started For Free
        </a>

        {!isLoggedIn && (
          <a
            href="/auth/login"
            className="shadow-lg shadow-[#6200EE]/10 bg-white border border-[#6200EE] text-[#6200EE] hover:bg-[#f4edff] py-3 px-5 sm:py-4 sm:px-9 font-medium text-base sm:text-lg rounded-full transition-all duration-200"
          >
            Login
          </a>
        )}
      </div>

      {/* Partner Logos and Scroll Indicator */}
      <section className="absolute lg:bottom-10 bottom-[10%] w-full flex flex-col items-center justify-center">
        {/* Partner Logos */}
        <div className="text-center">
          <p className="font-semibold text-sm sm:text-base mb-4">Backed by</p>
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8">
            {[Icedt, Nvidia, OpenAI, Resilience7, Lastimg].map((logo, i) => (
              <img
                key={i}
                src={logo}
                alt={`Partner ${i}`}
                className="h-4 sm:h-5 md:h-6 opacity-70"
              />
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 left-6 sm:left-10 md:left-[7%] lg:left-[13%] rotate-180">
          <div className="w-4 h-8 sm:w-5 sm:h-10 border-2 border-purple-500 rounded-full flex justify-center items-start p-1">
            <motion.div
              className="w-1.5 h-1.5 bg-[#6200EE] rounded-full"
              initial={{ y: 0 }}
              animate={{ y: [-6, 0, -6] }}
              transition={{
                duration: 1.0,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default LayoutTextFlipDemo;