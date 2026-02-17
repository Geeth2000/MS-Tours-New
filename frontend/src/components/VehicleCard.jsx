import { useState, memo } from "react";
import { Link } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

// 1. Use 'memo' to prevent unnecessary re-renders in large lists
const VehicleCard = memo(({ vehicle, onSelect }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Safety check: Ensure images is always an array
  const images = vehicle.images || [];
  const imageCount = images.length;
  const hasMultipleImages = imageCount > 1;

  // Handler: Next Image
  const nextImage = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev === imageCount - 1 ? 0 : prev + 1));
  };

  // Handler: Previous Image
  const prevImage = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev === 0 ? imageCount - 1 : prev - 1));
  };

  return (
    <Link
      to={`/vehicles/${vehicle._id}`}
      className="group block overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:border-sky-100 hover:shadow-lg"
    >
      {/* 2. Image Section: Used aspect-ratio for efficient layout */}
      <div className="relative aspect-[4/3] w-full bg-slate-200 group/image">
        {imageCount > 0 ? (
          <>
            <img
              src={images[currentImageIndex]}
              alt={`${vehicle.title} - View ${currentImageIndex + 1}`}
              // 3. Performance: Lazy load images and decode asynchronously
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500"
              onError={(e) => {
                e.target.style.display = "none"; // Efficiently hide broken images
              }}
            />

            {/* Navigation Controls (Rendered only if needed) */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-1.5 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/50 group-hover/image:opacity-100"
                  aria-label="Previous image"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-1.5 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/50 group-hover/image:opacity-100"
                  aria-label="Next image"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>

                <div className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                  {currentImageIndex + 1} / {imageCount}
                </div>
              </>
            )}
          </>
        ) : (
          /* Fallback for no images */
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <span className="text-5xl">🚗</span>
          </div>
        )}

        <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-700 shadow-sm backdrop-blur-sm">
          {vehicle.type}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="mb-3">
          <h3
            className="line-clamp-1 text-lg font-bold text-slate-800"
            title={vehicle.title}
          >
            {vehicle.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-500">
            {vehicle.description || "Reliable vehicle with professional driver"}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400">
              Rate per Day
            </p>
            <p className="text-lg font-bold text-sky-600">
              LKR {vehicle.pricePerDay?.toLocaleString()}
            </p>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-bold uppercase text-slate-400">
              Capacity
            </p>
            <p className="text-sm font-semibold text-slate-700">
              {vehicle.seatingCapacity} Seats
            </p>
          </div>
        </div>

        {onSelect && (
          <button
            type="button"
            className="mt-4 w-full rounded-xl bg-sky-500 py-2.5 text-sm font-bold text-white transition-all hover:bg-sky-600 hover:shadow-md active:scale-[0.98]"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onSelect(vehicle);
            }}
          >
            Book Now
          </button>
        )}
      </div>
    </Link>
  );
});

export default VehicleCard;
