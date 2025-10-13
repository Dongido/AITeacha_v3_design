// import React from "react";
// import ctaImg from "../../../assets/img/image 6.png";
// import { Link } from "react-router-dom";
// const CTA: React.FC = () => {
//   return (
//     <div>
//       <section className="py-16 ">
//         <div className="max-w-screen-xl mx-auto px-4 md:px-8 lg:flex lg:items-center">
//           <div className="lg:w-1/2 space-y-3 md:mx-auto">
//             <h3 className="text-primary font-semibold">AI For Tutors</h3>
//             <p className="text-gray-900 text-3xl md:text-4xl lg:text-5xl font-semibold sm:text-4xl">
//               AI Tool for Tutors
//             </p>
//             <p className="text-gray-800 text-xl">
//               Create a classroom, upload a Curriculum or Teaching content, add
//               your Students and let AiTeacha do the rest.
//             </p>
//             <div className="mt-4">
//               <Link
//                 to={"/auth/onboarding"}
//                 className="inline-flex py-2 px-4 text-white text-sm font-medium bg-primary duration-150 hover:bg-gray-700 active:bg-gray-900 rounded-full hover:shadow-none"
//               >
//                 Get started
//                 <svg
//                   className="ml-2 -mr-1 w-5 h-5"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
//                     clipRule="evenodd"
//                   ></path>
//                 </svg>
//               </Link>
//             </div>
//           </div>

//           <div className="lg:w-1/2 lg:pl-8 mt-8 lg:mt-0">
//             <img
//               src={ctaImg}
//               alt="CTA Image"
//               className="w-full h-auto rounded-md"
//             />
//           </div>
//         </div>
//       </section>
//       <section className="relative flex max-w-screen-xl mx-auto px-4 md:px-8 lg:flex lg:items-center z-10 overflow-hidden rounded-3xl bg-gradient-to-r from-[#07052D] to-[#171093] py-16 my-16 px-8">
//         <div className="container ">
//           <div className="-mx-4 flex flex-wrap items-center">
//             <div className="w-full px-4 lg:w-1/2">
//               <div className="text-center lg:text-left">
//                 <div className="mb-10 lg:mb-0">
//                   <h1 className="mt-0 mb-3 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-[40px]">
//                     AiTeacha is 100% Free for all Students Worldwide, Forever
//                   </h1>
//                   <p className="w-full text-base font-medium leading-relaxed text-white sm:text-lg">
//                     Inspire your students with AI-powered classrooms, streamline
//                     assignments using AI Assistants, and receive instant
//                     performance reports highlighting strengths and weaknesses
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div className="w-full px-4 lg:w-1/2">
//               <div className="text-center lg:text-right">
//                 <Link
//                   className="font-semibold rounded-full mx-auto inline-flex items-center justify-center bg-white py-4 px-9 hover:bg-opacity-90"
//                   to={"/auth/onboarding"}
//                 >
//                   Join AiTeacha
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Background SVG Elements */}
//         <span className="absolute top-4 left-4 -z-10">
//           <svg
//             width="16"
//             height="16"
//             viewBox="0 0 16 16"
//             fill="#FF16D4"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <polygon points="8,0 16,16 0,16" />
//           </svg>
//         </span>

//         <span className="absolute top-10 left-1/2 transform -translate-x-1/2 -z-10">
//           <svg
//             width="20"
//             height="20"
//             viewBox="0 0 20 20"
//             fill="#7B61FF"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <rect width="20" height="20" />
//           </svg>
//         </span>

//         <span className="absolute bottom-6 right-24 -z-10">
//           <svg
//             width="18"
//             height="18"
//             viewBox="0 0 18 18"
//             fill="#00FF00"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <polygon points="9,0 18,16 0,16" />
//           </svg>
//         </span>
//       </section>
//     </div>
//   );
// };

// export default CTA;

import "react";

const FooterCard = () => {
  return (
    <div className="bg-gradient-to-r from-[#6200EE] to-[#F133E1] px-6 py-8 sm:px-8 sm:py-10 md:px-12 md:py-12 lg:px-[80px] lg:py-[80px] flex flex-col md:flex-row md:justify-between md:items-center gap-6 rounded-[40px] mx-4 sm:mx-8 md:mx-12 lg:mx-20 lg:mb-20 lg:mt-20">
      <div className="flex-1 text-center md:text-left">
        <h1 className="font-[700] text-2xl sm:text-3xl md:text-4xl text-white max-w-full md:max-w-3xl leading-tight">
          AiTeacha is 100% Free for all Students Worldwide, Forever
        </h1>
        <p className="text-sm sm:text-base lg:text-lg mt-3 md:mt-4 text-white max-w-full md:max-w-4xl">
          Inspire your students with AI-powered classrooms, streamline
          assignments using AI Assistants, and receive instant performance
          reports highlighting strengths and weaknesses
        </p>
      </div>

      <div className="flex-shrink-0 flex justify-center md:justify-end md:ml-8 mt-4 md:mt-0">
        <a
          href="/auth/onboarding"
          aria-label="Get started for free"
          className="inline-block bg-white text-black px-6 py-3 sm:px-8 sm:py-4 rounded-full text-lg sm:text-xl shadow-sm"
        >
          Get Started For Free
        </a>
      </div>
    </div>
  );
};

export default FooterCard;
