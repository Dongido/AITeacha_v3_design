import React from "react";

const Community = () => {
  return (
    <div className="flex flex-col justify-center items-center  ">
      <div className="w-full text-center">
        <div className="my-4 px-12 ">
          <img
            src="https://cdn.dribbble.com/users/77121/screenshots/11485643/media/2daa7264756c4a02ddba5271f0ce1a71.gif" // Replace with your community preview GIF
            alt="Community Preview"
            className="w-full max-h-[450px] rounded-lg shadow-lg"
          />
        </div>

        <a
          href="https://t.me/+vYGpv4K_twllY2M0"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-primary text-white text-lg font-medium rounded-full shadow-lg hover:bg-[#007ab7] transition"
        >
          Join Our Community
        </a>
      </div>
    </div>
  );
};

export default Community;
