// import React, { useEffect, useState } from "react";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import { fetchHeroesWall } from "../../api/heroeswall";

// export interface HeroesWall {
//   id: number;
//   post_url: string;
//   source: string;
//   thumbnail: string;
//   status?: string;
//   created_at: string;
//   updated_at: string;
// }

// const HeroesWall = () => {
//   const [heroes, setHeroes] = useState<HeroesWall[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const loadHeroesWall = async () => {
//       try {
//         const data = await fetchHeroesWall();
//         setHeroes(data);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadHeroesWall();
//   }, []);

//   const renderEmbed = (wall: HeroesWall) => {
//     const { source, post_url } = wall;

//     if (source === "Twitter") {
//       return (
//         <blockquote
//           className="twitter-tweet"
//           data-dnt="true"
//           data-theme="light"
//         >
//           <a href={post_url} target="_blank" rel="noopener noreferrer">
//             Twitter Post
//           </a>
//         </blockquote>
//       );
//     } else if (source === "Facebook") {
//       return (
//         <div
//           className="fb-post"
//           data-href={post_url}
//           data-width="auto"
//           data-show-text="true"
//         ></div>
//       );
//     } else if (source === "Instagram") {
//       return (
//         <iframe
//           src={`${post_url}embed`}
//           className="w-full aspect-square rounded-md"
//           allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
//           frameBorder="0"
//         />
//       );
//     } else if (source === "LinkedIn") {
//       return (
//         <iframe
//           src={`${post_url}`}
//           className="w-full aspect-video rounded-md"
//           frameBorder="0"
//           allow="encrypted-media"
//         />
//       );
//     } else {
//       return (
//         <a
//           href={post_url}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="text-blue-500 underline"
//         >
//           Visit Post
//         </a>
//       );
//     }
//   };

//   return (
//     <div>
//       <Navbar />
//       <section className="relative bg-blight w-full mt-24 h-[60vh] pt-[5rem] flex justify-center bg-gradient-to-r from-[#07052D] to-[#171093] items-center overflow-hidden">
//         <span className="absolute inset-0 z-0 p-5 justify-center top-[5rem]"></span>
//         <section>
//           <figcaption className="desc z-10 relative">
//             <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-center my-6 text-white">
//               Heroes Wall
//             </h1>
//           </figcaption>
//         </section>
//       </section>
//       <section className="container mx-auto p-4">
//         {loading ? (
//           <p className="text-center text-gray-500">Loading...</p>
//         ) : error ? (
//           <p className="text-center text-red-500">{error}</p>
//         ) : (
//           <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
//             {heroes.map((wall) => (
//               <li
//                 key={wall.id}
//                 className="bg-white rounded-md shadow-md p-4 hover:shadow-lg transition-shadow"
//               >
//                 {renderEmbed(wall)}
//                 <p className="mt-2 text-sm text-gray-500">
//                   Source: {wall.source}
//                 </p>
//               </li>
//             ))}
//           </ul>
//         )}
//       </section>
//       <Footer />
//     </div>
//   );
// };

// export default HeroesWall;
import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { fetchHeroesWall } from "../../api/heroeswall";

export interface HeroesWall {
  id: number;
  post_url: string;
  source: string;
  thumbnail: string;
  status?: string;
  created_at: string;
  updated_at: string;
}

const HeroesWall = () => {
  const [heroes, setHeroes] = useState<HeroesWall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHeroesWall = async () => {
      try {
        const data = await fetchHeroesWall();
        setHeroes(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadHeroesWall();
  }, []);

  return (
    <div>
      <Navbar />
      <section className="relative bg-blight w-full mt-24 h-[60vh] pt-[5rem] flex justify-center bg-gradient-to-r from-[#07052D] to-[#171093] items-center overflow-hidden">
        <span className="absolute inset-0 z-0 p-5 justify-center top-[5rem]"></span>
        <section>
          <figcaption className="desc z-10 relative">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-center my-6 text-white">
              Heroes Wall
            </h1>
          </figcaption>
        </section>
      </section>
      <section className="container mx-auto p-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {heroes.map((wall) => {
              const thumbnailUrl = wall.thumbnail
                ? wall.thumbnail.startsWith("/home/icedtonline/")
                  ? `https://${wall.thumbnail.replace(
                      "/home/icedtonline/",
                      ""
                    )}`
                  : wall.thumbnail
                : "";

              return (
                <li
                  key={wall.id}
                  className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col justify-between items-start"
                >
                  {/* Thumbnail Preview */}
                  {wall.thumbnail ? (
                    <img
                      src={thumbnailUrl}
                      alt={`Thumbnail for ${wall.source}`}
                      className="w-full h-40 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-md">
                      <p className="text-gray-500 text-sm">No Image</p>
                    </div>
                  )}
                  {/* Post Source and Link */}
                  <div className="mt-4 flex flex-col items-start">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Source: {wall.source}
                    </h3>
                    <a
                      href={wall.post_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 bg-primary text-white text-center py-2 px-4 rounded-full hover:bg-blue-600 transition"
                    >
                      Visit Post
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default HeroesWall;
