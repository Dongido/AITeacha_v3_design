import React from "react";

const Feature = () => {
  return (
    <div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24 lg:px-8">
        <h3 className="text-xl font-medium text-center underline text-primary mb-2 relative">
          What sets us apart
        </h3>
        <h2 className="text-slate-900 font-bold font-display text-4xl sm:text-5xl text-center mb-8 md:mb-20">
          Why AiTeacha is a Game-Changer
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 ">
          <div className="flex flex-col ">
            <div className="text-base/7 font-semibold text-gray-900">
              <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center mb-6 relative shadow-xl shadow-purple-500/30 mx-auto lg:mx-0">
                <div className="rounded-full"></div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-28 h-28 text-purple-500 relative z-10"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="#FFFFFF"
                    stroke="#A855F7"
                    strokeWidth="2"
                  />
                  <path
                    d="M12 6v6h4"
                    stroke="#A855F7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 2a10 10 0 1 1-10 10 10 10 0 0 1 10-10Z"
                    fill="none"
                    stroke="#A855F7"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h3 className="text-slate-900 font-bold mb-4 font-display text-3xl sm:text-4xl text-center lg:text-left">
                Time-Saving Tools
              </h3>
            </div>

            <div className="mt-1 flex flex-auto flex-col text-base/7 text-slate-700 text-center lg:text-left ">
              <p className="flex-auto">
                Streamline administrative tasks, giving you more time to focus
                on student engagement and growth
              </p>
            </div>
          </div>
          <div className="flex flex-col ">
            <div className="text-base/7 font-semibold text-gray-900">
              <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center mb-6 relative shadow-xl shadow-purple-500/30 mx-auto lg:mx-0">
                <div className="rounded-full"></div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-28 h-28 text-purple-500 relative z-10"
                >
                  <rect x="3" y="8" width="18" height="2" fill="#A855F7" />
                  <circle cx="6" cy="9" r="3" fill="#A855F7" />
                  <rect x="3" y="14" width="18" height="2" fill="#A855F7" />
                  <circle cx="18" cy="15" r="3" fill="#A855F7" />
                </svg>
              </div>
              <h3 className="text-slate-900 font-bold mb-4 font-display text-3xl sm:text-4xl text-center lg:text-left">
                Customized for Every Classroom
              </h3>
            </div>

            <div className="mt-1 flex flex-auto flex-col text-base/7 text-slate-700 text-center lg:text-left ">
              <p className="flex-auto">
                AiTeacha makes it easy to adapt materials for any class size,
                meeting diverse student needs with ease
              </p>
            </div>
          </div>
          <div className="flex flex-col ">
            <div className="text-base/7 font-semibold text-gray-900">
              <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center mb-6 relative shadow-xl shadow-purple-500/30 mx-auto lg:mx-0">
                <div className="rounded-full"></div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-28 h-28 text-purple-500 relative z-10"
                >
                  <path
                    d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9L12 2.5z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h3 className="text-slate-900 font-bold mb-4 font-display text-3xl sm:text-4xl text-center lg:text-left">
                Enhances Teacher Performance
              </h3>
            </div>

            <div className="mt-1 flex flex-auto flex-col text-base/7 text-slate-700 text-center lg:text-left ">
              <p className="flex-auto">
                Let AI handle routine tasks, so you can focus on delivering
                engaging, innovative lessons that inspire and captivate your
                students
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feature;
