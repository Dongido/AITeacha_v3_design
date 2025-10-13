// import React from "react";
// import { FaQuoteLeft } from "react-icons/fa";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/swiper-bundle.css";
// import SwiperCore from "swiper";
// import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";

// SwiperCore.use([Navigation, Pagination, Autoplay, A11y]);

// type Testimonial = {
//   message: string;
//   author: string;
//   avatar: string;
// };

// type TestimonialSliderProps = {
//   testimonials: Testimonial[];
// };

// const TestimonialSlider: React.FC<TestimonialSliderProps> = ({
//   testimonials,
// }) => {
//   return (
//     <div className="w-full pb-6 relative">
//       <div className="mx-auto px-4">
//         <h1 className="text-md text-xl text-center font-bold text-primary">
//           Testimonials
//         </h1>
//         <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 text-gray-900">
//           What Our Customers Say
//         </h2>

//         <Swiper
//           slidesPerView={1}
//           spaceBetween={15}
//           navigation
//           pagination={{ clickable: true }}
//           autoplay={{ delay: 3000 }}
//           breakpoints={{
//             0: {
//               slidesPerView: 1,
//             },
//             640: { slidesPerView: 1 },
//             768: { slidesPerView: 2 },
//             1024: { slidesPerView: 3 },
//           }}
//           className="testimonial-swiper"
//         >
//           {testimonials.map((testimonial, index) => (
//             <SwiperSlide key={index}>
//               <div className="w-[350px] h-[250px] sm:w-[400px] sm:h-[250px] lg:w-[420px] lg:h-[280px] bg-gray-100 text-gray-900 rounded-lg border border-gray-300 text-left p-6 relative">
//                 <FaQuoteLeft className="text-primary text-3xl mb-4" />
//                 <p className="text-sm lg:text-base mb-6">
//                   "{testimonial.message}"
//                 </p>
//                 <div className="absolute bottom-4 left-4 flex items-center space-x-2">
//                   <img
//                     src={testimonial.avatar}
//                     alt={testimonial.author}
//                     className="w-10 h-10 rounded-full border-2 border-white"
//                   />
//                   <h3 className="text-sm font-semibold">
//                     {testimonial.author}
//                   </h3>
//                 </div>
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>
//     </div>
//   );
// };

// export default TestimonialSlider;

import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Define type for each testimonial
interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  review: string;
  rating: number;
}

// Sample data
const testimonials: Testimonial[] = [
  {
    name: "Dave Micheals",
    role: "Principal",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    review:
      "AiTeacha is a teaching app that has an engaging and interactive experience for both educators and learners. They offer a dynamic platform for delivering educational content in a more accessible and entertaining manner.",
    rating: 5,
  },
  {
    name: "Samuel Nzubechi",
    role: "Principal",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    review:
      "AiTeacha AI tools have transformed my teaching experience! The personalized learning, adaptive platforms, and intelligent support systems are incredible. It's an indispensable tool for educators seeking to enhance student engagement and success.",
    rating: 5,
  },
  {
    name: "Mary Chisom",
    role: "Teacher",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    review:
      "The AI-powered teaching assistant has simplified lesson planning and grading. I can focus on creativity while it handles structure.",
    rating: 5,
  },
  {
    name: "Agbinya Mario Gabriel",
    role: "Lecturer",
    avatar: "https://randomuser.me/api/portraits/men/20.jpg",
    review:
      "Every feature feels built with educators in mind. AiTeacha is easily one of the most useful tools I’ve adopted this year.",
    rating: 5,
  },
  {
    name: "Sophia Daniels",
    role: "Instructor",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    review:
      "From personalized analytics to class automation, it saves me hours weekly. Highly recommend to every school and teacher.",
    rating: 5,
  },
  {
    name: "Emmanuel Akpan",
    role: "Head of Department",
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
    review:
      "Impressed with the adaptive AI feedback system. It’s intuitive, fast, and accurate for student evaluation.",
    rating: 5,
  },
  {
    name: "Uche Sarah",
    role: "Vice Principal",
    avatar: "https://randomuser.me/api/portraits/women/19.jpg",
    review:
      "AiTeacha transformed how we monitor progress. Our teachers love its automation features.",
    rating: 5,
  },
];

// Props type for TestimonialCard
interface TestimonialCardProps {
  t: Testimonial;
  delay?: number;
}

const TestimonialsCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  // Group testimonials into slides of 5
  const slides: Testimonial[][] = [];
  for (let i = 0; i < testimonials.length; i += 5) {
    slides.push(testimonials.slice(i, i + 5));
  }

  const next = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prev = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="w-full bg-white px-6 sm:px-10 lg:px-20 relative overflow-hidden">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-[#A020F0] text-base font-medium mb-2">
          Testimonials
        </p>
        <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-[700] text-[#2A2929]">
          What Our Customers Say
        </h2>
      </div>

      {/* Carousel */}
      <div className="relative flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-6 w-full"
          >
            {/* Top Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full lg:w-[80%] justify-items-center">
              {slides[currentSlide]?.slice(0, 2).map((t, index) => (
                <TestimonialCard key={index} t={t} delay={index * 0.1} />
              ))}
            </div>

            {/* Middle Single */}
            <div className="w-full sm:w-[60%] lg:w-[40%] flex justify-center">
              {slides[currentSlide]?.[2] && (
                <TestimonialCard t={slides[currentSlide][2]} delay={0.2} />
              )}
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full lg:w-[80%] justify-items-center">
              {slides[currentSlide]?.slice(3, 5).map((t, index) => (
                <TestimonialCard
                  key={index}
                  t={t}
                  delay={index * 0.1 + 0.3}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-center items-center gap-6 mt-12">
          <button
            onClick={prev}
            aria-label="previous"
            className="bg-[#6200EE] hover:bg-[#4b00b5] text-white text-xl px-4 py-3 rounded-full shadow-md transition-all duration-300 cursor-pointer"
          >
            ←
          </button>
          <button
            onClick={next}
            aria-label="next"
            className="bg-[#6200EE] hover:bg-[#4b00b5] text-white text-xl px-4 py-3 rounded-full shadow-md transition-all duration-300 cursor-pointer"
          >
            →
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center mt-6 gap-3">
          {slides.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                i === currentSlide ? "bg-[#6200EE]" : "bg-[#D3D3D3]"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Single Card Component
const TestimonialCard: React.FC<TestimonialCardProps> = ({ t, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white border border-[#EAEAEA] rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 max-w-sm flex flex-col justify-between h-full"
  >
    {/* Top section */}
    <div className="flex items-center gap-3 mb-3">
      <img
        src={t.avatar}
        alt={t.name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div>
        <p className="text-base font-semibold">{t.name}</p>
        {/* <p className="text-sm text-gray-500">{t.role}</p> */}
      </div>
    </div>

    {/* Review */}
    <p className="text-[#3B3A3A] text-sm sm:text-base leading-relaxed mb-4">
      “{t.review}”
    </p>

    {/* Rating */}
    <div className="flex gap-1 text-[#FFD700] mt-auto">
      {Array.from({ length: t.rating }).map((_, i) => (
        <FaStar key={i} />
      ))}
    </div>
  </motion.div>
);

export default TestimonialsCarousel;
