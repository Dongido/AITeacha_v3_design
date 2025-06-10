import React from "react";

const HowItWorks: React.FC = () => {
  return (
    <section
      className="pb-32 pt-8 w-full text-white text-center bg-gradient-to-r from-[#07052D] to-[#171093]"
      //  style={{ background: "linear-gradient(180deg, #5C3CBB, #8071AE)" }}
    >
      <h4 className="text-xl uppercase font-medium mb-2 underline">
        How it works
      </h4>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-10 px-1">
        Get started in 4 easy steps
      </h2>
      <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-16 max-w-4xl mx-auto">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 flex items-center justify-center bg-white text-black rounded-full text-xl font-bold">
            1
          </div>
          <h3 className="text-2xl font-semibold">Sign Up</h3>
          <p className="text-gray-100 text-center text-xl max-w-sm">
            Create your account to get started with AiTeacha.
          </p>
        </div>
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 flex items-center justify-center bg-white text-black rounded-full text-xl font-bold">
            2
          </div>
          <h3 className="text-2xl font-semibold">Select Your Role</h3>
          <p className="text-gray-100 text-xl text-center max-w-sm">
            Choose your role to access relevant tools for your needs.
          </p>
        </div>
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 flex items-center justify-center bg-white text-black rounded-full text-xl font-bold">
            3
          </div>
          <h3 className="text-2xl font-semibold">Set Preferences</h3>
          <p className="text-gray-100 text-xl text-center max-w-sm">
            Adjust settings and preferences to personalize your experience.
          </p>
        </div>
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 flex items-center justify-center bg-white text-black rounded-full text-xl font-bold">
            4
          </div>
          <h3 className="text-2xl font-semibold">Engage Students</h3>
          <p className="text-gray-100 text-xl text-center max-w-sm">
            Create classrooms and engage Students with AiTeacha
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
