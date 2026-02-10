const PackageCard = ({ pkg, onSelect }) => (
  <article className="group overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300">
    {/* Image Section */}
    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-sky-100 to-blue-50">
      {pkg.images && pkg.images.length > 0 ? (
        <img
          src={pkg.images[0]}
          alt={pkg.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <svg
            className="h-16 w-16 text-sky-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}
      {/* Badge overlay */}
      <div className="absolute top-3 left-3">
        <span className="rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-sky-600 shadow-sm">
          {pkg.packageType === "dayTrip" ? "Day Trip" : "Multi-Day"}
        </span>
      </div>
      {/* Image count badge */}
      {pkg.images && pkg.images.length > 1 && (
        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/50 backdrop-blur-sm px-2.5 py-1 text-xs text-white">
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {pkg.images.length}
        </div>
      )}
    </div>

    {/* Content Section */}
    <div className="flex flex-col gap-4 p-5">
      <div>
        <h3 className="text-lg font-bold text-slate-800 group-hover:text-sky-600 transition-colors line-clamp-1">
          {pkg.title}
        </h3>
        <p className="mt-1.5 text-sm text-slate-500 line-clamp-2">
          {pkg.description}
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2 text-slate-600">
          <svg
            className="h-4 w-4 text-sky-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>
            {pkg.durationDays} day{pkg.durationDays > 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <svg
            className="h-4 w-4 text-sky-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-medium">
            {pkg.pricePerGroup
              ? `LKR ${pkg.pricePerGroup?.toLocaleString()}`
              : `LKR ${pkg.pricePerPerson?.toLocaleString()}`}
          </span>
        </div>
      </dl>

      {/* Locations preview */}
      {pkg.locations && pkg.locations.length > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <svg
            className="h-3.5 w-3.5 text-sky-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="line-clamp-1">
            {pkg.locations.slice(0, 3).join(" • ")}
            {pkg.locations.length > 3 && ` +${pkg.locations.length - 3}`}
          </span>
        </div>
      )}

      {onSelect && (
        <button
          type="button"
          className="mt-2 w-full rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:from-sky-600 hover:to-blue-700 transition-all duration-300 hover:shadow-lg"
          onClick={() => onSelect(pkg)}
        >
          Book Package
        </button>
      )}
    </div>
  </article>
);

export default PackageCard;
