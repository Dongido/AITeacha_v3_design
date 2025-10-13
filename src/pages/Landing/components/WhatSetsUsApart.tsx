// import React, { useState } from "react";
// import {
//   FaClipboard,
//   FaBookOpen,
//   FaCheckSquare,
//   FaChalkboardTeacher,
// } from "react-icons/fa";
// import lessonImg from "../../../assets/img/lessonpanner.png";
// import handoutImg from "../../../assets/img/handoutg.png";
// import textImg from "../../../assets/img/imageGen.png";
// import curImg from "../../../assets/img/curriculum.png";

// const WhatSetsUsApart: React.FC = () => {
//   const [activeTab, setActiveTab] = useState("Lesson Note Generator");

//   const navItems = [
//     {
//       id: "Lesson Note Generator",
//       icon: <FaClipboard />,
//       label: "Lesson Note Generator",
//       image: lessonImg,
//     },
//     {
//       id: "Handout Generator",
//       icon: <FaBookOpen />,
//       label: "Handout Generator",
//       image: handoutImg,
//     },
//     {
//       id: "Curriculum Generator",
//       icon: <FaCheckSquare />,
//       label: "Curriculum Generator",
//       image: curImg,
//     },
//     {
//       id: "Visual Teaching Aid",
//       icon: <FaChalkboardTeacher />,
//       label: "Visual Teaching Aid",

//       image: textImg,
//     },
//   ];

//   return (
//     <section className="   px-4 text-center text-white">
//       <section className="relative pb-8 px-4 text-center">
//         <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-black relative">
//           Unique AI Tools to teach Smarter, not Harder.
//         </h2>

//         <span className="absolute bottom-6 left-0">
//           <svg
//             width="16"
//             height="16"
//             viewBox="0 0 12 12"
//             fill="#7B61FF"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <polygon points="0,6 12,12 12,0" />
//           </svg>
//         </span>
//         <span className="absolute top-8 right-16">
//           <svg
//             width="16"
//             height="16"
//             viewBox="0 0 14 14"
//             fill="#FF16D4"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <polygon points="7,0 14,7 7,14 0,7" />
//           </svg>
//         </span>
//       </section>

//       <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
//         {navItems.map((item) => (
//           <button
//             key={item.id}
//             onClick={() => setActiveTab(item.id)}
//             className={`flex items-center px-3 py-2 rounded-full text-xs md:text-sm font-medium transition ${
//               activeTab === item.id
//                 ? "bg-primary text-white"
//                 : "bg-transparent text-primary border border-[#5c3cbb]"
//             }`}
//           >
//             <span
//               className={`mr-2 text-base md:text-lg ${
//                 activeTab === item.id ? "text-white" : "text-primary"
//               }`}
//             >
//               {item.icon}
//             </span>
//             {item.label}
//           </button>
//         ))}
//       </div>

//       <div className="flex justify-center mb-8 px-4">
//         <div
//           className="w-full max-w-md h-48 md:max-w-lg md:h-64 lg:max-w-2xl lg:h-80 flex items-center justify-center rounded-lg"
//           // style={{
//           //   background: "linear-gradient(180deg, #CEBDFF, #FF16D4)",

//           // }}
//           style={{
//             background: "linear-gradient(180deg, #5C3CBB, #8071AE)",
//             padding: "16px",
//           }}
//         >
//           <div className="w-full h-full bg-white flex m-1 items-center justify-center rounded-md">
//             {navItems.map(
//               (item) =>
//                 activeTab === item.id && (
//                   <img
//                     key={item.id}
//                     src={item.image}
//                     alt={item.label}
//                     className="w-full h-full  object-cover rounded-md"
//                   />
//                 )
//             )}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default WhatSetsUsApart;

import GameChangerbg from "../../../assets/img/Gamechangerbg.svg";
import Time from "../../../assets/img/Group 5.svg";
import Classroom from "../../../assets/img/Group 6 (2).svg";
import Enhance from "../../../assets/img/Enhance.svg";
const GameChanger = () => {
  const features = [
    {
      title: "Time-Saving Tools",
      description:
        "Streamline administrative tasks, giving you more time to focus on student engagement and growth.",
      icon: Time,
    },
    {
      title: "Customized for Every Classroom",
      description:
        "AiTeacha makes it easy to adapt materials for any class size, meeting diverse student needs with ease.",
      icon: Classroom,
    },
    {
      title: "Enhances Teacher Performance",
      description:
        "Let AI handle routine tasks, so you can focus on delivering engaging, innovative lessons that inspire and captivate your students.",
      icon: Enhance,
    },
  ];

  return (
    <section className="relative overflow-hidden py-20 px-6 md:px-16 flex flex-col items-center justify-center">
      {/* Spinning SVG Background */}
      <div className="absolute inset-0 lg:flex justify-center items-center md:flex hidden -z-10">
        <img
          src={GameChangerbg}
          alt="Spinning gradient background"
          className="w-[140%] md:w-[110%] h-auto opacity-70"
        />
      </div>

      {/* Content */}
      <div className="relative text-center max-w-6xl mx-auto z-10">
        <h4 className="bg-gradient-to-r from-[#F133E1] to-[#6200EE] bg-clip-text text-transparent font-[400] mb-2 text-2xl">
          What sets us apart
        </h4>
        <h2 className="text-3xl lg:text-[40px] md:text-4xl font-bold text-gray-900 mb-12">
          Why AiTeacha is a Game-Changer
        </h2>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-24 md:mb-56">
          {features.map((item, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-sm p-6 md:p-8 hover:scale-105 transition-transform duration-300 text-left border border-white cursor-pointer flex flex-col justify-between h-full overflow-hidden md:overflow-visible"
            >
              <div>
                <h3 className="text-[20px] font-semibold text-black mb-2">
                  {item.title}
                </h3>
                <p className="text-[#626161] text-[14px] md:text-base leading-tight">
                  {item.description}
                </p>
              </div>

              <div className="flex justify-start -mb-6 md:-mb-8">
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-28 h-28 sm:w-36 sm:h-36 md:w-48 md:h-48 lg:w-56 lg:h-56 object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GameChanger;
