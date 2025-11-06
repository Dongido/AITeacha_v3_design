// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { FaBook, FaRss, FaFileAlt, FaClipboard } from "react-icons/fa";
// import axios, { AxiosResponse } from "axios";
// import { Link } from "react-router-dom";
// interface Tool {
//   id: number;
//   name: string;
//   description: string;
//   thumbnail: string;
// }

// interface ToolsApiResponse {
//   status: string;
//   message: string;
//   data: Tool[];
// }

// const StudentToolboxPage: React.FC = () => {
//   const [toolboxItems, setToolboxItems] = useState<Tool[]>([]);
//   const [displayItems, setDisplayItems] = useState<Tool[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [loading, setLoading] = useState(true);
//   useEffect(() => {
//     const fetchTools = async () => {
//       try {
//         const response: AxiosResponse<ToolsApiResponse> = await axios.get(
//           "https://vd.aiteacha.com/api/tools/home/display/student"
//         );

//         if (response.data.status === "success") {
//           const toolsWithoutLastItem = response.data.data.slice(0, -1);
//           setToolboxItems(toolsWithoutLastItem);
//         }
//       } catch (error) {
//         console.error("Error fetching tools:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTools();
//   }, []);

//   useEffect(() => {
//     const screenWidth = window.innerWidth;
//     const itemsToShow = screenWidth < 640 ? 8 : 12;

//     const updateDisplayItems = () => {
//       const start = currentIndex * itemsToShow;
//       const end = start + itemsToShow;
//       setDisplayItems(toolboxItems.slice(start, end));
//     };

//     updateDisplayItems();

//     const interval = setInterval(() => {
//       setCurrentIndex(
//         (prevIndex) => (prevIndex + 1) % Math.ceil(toolboxItems.length / 12)
//       );
//       updateDisplayItems();
//     }, 1500);

//     return () => clearInterval(interval);
//   }, [currentIndex, toolboxItems]);

//   return (
//     <section className="mx-auto mt-12 py-12 text-white">
//       <section className="">
//         <section className="relative bg-blight w-full h-[60vh] pt-[5rem] flex justify-center bg-gradient-to-r from-[#07052D] to-[#171093] items-center overflow-hidden overlow-hidden">
//           <span className="absolute inse=t-0 z-0 p-5  justif-center top-[rem]"></span>
//           <section>
//             <figcaption className="desc z-10 relative px-2">
//               <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-center my-2 text-header text-white">
//                 {" "}
//                 Amazing 27 Student AI Tools
//               </h1>
//               <p className="text-center text-gray-200 text-xl ">
//                 {" "}
//                 Handle all administrative or learning tasks with our AI Student
//                 toolbox
//               </p>
//             </figcaption>
//           </section>
//         </section>
//       </section>

//       {loading ? (
//         <div className="text-center text-xl text-gray-700">
//           Loading tools...
//         </div>
//       ) : (
//         <div className="grid  px-4 md:px-12 mt-8  grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 text-center mx-auto">
//           {displayItems.map((item) => (
//             <motion.div
//               key={item.id}
//               className="flex items-center border border-gray-300 px-4 py-3 rounded-md hover:bg-gray-50 cursor-pointer transition duration-500 ease-in-out transform hover:scale-105"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 1.5 }}
//             >
//               <div className="text-primary text-2xl mr-4">
//                 <img
//                   src={
//                     item?.thumbnail?.startsWith("http")
//                       ? item?.thumbnail
//                       : `https://${item?.thumbnail}`
//                   }
//                   alt={item.name}
//                   className="w-12 h-12 object-cover rounded-md"
//                 />
//               </div>
//               <div className="text-left">
//                 <h3 className="text-base capitalize font-semibold text-black">
//                   {item.name}
//                 </h3>
//                 <p className="text-gray-800 text-lg">{item.description}</p>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       )}

//       <Link to={"/dashboard/tools"}>
//         <button className="mt-8 px-4 py-2 bg-primary mx-auto text-white rounded-full flex items-center justify-center space-x-2">
//           <span className="text-md">Explore All</span>
//           <svg
//             width="22"
//             height="22"
//             viewBox="0 0 22 22"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               d="M13.75 17.4166L12.4437 16.1333L16.6604 11.9166H1.83333V10.0833H16.6604L12.4667 5.86659L13.75 4.58325L20.1667 10.9999L13.75 17.4166Z"
//               fill="#E8EAED"
//             />
//           </svg>
//         </button>
//       </Link>
//     </section>
//   );
// };

// export default StudentToolboxPage;




import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios, { AxiosResponse } from "axios";
import tools from "../../../assets/img/tools.png";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../../../lib/utils";

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

const StudentToolboxPage: React.FC = () => {
  const [toolboxItems, setToolboxItems] = useState<Tool[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response: AxiosResponse<ToolsApiResponse> = await axios.get(
          `${BACKEND_URL}tools/home/display/student`
        );

        if (response.data.status === "success") {
          const toolsWithoutLastItem = response.data.data.slice(0, -1);
          setToolboxItems(toolsWithoutLastItem);
        }
      } catch (error) {
        console.error("Error fetching student tools:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  return (
    <section className="mx-auto mt-12 py-12 p-4 text-white">
      {/* Header */}
      <section className="relative rounded-2xl bg-blight w-full h-[60vh] flex justify-center bg-gradient-to-r from-[#07052D] to-[#171093] items-center overflow-hidden">
        <img
                    src={tools}
                    alt=""
                    className="w-full h-full absolute object-cover max-w-full"
                  />
                  <div className="absolute w-full h-full bg-[#2E096399] z-20" />
        <figcaption className="z-20 relative px-2">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-center my-2 text-white">
            Amazing 27 Student AI Tools
          </h1>
          <p className="text-center text-gray-200 text-xl">
            Handle all administrative or learning tasks with our AI Student Toolbox
          </p>
        </figcaption>
      </section>

      {/* Content */}
      {loading ? (
        <div className="text-center text-xl text-gray-700">Loading tools...</div>
      ) : (
        <section className="max-w-7xl mx-auto mt-[100px]">

          <div className="flex items-center justify-between gap-4 flex-wrap px-4 md:px-12">
                      <h3 className="text-black m-0">A.I Tools</h3>
                      <Link to={"/dashboard/tools"}>
                        <button className="px-4 py-2 bg-primary mx-auto text-white rounded-full flex items-center justify-center space-x-2">
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
                      </Link>
                    </div>



          <div className="grid px-4 md:px-12 mt-8 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mx-auto">
            {toolboxItems.slice(0, visibleCount).map((item) => (
              <motion.div
                key={item.id}
                className="flex  flex-col rounded-md hover:bg-gray-50 cursor-pointer transition duration-500 ease-in-out transform hover:scale-105"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-primary text-2xl mr-4">
                  <img
                    src={
                      item.thumbnail.startsWith("http")
                        ? item.thumbnail
                        : `https://${item.thumbnail}`
                    }
                    alt={item.name}
                  className="w-full h-[180px] object-cover rounded-md mb-2"
                  />
                </div>
                <div className="text-left">
                  <h3 className="text-base capitalize font-semibold text-black">
                    {item.name}
                  </h3>
                  <p className="text-gray-800 text-sm">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load More Button */}
          {visibleCount < toolboxItems.length && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMore}
                className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/80 transition"
              >
                Load More
              </button>
            </div>
          )}
        </section>
      )}

      
    </section>
  );
};

export default StudentToolboxPage;
