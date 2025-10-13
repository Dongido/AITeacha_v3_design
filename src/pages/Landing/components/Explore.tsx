import { useState } from "react";
import { motion } from "framer-motion";
import Toolbox from "../../../assets/img/Toolbox.svg";
import DashboardPreview from "../../../assets/img/DashboardPreview.svg";
import Dashboard2 from "../../../assets/img/2.png"
import Dashboard3 from "../../../assets/img/2.png"

const ExploreTools = () => {
  const previews = [DashboardPreview, Dashboard2, Dashboard3];
  const [index, setIndex] = useState(0);

  const prev = () =>
    setIndex((i) => (i - 1 + previews.length) % previews.length);
  const next = () => setIndex((i) => (i + 1) % previews.length);

  return (
    <section className="relative bg-[#2A0079] text-white py-10 px-6 md:px-16 overflow-hidden h-[55vh] md:h-[70vh] lg:h-[70vh]">
      <div className="relative flex justify-center items-center animate-float">
        <div className="absolute lg:-top-4 lg:left-10 -left-4 flex space-x-2">
          <span className="w-3 h-3 bg-red-400 rounded-full"></span>
          <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
          <span className="w-3 h-3 bg-green-400 rounded-full"></span>
        </div>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side */}
        <div className="relative -left-4 top-10 flex flex-col justify-center space-y-8 z-10">
          <h4 className="text-[#E630F0] font-medium text-lg">Explore tools</h4>
          <h2 className="text-3xl md:text-3xl font-[500] lg:text-[40px] max-w-sm leading-[36px]">
            Handle all administrative or learning tasks with our AI toolbox
          </h2>

          {/* Arrows (click to change preview) */}
          <div className="absolute flex flex-col gap-2 sm:gap-3 text-white right-4 top-[85%] right-[20%] sm:top-[85%] rotate-90 md:right-[60%] md:top-[95%] md:rotate-0 lg:right-[-20%] lg:top-[70%] transition-all duration-300 ease-in-out">
            <button
              onClick={prev}
              aria-label="previous preview"
              className="text-lg sm:text-xl p-1.5 sm:p-2 rounded-md hover:bg-white/10 cursor-pointer"
            >
              ↑
            </button>
            <button
              onClick={next}
              aria-label="next preview"
              className="text-lg sm:text-xl p-1.5 sm:p-2 rounded-md hover:bg-white/10 cursor-pointer"
            >
              ↓
            </button>
          </div>

          {/* */}
        </div>

        {/* Right Side - Stacked Dashboard Previews */}
        <div className="absolute right-0 bottom-0 -ml-20 flex justify-center items-end pointer-events-none">
          <div className="relative w-[260px] sm:w-[360px] md:w-[520px] lg:w-[640px] h-[220px] sm:h-[300px] md:h-[380px] lg:h-[460px]">
            {previews.map((src, i) => {
              const n = previews.length;
              // depth 0 = active/top, larger numbers are further back
              const depth = (i - index + n) % n;
              const z = n - depth; // higher z for top
              const x = depth * 18; // px to shift horizontally
              const y = -depth * 10; // px to shift vertically (lift back items)
              const scale = 1 - depth * 0.04;
              const opacity = 1 - depth * 0.12;

              return (
                <motion.img
                  key={i}
                  src={src}
                  alt={`AiTeacha dashboard preview ${i + 1}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity, x, y, scale }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className={`absolute left-0 bottom-0`}
                  style={{
                    width: "100%",
                    zIndex: z,
                    pointerEvents: depth === 0 ? "auto" : "none",
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* */}
      <div className="absolute lg:-mt-56 left-0 bottom-0 md:-ml-16 w-48 sm:w-56 md:w-80 lg:w-[20%] z-0 pointer-events-none">
        <img
          src={Toolbox}
          alt="Toolbox illustration"
          className="w-full h-auto block"
        />
      </div>
    </section>
  );
};

export default ExploreTools;
