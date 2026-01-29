import { useEffect, useState } from "react";
import PackageCard from "../components/PackageCard.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import BookingModal from "../components/BookingModal.jsx"; // Import Modal
import { fetchPackages } from "../services/packageService.js";
import { handleApiError } from "../services/apiClient.js";

const Packages = () => {
  const [filters, setFilters] = useState({ packageType: "", maxPrice: "" });
  const [state, setState] = useState({ items: [], loading: true, error: null });

  // NEW: State for modal
  const [selectedPackage, setSelectedPackage] = useState(null);

  const load = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      const { data } = await fetchPackages({ ...filters, status: "published" });
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
        title="Travel Packages"
        subtitle="Flexible itineraries curated by expert drivers and local guides."
      />

      {/* Filter Form (Existing Code) */}
      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-3xl bg-white p-6 shadow-soft md:grid-cols-4"
      >
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Type
          <select
            value={filters.packageType}
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                packageType: event.target.value,
              }))
            }
            className="mt-2 w-full rounded-full border border-slate-200 px-4 py-2 text-sm"
          >
            <option value="">All</option>
            <option value="dayTrip">Day Trip</option>
            <option value="multiDay">Multi-Day</option>
          </select>
        </label>
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Max Budget (LKR)
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, maxPrice: event.target.value }))
            }
            className="mt-2 w-full rounded-full border border-slate-200 px-4 py-2 text-sm"
          />
        </label>
        <div className="md:col-span-2 md:flex md:items-end md:justify-end">
          <button type="submit" className="btn-primary text-sm">
            Filter Packages
          </button>
        </div>
      </form>

      {/* List */}
      {state.loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
          Loading packages...
        </div>
      ) : state.error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
          {state.error}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {state.items.map((pkg) => (
            <PackageCard
              key={pkg._id}
              pkg={pkg}
              // NEW: Pass selection handler
              onSelect={(item) => setSelectedPackage(item)}
            />
          ))}
        </div>
      )}

      {/* NEW: Booking Modal */}
      <BookingModal
        isOpen={!!selectedPackage}
        onClose={() => setSelectedPackage(null)}
        item={selectedPackage}
        type="package"
      />
    </div>
  );
};

export default Packages;
