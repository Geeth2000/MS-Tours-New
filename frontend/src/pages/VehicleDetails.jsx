import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { fetchVehicleById } from "../services/vehicleService.js";
import { fetchPackagesByOwner } from "../services/packageService.js";
import { handleApiError } from "../services/apiClient.js";
import BookingModal from "../components/BookingModal.jsx";
import PackageCard from "../components/PackageCard.jsx";
import { useAuthStore } from "../hooks/useAuthStore.js";
import toast from "react-hot-toast";

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [vehicle, setVehicle] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [bookingType, setBookingType] = useState("vehicle"); // "vehicle" or "package"

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const vehicleData = await fetchVehicleById(id);
        setVehicle(vehicleData);

        // Fetch packages by the same owner
        if (vehicleData.owner?._id) {
          const packagesData = await fetchPackagesByOwner(
            vehicleData.owner._id,
          );
          setPackages(packagesData.data || []);
        }
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const images = vehicle?.images || [];
  const imageCount = images.length;
  const hasMultipleImages = imageCount > 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === imageCount - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? imageCount - 1 : prev - 1));
  };

  // Handle booking with auth check
  const handleBookVehicle = () => {
    if (!user) {
      toast.error("Please login to book this vehicle");
      navigate("/login", { state: { from: `/vehicles/${id}` } });
      return;
    }
    setBookingType("vehicle");
    setSelectedPackage(null);
    setIsBookingOpen(true);
  };

  const handleBookPackage = (pkg) => {
    if (!user) {
      toast.error("Please login to book this package");
      navigate("/login", { state: { from: `/vehicles/${id}` } });
      return;
    }
    setBookingType("package");
    setSelectedPackage(pkg);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setSelectedPackage(null);
    setBookingType("vehicle");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-sky-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" />
              <p className="text-sm text-slate-500">
                Loading vehicle details...
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
              to="/vehicles"
              className="mt-4 inline-block rounded-xl bg-sky-500 px-6 py-2 text-sm font-bold text-white hover:bg-sky-600"
            >
              Back to Vehicles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const owner = vehicle?.owner;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-sky-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/vehicles"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-sky-600 transition"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Back to Vehicles
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
                      alt={`${vehicle.title} - View ${currentImageIndex + 1}`}
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
                    <span className="text-8xl text-slate-300">🚗</span>
                  </div>
                )}

                {/* Type Badge */}
                <div className="absolute top-4 left-4 rounded-full bg-white/90 px-4 py-2 text-sm font-bold uppercase tracking-wide text-slate-700 shadow-lg backdrop-blur-sm">
                  {vehicle.type}
                </div>
              </div>

              {/* Vehicle Info Card */}
              <div className="rounded-3xl bg-white p-6 shadow-lg sm:p-8">
                <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                  {vehicle.title}
                </h1>
                <p className="mt-3 text-slate-600 leading-relaxed">
                  {vehicle.description ||
                    "A reliable vehicle with professional driver service for comfortable travel across Sri Lanka."}
                </p>

                {/* Stats Grid */}
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="rounded-2xl bg-sky-50 p-4 text-center">
                    <p className="text-xs font-bold uppercase text-sky-600">
                      Type
                    </p>
                    <p className="mt-1 text-lg font-bold text-slate-800 capitalize">
                      {vehicle.type}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 p-4 text-center">
                    <p className="text-xs font-bold uppercase text-emerald-600">
                      Capacity
                    </p>
                    <p className="mt-1 text-lg font-bold text-slate-800">
                      {vehicle.seatingCapacity} Seats
                    </p>
                  </div>
                  <div className="rounded-2xl bg-purple-50 p-4 text-center">
                    <p className="text-xs font-bold uppercase text-purple-600">
                      Transmission
                    </p>
                    <p className="mt-1 text-lg font-bold text-slate-800 capitalize">
                      {vehicle.transmission || "Auto"}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-amber-50 p-4 text-center">
                    <p className="text-xs font-bold uppercase text-amber-600">
                      Fuel
                    </p>
                    <p className="mt-1 text-lg font-bold text-slate-800 capitalize">
                      {vehicle.fuelType || "Petrol"}
                    </p>
                  </div>
                </div>

                {/* Features */}
                {vehicle.features && vehicle.features.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                      Features
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {vehicle.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Vehicle Details */}
                {(vehicle.make || vehicle.model || vehicle.year) && (
                  <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                      Vehicle Details
                    </h3>
                    <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                      {vehicle.make && (
                        <div>
                          <p className="text-slate-500">Make</p>
                          <p className="font-semibold text-slate-800">
                            {vehicle.make}
                          </p>
                        </div>
                      )}
                      {vehicle.model && (
                        <div>
                          <p className="text-slate-500">Model</p>
                          <p className="font-semibold text-slate-800">
                            {vehicle.model}
                          </p>
                        </div>
                      )}
                      {vehicle.year && (
                        <div>
                          <p className="text-slate-500">Year</p>
                          <p className="font-semibold text-slate-800">
                            {vehicle.year}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Price & Owner Info */}
            <div className="space-y-6">
              {/* Price Card */}
              <div className="sticky top-24 space-y-6">
                <div className="rounded-3xl bg-white p-6 shadow-lg">
                  <div className="text-center">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Price Per Day
                    </p>
                    <p className="mt-2 text-4xl font-bold text-sky-600">
                      LKR {vehicle.pricePerDay?.toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={handleBookVehicle}
                    className="mt-6 w-full rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 py-4 text-lg font-bold text-white shadow-lg shadow-sky-500/30 transition hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Book This Vehicle
                  </button>

                  {vehicle.location && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500">
                      <svg
                        className="h-4 w-4"
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
                      <span>
                        {vehicle.location.city}, {vehicle.location.district}
                      </span>
                    </div>
                  )}
                </div>

                {/* Owner Info Card */}
                {owner && (
                  <div className="rounded-3xl bg-white p-6 shadow-lg">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500 mb-4">
                      Vehicle Owner
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
                        <p className="text-sm text-slate-500">
                          Vehicle Partner
                        </p>
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

          {/* Owner's Packages Section */}
          {packages.length > 0 && (
            <section className="mt-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                  Packages by {owner?.firstName}
                </h2>
                <p className="mt-2 text-slate-500">
                  Explore travel packages offered by this vehicle owner
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {packages.map((pkg) => (
                  <PackageCard
                    key={pkg._id}
                    pkg={pkg}
                    onSelect={handleBookPackage}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        item={bookingType === "package" ? selectedPackage : vehicle}
        type={bookingType}
      />
    </div>
  );
};

export default VehicleDetails;
