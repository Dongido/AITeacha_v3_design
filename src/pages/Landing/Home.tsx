import React from "react";
import TestimonialSlider from "./components/Testimonial";
import ToolboxPage from "./components/ToolBox";
import FaqsSection from "./components/FaqDesign";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import HeroA from "./components/HeroA";
import HeroD from "./components/HeroD";
import HowItWorks from "./components/HowItWorks";
import WhatSetsUsApart from "./components/WhatSetsUsApart";
import AnimatedSection from "./components/AnimatedSection";
import Feature from "./components/Feature";
const Home: React.FC = () => {
  const testimonials = [
    {
      message:
        "AI Teacha AI tools have transformed my teaching experience! The personalized learning, adaptive platforms, and intelligent support systems are incredible. It's an indispensable tool for educators seeking to enhance student engagement and success.",
      author: "Uche Nwaobi",
      avatar: "https://pagedone.io/asset/uploads/1696229994.png",
    },
    {
      message:
        "AI Teacha AI has revolutionized my classroom. The adaptive learning platforms and intelligent support systems create an unparalleled teaching environment. It's a game-changer for educators dedicated to student success.",
      author: "Emmanuel Akpan",
      avatar:
        "https://res.cloudinary.com/dqny2b4gb/image/upload/v1729123752/47f40d1d-e9f7-4c26-bb74-d9361bd3934a_frohxv.jpg", // Replace with actual avatar URL
    },
    {
      message:
        "AI Teacha is a teaching app that has an engaging and interactive experience for both educators and learners. They offer a dynamic platform for delivering educational content in a more accessible and often entertaining manner.",
      author: "Dave Micheals",
      avatar: "https://pagedone.io/asset/uploads/1696230027.png",
    },
    {
      message:
        "AI Teacha is a teaching app that has an engaging and interactive experience for both educators and learners. They offer a dynamic platform for delivering educational content in a more accessible and often entertaining manner.",
      author: "Samuel Nzubechi",
      avatar: "https://pagedone.io/asset/uploads/1696229969.png",
    },
    {
      message:
        "AI Teacha is a teaching app that has an engaging and interactive experience for both educators and learners. They offer a dynamic platform for delivering educational content in a more accessible and often entertaining manner.",
      author: "Agbinya Mario Gabriel",
      avatar: "https://pagedone.io/asset/uploads/1696229994.png",
    },
  ];

  return (
    <div className="flex flex-col  min-h-screen bg-white">
      <AnimatedSection delay={0.4}>
        <HeroA />
      </AnimatedSection>

      <div className="flex flex-col items-center justify-center">
        <HowItWorks />
        <AnimatedSection delay={0.4}>
          <section>
            <Feature />
          </section>
        </AnimatedSection>
        <AnimatedSection delay={0.4}>
          <section id="features">
            <WhatSetsUsApart />
          </section>
        </AnimatedSection>
        <AnimatedSection delay={0.6}>
          <section id="tools">
            <ToolboxPage />
          </section>
        </AnimatedSection>
        <AnimatedSection delay={0.8}>
          <CTA />
        </AnimatedSection>
        <TestimonialSlider testimonials={testimonials} />
        <AnimatedSection delay={1.2}>
          <section id="faqs">
            <FaqsSection />
          </section>
        </AnimatedSection>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
