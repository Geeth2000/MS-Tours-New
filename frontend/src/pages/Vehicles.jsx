import { useEffect, useState } from "react";
import VehicleCard from "../components/VehicleCard.jsx";
import BookingModal from "../components/BookingModal.jsx";
import { fetchVehicles } from "../services/vehicleService.js";
import { handleApiError } from "../services/apiClient.js";

const Vehicles = () => {
  const [filters, setFilters] = useState({ type: "", seats: "" });
  const [state, setState] = useState({ items: [], loading: true, error: null });

  // State for booking modal
  const [selectedVehicle, setSelectedVehicle] = useState(null);

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
    </div>
  );
};

export default Vehicles;
