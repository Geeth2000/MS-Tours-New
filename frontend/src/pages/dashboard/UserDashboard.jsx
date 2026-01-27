import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchMyBookings,
  cancelBooking,
} from "../../services/bookingService.js";
import { handleApiError } from "../../services/apiClient.js";
import { useAuthStore } from "../../hooks/useAuthStore.js";

const UserDashboard = () => {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchMyBookings();
      setBookings(data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;
    try {
      await cancelBooking(id);
      await load();
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  // --- STATS CALCULATION ---
  const upcomingTrips = bookings.filter(
    (b) => b.status === "pending" || b.status === "confirmed",
  );
  const pastTrips = bookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled",
  );

  // Filter displayed bookings based on tab
  const displayedBookings =
    activeTab === "upcoming" ? upcomingTrips : pastTrips;

  return (
    <div className="flex flex-col gap-8 pb-12 font-sans text-slate-600">
      {/* 1. HERO HEADER */}
      <header className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-sky-500 to-blue-600 p-10 text-white shadow-xl">
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="mt-2 text-sky-100 opacity-90">
              Ready for your next adventure in Sri Lanka?
            </p>
          </div>

          <div className="flex gap-4">
            <StatBadge
              label="Upcoming Trips"
              value={upcomingTrips.length}
              highlight
            />
            <StatBadge label="Total Bookings" value={bookings.length} />
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      </header>

      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600 shadow-sm">
          {error}
        </div>
      )}

      {/* 2. TABS & CONTENT */}
      <div className="min-h-[400px]">
        {/* Tab Navigation */}
        <div className="mb-6 flex gap-8 border-b border-slate-200 px-4">
          <TabButton
            active={activeTab === "upcoming"}
            onClick={() => setActiveTab("upcoming")}
            label="Upcoming Trips"
            count={upcomingTrips.length}
          />
          <TabButton
            active={activeTab === "history"}
            onClick={() => setActiveTab("history")}
            label="History"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-12 text-center text-slate-400">
            <p>Loading your journeys...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && displayedBookings.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
            <div className="mb-4 text-4xl">🌏</div>
            <h3 className="text-lg font-bold text-slate-800">
              No {activeTab} trips found
            </h3>
            <p className="text-slate-500 max-w-xs mx-auto mt-2">
              {activeTab === "upcoming"
                ? "You haven't planned any trips yet. Explore our tours to get started!"
                : "Your travel history will appear here once you complete a trip."}
            </p>
            {activeTab === "upcoming" && (
              <Link
                to="/tours"
                className="mt-6 rounded-xl bg-sky-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-200 transition hover:bg-sky-600 hover:shadow-sky-300"
              >
                Explore Tours
              </Link>
            )}
          </div>
        )}

        {/* Booking List */}
        <div className="grid gap-6">
          {displayedBookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              onCancel={handleCancel}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// --- SUB COMPONENTS ---

const StatBadge = ({ label, value, highlight }) => (
  <div
    className={`rounded-2xl p-4 backdrop-blur-md ${highlight ? "bg-white text-sky-600 shadow-lg" : "bg-white/10 text-white"}`}
  >
    <p className="text-xs font-bold uppercase tracking-wider opacity-80">
      {label}
    </p>
    <p className="mt-1 text-2xl font-bold">{value}</p>
  </div>
);

const TabButton = ({ active, onClick, label, count }) => (
  <button
    onClick={onClick}
    className={`relative flex items-center gap-2 pb-4 text-sm font-bold tracking-wide transition-colors ${
      active ? "text-sky-600" : "text-slate-400 hover:text-slate-600"
    }`}
  >
    {label}
    {count > 0 && (
      <span
        className={`flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] ${active ? "bg-sky-100 text-sky-700" : "bg-slate-100 text-slate-500"}`}
      >
        {count}
      </span>
    )}
    {active && (
      <span className="absolute bottom-0 left-0 h-0.5 w-full bg-sky-500" />
    )}
  </button>
);

const BookingCard = ({ booking, onCancel }) => {
  const isPending = booking.status === "pending";

  // Status Styling
  const statusConfig = {
    pending: {
      color: "bg-amber-100 text-amber-700",
      label: "Pending Approval",
    },
    confirmed: { color: "bg-emerald-100 text-emerald-700", label: "Confirmed" },
    cancelled: { color: "bg-rose-100 text-rose-700", label: "Cancelled" },
    completed: { color: "bg-slate-100 text-slate-600", label: "Completed" },
  };

  const statusStyle = statusConfig[booking.status] || statusConfig.pending;
  const title =
    booking.tour?.title || booking.vehicle?.title || booking.package?.title;
  const typeIcon = booking.tour ? "🗺️" : booking.vehicle ? "🚗" : "📦";
  const typeLabel = booking.tour
    ? "Tour Package"
    : booking.vehicle
      ? "Vehicle Rental"
      : "Custom Package";

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition hover:border-sky-100 hover:shadow-md">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* Left Info */}
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-2xl">
            {typeIcon}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {typeLabel}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${statusStyle.color}`}
              >
                {statusStyle.label}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
            <p className="text-sm font-medium text-slate-400">
              Ref:{" "}
              <span className="font-mono text-slate-500">
                {booking.referenceCode}
              </span>
            </p>
          </div>
        </div>

        {/* Right Details */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 md:justify-end">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase text-slate-400">
              Date
            </span>
            <span className="text-sm font-semibold text-slate-700">
              {new Date(booking.startDate).toLocaleDateString()}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase text-slate-400">
              Total Price
            </span>
            <span className="text-sm font-bold text-sky-600">
              LKR {booking.totalPrice?.toLocaleString()}
            </span>
          </div>

          {isPending && (
            <button
              onClick={() => onCancel(booking._id)}
              className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-100 hover:border-rose-200"
            >
              Cancel Request
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default UserDashboard;
