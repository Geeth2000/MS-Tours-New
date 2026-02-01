import { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import VehicleCard from "../components/VehicleCard.jsx";
import BookingModal from "../components/BookingModal.jsx";
import { fetchVehicles } from "../services/vehicleService.js";
import { handleApiError } from "../services/apiClient.js";

const Vehicles = () => {
  const [filters, setFilters] = useState({ type: "", seats: "" });
  const [state, setState] = useState({ items: [], loading: true, error: null });

  // NEW: State for modal
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [detailsVehicle, setDetailsVehicle] = useState(null);

  const load = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      const { data } = await fetchVehicles(filters);
      setState({ items: data || [], loading: false, error: null });
    } catch (error) {
      setState({ items: [], loading: false, error: handleApiError(error) });
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    load();
  };

  const [showFilters, setShowFilters] = useState(false);
  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== "",
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-sky-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-sky-600 via-cyan-600 to-blue-700 pb-32">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-1/3 top-1/3 h-96 w-96 animate-pulse rounded-full bg-white blur-3xl" />
          <div
            className="absolute right-1/3 bottom-1/3 h-96 w-96 animate-pulse rounded-full bg-blue-300 blur-3xl"
            style={{ animationDelay: "1.5s" }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-2 mb-4">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/90">
                Premium Fleet
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Explore Sri Lanka
              <span className="block mt-2 bg-gradient-to-r from-emerald-300 to-blue-200 bg-clip-text text-transparent">
                In Comfort & Style
              </span>
            </h1>
            <p className="text-lg text-cyan-100 max-w-2xl mx-auto">
              Choose from our verified fleet with professional drivers for
              island-wide coverage
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {state.items.length}
              </div>
              <div className="text-sm text-cyan-200">Vehicles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">24/7</div>
              <div className="text-sm text-cyan-200">Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">100%</div>
              <div className="text-sm text-cyan-200">Verified</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative mx-auto -mt-24 max-w-7xl px-4 pb-16">
        {/* Filter Card - Elevated */}
        <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl mb-8">
          <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-sky-400 via-cyan-500 to-blue-600 p-1 opacity-20" />

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden p-4 border-b border-slate-100">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-600 px-6 py-4 font-bold text-white shadow-lg transition hover:shadow-xl"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">🚗</span>
                <span>Search Filters</span>
                {activeFilterCount > 0 && (
                  <span className="rounded-full bg-white/20 backdrop-blur-sm px-2 py-0.5 text-xs">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <span className="text-xl">{showFilters ? "✕" : "▼"}</span>
            </button>
          </div>

          {/* Filter Form */}
          <form
            onSubmit={handleSubmit}
            className={`p-6 lg:p-8 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <div className="grid gap-6 md:grid-cols-4">
              {/* Vehicle Type */}
              <div className="space-y-2 md:col-span-2">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                  <span className="text-lg">🚙</span>
                  Vehicle Type
                </label>
                <select
                  value={filters.type}
                  onChange={(event) =>
                    setFilters((prev) => ({
                      ...prev,
                      type: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white px-4 py-3 text-sm font-medium text-slate-700 transition focus:border-sky-400 focus:shadow-lg focus:shadow-sky-100 focus:outline-none"
                >
                  <option value="">All Vehicle Types</option>
                  <option value="car">🚗 Car</option>
                  <option value="van">🚐 Van</option>
                  <option value="bus">🚌 Bus</option>
                  <option value="suv">🚙 SUV</option>
                  <option value="jeep">🚜 Jeep</option>
                </select>
              </div>

              {/* Minimum Seats */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                  <span className="text-lg">👥</span>
                  Min Seats
                </label>
                <input
                  type="number"
                  value={filters.seats}
                  onChange={(event) =>
                    setFilters((prev) => ({
                      ...prev,
                      seats: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white px-4 py-3 text-sm font-medium text-slate-700 placeholder:text-slate-400 transition focus:border-sky-400 focus:shadow-lg focus:shadow-sky-100 focus:outline-none"
                  placeholder="e.g. 4"
                />
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="group w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 via-cyan-600 to-blue-600 px-6 py-3 font-bold text-white shadow-xl shadow-sky-200 transition hover:shadow-2xl hover:shadow-sky-300 hover:scale-105"
                >
                  <span>Search</span>
                  <span className="text-xl transition-transform group-hover:translate-x-1">
                    🔍
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Results Section */}
        {state.loading ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-16 shadow-sm">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600 mb-4"></div>
            <p className="text-lg font-semibold text-slate-600">
              Finding perfect vehicles...
            </p>
          </div>
        ) : state.error ? (
          <div className="rounded-3xl border-2 border-red-200 bg-red-50 p-12 text-center shadow-sm">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-red-700 mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-red-600">{state.error}</p>
          </div>
        ) : state.items.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-slate-700 mb-2">
              No vehicles found
            </h3>
            <p className="text-slate-500 mb-6">
              Try adjusting your search criteria
            </p>
            <button
              onClick={() => {
                setFilters({ type: "", seats: "" });
                setTimeout(load, 0);
              }}
              className="rounded-xl bg-sky-500 px-6 py-3 font-semibold text-white transition hover:bg-sky-600"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="mb-6 flex items-center justify-between rounded-2xl bg-white px-6 py-4 shadow-sm">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {state.items.length}{" "}
                  {state.items.length === 1 ? "Vehicle" : "Vehicles"} Available
                </h2>
                <p className="text-sm text-slate-500">
                  Premium fleet with professional service
                </p>
              </div>
              {activeFilterCount > 0 && (
                <div className="flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-600">
                  <span className="text-lg">✓</span>
                  <span>
                    {activeFilterCount}{" "}
                    {activeFilterCount === 1 ? "Filter" : "Filters"} Active
                  </span>
                </div>
              )}
            </div>

            {/* Vehicles Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {state.items.map((vehicle) => (
                <VehicleCard
                  key={vehicle._id}
                  vehicle={vehicle}
                  onSelect={(item) => setSelectedVehicle(item)}
                  onViewDetails={(item) => setDetailsVehicle(item)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={!!selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
        item={selectedVehicle}
        type="vehicle"
      />

      {/* Vehicle Details Modal */}
      {detailsVehicle && (
        <VehicleDetailsModal
          vehicle={detailsVehicle}
          onClose={() => setDetailsVehicle(null)}
          onBook={() => {
            setSelectedVehicle(detailsVehicle);
            setDetailsVehicle(null);
          }}
        />
      )}
    </div>
  );
};

// Vehicle Details Modal Component
const VehicleDetailsModal = ({ vehicle, onClose, onBook }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = vehicle.images || [];
  const hasImages = images.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
      <div className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/95 p-3 text-slate-600 shadow-lg backdrop-blur-sm transition hover:bg-white hover:text-slate-900 hover:scale-110"
          aria-label="Close"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Image Gallery */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300">
          {hasImages ? (
            <>
              <img
                src={images[currentImageIndex]}
                alt={`${vehicle.title} - View ${currentImageIndex + 1}`}
                className="h-full w-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev === 0 ? images.length - 1 : prev - 1,
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 text-slate-800 shadow-xl backdrop-blur-sm transition hover:bg-white hover:scale-110"
                  >
                    <ChevronLeftIcon className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev === images.length - 1 ? 0 : prev + 1,
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 text-slate-800 shadow-xl backdrop-blur-sm transition hover:bg-white hover:scale-110"
                  >
                    <ChevronRightIcon className="h-6 w-6" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`h-2.5 rounded-full transition-all ${
                          idx === currentImageIndex
                            ? "w-8 bg-white shadow-lg"
                            : "w-2.5 bg-white/60 hover:bg-white/80"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-sky-100 to-cyan-100">
              <span className="text-8xl">🚗</span>
            </div>
          )}
        </div>

        {/* Vehicle Details */}
        <div className="p-8">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-100 to-cyan-100 px-4 py-1.5">
                <span className="text-lg">🚙</span>
                <span className="text-xs font-bold uppercase tracking-wide text-sky-700">
                  {vehicle.type}
                </span>
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">
                {vehicle.title}
              </h2>
              {(vehicle.make || vehicle.model) && (
                <p className="text-lg text-slate-500 flex items-center gap-2">
                  <span className="text-xl">🏷️</span>
                  {vehicle.make} {vehicle.model}{" "}
                  {vehicle.year && `(${vehicle.year})`}
                </p>
              )}
            </div>
            <div className="text-left md:text-right">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-1">
                Daily Rate
              </p>
              <div className="flex items-baseline gap-2 md:justify-end">
                <p className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">
                  {vehicle.pricePerDay?.toLocaleString()}
                </p>
                <p className="text-lg font-semibold text-slate-500">LKR</p>
              </div>
              <p className="text-xs text-slate-400 mt-1">per day + fuel</p>
            </div>
          </div>

          {/* Description */}
          {vehicle.description && (
            <div className="mb-6 rounded-2xl bg-gradient-to-br from-slate-50 to-sky-50 p-6 border border-sky-100">
              <p className="text-slate-700 leading-relaxed">
                {vehicle.description}
              </p>
            </div>
          )}

          {/* Specifications Grid */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border-2 border-sky-100 bg-gradient-to-br from-white to-sky-50 p-5 transition hover:border-sky-200 hover:shadow-lg">
              <p className="text-2xl mb-2">👥</p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Capacity
              </p>
              <p className="text-2xl font-bold text-slate-800">
                {vehicle.seatingCapacity}
              </p>
              <p className="text-xs text-slate-500">Seats</p>
            </div>
            {vehicle.transmission && (
              <div className="rounded-2xl border-2 border-sky-100 bg-gradient-to-br from-white to-sky-50 p-5 transition hover:border-sky-200 hover:shadow-lg">
                <p className="text-2xl mb-2">⚙️</p>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Transmission
                </p>
                <p className="text-xl font-bold text-slate-800 capitalize">
                  {vehicle.transmission}
                </p>
              </div>
            )}
            {vehicle.fuelType && (
              <div className="rounded-2xl border-2 border-sky-100 bg-gradient-to-br from-white to-sky-50 p-5 transition hover:border-sky-200 hover:shadow-lg">
                <p className="text-2xl mb-2">⛽</p>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Fuel Type
                </p>
                <p className="text-xl font-bold text-slate-800 capitalize">
                  {vehicle.fuelType}
                </p>
              </div>
            )}
            {vehicle.location?.city && (
              <div className="rounded-2xl border-2 border-sky-100 bg-gradient-to-br from-white to-sky-50 p-5 transition hover:border-sky-200 hover:shadow-lg">
                <p className="text-2xl mb-2">📍</p>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Location
                </p>
                <p className="text-lg font-bold text-slate-800">
                  {vehicle.location.city}
                </p>
                {vehicle.location.district && (
                  <p className="text-xs text-slate-500">
                    {vehicle.location.district}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Features */}
          {vehicle.features && vehicle.features.length > 0 && (
            <div className="mb-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-cyan-50 p-6 border border-emerald-100">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">✨</span>
                <h3 className="text-lg font-bold text-slate-800">
                  Features & Amenities
                </h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {vehicle.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 border border-emerald-100 transition hover:border-emerald-200 hover:shadow-md"
                  >
                    <span className="text-emerald-500">✓</span>
                    <span className="text-sm font-medium text-slate-700">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ratings */}
          {vehicle.ratings && vehicle.ratings.count > 0 && (
            <div className="mb-6 flex items-center gap-4 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 p-5 border border-amber-200">
              <div className="flex items-center gap-3">
                <span className="text-4xl">⭐</span>
                <div>
                  <span className="text-3xl font-bold text-slate-800 block leading-none">
                    {vehicle.ratings.average.toFixed(1)}
                  </span>
                  <span className="text-xs text-slate-500">out of 5</span>
                </div>
              </div>
              <div className="h-12 w-px bg-amber-200"></div>
              <div>
                <span className="text-lg font-bold text-slate-800">
                  {vehicle.ratings.count}
                </span>
                <span className="text-sm text-slate-600 ml-1">
                  {vehicle.ratings.count === 1 ? "review" : "reviews"}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 border-t-2 border-slate-100 pt-6">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border-2 border-slate-200 bg-white px-6 py-4 font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Close
            </button>
            <button
              onClick={onBook}
              className="flex-1 group rounded-xl bg-gradient-to-r from-sky-500 via-cyan-600 to-blue-600 px-6 py-4 font-bold text-white shadow-xl shadow-sky-200 transition hover:shadow-2xl hover:shadow-sky-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              <span>Book This Vehicle</span>
              <span className="text-xl transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vehicles;
