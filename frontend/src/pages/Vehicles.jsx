import { useEffect, useState } from "react";
import VehicleCard from "../components/VehicleCard.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { fetchVehicles } from "../services/vehicleService.js";
import { handleApiError } from "../services/apiClient.js";

const Vehicles = () => {
  const [filters, setFilters] = useState({ type: "", seats: "" });
  const [state, setState] = useState({ items: [], loading: true, error: null });

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    load();
  };

  return (
    <div className="flex flex-col gap-8">
      <SectionHeading
        title="Vehicle Rentals"
        subtitle="Book verified vehicles with professional drivers for island-wide coverage."
      />
      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-3xl bg-white p-6 shadow-soft md:grid-cols-4"
      >
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Type
          <select
            value={filters.type}
            onChange={(event) => setFilters((prev) => ({ ...prev, type: event.target.value }))}
            className="mt-2 w-full rounded-full border border-slate-200 px-4 py-2 text-sm"
          >
            <option value="">All Types</option>
            <option value="car">Car</option>
            <option value="van">Van</option>
            <option value="bus">Bus</option>
            <option value="suv">SUV</option>
            <option value="jeep">Jeep</option>
          </select>
        </label>
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Minimum Seats
          <input
            type="number"
            value={filters.seats}
            onChange={(event) => setFilters((prev) => ({ ...prev, seats: event.target.value }))}
            className="mt-2 w-full rounded-full border border-slate-200 px-4 py-2 text-sm"
            placeholder="Seats"
          />
        </label>
        <div className="md:col-span-2 md:flex md:items-end md:justify-end">
          <button type="submit" className="btn-primary text-sm">
            Search Vehicles
          </button>
        </div>
      </form>
      {state.loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
          Loading vehicles...
        </div>
      ) : state.error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
          {state.error}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {state.items.map((vehicle) => (
            <VehicleCard key={vehicle._id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Vehicles;
