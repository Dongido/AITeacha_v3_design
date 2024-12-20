import React from "react";
import { FaPen } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import SwiperCore from "swiper";
import { Link } from "react-router-dom";
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";

// Import local images
import Image1 from "../../../assets/img/course.png";
import Image2 from "../../../assets/img/certification.jpg";
import Image3 from "../../../assets/img/certification2.jpg";
import Image4 from "../../../assets/img/certification3.jpg";

SwiperCore.use([Navigation, Pagination, Autoplay, A11y]);

type Blog = {
  title: string;
  excerpt: string;
  href: string;
  date: string;
  image: string;
};

type BlogSliderProps = {
  blogs: Blog[];
};

const BlogSlider: React.FC<BlogSliderProps> = ({ blogs }) => {
  return (
    <div className="w-full pb-6 relative">
      <div className="mx-auto">
        <section className="relative bg-blight w-full mb-6 h-[60vh] mt-24 pt-[5rem] flex justify-center bg-gradient-to-r from-[#07052D] to-[#171093] items-center overflow-hidden">
          <span className="absolute inset-0 z-0 p-5 justify-center"></span>
          <section>
            <figcaption className="desc z-10 relative px-2">
              <h1 className="text-xl text-center font-bold text-gray-300">
                Our Blog
              </h1>
              <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-center mb-8 text-white">
                Latest Posts
              </h2>
            </figcaption>
          </section>
        </section>

        <div className="px-4 md:px-6 lg:px-6">
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
            className="blog-swiper mt-24"
          >
            {blogs.map((blog, index) => (
              <SwiperSlide key={index}>
                <div className="w-[350px] mt-6 h-[320px] sm:w-[400px] lg:w-[420px] h-[320px] bg-gray-50 text-gray-900 rounded-lg border border-gray-300 text-left p-2 px-4 relative">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-32 object-cover rounded-md mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                  <p className="text-sm lg:text-base mb-4">{blog.excerpt}</p>

                  <div className="absolute bottom-2 left-2 flex items-center space-x-2">
                    <Link
                      to={blog.href}
                      className="text-primary underline py-1 rounded-full"
                    >
                      Read more
                    </Link>
                    <h4 className="text-sm font-semibold">{blog.date}</h4>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

const dummyBlogData: Blog[] = [
  {
    title:
      "Level Up Your Teaching: Introducing the AI Teacher Certification Course",
    excerpt: "Are you ready to transform your classroom with the....",
    href: "/blogs/level-up-your-teaching-introducing-the-ai-teacher-certification-course",
    date: "September 1, 2024",
    image: Image1,
  },
  {
    title: "The Role of AI Natural Language Processors",
    excerpt: "In the dynamic landscape of education, harnessing the....",
    href: "/blogs/the-role-of-ai-natural-language-processors",
    date: "November 14, 2023",
    image: Image2,
  },
  {
    title: "Artificial Intelligence Transforming Education",
    excerpt: "As we stand on the brink of a new era in education, the ...",
    href: "/blogs/artificial-intelligence-transforming-education",
    date: "November 14, 2023",
    image: Image3,
  },
  {
    title: "Is it really safe to use AI in Education?",
    excerpt: "In the ever-evolving landscape of education, technology...",
    href: "/blogs/is-it-really-safe-to-use-ai-in-education",
    date: "November 14, 2023",
    image: Image4,
  },
];

export default function BlogApp() {
  return <BlogSlider blogs={dummyBlogData} />;
}
