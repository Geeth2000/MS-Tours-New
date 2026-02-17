import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useConfirm } from "../../components/ConfirmModal.jsx";
import ProfileEditModal from "../../components/ProfileEditModal.jsx";
import {
  fetchMyBookings,
  cancelBooking,
} from "../../services/bookingService.js";
import {
  fetchMyCustomRequests,
  deleteMyCustomRequest,
  updateMyCustomRequest,
} from "../../services/customRequestService.js";
import { handleApiError } from "../../services/apiClient.js";
import { useAuthStore } from "../../hooks/useAuthStore.js";

const UserDashboard = () => {
  const { user } = useAuthStore();
  const confirm = useConfirm();
  const [bookings, setBookings] = useState([]);
  const [customRequests, setCustomRequests] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [editingRequest, setEditingRequest] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const [bookingsData, requestsData] = await Promise.all([
        fetchMyBookings(),
        fetchMyCustomRequests(),
      ]);
      setBookings(bookingsData);
      setCustomRequests(requestsData);
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
    const confirmed = await confirm({
      title: "Cancel Booking",
      message:
        "Are you sure you want to cancel this booking? This action cannot be undone.",
      confirmText: "Yes, Cancel",
      variant: "warning",
    });
    if (!confirmed) return;
    try {
      await cancelBooking(id);
      toast.success("Booking cancelled successfully");
      await load();
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const handleDeleteRequest = async (id) => {
    const confirmed = await confirm({
      title: "Delete Trip Request",
      message:
        "Are you sure you want to delete this trip request? This action cannot be undone.",
      confirmText: "Delete",
      variant: "danger",
    });
    if (!confirmed) return;
    try {
      await deleteMyCustomRequest(id);
      toast.success("Trip request deleted");
      await load();
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const handleEditRequest = (request) => {
    setEditingRequest(request);
  };

  const handleUpdateRequest = async (id, updatedData) => {
    try {
      await updateMyCustomRequest(id, updatedData);
      setEditingRequest(null);
      await load();
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const handleCancelEdit = () => {
    setEditingRequest(null);
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
          <div className="flex items-center gap-5">
            {/* Profile Photo */}
            <div className="relative group">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={`${user.firstName}'s profile`}
                  className="h-20 w-20 rounded-full object-cover border-4 border-white/30 shadow-lg"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/30 bg-white/20 text-3xl font-bold text-white shadow-lg">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </div>
              )}
              <button
                onClick={() => setShowProfileModal(true)}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Edit Profile"
              >
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="mt-2 text-sky-100 opacity-90">
                Ready for your next adventure in Sri Lanka?
              </p>
              <button
                onClick={() => setShowProfileModal(true)}
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-sky-100 hover:text-white transition"
              >
                <svg
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                Edit Profile
              </button>
            </div>
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

      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

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
            active={activeTab === "requests"}
            onClick={() => setActiveTab("requests")}
            label="Trip Requests"
            count={customRequests.length}
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
        {!loading &&
          activeTab !== "requests" &&
          displayedBookings.length === 0 && (
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

        {/* Trip Requests Tab */}
        {activeTab === "requests" && (
          <div className="space-y-6">
            {!loading && customRequests.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
                <div className="mb-4 text-4xl">🗺️</div>
                <h3 className="text-lg font-bold text-slate-800">
                  No trip requests yet
                </h3>
                <p className="text-slate-500 max-w-xs mx-auto mt-2">
                  Create a custom trip request and our team will help plan your
                  perfect journey!
                </p>
                <Link
                  to="/plan-trip"
                  className="mt-6 rounded-xl bg-sky-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-200 transition hover:bg-sky-600 hover:shadow-sky-300"
                >
                  Plan a Trip
                </Link>
              </div>
            )}
            {customRequests.map((request) =>
              editingRequest?._id === request._id ? (
                <EditRequestForm
                  key={request._id}
                  request={editingRequest}
                  onSave={handleUpdateRequest}
                  onCancel={handleCancelEdit}
                />
              ) : (
                <CustomRequestCard
                  key={request._id}
                  request={request}
                  onDelete={handleDeleteRequest}
                  onEdit={handleEditRequest}
                />
              ),
            )}
          </div>
        )}

        {/* Booking List */}
        {activeTab !== "requests" && (
          <div className="grid gap-6">
            {displayedBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onCancel={handleCancel}
              />
            ))}
          </div>
        )}
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

const CustomRequestCard = ({ request, onDelete, onEdit }) => {
  const statusConfig = {
    pending: {
      color: "bg-amber-100 text-amber-700 border-amber-200",
      icon: "⏳",
      label: "Pending Review",
    },
    inProgress: {
      color: "bg-sky-100 text-sky-700 border-sky-200",
      icon: "🔄",
      label: "In Progress",
    },
    completed: {
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
      icon: "✅",
      label: "Completed",
    },
    cancelled: {
      color: "bg-rose-100 text-rose-700 border-rose-200",
      icon: "❌",
      label: "Cancelled",
    },
  };

  const status = statusConfig[request.status] || statusConfig.pending;
  const canEdit = request.status === "pending";
  const canDelete =
    request.status === "pending" || request.status === "cancelled";

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:border-sky-100 hover:shadow-md">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-50 bg-gradient-to-r from-slate-50 to-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-xl">
            🗺️
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Custom Trip Request
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              {request.destinations}
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 rounded-xl border px-4 py-2 ${status.color}`}
          >
            <span className="text-lg">{status.icon}</span>
            <span className="text-xs font-bold uppercase tracking-wide">
              {status.label}
            </span>
          </div>
          {canEdit && (
            <button
              onClick={() => onEdit(request)}
              className="rounded-xl bg-sky-50 p-2.5 text-sky-600 transition hover:bg-sky-100 hover:shadow-md"
              title="Edit request"
            >
              ✏️
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => onDelete(request._id)}
              className="rounded-xl bg-rose-50 p-2.5 text-rose-600 transition hover:bg-rose-100 hover:shadow-md"
              title="Delete request"
            >
              🗑️
            </button>
          )}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid gap-6 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            📅 Start Date
          </p>
          <p className="text-sm font-medium text-slate-700">
            {request.startDate
              ? new Date(request.startDate).toLocaleDateString()
              : "Not specified"}
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            ⏱️ Duration
          </p>
          <p className="text-sm font-medium text-slate-700">
            {request.durationDays
              ? `${request.durationDays} Days`
              : "Not specified"}
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            👥 Travelers
          </p>
          <p className="text-sm font-medium text-slate-700">
            {request.travelers || "Not specified"}
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            � WhatsApp
          </p>
          <p className="text-sm font-medium text-slate-700">
            {request.whatsappNumber || "Not specified"}
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            �💰 Budget
          </p>
          <p className="text-sm font-bold text-emerald-600">
            {request.budgetRange
              ? `LKR ${request.budgetRange}`
              : "Not specified"}
          </p>
        </div>
      </div>

      {/* Notes */}
      {request.notes && (
        <div className="border-t border-slate-50 bg-slate-50/50 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            📝 Special Notes
          </p>
          <p className="text-sm text-slate-600 bg-white rounded-xl p-3 border border-slate-100">
            {request.notes}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-slate-50 bg-slate-50/30 px-5 py-3">
        <p className="text-xs text-slate-400">
          Submitted on {new Date(request.createdAt).toLocaleDateString()} at{" "}
          {new Date(request.createdAt).toLocaleTimeString()}
        </p>
      </div>
    </article>
  );
};

const EditRequestForm = ({ request, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    destinations: request.destinations || "",
    startDate: request.startDate
      ? new Date(request.startDate).toISOString().split("T")[0]
      : "",
    durationDays: request.durationDays || "",
    travelers: request.travelers || 2,
    budgetRange: request.budgetRange || "",
    notes: request.notes || "",
    whatsappNumber: request.whatsappNumber || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(request._id, formData);
  };

  return (
    <article className="rounded-3xl border-2 border-sky-200 bg-white shadow-lg">
      <div className="border-b-2 border-sky-100 bg-gradient-to-r from-sky-50 to-blue-50 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✏️</span>
            <h3 className="text-xl font-bold text-slate-800">
              Edit Trip Request
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-slate-600"
            title="Cancel editing"
          >
            ✕
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">
            🗺️ Destinations
          </label>
          <input
            type="text"
            name="destinations"
            value={formData.destinations}
            onChange={handleChange}
            required
            className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-slate-700 transition focus:border-sky-400 focus:outline-none"
            placeholder="e.g., Sigiriya, Ella, Mirissa"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              📅 Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().split("T")[0]}
              className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-slate-700 transition focus:border-sky-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              ⏱️ Duration (Days)
            </label>
            <input
              type="number"
              name="durationDays"
              value={formData.durationDays}
              onChange={handleChange}
              required
              min="1"
              max="30"
              className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-slate-700 transition focus:border-sky-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              👥 Travelers
            </label>
            <input
              type="number"
              name="travelers"
              value={formData.travelers}
              onChange={handleChange}
              min="1"
              max="20"
              className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-slate-700 transition focus:border-sky-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              💰 Budget (LKR)
            </label>
            <input
              type="text"
              name="budgetRange"
              value={formData.budgetRange}
              onChange={handleChange}
              className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-slate-700 transition focus:border-sky-400 focus:outline-none"
              placeholder="e.g., 150,000 - 200,000"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">
            📱 WhatsApp Contact Number <span className="text-rose-500">*</span>
          </label>
          <input
            type="tel"
            name="whatsappNumber"
            value={formData.whatsappNumber}
            onChange={handleChange}
            required
            className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-slate-700 transition focus:border-sky-400 focus:outline-none"
            placeholder="e.g., +94 77 123 4567"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">
            📝 Special Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            className="w-full resize-none rounded-xl border-2 border-slate-200 px-4 py-3 text-slate-700 transition focus:border-sky-400 focus:outline-none"
            placeholder="Any special requirements or preferences..."
          />
        </div>

        <div className="flex gap-3 border-t-2 border-slate-100 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-3 font-bold text-white shadow-lg transition hover:shadow-xl hover:scale-105"
          >
            Save Changes
          </button>
        </div>
      </form>
    </article>
  );
};

export default UserDashboard;
