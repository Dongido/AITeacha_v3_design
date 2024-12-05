import React from "react";
import { FaQuoteLeft } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import SwiperCore from "swiper";
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";

SwiperCore.use([Navigation, Pagination, Autoplay, A11y]);

type Testimonial = {
  message: string;
  author: string;
  avatar: string;
};

type TestimonialSliderProps = {
  testimonials: Testimonial[];
};

const TestimonialSlider: React.FC<TestimonialSliderProps> = ({
  testimonials,
}) => {
  return (
    <div className="w-full pb-6 relative">
      <div className="mx-auto px-4">
        <h1 className="text-md text-center font-bold text-primary">
          Testimonials
        </h1>
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
          What Our Customers Say
        </h2>

        <Swiper
          slidesPerView={1}
          spaceBetween={15}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="testimonial-swiper"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="w-[350px] h-[250px] sm:w-[400px] sm:h-[250px] lg:w-[420px] lg:h-[280px] bg-gray-100 text-gray-900 rounded-lg border border-gray-300 text-left p-6 relative">
                <FaQuoteLeft className="text-primary text-3xl mb-4" />
                <p className="text-sm lg:text-base mb-6">
                  "{testimonial.message}"
                </p>
                <div className="absolute bottom-4 left-4 flex items-center space-x-2">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                  <h3 className="text-sm font-semibold">
                    {testimonial.author}
                  </h3>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default TestimonialSlider;
