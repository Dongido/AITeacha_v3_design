import { useState, useEffect, useRef, useCallback } from "react";

import { cardsData } from "./data";
import Navbar from "./Navbar";
import { Link, useNavigate } from "react-router-dom";
import Hero from "../../../pages/Landing/components/Hero";
import Explore from "../../../pages/Landing/components/Explore"

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

  const stats = [
    { value: "19k+", label: "Teachers Onboard" },
    { value: "3k+", label: "Schools Partnered" },
    { value: "200k+", label: "Students Impacted" },
  ];

  const roles = [
    {
      title: "For Teachers",
      icon: "👨‍🏫",
      features: [
        "1-on-1 Lesson Customization",
        "Curriculum-Aligned Content",
        "AI-Powered Feedbacks",
        "Realtime Student Performance Reporting",
        "Personalized Assessment & Feedback",
        "AI-Powered CBT for Automated Tests & Exams",
      ],
      cta: "Start as a Teacher",
    },
    {
      title: "For Lecturers",
      icon: "🧑‍💻",
      features: [
        "Course Outline Generator",
        "Bulk Grading Assistant",
        "Research Companion",
        "All Student Feedback Tool",
        "Thesis Topic Advisor (coming soon)",
        "Automated Lesson Plan Generation",
      ],
      cta: "Start as a Lecturer",
    },
    {
      title: "For Schools",
      icon: "🏫",
      features: [
        "Standardized Lesson Plans",
        "School-Level Analytics",
        "Teacher Onboarding Support",
        "Identify Struggling Students Early",
        "Offline AI (Coming Soon)",
        "Integrated Administrative Tools",
        "Centralized Curriculum Management",
      ],
      cta: "Start as a School",
    },
    {
      title: "For Online Tutors",
      icon: "💻",
      features: [
        "LIVE Classroom Capabilities",
        "Curriculum-Aligned Content for Distant Learning",
        "Realtime Student Performance Reporting",
        "Multimodal Content Creation & Delivery",
        "24/7 AI Chat Support for Instant Study Aids",
      ],
      cta: "Start as a Teacher",
    },
    {
      title: "For Students",
      icon: "🎓",
      features: [
        "Personalized Study Paths with Adaptive Learning Modules",
        "Instant Homework & Problem Solving",
        "Multimodal Learning Resources",
        "Learning Challenge Detection & Support",
        "24/7 AI Study Assistance with Zyra",
      ],
      cta: "Start as a Lecturer",
    },
    {
      title: "For Parents",
      icon: "👩‍👩‍👧‍👦",
      features: [
        "Real-Time Progress Dashboards",
        "Personalized Learning Insights",
        "Automated Homework Assistance",
        "Early Intervention Alerts and Supports",
        "Engagement & Communication Hub",
        "Curated Educational Resources",
      ],
      cta: "Start as a School",
    },
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
      <Hero />
      <Explore />

      <section className="py-20 px-6 md:px-16 bg-white text-center">
        {/* Trusted Header */}
        <p className="text-2xl mb-8 font-[600] text-[#C2C2C2]">
          Trusted by{" "}
          <span className="text-gray-700 font-semibold">teachers</span>,{" "}
          <span className="text-gray-700 font-semibold">schools</span> &{" "}
          <span className="text-gray-700 font-semibold">students</span>
        </p>

        {/* Stats */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-20 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#F133E1] to-[#6200EE] bg-clip-text text-transparent">
                {stat.value}
              </h3>
              <p className="text-gray-700 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Headline */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Empowering Educators with AI From Classrooms to Campuses Across
            Africa
          </h2>
          <p className="text-gray-500">
            Reduce your workload by 80% and personalize learning using Africa's
            most powerful AI Edtech Platform.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {roles.map((role, index) => (
            <div
              key={index}
              className="bg-gradient-to-b from-[#290064] to-[#3F003A] rounded-3xl p-8 text-left text-white shadow-lg 
                       hover:-translate-y-2 hover:shadow-2xl transition-transform duration-300 
                       flex flex-col justify-between h-full"
            >
              {/* Role Icon & Title */}
              <div>
                <div className="flex items-center mb-6 text-2xl font-semibold">
                  <span className="text-6xl mr-3">{role.icon}</span>{" "}
                  {role.title}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {role.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 border-b border-white/30 pb-2 border-dashed"
                    >
                      <span className="text-white text-lg">✓</span>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <a
                href="#"
                className="w-full border border-white py-3 rounded-full hover:bg-white hover:text-[#3D007A] 
                         transition-colors duration-300 font-medium px-8 text-center inline-block mt-auto"
              >
                {role.cta}
              </a>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
};