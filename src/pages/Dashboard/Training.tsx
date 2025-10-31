import React from "react";
import { useNavigate } from "react-router-dom";

import dashImg from "../../assets/img/0e846ab4-992d-48b3-a818-d62a7803bd8e 1.png";

const Training = () => {
  const navigate = useNavigate();

  const handleEnquireClick = () => {
    navigate("/dashboard/resource/training/form");
  };
  const videoUrls = [
    "https://www.youtube.com/embed/-84DHq29NiM?si=CNOZQzCJVEiagH0k",
    "https://www.youtube.com/embed/z7_EvUO4BSA?si=dlutyNzAH0UiDUGH",
    "https://www.youtube.com/embed/-84DHq29NiM?si=ijc5ZAsary_NQeJ-",
    "https://www.youtube.com/embed/ytnQEgxMnBM?si=Mc6Lqg3Q2YUpTznG",
    "https://www.youtube.com/embed/ytnQEgxMnBM?si=oGHfPuBqAxAwgpy8",
    "https://www.youtube.com/embed/sRarbz2zIO8?si=1O6sQ_UU79_h1Gnm",
    "https://www.youtube.com/embed/3IlMlzkvmlY?si=FEVjXP0XWfDMlcrp",
    "https://www.youtube.com/embed/F1b6EiOlU8w?si=BYr1mvATTYcyszb6",
    "https://www.youtube.com/embed/F1b6EiOlU8w?si=wj7iPKBT_6l1x9HG",
  ];
  return (
    <div className="mt-4 p-0 md:p-[30px]">
      <h4 className="text-xl font-bold mb-[24px]">Resources</h4>
      

      <div className="relative mt-4">
        <div className="bg-[#EFE6FD] p-4 md:p-8 rounded-lg overflow-hidden">
           <div className="max-w-xl">
            <h3 className=" text-lg font-semibold sm:text-2xl">
              Empower your school with AI-driven teaching tools
            </h3>
            <p className="mt-3">
              Equip your educators and students with the latest AI technology to
              enhance learning experiences, improve engagement, and accelerate
              academic success. Join the AiTeacha program today!
            </p>
          </div>
          <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
            <button
              onClick={handleEnquireClick}
              className="inline-block px-6 py-2 font-medium bg-primary text-white duration-150 hover:border-[#6200EE] active:bg-gray-200 rounded-full  hover:shadow-none"
            >
              Enquire Now
            </button>
            <a
              href="https://t.me/+vYGpv4K_twllY2M0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-2 bg-transparent text-primary border border-[#6200EE] text-base font-medium rounded-full transition"
            >
              Join Our Community
            </a>
          </div>
        </div>

        <img
          src={dashImg}
          alt="Robot reading a book"
          className="absolute lg:block hidden h-[200px] right-[120px] bottom-0"
          
        />
      </div>

      <div>
        <h4 className="text-xl font-bold mt-[30px] m-0">Video Resources</h4>
        <p className="text-sm m-0">Watch videos to learn more</p>
      </div>
      <div className="mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videoUrls.map((url, index) => (
            <div
              key={index}
              className="bg-black rounded-lg overflow-hidden shadow-lg"
            >
              <iframe
                width="100%"
                height="315"
                src={url}
                title={`YouTube video ${index + 1}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Training;
