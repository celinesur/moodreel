"use client";

/**
 * MovieCard
 * - Displays a movie poster in a fixed aspect-ratio container 
 * 
 * Props:
 * - movie: TMDB movie object
 * - onClick: function to trigger the modal to open
 */

export default function MovieCard({ movie, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="rounded-xl bg-white shadow-md overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-xl transition"
    >
      {/* poster container with a fixed aspect ratio */}
      <div className="relative w-full aspect-[2/3] overflow-hidden rounded-2xl">
        <img 
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-full object-contain bg-[#f3f1ee] group-hover:scale-[1.02] transition-transform duration-300"
      /> 
    </div>
  </div>
  );
}