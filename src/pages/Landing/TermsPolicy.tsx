import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { BsArrowRightShort } from "react-icons/bs";
import { Input } from "../../components/ui/Input";
import { Link } from "react-router-dom";

const TermsPolicy = () => {
  const policies = [
    { name: "AI Teacha Terms of Service", href: "/terms-of-service" },
    { name: "AI Teacha Privacy Policy", href: "/privacy-policy" },
    { name: "AI Policy", href: "/ai-policy" },
    { name: "AI Teacha Data Privacy Addendum (DPA)", href: "/data-privacy" },
    { name: "AI Teacha Student Data Policy", href: "/student-policy" },
  ];
  return (
    <div>
      <Navbar />

      <section className=" pb-[4rem] min-h-screen bg-gradient-to-b from-white to-blight  mt-24">
        <section className="">
          <section className="relative bg-blight w-full h-[60vh] pt-[5rem] flex justify-center bg-[#c1bad4] items-center overflow-hidden overlow-hidden">
            <span className="absolute inse=t-0 z-0 p-5  justif-center top-[rem]"></span>
            <section>
              <figcaption className="desc z-10 relative">
                <h1 className="text-6xl font-bold text-center my-6 text-header">
                  {" "}
                  AI Teacha Privacy
                </h1>
                <p className="text-center text-primary ">
                  {" "}
                  Important things you need to know as you use AI Teacha
                  platforms
                </p>
              </figcaption>
            </section>
          </section>
        </section>

        <div className="max-w-4xl mx-auto mt-[5rem] p-4  b">
          <div className="mb-4 relative">
            <div className="flex">
              <div className="relative flex-grow">
                <Input
                  type="text"
                  placeholder="What do you need to know"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-l-lg "
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <button
                aria-label="search menu"
                className="bg-primary text-white px-4 py-2 rounded-r-lg  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Search
              </button>
            </div>
          </div>

          <section className="bg-slate-100 rounded-lg">
            <ul className="space-y-[1.5rem] p-5">
              {policies.map((policy, index) => (
                <li key={index} className="bg-white p-3 rounded shadow">
                  <div className="flex justify-between items-center">
                    <Link
                      to={policy.href}
                      className="text-header hover:underline"
                      //   target="_blank"
                      //   rel="noopener noreferrer"
                    >
                      {policy.name}
                    </Link>
                    <span className="text-header">
                      <BsArrowRightShort />
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default TermsPolicy;
