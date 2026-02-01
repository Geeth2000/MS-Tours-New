import { useEffect, useState } from "react";
import TourCard from "../components/TourCard.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { fetchTours } from "../services/tourService.js";
import { handleApiError } from "../services/apiClient.js";

const defaultFilters = {
  category: "",
  minPrice: "",
  maxPrice: "",
  minDuration: "",
  maxDuration: "",
};

const Tours = () => {
  const [filters, setFilters] = useState(defaultFilters);
  const [state, setState] = useState({ items: [], loading: true, error: null });
  const [showFilters, setShowFilters] = useState(false);

  const loadTours = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      const { data } = await fetchTours({ ...filters });
      setState({ items: data || [], loading: false, error: null });
    } catch (error) {
      setState({ items: [], loading: false, error: handleApiError(error) });
    }
  };

  useEffect(() => {
    loadTours();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    loadTours();
    setShowFilters(false); // Hide filters on mobile after applying
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setTimeout(loadTours, 0);
  };

  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== "",
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Section with Search */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 pb-32">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-white blur-3xl" />
          <div
            className="absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-cyan-300 blur-3xl"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-2 mb-4">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/90">
                Explore Sri Lanka
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Discover Amazing
              <span className="block mt-2 bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                Tour Experiences
              </span>
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Find the perfect adventure from beaches to mountains, culture to
              wildlife
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {state.items.length}
              </div>
              <div className="text-sm text-blue-200">Tours Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">50+</div>
              <div className="text-sm text-blue-200">Destinations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">4.8★</div>
              <div className="text-sm text-blue-200">Avg Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative mx-auto -mt-24 max-w-7xl px-4 pb-16">
        {/* Filter Card - Elevated */}
        <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl mb-8">
          <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 p-1 opacity-20" />

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden p-4 border-b border-slate-100">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 font-bold text-white shadow-lg transition hover:shadow-xl"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">🔍</span>
                <span>Filters</span>
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
            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6">
              {/* Category Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                  <span className="text-lg">🏷️</span>
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(event) =>
                    setFilters((prev) => ({
                      ...prev,
                      category: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white px-4 py-3 text-sm font-medium text-slate-700 transition focus:border-blue-400 focus:shadow-lg focus:shadow-blue-100 focus:outline-none"
                >
                  <option value="">All Categories</option>
                  <option value="beach">🏖️ Beach</option>
                  <option value="culture">🏛️ Culture</option>
                  <option value="nature">🌿 Nature</option>
                  <option value="adventure">⛰️ Adventure</option>
                  <option value="wildlife">🦁 Wildlife</option>
                  <option value="heritage">🏰 Heritage</option>
                  <option value="wellness">🧘 Wellness</option>
                </select>
              </div>

              {/* Min Price */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                  <span className="text-lg">💰</span>
                  Min Price
                </label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(event) =>
                    setFilters((prev) => ({
                      ...prev,
                      minPrice: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white px-4 py-3 text-sm font-medium text-slate-700 placeholder:text-slate-400 transition focus:border-blue-400 focus:shadow-lg focus:shadow-blue-100 focus:outline-none"
                  placeholder="LKR 0"
                />
              </div>

              {/* Max Price */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                  <span className="text-lg">💳</span>
                  Max Price
                </label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(event) =>
                    setFilters((prev) => ({
                      ...prev,
                      maxPrice: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white px-4 py-3 text-sm font-medium text-slate-700 placeholder:text-slate-400 transition focus:border-blue-400 focus:shadow-lg focus:shadow-blue-100 focus:outline-none"
                  placeholder="LKR 50000"
                />
              </div>

              {/* Min Duration */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                  <span className="text-lg">📅</span>
                  Min Days
                </label>
                <input
                  type="number"
                  value={filters.minDuration}
                  onChange={(event) =>
                    setFilters((prev) => ({
                      ...prev,
                      minDuration: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white px-4 py-3 text-sm font-medium text-slate-700 placeholder:text-slate-400 transition focus:border-blue-400 focus:shadow-lg focus:shadow-blue-100 focus:outline-none"
                  placeholder="1"
                />
              </div>

              {/* Max Duration */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                  <span className="text-lg">🗓️</span>
                  Max Days
                </label>
                <input
                  type="number"
                  value={filters.maxDuration}
                  onChange={(event) =>
                    setFilters((prev) => ({
                      ...prev,
                      maxDuration: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white px-4 py-3 text-sm font-medium text-slate-700 placeholder:text-slate-400 transition focus:border-blue-400 focus:shadow-lg focus:shadow-blue-100 focus:outline-none"
                  placeholder="14"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 md:col-span-3 lg:col-span-1">
                <button
                  type="submit"
                  className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 px-6 py-3 font-bold text-white shadow-xl shadow-blue-200 transition hover:shadow-2xl hover:shadow-blue-300 hover:scale-105"
                >
                  <span>Search</span>
                  <span className="text-xl transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-xl border-2 border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Results Section */}
        {state.loading ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-16 shadow-sm">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 mb-4"></div>
            <p className="text-lg font-semibold text-slate-600">
              Discovering amazing tours...
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
              No tours found
            </h3>
            <p className="text-slate-500 mb-6">
              Try adjusting your filters to see more results
            </p>
            <button
              onClick={handleReset}
              className="rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-600"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="mb-6 flex items-center justify-between rounded-2xl bg-white px-6 py-4 shadow-sm">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {state.items.length}{" "}
                  {state.items.length === 1 ? "Tour" : "Tours"} Found
                </h2>
                <p className="text-sm text-slate-500">
                  Explore our curated selection
                </p>
              </div>
              {activeFilterCount > 0 && (
                <div className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
                  <span className="text-lg">✓</span>
                  <span>
                    {activeFilterCount}{" "}
                    {activeFilterCount === 1 ? "Filter" : "Filters"} Active
                  </span>
                </div>
              )}
            </div>

            {/* Tours Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {state.items.map((tour) => (
                <TourCard key={tour._id} tour={tour} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Tours;
