"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

const RATING_DESCRIPTIONS: Record<number, string> = {
  1: "1 Star • Poor",
  2: "2 Stars • Needs Improvement",
  3: "3 Stars • Average",
  4: "4 Stars • Very Good",
  5: "5 Stars • Excellent",
};

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
}) => {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const activeRating = hoveredRating !== null ? hoveredRating : rating;

  return (
    <div className="flex flex-col items-center w-full">
      <div
        className="flex items-center justify-center gap-2 sm:gap-3 py-1 px-1"
        role="radiogroup"
        aria-label="Star rating from 1 to 5"
      >
        {[1, 2, 3, 4, 5].map((starValue) => {
          const isFilled = starValue <= activeRating;
          const isSelected = starValue === rating;

          return (
            <button
              key={starValue}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`${starValue} star${starValue > 1 ? "s" : ""}`}
              onClick={() => onRatingChange(starValue)}
              onMouseEnter={() => setHoveredRating(starValue)}
              onMouseLeave={() => setHoveredRating(null)}
              className={`p-2 rounded-xl transition-all duration-150 select-none touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-[#af4930] ${
                isSelected ? "scale-105 animate-star-pop" : "hover:scale-105 active:scale-95"
              }`}
            >
              <Star
                className={`w-9 h-9 sm:w-10 sm:h-10 transition-colors duration-150 ${
                  isFilled
                    ? "fill-[#af4930] text-[#af4930] drop-shadow-[0_1px_4px_rgba(175,73,48,0.25)]"
                    : "fill-transparent text-stone-300 stroke-[1.5] hover:text-stone-400"
                }`}
              />
            </button>
          );
        })}
      </div>

      <div className="h-6 flex items-center justify-center text-center mt-1">
        {activeRating > 0 ? (
          <p className="text-xs sm:text-sm font-semibold text-[#af4930]">
            {RATING_DESCRIPTIONS[activeRating]}
          </p>
        ) : (
          <p className="text-xs text-stone-400">
            Tap a star to rate your experience
          </p>
        )}
      </div>
    </div>
  );
};
