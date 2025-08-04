import { useState, useEffect, useRef, useCallback } from "react";

import { cardsData } from "./data";
import Navbar from "./Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import rescillience from "../../../assets/img/resilienc.svg";
import cfirst from "../../../assets/img/csfirst lag.jpg";
import openAi from "../../../assets/img/OpenAI_Logo.svg";
import icedt from "../../../assets/img/icedt-removebg-preview.png";
import nvidia from "../../../assets/img/NVIDIA_logo.svg.png";
import { Button } from "../../../components/ui/Button";
export default () => {
  const [text, setText] = useState(
    "Customizable, effortless lesson plans with"
  );
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [loading, setLoading] = useState(false);

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
  }, [texts]);
  const scrollToCard = useCallback((index: number): void => {
    const carouselElement = carouselRef.current;
    if (carouselElement) {
      if (carouselElement.children.length > 0) {
        const firstChild = carouselElement.children[0] as HTMLElement;
        if (firstChild) {
          const cardWidth = firstChild.offsetWidth;
          const gap = window.innerWidth < 768 ? 24 : 32;
          const scrollPosition = index * (cardWidth + gap);
          carouselElement.scrollTo({
            left: scrollPosition,
            behavior: "smooth",
          });
        }
      }
    }
  }, []);

  const startAutoScroll = useCallback(() => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
    }
    if (window.innerWidth < 768) {
      autoScrollIntervalRef.current = setInterval(() => {
        setCurrentCardIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % cardsData.length;
          scrollToCard(nextIndex);
          return nextIndex;
        });
      }, 3000);
    }
  }, [scrollToCard]);
  const stopAutoScroll = useCallback(() => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      stopAutoScroll();
      startAutoScroll();
    };

    startAutoScroll();
    window.addEventListener("resize", handleResize);
    return () => {
      stopAutoScroll();
      window.removeEventListener("resize", handleResize);
    };
  }, [startAutoScroll, stopAutoScroll]);
  useEffect(() => {
    const carouselElement = carouselRef.current;
    if (!carouselElement || window.innerWidth >= 768) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Array.from(carouselElement.children).indexOf(
              entry.target
            );
            if (index !== -1 && index !== currentCardIndex) {
              setCurrentCardIndex(index);
            }
          }
        });
      },
      {
        root: carouselElement,
        rootMargin: "0px",
        threshold: 0.8,
      }
    );

    Array.from(carouselElement.children).forEach((child) => {
      observer.observe(child);
    });

    return () => {
      if (carouselElement) {
        Array.from(carouselElement.children).forEach((child) => {
          observer.unobserve(child);
        });
      }
    };
  }, [carouselRef, currentCardIndex]); // currentCardIndex is a dependency here

  const scrollToSectionOnHome = (id: string) => {
    if (window.location.pathname === "/") {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleCardButtonClick = async (cardId: string, roleId: number) => {
    setLoading(true);
    localStorage.setItem("selectedRole", cardId);
    localStorage.setItem("roleId", roleId.toString());
    navigate("/auth/sign-up");
  };

  return (
    <section>
      <Navbar />
      <div className="pt-16 lg:pt-32 pb-12 gap-12 text-gray-600 ">
        <div
          style={{
            background:
              "linear-gradient(180deg, rgba(192, 132, 252, 0) 20.79%, rgba(232, 121, 249, 0.26) 40.92%, rgba(204, 171, 238, 0) 70.35%)",
          }}
          className="pb-24"
        >
          <div className="max-w-screen-2xl mx-auto relative space-y-5 text-center px-4 md:px-8 mt-12 ">
            <a
              href="#"
              className="inline-flex justify-between items-center py-2 mt-6 px-3 text-sm text-primary bg-gray-50 rounded-full dark:text-white border border-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              role="alert"
            >
              <span className="text-lg font-medium">
                ❤️ Teachers Are Heroes
              </span>
            </a>
            <div className="text-center">
              <motion.h2
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-4xl md:text-5xl lg:text-7xl text-black primary-bold mx-auto"
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
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#E114E5] bg-[length:200%_200%]"
                  style={{
                    display: "inline-block",
                    backgroundPosition: "0% 50%",
                  }}
                >
                  AiTeacha
                </motion.span>
              </motion.h2>
            </div>

            <p className="max-w-2xl mx-auto text-lg font-medium text-gray-900">
              Built with all AI tools to aid teachers day-to-day tasks to
              improve students outcome
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
          <div className="mt-14 max-w-screen-2xl mx-auto">
            <video
              className="w-full shadow-lg rounded-lg border"
              src={"/dashboardvideo.mp4"}
              controls
              autoPlay
              muted
              loop
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
        <div className="bg-gradient-to-b from-white via-blue-50 to-white pb-20 overflow-hidden">
          <section className="max-w-screen-2xl text-center mx-auto  pb-8 px-4 md:px-8 pt-12">
            <div>
              <div className="py-4">
                <h3 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-700">
                  Empowering Educators with AI From Classrooms to Campuses
                  Across Africa
                </h3>
                <p className="text-lg md:text-xl lg:text-xl text-gray-700 leading-relaxed mt-4 max-w-3xl mx-auto">
                  Reduce your workload by 80% and personalize learning using
                  Africa's most powerful AI Edtech Platform.
                </p>
              </div>
            </div>
          </section>
          <div className="max-w-screen-2xl mx-auto px-2 md:px-4 lg:px-8">
            <div
              ref={carouselRef}
              className="flex md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 gap-x-6
                    overflow-x-auto snap-x snap-mandatory scrollbar-hide
                    md:overflow-visible md:snap-none"
              style={{
                paddingLeft:
                  window.innerWidth < 768 ? "calc(50% - 160px)" : "0",
                paddingRight:
                  window.innerWidth < 768 ? "calc(50% - 160px)" : "0",
              }}
            >
              {cardsData.map((card: any, index: number) => (
                <div
                  key={card.id}
                  className={`
                  flex-shrink-0 w-[320px] md:w-auto snap-center
                  bg-white rounded-xl shadow-xl px-2 md:px-4 lg:px-8 py-8 md:m-0 flex flex-col justify-between
                  transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-2xl border border-gray-100
                  ${
                    currentCardIndex === index && window.innerWidth < 768
                      ? "scale-100"
                      : window.innerWidth < 768
                      ? "scale-95"
                      : "scale-100"
                  }
                `}
                  onMouseEnter={stopAutoScroll}
                  onMouseLeave={startAutoScroll}
                >
                  <div>
                    <div className="flex items-center mb-5">
                      {card.icon && (
                        <div
                          className="p-3 rounded-full mr-4 flex items-center justify-center"
                          style={{ backgroundColor: `${card.buttonBgColor}20` }}
                        >
                          <card.icon
                            className="h-8 w-8"
                            style={{ color: card.buttonBgColor }}
                            aria-hidden="true"
                          />
                        </div>
                      )}
                      <h3 className="text-2xl font-bold text-gray-900">
                        {card.title}
                      </h3>
                    </div>
                    <ul className="text-gray-700 space-y-3 mb-8 text-lg">
                      {card.bullets.map((bullet: string, i: number) => (
                        <li key={i} className="flex items-start">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-1"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.052-.143Z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button
                    onClick={() => handleCardButtonClick(card.id, card.roleId)}
                    variant={"gradient"}
                    className="w-full text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out shadow-md hover:shadow-lg hover:brightness-90 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  >
                    {card.buttonText}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          className="max-w-screen-2xl mx-auto mt-28 bg-gradient-to-b from-[#5c3cbb] to-[#8b6ecb] py-4 lg:py-8 rounded-3xl
                      flex flex-col lg:flex-row lg:items-center lg:justify-start lg:space-x-12 px-4 relative"
        >
          <div className="hidden lg:block lg:flex-shrink-0 w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white shadow-lg ml-8">
            <img
              src="https://img.freepik.com/premium-photo/black-teacher-teaching-lesson-classroom-full-students-back-school-learning-concept_191555-3151.jpg?w=360"
              alt="Young teacher"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col items-center text-white text-center flex-grow">
            <p className="text-2xl font-semibold sm:text-3xl mb-2">
              "AiTeacha saved me 15 hours a week!"
            </p>
            <h3 className="font-semibold text-lg mb-8">
              Teacher in Lagos, Nigeria
            </h3>
            <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-16 mt-8 text-white justify-center">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-white">19,000+</h2>
                <p className="text-lg">Teachers Onboard</p>
              </div>
              <div className="text-center">
                <h2 className="text-4xl font-bold text-white">3,000+</h2>
                <p className="text-lg">Schools Partnered</p>
              </div>
              <div className="text-center">
                <h2 className="text-4xl font-bold text-white">200,000+</h2>
                <p className="text-lg">Students Impacted</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-32">
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
