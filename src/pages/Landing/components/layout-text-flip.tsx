import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LayoutTextFlipProps {
  text?: string;
  words?: string[];
  duration?: number;
}

const LayoutTextFlip = ({
  text = "",
  words = ["Landing Pages", "Component Blocks", "Page Sections", "3D Shaders"],
  duration = 3000,
}: LayoutTextFlipProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, duration);
    return () => clearInterval(interval);
  }, [duration, words.length]);

  return (
    <div className="flex flex-col items-center md:items-start">
      {text && (
        <motion.span className="text-lg sm:text-xl md:text-2xl font-bold drop-shadow-lg mb-2">
          {text}
        </motion.span>
      )}

      {/* ✅ Fixed height and smooth transitions */}
      <div
        ref={containerRef}
        className="relative w-fit overflow-hidden rounded-md px-2 sm:px-3 py-1 sm:py-2 text-center"
        style={{
          height: "clamp(3rem, 10vw, 5rem)", // ensures enough height for large text
        }}
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={currentIndex}
            className="block bg-gradient-to-r from-[#6200EE] to-[#F133E1] bg-clip-text text-transparent text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-extrabold leading-none"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 0.9, 0.3, 1] }}
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LayoutTextFlip;