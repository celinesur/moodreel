"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import MovieCard from "@/components/MovieCard";
import MovieModal from "@/components/MovieModal";

/**
 * Home
 * - Landing page
 * - Users can:
 *  - Search moods using keywords
 *  - Select moods with the button
 *  - Browse current popular movies
 */

export default function Home() {
  const router= useRouter();
  const [ featuredMovies, setFeaturedMovies ] = useState([]);
  const [ selectedMovie, setSelectedMovie ] = useState(null);

  /**
   * moodKeywords:
   * - Maps related words to one of the 9 moods
   * - When the user types something similar, it routes them to the correct mood page
   */
  
  const moodKeywords = {
    cozy: ["cozy", "warm", "soft", "comforting"],
    romantic: ["romantic", "love", "date", "crush"],
    wholesome: ["wholesome", "cute", "uplifting", "sweet"],
    rainy: ["rainy", "sad", "moody", "melancholy"],
    nostalgic: ["nostalgic", "memory", "childhood", "retro"],
    a24: ["a24"],
    ghibli: ["ghibli", "studio ghibli"],
    thriller: ["thriller", "scary", "crime", "mystery"],
    comfort: ["comfort", "feel-good", "safe"],
  };

  /**
   * useEffect:
   * - Adds manual event listener for the search button
   */
  useEffect(() => {
    const input = document.getElementById("moodSearch");
    const button = document.getElementById("searchButton");

    // Will exit early if elements are not found yet
    if (!input || !button) return;

    const handleSearch = () => {
      const value = input.value.toLowerCase().trim();

      if (!value) return;

      // Loops through the moods and see if the user input matches any keywords
      for (const mood in moodKeywords) {
        if (moodKeywords[mood].some((word) => value.includes(word))) {
          router.push(`/mood/${mood}`);
          return;
        }
      }

      // Default mood if there is no match
      router.push(`/mood/comfort`);
    };

    // Search handler
    button.addEventListener("click", handleSearch);

    // Cleanup 
    return () => button.removeEventListener("click", handleSearch);
  }, []);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&include_adult=false`
        );
        const data = await res.json();
        setFeaturedMovies(data.results.slice(0, 8));
      } catch (err) {
        console.error("Failed to fetch featured movies", err);
      }
    }

    fetchFeatured();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from -[#fff1f4] via-[#fde7ec] relative overflow-hidden flex flex-col items-center px-6 py-16">
      <div
        aria-hidden
        className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-gradient-to-b from-pink-300/40 via-rose-200/30 to-transparent
                    blur-[90px] pointer-events-none"
      />

      {/* Title */}
      <h1 className="relative text-5xl font-semibold text-[#2a2a2a] mb-4 tracking-tight">
        Mood<span className="text-rose-400">Reel</span>
      </h1>

      {/* Subtitle */}
      <p className="relative z-10 text-[#494848] text-lg max-w-md text-center mb-12">
        Choose a vibe and discover movies that match your mood ₊✩‧₊˚౨ৎ˚₊✩‧₊
      </p>

      {/* Search bar */}
      <div className="w-full max-w-xl mb-10">
        <form 
          action="/mood"
          onSubmit={(e) => e.preventDefault()}
          className="relative"
        >
          {/* Text input */}
          <input 
            type="text"
            placeholder="What are you feeling today?"
            id="moodSearch"
            className="w-full px-5 py-4 rounded-2xl bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-rose-300 transition-all duration-300
                        placeholder:text-gray-400 text-gray-700"
          />
          {/* Search button icon */}
          <button
            type="button"
            id="searchButton"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-400 text-xl hover:text-rose-500 transition"
          >
            🔍
            </button>  
        </form>
        <p className="text-sm text-gray-400 mt-3">
            Try typing <span className="text-gray-500">“sad”</span>,{" "}
            <span className="text-gray-500">“comfort”</span>, or{" "}
            <span className="text-gray-500">“rom-com”</span>
          </p>  
      </div>

      {/* Mood Buttons Grid */}
      <div className="grid grid-cols-3 gap-6 w-full max-w-xl place-items-center">

        {/* Cozy */}
        <Link href="/mood/cozy">
          <button className="w-[160px] h-[70px] flex items-center justify-center text-center p-5 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 
            shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-200">
            <span className="text-[#5a3d1e] font-medium">🕯 Cozy</span>
          </button>
        </Link>

        {/* Romantic */}
        <Link href="/mood/romantic">
          <button className="w-[160px] h-[70px] flex items-center justify-center text-center p-5 rounded-2xl bg-gradient-to-br from-rose-200 to-rose-300 
            shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-200">
            <span className="text-rose-700 font-medium">💖 Romantic</span>
          </button>
        </Link>

        {/* Wholesome */}
        <Link href="/mood/wholesome">
          <button className="w-[160px] h-[70px] flex items-center justify-center text-center p-5 rounded-2xl bg-gradient-to-br from-yellow-100 to-pink-100 
            shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-200">
            <span className="text-[#d97706] font-medium">💌 Wholesome</span>
          </button>
        </Link>

        {/* Rainy Day */}
        <Link href="/mood/rainy">
          <button className="w-[160px] h-[70px] flex items-center justify-center text-center p-5 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 
            shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-200">
            <span className="text-slate-700 font-medium">🌧 Rainy Day</span>
          </button>
        </Link>

        {/* Nostalgic */}
        <Link href="/mood/nostalgic">
          <button className="w-[160px] h-[70px] flex items-center justify-center text-center p-5 rounded-2xl bg-gradient-to-br from-pink-100 to-pink-200 
            shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-200">
            <span className="text-pink-700 font-medium">🎀 Nostalgic</span>
          </button>
        </Link>

        {/* A24 */}
        <Link href="/mood/a24">
          <button className="w-[160px] h-[70px] flex items-center justify-center text-center p-5 rounded-2xl bg-gradient-to-br from-purple-200 to-purple-300 
            shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-200">
            <span className="text-purple-700 font-medium">🍿 A24</span>
          </button>
        </Link>

        {/* Ghibli */}
        <Link href="/mood/ghibli">
          <button className="w-[160px] h-[70px] flex items-center justify-center text-center p-5 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 
            shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-200">
            <span className="text-green-700 font-medium">🌿 Ghibli</span>
          </button>
        </Link>

        {/* Thriller */}
        <Link href="/mood/thriller">
          <button className="w-[160px] h-[70px] flex items-center justify-center text-center p-5 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 
            shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-200">
            <span className="text-gray-700 font-medium">🔪 Thriller</span>
          </button>
        </Link>

        {/* Comfort */}
        <Link href="/mood/comfort">
          <button className="w-[160px] h-[70px] flex items-center justify-center text-center p-5 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 
            shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-200">
            <span className="text-blue-700 font-medium">💌 Comfort</span>
          </button>
        </Link>
      </div>

      {/* Featured section */}
      {featuredMovies.length > 0 && (
        <section className="w-full max-w-6xl mt-20">
          <h2 className="text-xl font-semibold text-[#2a2a2a] mb-4">
            Popular right now
          </h2>

          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {featuredMovies.map((movie) => (
              <div
                key={movie.id}
                className="min-w-[160px]"
                onClick={() => setSelectedMovie(movie)}
              >
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </section>
      )}
      <MovieModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </main>
  );
}
