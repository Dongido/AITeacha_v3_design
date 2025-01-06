import React, { useEffect, useState, useCallback } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { fetchHeroesWall } from "../../api/heroeswall";

// Declare global window.twttr type
declare global {
  interface Window {
    twttr: {
      widgets: {
        load: () => void;
      };
    };
  }
}

export interface HeroesWall {
  id: number;
  post_url: string; // Embed code for the post
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

  const loadHeroesWall = useCallback(async () => {
    try {
      const data = await fetchHeroesWall();
      setHeroes(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // useEffect(() => {
  //   // Reload the page on every visit
  //   window.location.reload();
  // }, []);

  useEffect(() => {
    loadHeroesWall();
  }, [loadHeroesWall]);

  const renderEmbed = (wall: HeroesWall) => {
    const { source, post_url } = wall;

    return (
      <div className="embed-container max-h-[500px] overflow-hidden rounded-md relative">
        {source === "twitter" ||
        source === "facebook" ||
        source === "instagram" ||
        source === "linkedin" ? (
          <div
            className="embed-content max-h-[500px] overflow-hidden text-ellipsis whitespace-normal break-words"
            dangerouslySetInnerHTML={{ __html: post_url }}
          ></div>
        ) : (
          <a
            href={post_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Visit Post
          </a>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-[40px] bg-gradient-to-t from-white to-transparent"></div>
      </div>
    );
  };

  useEffect(() => {
    // Lazy load Twitter widgets script
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.charset = "utf-8";
    document.body.appendChild(script);
    script.onload = () => window.twttr.widgets.load(); // Ensure widgets load after script is loaded
  }, []);

  return (
    <div>
      <Navbar />
      {/* Header Section */}
      <section className="relative w-full mt-24 h-[60vh] pt-[5rem] flex justify-center bg-gradient-to-r from-[#07052D] via-[#4E43D7] to-[#171093] items-center overflow-hidden">
        <span className="absolute inset-0 z-0 p-5 justify-center top-[5rem]"></span>
        <section>
          <figcaption className="desc z-10 relative">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-center my-6 text-white">
              Heroes Wall
            </h1>
            <p className="text-center text-lg px-4 md:text-lg lg:text-xl font-bold text-gray-200">
              Celebrate educators transforming classrooms with AI Teacha,
              showcasing their achievements, stories, and innovative teaching
              methods.
            </p>
          </figcaption>
        </section>
      </section>

      {/* Cards Section */}
      <section className="container mx-auto p-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {heroes.map((wall) => (
              <li
                key={wall.id}
                className="transition-transform transform hover:scale-105"
              >
                {/* Card Design */}
                <a
                  href={wall.post_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-gradient-to-br from-[#9B5FA0] via-[#D565A7] to-[#FF8A95]
 text-white rounded-xl shadow-lg p-6 hover:shadow-2xl"
                >
                  {renderEmbed(wall)}
                  <div className="mt-4">
                    <p className="text-sm text-white font-medium">
                      Source: {wall.source}
                    </p>
                    <p className="text-xs text-gray-200">
                      Created: {new Date(wall.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default HeroesWall;
