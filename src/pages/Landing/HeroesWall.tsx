import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.charset = "utf-8";
    document.body.appendChild(script);
  }, []);

  const renderEmbed = (wall: HeroesWall) => {
    const { source, post_url } = wall;

    return (
      <div className="embed-container max-h-[500px]  overflow-hidden rounded-md relative">
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
            <p className="text-center text-lg px-4 md:text-lg lg:text-xl font-bold text-gray-200">
              Celebrate educators transforming classrooms with AI Teacha,
              showcasing their achievements, stories, and innovative teaching
              methods.
            </p>
          </figcaption>
        </section>
      </section>
      <section className="container mx-auto p-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {heroes.map((wall) => (
              <li key={wall.id} className="transition-shadow">
                {/* Wrapping the entire card with an <a> tag */}
                <a
                  href={wall.post_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white rounded-md max-w-[500px] shadow-md p-4 hover:shadow-lg"
                >
                  {renderEmbed(wall)}
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
