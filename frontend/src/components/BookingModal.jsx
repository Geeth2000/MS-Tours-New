import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBooking } from "../services/bookingService.js";
import { useAuthStore } from "../hooks/useAuthStore.js";

const BookingModal = ({ isOpen, onClose, item, type }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    date: "",
    guests: 1,
    notes: "",
  });

  if (!isOpen || !item) return null;

  const calculateEstimatedPrice = () => {
    if (type === "vehicle") return item.pricePerDay || 0;
    if (type === "tour") return (item.pricePerPerson || 0) * formData.guests;
    if (type === "package") return (item.pricePerPerson || 0) * formData.guests;
    return 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      alert("Please login to book this item.");
      navigate("/login");
      return;
    }

    if (!formData.date) {
      setError("Please select a valid date.");
      return;
    }

    setLoading(true);

    try {
      const estimatedPrice = calculateEstimatedPrice();

      // FIX: Map frontend form data to the BACKEND SCHEMA
      const payload = {
        // Backend expects 'startDate', not 'date'
        startDate: formData.date,

        // Backend expects 'travelers' object, not 'count'
        travelers: {
          adults: Number(formData.guests),
          children: 0,
        },

        notes: formData.notes,
        totalPrice: isNaN(estimatedPrice) ? 0 : estimatedPrice,
      };

      // Add specific ID based on type
      if (type === "tour") payload.tour = item._id;
      if (type === "vehicle") payload.vehicle = item._id;
      if (type === "package") payload.package = item._id;

      console.log("🚀 Sending Corrected Payload:", payload);

      await createBooking(payload);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        setFormData({ date: "", guests: 1, notes: "" });
        onClose();
      }, 2000);
    } catch (err) {
      console.error("❌ Booking Error:", err.response?.data);
      const backendMessage =
        err.response?.data?.message || err.response?.data?.error;
      setError(backendMessage || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl animate-fade-in ring-1 ring-black/5">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {success ? (
          <div className="flex flex-col items-center justify-center py-8 text-center animate-scale-in">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl shadow-sm">
              🎉
            </div>
            <h3 className="text-2xl font-bold text-slate-800">
              Booking Request Sent!
            </h3>
            <p className="mt-2 text-slate-500">
              You can view the status in your Dashboard.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Book {type}
              </span>
              <h2 className="text-2xl font-bold text-slate-900 leading-tight mt-1">
                {item.title}
              </h2>
              <p className="mt-1 text-base font-semibold text-slate-500">
                LKR {calculateEstimatedPrice().toLocaleString()}{" "}
                <span className="text-xs font-normal text-slate-400">
                  (Est. Total)
                </span>
              </p>
            </div>

            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-medium text-red-600">
                🚨 {error}
              </div>
            )}

            <div className="space-y-4">
              <label className="block">
                <span className="ml-1 text-xs font-bold uppercase text-slate-500">
                  Date
                </span>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 focus:border-primary focus:bg-white focus:outline-none transition-all"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </label>

              <label className="block">
                <span className="ml-1 text-xs font-bold uppercase text-slate-500">
                  {type === "vehicle" ? "Days Needed" : "Number of People"}
                </span>
                <input
                  type="number"
                  min="1"
                  required
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 focus:border-primary focus:bg-white focus:outline-none transition-all"
                  value={formData.guests}
                  onChange={(e) =>
                    setFormData({ ...formData, guests: e.target.value })
                  }
                />
              </label>

              <label className="block">
                <span className="ml-1 text-xs font-bold uppercase text-slate-500">
                  Special Requests
                </span>
                <textarea
                  rows="3"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 focus:border-primary focus:bg-white focus:outline-none transition-all resize-none"
                  placeholder="Pick-up location, dietary restrictions, etc."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-primary py-3.5 text-base font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-primary/40 hover:translate-y-[-2px] disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? "Processing..." : "Confirm Booking"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
