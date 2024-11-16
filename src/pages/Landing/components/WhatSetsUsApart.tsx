import React, { useState } from "react";
import {
  FaClipboard,
  FaBookOpen,
  FaCheckSquare,
  FaChalkboardTeacher,
} from "react-icons/fa";
import lessonImg from "../../../assets/img/lessnPlan.png";
import handoutImg from "../../../assets/img/handout gen.png";
import textImg from "../../../assets/img/text gen.png";
import curImg from "../../../assets/img/curiculumGen.png";

const WhatSetsUsApart: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Lesson Note Generator");

  const navItems = [
    {
      id: "Lesson Note Generator",
      icon: <FaClipboard />,
      label: "Lesson Note Generator",
      image: lessonImg,
    },
    {
      id: "Handout Generator",
      icon: <FaBookOpen />,
      label: "Handout Generator",
      image: handoutImg,
    },
    {
      id: "Curriculum Generator",
      icon: <FaCheckSquare />,
      label: "Curriculum Generator",
      image: curImg,
    },
    {
      id: "Visual Teaching Aid",
      icon: <FaChalkboardTeacher />,
      label: "Visual Teaching Aid",

      image: textImg,
    },
  ];

  return (
    <section className="py-4 px-4 text-center text-white">
      <section className="relative py-8 px-4 text-center">
        <h3 className="text-sm font-medium underline text-primary mb-2 relative">
          What sets us apart
        </h3>
        <h2 className="text-2xl md:text-3xl font-extrabold text-black relative">
          Unique AI Tools For Your Teaching Goals
        </h2>

        <span className="absolute bottom-8 left-8">
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
        <span className="absolute top-8 right-16">
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
      </section>

      <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center px-3 py-2 rounded-full text-xs md:text-sm font-medium transition ${
              activeTab === item.id
                ? "bg-primary text-white"
                : "bg-transparent text-primary border border-[#5c3cbb]"
            }`}
          >
            <span
              className={`mr-2 text-base md:text-lg ${
                activeTab === item.id ? "text-white" : "text-primary"
              }`}
            >
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex justify-center mb-8 px-4">
        <div
          className="w-full max-w-md h-48 md:max-w-lg md:h-64 lg:max-w-2xl lg:h-80 flex items-center justify-center rounded-lg"
          style={{
            background: "linear-gradient(180deg, #CEBDFF, #FF16D4)",
            padding: "16px",
          }}
        >
          <div className="w-full h-full bg-white flex m-1 items-center justify-center rounded-md">
            {navItems.map(
              (item) =>
                activeTab === item.id && (
                  <img
                    key={item.id}
                    src={item.image}
                    alt={item.label}
                    className="w-full h-full  object-cover rounded-md"
                  />
                )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatSetsUsApart;
