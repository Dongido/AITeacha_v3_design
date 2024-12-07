import React from "react";

const Feature = () => {
  return (
    <div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24 lg:px-8">
        <h2 className="text-slate-900 font-bold font-display text-4xl sm:text-5xl text-center mb-8 md:mb-20">
          Why AI Teacha is a Game-Changer
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 ">
          <div className="flex flex-col ">
            <div className="text-base/7 font-semibold text-gray-900">
              <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center mb-6 relative shadow-xl shadow-purple-500/30 mx-auto lg:mx-0">
                <div className="rounded-full"></div>
                <img
                  src="https://www.eduaide.ai/images/ui/features/Icon_Clock.svg"
                  alt="Time-Saving Solutions"
                  className="w-28 h-28 relative z-10"
                />
              </div>
              <h3 className="text-slate-900 font-bold mb-4 font-display text-3xl sm:text-4xl text-center lg:text-left">
                Time-Saving Tools
              </h3>
            </div>
            <div className="mt-1 flex flex-auto flex-col text-base/7 text-slate-700 text-center lg:text-left ">
              <p className="flex-auto">
                Reduce time spent on administrative tasks, freeing you up to
                focus more on student interaction and development.
              </p>
            </div>
          </div>
          <div className="flex flex-col ">
            <div className="text-base/7 font-semibold text-gray-900">
              <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center mb-6 relative shadow-xl shadow-purple-500/30 mx-auto lg:mx-0">
                <div className="rounded-full"></div>
                <img
                  src="https://www.eduaide.ai/images/ui/features/Icon_Sliders.svg"
                  alt="Tailored for Every Classroom"
                  className="w-28 h-28 relative z-10"
                />
              </div>
              <h3 className="text-slate-900 font-bold mb-4 font-display text-3xl sm:text-4xl text-center lg:text-left">
                Customized for Every Classroom
              </h3>
            </div>
            <div className="mt-1 flex flex-auto flex-col text-base/7 text-slate-700 text-center lg:text-left ">
              <p className="flex-auto">
                Whether you're teaching large classes or small groups, Eduaide
                helps you adapt materials to suit diverse student needs
                effortlessly.
              </p>
            </div>
          </div>
          <div className="flex flex-col ">
            <div className="text-base/7 font-semibold text-gray-900">
              <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center mb-6 relative shadow-xl shadow-purple-500/30 mx-auto lg:mx-0">
                <div className="rounded-full"></div>
                <img
                  src="	https://www.eduaide.ai/images/ui/features/Icon_Stars.svg"
                  alt="Empowers Teacher Excellence"
                  className="w-28 h-28 relative z-10"
                />
              </div>
              <h3 className="text-slate-900 font-bold mb-4 font-display text-3xl sm:text-4xl text-center lg:text-left">
                Enhances Teacher Performance
              </h3>
            </div>
            <div className="mt-1 flex flex-auto flex-col text-base/7 text-slate-700 text-center lg:text-left ">
              <p className="flex-auto">
                With AI taking care of routine tasks, you're free to focus on
                what you do best - executing engaging, innovative lessons that
                inspire and captivate your students.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feature;
