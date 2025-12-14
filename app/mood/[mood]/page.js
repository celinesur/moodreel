"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import MovieModal from "@/components/MovieModal";
import MovieCard from "@/components/MovieCard";

/**
 * MoodPage
 * - Displays a grid of movies based on the selected mood
 * - Supports pagincation, sorting, content filtering, and a detailed modal view for each movie
 */

export default function MoodPage() {
  const { mood } = useParams();

  const [ selectedMovie, setSelectedMovie ] = useState(null);

  // states for movie data and ui behaviour 
  const [ movies, setMovies ] = useState([]);                 // stores fetched movies
  const [ page, setPage ] = useState(1);                      // current TMDB page
  const [ loading, setLoading ] = useState(true);             // loading indicator
  const [ hasMore, setHasMore ] = useState(true);             // whether theres more pages
  const [ sortBy, setSortBy ] = useState("popularity.desc");  // default sorting option

  // capitalize the mood name for display 
  const formattedMood = mood.charAt(0).toUpperCase() + mood.slice(1);

  // map moods to TMDB query parameters
  // allows each mood to return a curated genre/company-based result
  const moodQuery = {
    cozy: "&with_genres=16,10749,35",                   // animation, romance, comedy
    romantic: "&with_genres=10749",                     
    wholesome: "&with_genres=16,10751",                 // animation, family
    rainy: "&with_genres=18,9648,",                      // drama, mystery, action
    nostalgic: "&primary_release_date.lte=2005-01-01",  
    a24: "&with_companies=41077",                       // a24 studio
    ghibli: "&with_companies=10342",                    // studio ghibli
    thriller: "&with_genres=53,80",                     // thriller, crime
    comfort: "&with_genres=35,10751",                   // comedy, family
  };

  // resets the movie data when the mood or sort option changes
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [ mood, sortBy ]);

  // fetches the movies from TMDB when mood, page, or sort option changes
  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true);

        const res = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}${moodQuery[mood]}&include_adult=false&sort_by=${sortBy}&page=${page}`
        );

        const data = await res.json();

        // adds new results to existing movies
        if (data?.results?.length) {
          setMovies((prev) => [...prev, ...data.results]);
        } else {
          // no more results are available
          setHasMore(false);
        }
      } catch(error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, [ mood, page, sortBy ]);

  /**
   * filter movies to:
   * - ensure posters exist
   * - remove NSFW and inappropriate content
   * - remove low-quality movies
   */
  
  const filteredMovies = movies
    .filter((movie) => movie.poster_path)
    .filter((movie) => {
      const title = (movie.title || "").toLowerCase();
      const overview = (movie.overview || "").toLowerCase();

      const bannedWords = [
        "erotic",
        "erotik",
        "porno",
        "porn",
        "fetish",
        "sensual",
        "sex",
        "naked",
        "nudity",
        "adults only",
        "desire",
      ];

      return (
        !bannedWords.some((w) => title.includes(w)) &&
        !bannedWords.some((w) => overview.includes(w))
      );
    })

    // returns only recognizable, well-rated movies
    .filter((movie) => movie.vote_count > 200 && movie.vote_average >= 6);

  return (
    <main className="min-h-screen bg-[#faf7f4] px-6 py-12">
      {/* Header */}
      <h1 className="text-4xl font-semibold text-[#2a2a2a] mb-2 tracking-tight">
        {formattedMood} Movies
      </h1>

      {/* Subtitle */}
      <p className="text-[#6b6b6b] text-lg mb-6">
        Curated films that match the{" "}
        <span className="text-rose-400">{mood}</span> vibe
      </p>

      {/* Sort dropdown */}
      <div className="flex justify-end mb-8">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 rounded-xl bg-white shadow-md border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-300"
        >
          <option value="popularity.desc">Most Popular</option>
          <option value="vote_average.desc">Highest Rated</option>
          <option value="release_date.desc">Newest</option>
          <option value="release_date.asc">Oldest</option>
          <option value="vote_count.desc">Most Reviewed</option>
        </select>
      </div>

      {/* Movie grid */}
      {movies.length === 0 && loading ? (
        // initial loading skeletons
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md h-[240px] animate-pulse"
            />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={() => setSelectedMovie(movie)}
              />
            ))}
          </div>

          {/* Load more button */}
          {hasMore && !loading && (
            <div className="flex justify-center mt-10">
              <button
                onClick={() => setPage((prev) => prev + 1)}
                className="px-6 py-3 rounded-full bg-rose-400 text-white font-medium shadow-md hover:bg-rose-500 transition"
              >
                Load more
              </button>
            </div>
          )}

          {/* Loading more indicator */}
          {loading && movies.length > 0 && (
            <p className="text-center text-gray-500 mt-6">
              Loading more movies…
            </p>
          )}
        </>
      )}
      <MovieModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </main>
  );
}