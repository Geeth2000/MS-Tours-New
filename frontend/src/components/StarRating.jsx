import { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";

/**
 * StarRating Component
 * @param {number} rating - Current rating value (1-5)
 * @param {function} onRatingChange - Callback when rating changes (if interactive)
 * @param {boolean} readonly - If true, stars are not interactive
 * @param {string} size - Size variant: "sm", "md", "lg"
 * @param {boolean} showValue - Show numeric value next to stars
 */
const StarRating = ({
  rating = 0,
  onRatingChange,
  readonly = false,
  size = "md",
  showValue = false,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const handleClick = (value) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (!readonly) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((value) => {
          const isFilled = value <= displayRating;
          return (
            <button
              key={value}
              type="button"
              onClick={() => handleClick(value)}
              onMouseEnter={() => handleMouseEnter(value)}
              onMouseLeave={handleMouseLeave}
              disabled={readonly}
              className={`${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"} transition-transform focus:outline-none`}
              aria-label={`Rate ${value} stars`}
            >
              {isFilled ? (
                <StarIcon className={`${sizeClasses[size]} text-amber-400`} />
              ) : (
                <StarOutlineIcon
                  className={`${sizeClasses[size]} text-amber-400`}
                />
              )}
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="ml-1 text-sm font-semibold text-slate-600">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
