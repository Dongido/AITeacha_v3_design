import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaBook, FaRss, FaFileAlt, FaClipboard } from "react-icons/fa";
import axios, { AxiosResponse } from "axios";

interface Tool {
  id: number;
  name: string;
  description: string;
  thumbnail: string;
}

interface ToolsApiResponse {
  status: string;
  message: string;
  data: Tool[];
}

const HeroToolBox: React.FC = () => {
  const [toolboxItems, setToolboxItems] = useState<Tool[]>([]);
  const [displayItems, setDisplayItems] = useState<Tool[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response: AxiosResponse<ToolsApiResponse> = await axios.get(
          "https://vd.aiteacha.com/api/tools/home/display"
        );

        if (response.data.status === "success") {
          const toolsWithoutLastItem = response.data.data.slice(0, -1);
          setToolboxItems(toolsWithoutLastItem);
        }
      } catch (error) {
        console.error("Error fetching tools:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  useEffect(() => {
    const screenWidth = window.innerWidth;
    const itemsToShow = screenWidth < 640 ? 8 : 12;

    const updateDisplayItems = () => {
      const start = currentIndex * itemsToShow;
      const end = start + itemsToShow;
      setDisplayItems(toolboxItems.slice(start, end));
    };

    updateDisplayItems();

    const interval = setInterval(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex + 1) % Math.ceil(toolboxItems.length / 12)
      );
      updateDisplayItems();
    }, 1500);

    return () => clearInterval(interval);
  }, [currentIndex, toolboxItems]);

  return (
    <section className="mx-auto   py-12 text-white">
      <section className="">
        <section className="relative w-full h-[60vh] flex justify-center items-center overflow-hidden overlow-hidden">
          <span className="absolute inse=t-0 z-0 p-5  justif-center top-[rem]"></span>
          <section>
            <figcaption className="desc z-10 relative px-2">
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-center my-6 text-header text-black">
                {" "}
                Over 46 Powerful tools
              </h1>
              <p className="text-center text-primary">
                {" "}
                Handle all administrative or learning tasks with our AI toolbox
              </p>
            </figcaption>
          </section>
        </section>
      </section>

      {loading ? (
        <div className="text-center text-xl text-gray-700">
          Loading tools...
        </div>
      ) : (
        <div className="grid px-4 md:px-12 mt-8 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 text-center mx-auto">
          {displayItems.map((item) => (
            <motion.div
              key={item.id}
              className="flex items-center border border-gray-300 px-4 py-3 rounded-md hover:bg-gray-50 cursor-pointer transition duration-500 ease-in-out transform hover:scale-105"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
            >
              <div className="text-primary text-2xl mr-4">
                <img
                  src={
                    item?.thumbnail?.startsWith("http")
                      ? item?.thumbnail
                      : `https://${item?.thumbnail}`
                  }
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-md"
                />
              </div>
              <div className="text-left">
                <h3 className="text-base capitalize text-xl font-semibold text-black">
                  {item.name}
                </h3>
                <p className="text-gray-800 text-lg">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <button className="mt-8 px-4 py-2 bg-primary mx-auto text-white rounded-full flex items-center justify-center space-x-2">
        <span className="text-md">Explore All</span>
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.75 17.4166L12.4437 16.1333L16.6604 11.9166H1.83333V10.0833H16.6604L12.4667 5.86659L13.75 4.58325L20.1667 10.9999L13.75 17.4166Z"
            fill="#E8EAED"
          />
        </svg>
      </button>
    </section>
  );
};

export default HeroToolBox;
