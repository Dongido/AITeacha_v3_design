import React from "react";
import { useNavigate } from "react-router-dom";

const Training = () => {
  const navigate = useNavigate();

  const handleEnquireClick = () => {
    navigate("/dashboard/resource/training/form");
  };
  const videoUrls = [
    "https://www.youtube.com/embed/ytnQEgxMnBM?si=Mc6Lqg3Q2YUpTznG",
    "https://www.youtube.com/embed/ytnQEgxMnBM?si=oGHfPuBqAxAwgpy8",
    "https://www.youtube.com/embed/sRarbz2zIO8?si=1O6sQ_UU79_h1Gnm",
    "https://www.youtube.com/embed/3IlMlzkvmlY?si=FEVjXP0XWfDMlcrp",
    "https://www.youtube.com/embed/F1b6EiOlU8w?si=BYr1mvATTYcyszb6",
    "https://www.youtube.com/embed/F1b6EiOlU8w?si=wj7iPKBT_6l1x9HG",
  ];
  return (
    <div className="mt-4">
      <section className="bg-gradient-to-r from-[#07052D] to-[#171093] py-14 rounded-2xl">
        <div className="max-w-screen-xl mx-auto px-4 gap-x-12 justify-between md:flex md:px-8">
          <div className="max-w-xl">
            <h3 className="text-white text-3xl font-semibold sm:text-4xl">
              Empower your school with AI-driven teaching tools
            </h3>
            <p className="mt-3 text-gray-300">
              Equip your educators and students with the latest AI technology to
              enhance learning experiences, improve engagement, and accelerate
              academic success. Join the AiTeacha program today!
            </p>
          </div>
          <div className="flex-none mt-4 md:mt-0">
            <button
              onClick={handleEnquireClick}
              className="inline-block py-2 px-4 text-gray-800 font-medium bg-white duration-150 hover:bg-gray-100 active:bg-gray-200 rounded-lg shadow-md hover:shadow-none"
            >
              Enquire Now
            </button>
          </div>
        </div>
      </section>
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
