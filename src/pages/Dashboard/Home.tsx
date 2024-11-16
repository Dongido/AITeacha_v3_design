import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { loadTools } from "../../store/slices/toolsSlice";
import { Skeleton } from "../../components/ui/Skeleton";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import dashImg from "../../assets/img/0e846ab4-992d-48b3-a818-d62a7803bd8e 1.png";
import { FaDraftingCompass, FaMagic, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiImageAdd } from "react-icons/bi";

import { motion } from "framer-motion";

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { tools, loading, error } = useSelector(
    (state: RootState) => state.tools
  );

  useEffect(() => {
    if (tools.length === 0) {
      dispatch(loadTools());
    }
  }, [dispatch, tools.length]);

  return (
    <div className="mt-12 ">
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-64 w-full mx-auto rounded-lg" />

          <div className="grid grid-cols-4 gap-4 mt-8">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div>
          <div className="relative mt-4">
            <div className="bg-[#5C3CBB] text-white p-8 rounded-lg overflow-hidden">
              <p className="text-sm font-semibold">Your Journey</p>
              <h2 className="text-2xl font-bold mt-2">
                Hello, Inspiring Educator! 👋
              </h2>
              <p className="text-lg mt-1">
                Empower your students and create meaningful learning experiences
                today.
              </p>
              <Link to={"/dashboard/classrooms/create"}>
                <button className="mt-4 flex hover:bg-gray-200 items-center bg-white text-[#5C3CBB] font-semibold py-2 px-4 rounded-full text-sm">
                  launch classroom
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
                </button>
              </Link>
            </div>

            <img
              src={dashImg}
              alt="Robot reading a book"
              className="absolute lg:block hidden"
              style={{
                height: "300px",
                right: "10%",
                top: "28%",
                transform: "translateY(-50%)",
              }}
            />
          </div>

          <div className="mt-8 flex justify-center">
            <div className="flex gap-4 overflow-x-auto">
              <button className="flex items-center gap-2 bg-purple-200 text-purple-800 rounded-full py-2 px-4 whitespace-nowrap">
                <FaMagic className="h-5 w-5" />
                history
              </button>
              <button className="flex items-center gap-2 bg-blue-200 text-blue-800 rounded-full py-2 px-4 whitespace-nowrap">
                <FaDraftingCompass className="h-5 w-5" />
                Chatbot
              </button>
              <button className="flex items-center gap-2 bg-yellow-200 text-yellow-800 rounded-full py-2 px-4 whitespace-nowrap">
                <BiImageAdd className="h-5 w-5" />
                text to speech
              </button>
            </div>
          </div>

          <div className="mt-8 overflow-x-auto py-4">
            <div className="flex justify-between items-center mb-4 px-2">
              <h2 className="text-xl font-bold text-gray-900">Tools</h2>
              <Link
                to="/dashboard/tools"
                className="text-sm text-blue-600 hover:underline"
              >
                <button className="text-sm flex rounded-full px-6 py-2 bg-black hover:bg-gray-400 hover:text-black text-white">
                  See All
                  <ArrowRightIcon className="h-5 w-4 ml-2" />
                </button>
              </Link>
            </div>
            <motion.div
              className="flex gap-4"
              whileTap={{ cursor: "grabbing" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 text-center mx-auto">
                {tools.slice(0, 15).map((tool) => (
                  <Link
                    to={`/dashboard/tools/${tool.slug}`}
                    key={tool.id}
                    className="flex items-center border border-gray-300 px-4 py-3 rounded-3xl bg-white hover:bg-gray-50 cursor-pointer transition duration-500 ease-in-out transform hover:scale-105"
                  >
                    <div className="text-primary text-2xl mr-4">
                      <FaHeart className="text-purple-500" />
                    </div>

                    <div className="text-left">
                      <h3 className="text-base capitalize font-semibold text-gray-900">
                        {tool.name}
                      </h3>
                      <p className="text-gray-700 text-sm">
                        {tool.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
