"use client";

import { useEffect, useRef, useState } from "react";
import ColorThief from "colorthief";

/**
 * MovieModal
 * - Displays detailed information about a selected movie
 * - Also extracts dominant color palette from the movie image 
 * 
 * Props:
 * - movie: TMDB movie object to display
 * - onClose: function to close the modal
 */

export default function MovieModal({ movie, onClose }) {

  // stores extracted color palette from movie image
  const [ colors, setColors ] = useState([]);

  // use dominant color for subtle background tint
  const primaryColor = colors?.[1] || colors?.[2] || colors?.[0];
  const accentColor = colors?.[2] || colors?.[3] || colors?.[1];

  /**
   * extract dominant colors whenever a new movie is selected
   * uses the backdrop image when available for better color accuracy
   */
  useEffect(() => {
    if (!movie) return;
    
    const img = new Image();
    
    // backdrop image for palette extraction 
    const imagePath = movie.backdrop_path || movie.poster_path;
    
    // required to allow pixel access for the color extraction
    img.crossOrigin = "anonymous";
    img.src = `https://image.tmdb.org/t/p/w500${imagePath}`;
    
    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const palette = colorThief.getPalette(img, 5);
        setColors(palette);
      } catch(err) {
        console.error("Color extraction failed:", err);
      }
    };
  }, [movie]);

  function rgbToHex([r, g, b]) {
    return (
      "#" +
      [r, g, b]
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase()
    );
  }

  // do not render modal if no movie is selected
  if (!movie) return null;

  return (
    <div
      className="fixed inset-0 bg-black/65 flex items-center justify-center z-50"
      onClick={onClose}
    >
      {/* Modal container */}
      <div
        className="relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* pallete based glow */}
        {primaryColor && (
          <div
            aria-hidden
            className="absolute -inset-40 rounded-full blur-[160px] opacity-90 pointer-events-none"
            style={{
              background: `
                radial-gradient(
                  circle at center,
                  rgba(${primaryColor.join(",")}, 1.0),
                  rgba(${accentColor?.join(",") || primaryColor.join(",")}, 1.0) 60%,
                  transparent 25%
                )
              `,
            }}
          />
        )}

        <div className="relative bg-white rounded-2xl shadow-xl max-w-3xl w-full mx-6 p-6 z-10">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          X
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Movie Poster */}
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full md:w-64 rounded-xl"
          />

          {/* Details */}
          <div>
            <h2 className="text-2xl font-semibold mb-2">
              {movie.title}
            </h2>

            <p className="text-gray-500 text-sm mb-3">
              {movie.release_date?.slice(0, 4)}{" "}
              {movie.vote_average && (
                <>• ⭐{movie.vote_average.toFixed(1)}</>
              )}
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              {movie.overview}
            </p>

            {/* Color Palette */}
            {colors.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Mood Palette
                </h3>

                <div className="flex gap-3">
                  {colors.map((color, i) => {
                    const hex = rgbToHex(color);

                    return (
                      <div 
                        key={i} 
                        className="relative group"
                      >
                        <div 
                          className="w-10 h-10 rounded-full shadow"
                          style={{ backgroundColor: `rgb(${color.join(",")})` }}
                        />

                        {/* tooltip */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-rose-500 text-white text-xs opacity-0 group-hover:opacity-100
                                        transition pointer-events-none"
                        >
                          {hex}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  </div>
)};