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
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setTimeout(loadTours, 0);
  };

  return (
    <div className="flex flex-col gap-8">
      <SectionHeading
        title="Discover Tours"
        subtitle="Filter tours by price, duration, and category to find your perfect itinerary."
      />
      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-3xl bg-white p-6 shadow-soft md:grid-cols-6"
      >
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Category
          <select
            value={filters.category}
            onChange={(event) => setFilters((prev) => ({ ...prev, category: event.target.value }))}
            className="mt-2 w-full rounded-full border border-slate-200 px-4 py-2 text-sm"
          >
            <option value="">All</option>
            <option value="beach">Beach</option>
            <option value="culture">Culture</option>
            <option value="nature">Nature</option>
            <option value="adventure">Adventure</option>
            <option value="wildlife">Wildlife</option>
            <option value="heritage">Heritage</option>
            <option value="wellness">Wellness</option>
          </select>
        </label>
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Min Price
          <input
            type="number"
            value={filters.minPrice}
            onChange={(event) => setFilters((prev) => ({ ...prev, minPrice: event.target.value }))}
            className="mt-2 w-full rounded-full border border-slate-200 px-4 py-2 text-sm"
            placeholder="LKR"
          />
        </label>
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Max Price
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(event) => setFilters((prev) => ({ ...prev, maxPrice: event.target.value }))}
            className="mt-2 w-full rounded-full border border-slate-200 px-4 py-2 text-sm"
            placeholder="LKR"
          />
        </label>
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Min Days
          <input
            type="number"
            value={filters.minDuration}
            onChange={(event) => setFilters((prev) => ({ ...prev, minDuration: event.target.value }))}
            className="mt-2 w-full rounded-full border border-slate-200 px-4 py-2 text-sm"
          />
        </label>
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Max Days
          <input
            type="number"
            value={filters.maxDuration}
            onChange={(event) => setFilters((prev) => ({ ...prev, maxDuration: event.target.value }))}
            className="mt-2 w-full rounded-full border border-slate-200 px-4 py-2 text-sm"
          />
        </label>
        <div className="flex items-end gap-2">
          <button type="submit" className="btn-primary w-full text-sm">
            Apply Filters
          </button>
          <button
            type="button"
            className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-500 transition hover:border-primary hover:text-primary"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </form>

      {state.loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
          Loading tours...
        </div>
      ) : state.error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
          {state.error}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {state.items.map((tour) => (
            <TourCard key={tour._id} tour={tour} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Tours;
