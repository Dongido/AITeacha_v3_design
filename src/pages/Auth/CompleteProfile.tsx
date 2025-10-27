import React from "react";
import {  CompleteProfileForm } from "./components/complete-profile-form";
import { Link } from "react-router-dom";
import Logo from "../../assets/img/logo.png";

const CompleteProfile = () => {
  return (
    <div className="min-h-screen flex flex-col items-center px-4 justify-center">
      <div className="md:hidden flex items-center justify-center gap-1 text-black text-2xl font-bold mb-0 mt-4">
        <Link
          to="/"
          className="flex items-center gap-1 text-black text-2xl font-bold"
        >
          <img className="h-8 w-auto" src={Logo} alt="AI-Teacha Logo" />
          <span className="text-sm">AiTeacha</span>
        </Link>
      </div>

      <div>
        <h1 className="text-center text-2xl font-semibold text-gray-800 mb-0">
          Complete Your Profile
        </h1>
        <p className="text-center text-gray-600 mb-8">
          A little details about you
        </p>
      </div>
      <CompleteProfileForm />
    </div>
  );
};

export default CompleteProfile;
