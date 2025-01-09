import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import {
  fetchHeroesWallThunk,
  resetError,
} from "../../store/slices/HeroesWallSlice";
import { RootState } from "../../store";
import { AppDispatch } from "../../store";
import { useLocation } from "react-router-dom";

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

const LazyLoadPost: React.FC<{ postUrl: string; source: string }> = ({
  postUrl,
  source,
}) => {
  const postRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (window.twttr) {
              window.twttr.widgets.load();
            }
            observer.disconnect(); // Stop observing once it's loaded
          }
        });
      },
      {
        threshold: 0.5, // Load when 50% of the card is in view
      }
    );

    if (postRef.current) {
      observer.observe(postRef.current);
    }

    return () => {
      if (postRef.current) {
        observer.unobserve(postRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={postRef}
      className="embed-container max-h-[500px] overflow-hidden rounded-md relative"
    >
      {source === "twitter" ||
      source === "facebook" ||
      source === "instagram" ||
      source === "linkedin" ? (
        <div
          className="embed-content max-h-[500px] overflow-hidden text-ellipsis whitespace-normal break-words"
          dangerouslySetInnerHTML={{ __html: postUrl }}
        ></div>
      ) : (
        <a
          href={postUrl}
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

const HeroesWall = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { heroesWall, loading, error } = useSelector(
    (state: RootState) => state.heroesWall
  );
  const [loaded, setLoaded] = useState(false);

  const loadHeroesWall = useCallback(() => {
    if (heroesWall.length === 0) {
      dispatch(fetchHeroesWallThunk());
    }
  }, [dispatch, heroesWall]);

  // Handle page reload logic using localStorage
  useEffect(() => {
    const isLoaded = localStorage.getItem("isHeroesWallLoaded");

    if (isLoaded !== "true") {
      localStorage.setItem("isHeroesWallLoaded", "true");

      setTimeout(() => {
        window.location.reload();
      }, 5000);
    }
  }, []);

  useEffect(() => {
    const resetOnLeave = () => {
      if (location.pathname !== "/heroes-wall") {
        localStorage.setItem("isHeroesWallLoaded", "false");
      }
    };

    window.addEventListener("beforeunload", resetOnLeave);

    return () => {
      window.removeEventListener("beforeunload", resetOnLeave);
      resetOnLeave();
    };
  }, [location.pathname]);

  // Dynamically load Twitter widgets.js
  useEffect(() => {
    const loadTwitterScript = () => {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.onload = () => {
        if (window.twttr) {
          window.twttr.widgets.load();
        }
      };
      document.body.appendChild(script);
    };

    loadTwitterScript();
  }, []);

  useEffect(() => {
    loadHeroesWall();
  }, [loadHeroesWall]);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        setLoaded(true);
      }, 3000);
    }
  }, [loading]);

  useEffect(() => {
    if (loaded && window.twttr) {
      window.twttr.widgets.load();
    }
  }, [loaded]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        dispatch(resetError());
      }, 5000);
    }
  }, [error, dispatch]);

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

      <section className="container mx-auto p-4">
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          loaded && (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 list-none gap-6">
              {heroesWall.map((wall: HeroesWall) => (
                <li
                  key={wall.id}
                  className="transition-transform transform list-none hover:scale-105"
                >
                  <a
                    href={wall.post_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-gradient-to-br from-[#5c3cbb] via-[#D565A7] to-[#5c3cbb] text-white rounded-xl shadow-lg p-6 hover:shadow-2xl"
                  >
                    <LazyLoadPost
                      postUrl={wall.post_url}
                      source={wall.source}
                    />
                  </a>
                </li>
              ))}
            </ul>
          )
        )}
      </section>

      <Footer />
    </div>
  );
};

export default HeroesWall;
