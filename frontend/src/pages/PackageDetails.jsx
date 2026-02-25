import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { fetchPackageById } from "../services/packageService.js";
import { handleApiError } from "../services/apiClient.js";
import BookingModal from "../components/BookingModal.jsx";
import ReviewSection from "../components/ReviewSection.jsx";
import StarRating from "../components/StarRating.jsx";
import { useAuthStore } from "../hooks/useAuthStore.js";
import toast from "react-hot-toast";

const PackageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const packageData = await fetchPackageById(id);
        setPkg(packageData);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const images = pkg?.images || [];
  const imageCount = images.length;
  const hasMultipleImages = imageCount > 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === imageCount - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? imageCount - 1 : prev - 1));
  };

  const handleBookPackage = () => {
    if (!user) {
      toast.error("Please login to book this package");
      navigate("/login", { state: { from: `/packages/${id}` } });
      return;
    }
    setIsBookingOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-sky-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" />
              <p className="text-sm text-slate-500">
                Loading package details...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-sky-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-600">{error}</p>
            <Link
              to="/packages"
              className="mt-4 inline-block rounded-xl bg-sky-500 px-6 py-2 text-sm font-bold text-white hover:bg-sky-600"
            >
              Back to Packages
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const owner = pkg?.owner;
  const packageTypeLabels = {
    dayTrip: "Day Trip",
    multiDay: "Multi-Day Tour",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-sky-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/packages"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-sky-600 transition"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Back to Packages
        </Link>

        <div className="flex flex-col gap-8">
          {/* Main Content Grid */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Images & Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl bg-slate-200 shadow-xl">
                {imageCount > 0 ? (
                  <>
                    <img
                      src={images[currentImageIndex]}
                      alt={`${pkg.title} - View ${currentImageIndex + 1}`}
                      className="h-full w-full object-cover"
                    />

                    {/* Navigation Controls */}
                    {hasMultipleImages && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-3 text-slate-700 shadow-lg backdrop-blur-sm transition hover:bg-white"
                        >
                          <ChevronLeftIcon className="h-6 w-6" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-3 text-slate-700 shadow-lg backdrop-blur-sm transition hover:bg-white"
                        >
                          <ChevronRightIcon className="h-6 w-6" />
                        </button>

                        {/* Image Counter */}
                        <div className="absolute bottom-4 right-4 rounded-full bg-black/60 px-4 py-2 text-sm font-bold text-white backdrop-blur-md">
                          {currentImageIndex + 1} / {imageCount}
                        </div>

                        {/* Thumbnail Navigation */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          {images.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentImageIndex(idx)}
                              className={`h-2 w-2 rounded-full transition ${
                                idx === currentImageIndex
                                  ? "bg-white w-6"
                                  : "bg-white/50 hover:bg-white/80"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-8xl text-slate-300">🎒</span>
                  </div>
                )}

                {/* Type Badge */}
                <div className="absolute top-4 left-4 rounded-full bg-white/90 px-4 py-2 text-sm font-bold uppercase tracking-wide text-slate-700 shadow-lg backdrop-blur-sm">
                  {packageTypeLabels[pkg.packageType] || pkg.packageType}
                </div>
              </div>

              {/* Package Info Card */}
              <div className="rounded-3xl bg-white p-6 shadow-lg sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                    {pkg.title}
                  </h1>
                  {pkg.ratings?.count > 0 && (
                    <div className="flex items-center gap-2">
                      <StarRating
                        rating={Math.round(pkg.ratings.average)}
                        readonly
                        size="sm"
                      />
                      <span className="text-sm font-semibold text-slate-600">
                        {pkg.ratings.average.toFixed(1)} ({pkg.ratings.count})
                      </span>
                    </div>
                  )}
                </div>
                <p className="mt-3 text-slate-600 leading-relaxed">
                  {pkg.description}
                </p>

                {/* Stats Grid */}
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-sky-50 p-4 text-center">
                    <p className="text-xs font-bold uppercase text-sky-600">
                      Duration
                    </p>
                    <p className="mt-1 text-lg font-bold text-slate-800">
                      {pkg.durationDays} Day{pkg.durationDays > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 p-4 text-center">
                    <p className="text-xs font-bold uppercase text-emerald-600">
                      Type
                    </p>
                    <p className="mt-1 text-lg font-bold text-slate-800 capitalize">
                      {packageTypeLabels[pkg.packageType] || pkg.packageType}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-purple-50 p-4 text-center">
                    <p className="text-xs font-bold uppercase text-purple-600">
                      Locations
                    </p>
                    <p className="mt-1 text-lg font-bold text-slate-800">
                      {pkg.locations?.length || 0}
                    </p>
                  </div>
                </div>

                {/* Locations */}
                {pkg.locations && pkg.locations.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                      Destinations
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {pkg.locations.map((location, idx) => (
                        <span
                          key={idx}
                          className="rounded-full bg-sky-100 px-4 py-2 text-sm font-medium text-sky-700"
                        >
                          📍 {location}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Includes */}
                {pkg.includes && pkg.includes.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                      What's Included
                    </h3>
                    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                      {pkg.includes.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2 text-sm text-slate-600"
                        >
                          <span className="text-emerald-500">✓</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Excludes */}
                {pkg.excludes && pkg.excludes.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                      Not Included
                    </h3>
                    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                      {pkg.excludes.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2 text-sm text-slate-500"
                        >
                          <span className="text-red-400">✕</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Price & Owner Info */}
            <div className="space-y-6">
              <div className="sticky top-24 space-y-6">
                {/* Price Card */}
                <div className="rounded-3xl bg-white p-6 shadow-lg">
                  <div className="text-center space-y-2">
                    {pkg.pricePerPerson && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                          Price Per Person
                        </p>
                        <p className="mt-1 text-3xl font-bold text-sky-600">
                          LKR {pkg.pricePerPerson?.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {pkg.pricePerGroup && (
                      <div className="pt-2 border-t border-slate-100">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                          Group Price
                        </p>
                        <p className="mt-1 text-2xl font-bold text-emerald-600">
                          LKR {pkg.pricePerGroup?.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleBookPackage}
                    className="mt-6 w-full rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 py-4 text-lg font-bold text-white shadow-lg shadow-sky-500/30 transition hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Book This Package
                  </button>
                </div>

                {/* Owner Info Card */}
                {owner && (
                  <div className="rounded-3xl bg-white p-6 shadow-lg">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500 mb-4">
                      Package Provider
                    </h3>

                    <div className="flex items-center gap-4">
                      {owner.profileImage ? (
                        <img
                          src={owner.profileImage}
                          alt={`${owner.firstName} ${owner.lastName}`}
                          className="h-16 w-16 rounded-2xl object-cover shadow-md"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-xl font-bold text-white shadow-md">
                          {owner.firstName?.[0]}
                          {owner.lastName?.[0]}
                        </div>
                      )}
                      <div>
                        <p className="text-lg font-bold text-slate-800">
                          {owner.firstName} {owner.lastName}
                        </p>
                        <p className="text-sm text-slate-500">Travel Partner</p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      {owner.email && (
                        <a
                          href={`mailto:${owner.email}`}
                          className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-600 transition hover:bg-slate-100"
                        >
                          <svg
                            className="h-5 w-5 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="truncate">{owner.email}</span>
                        </a>
                      )}
                      {owner.phone && (
                        <a
                          href={`tel:${owner.phone}`}
                          className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-600 transition hover:bg-slate-100"
                        >
                          <svg
                            className="h-5 w-5 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          <span>{owner.phone}</span>
                        </a>
                      )}
                    </div>

                    <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-medium">Verified Partner</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <ReviewSection
            itemId={id}
            itemType="package"
            ratings={pkg?.ratings}
          />
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        item={pkg}
        type="package"
      />
    </div>
  );
};

export default PackageDetails;
