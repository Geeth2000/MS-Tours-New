import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createBooking } from "../services/bookingService.js";
import { useAuthStore } from "../hooks/useAuthStore.js";

const BookingModal = ({ isOpen, onClose, item, type }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1); // 1 = form, 2 = summary
  const [validationErrors, setValidationErrors] = useState({});

  // Form State with customer-confirmed booking details
  const [formData, setFormData] = useState({
    // Customer Information
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    // Travel Details
    pickupLocation: "",
    dropoffLocation: "",
    pickupDate: "",
    pickupTime: "",
    travelerCount: 1,
    specialRequests: "",
  });

  // Pre-fill form with user data when modal opens
  useEffect(() => {
    if (isOpen && user) {
      setFormData((prev) => ({
        ...prev,
        customerName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        customerPhone: user.phone || "",
        customerEmail: user.email || "",
      }));
      setStep(1);
      setError(null);
      setValidationErrors({});
    }
  }, [isOpen, user]);

  if (!isOpen || !item) return null;

  const calculateEstimatedPrice = () => {
    if (type === "vehicle") return item.pricePerDay || 0;
    if (type === "tour")
      return (item.pricePerPerson || 0) * formData.travelerCount;
    if (type === "package") {
      if (item.pricePerGroup) return item.pricePerGroup;
      return (item.pricePerPerson || 0) * formData.travelerCount;
    }
    return 0;
  };

  const validateForm = () => {
    const errors = {};

    // Customer name validation
    if (!formData.customerName.trim()) {
      errors.customerName = "Full name is required";
    } else if (formData.customerName.trim().length < 2) {
      errors.customerName = "Name must be at least 2 characters";
    }

    // Phone validation
    if (!formData.customerPhone.trim()) {
      errors.customerPhone = "Phone number is required";
    } else if (formData.customerPhone.trim().length < 6) {
      errors.customerPhone = "Please enter a valid phone number";
    }

    // Pickup location validation
    if (!formData.pickupLocation.trim()) {
      errors.pickupLocation = "Pickup location is required";
    }

    // Pickup date validation
    if (!formData.pickupDate) {
      errors.pickupDate = "Pickup date is required";
    } else {
      const selectedDate = new Date(formData.pickupDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        errors.pickupDate = "Pickup date cannot be in the past";
      }
    }

    // Traveler count validation
    if (!formData.travelerCount || formData.travelerCount < 1) {
      errors.travelerCount = "At least 1 traveler is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToSummary = (e) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      toast.error("Please login to book this item.");
      navigate("/login");
      return;
    }

    if (validateForm()) {
      setStep(2);
    }
  };

  const handleBackToForm = () => {
    setStep(1);
    setError(null);
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      const estimatedPrice = calculateEstimatedPrice();

      const payload = {
        // Customer-confirmed booking details
        customerName: formData.customerName.trim(),
        customerPhone: formData.customerPhone.trim(),
        customerEmail: formData.customerEmail.trim() || undefined,
        pickupLocation: formData.pickupLocation.trim(),
        dropoffLocation: formData.dropoffLocation.trim() || undefined,
        pickupTime: formData.pickupTime || undefined,
        travelerCount: Number(formData.travelerCount),
        specialRequests: formData.specialRequests.trim() || undefined,

        // Backend expects 'startDate', not 'pickupDate'
        startDate: formData.pickupDate,

        // Backend expects 'travelers' object for compatibility
        travelers: {
          adults: Number(formData.travelerCount),
          children: 0,
        },

        totalPrice: isNaN(estimatedPrice) ? 0 : estimatedPrice,
      };

      // Add specific ID based on type
      if (type === "tour") payload.tour = item._id;
      if (type === "vehicle") payload.vehicle = item._id;
      if (type === "package") payload.package = item._id;

      await createBooking(payload);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        setFormData({
          customerName: "",
          customerPhone: "",
          customerEmail: "",
          pickupLocation: "",
          dropoffLocation: "",
          pickupDate: "",
          pickupTime: "",
          travelerCount: 1,
          specialRequests: "",
        });
        setStep(1);
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

  const handleClose = () => {
    setStep(1);
    setError(null);
    setValidationErrors({});
    onClose();
  };

  const inputClasses = (fieldName) =>
    `mt-1 w-full rounded-xl border ${
      validationErrors[fieldName]
        ? "border-red-300 bg-red-50 focus:border-red-500"
        : "border-slate-200 bg-slate-50 focus:border-primary"
    } px-4 py-3 text-sm font-medium text-slate-700 focus:bg-white focus:outline-none transition-all`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto overflow-hidden rounded-3xl bg-white p-6 shadow-2xl animate-fade-in ring-1 ring-black/5">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors z-10"
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
        ) : step === 1 ? (
          /* Step 1: Booking Form */
          <form
            onSubmit={handleProceedToSummary}
            className="flex flex-col gap-5"
          >
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

            {/* Customer Information Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500 border-b border-slate-100 pb-2">
                Customer Information
              </h3>

              <label className="block">
                <span className="ml-1 text-xs font-bold uppercase text-slate-500">
                  Full Name <span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className={inputClasses("customerName")}
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                />
                {validationErrors.customerName && (
                  <p className="mt-1 text-xs text-red-500">
                    {validationErrors.customerName}
                  </p>
                )}
              </label>

              <label className="block">
                <span className="ml-1 text-xs font-bold uppercase text-slate-500">
                  Phone Number <span className="text-red-500">*</span>
                </span>
                <input
                  type="tel"
                  placeholder="e.g., +94 77 123 4567"
                  className={inputClasses("customerPhone")}
                  value={formData.customerPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, customerPhone: e.target.value })
                  }
                />
                {validationErrors.customerPhone && (
                  <p className="mt-1 text-xs text-red-500">
                    {validationErrors.customerPhone}
                  </p>
                )}
              </label>

              <label className="block">
                <span className="ml-1 text-xs font-bold uppercase text-slate-500">
                  Email Address
                </span>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  className={inputClasses("customerEmail")}
                  value={formData.customerEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, customerEmail: e.target.value })
                  }
                />
              </label>
            </div>

            {/* Travel Details Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500 border-b border-slate-100 pb-2">
                Travel Details
              </h3>

              <label className="block">
                <span className="ml-1 text-xs font-bold uppercase text-slate-500">
                  Pickup Location <span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  placeholder="e.g., Colombo, Hotel Name, Airport"
                  className={inputClasses("pickupLocation")}
                  value={formData.pickupLocation}
                  onChange={(e) =>
                    setFormData({ ...formData, pickupLocation: e.target.value })
                  }
                />
                {validationErrors.pickupLocation && (
                  <p className="mt-1 text-xs text-red-500">
                    {validationErrors.pickupLocation}
                  </p>
                )}
              </label>

              <label className="block">
                <span className="ml-1 text-xs font-bold uppercase text-slate-500">
                  Drop-off Location
                </span>
                <input
                  type="text"
                  placeholder="e.g., Same as pickup, Different location"
                  className={inputClasses("dropoffLocation")}
                  value={formData.dropoffLocation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dropoffLocation: e.target.value,
                    })
                  }
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="ml-1 text-xs font-bold uppercase text-slate-500">
                    Pickup Date <span className="text-red-500">*</span>
                  </span>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    className={inputClasses("pickupDate")}
                    value={formData.pickupDate}
                    onChange={(e) =>
                      setFormData({ ...formData, pickupDate: e.target.value })
                    }
                  />
                  {validationErrors.pickupDate && (
                    <p className="mt-1 text-xs text-red-500">
                      {validationErrors.pickupDate}
                    </p>
                  )}
                </label>

                <label className="block">
                  <span className="ml-1 text-xs font-bold uppercase text-slate-500">
                    Pickup Time
                  </span>
                  <input
                    type="time"
                    className={inputClasses("pickupTime")}
                    value={formData.pickupTime}
                    onChange={(e) =>
                      setFormData({ ...formData, pickupTime: e.target.value })
                    }
                  />
                </label>
              </div>

              <label className="block">
                <span className="ml-1 text-xs font-bold uppercase text-slate-500">
                  Number of Travelers <span className="text-red-500">*</span>
                </span>
                <input
                  type="number"
                  min="1"
                  className={inputClasses("travelerCount")}
                  value={formData.travelerCount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      travelerCount: Math.max(1, parseInt(e.target.value) || 1),
                    })
                  }
                />
                {validationErrors.travelerCount && (
                  <p className="mt-1 text-xs text-red-500">
                    {validationErrors.travelerCount}
                  </p>
                )}
              </label>

              <label className="block">
                <span className="ml-1 text-xs font-bold uppercase text-slate-500">
                  Special Requests / Notes
                </span>
                <textarea
                  rows="3"
                  className={`${inputClasses("specialRequests")} resize-none`}
                  placeholder="Any special requirements, dietary restrictions, accessibility needs, etc."
                  value={formData.specialRequests}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specialRequests: e.target.value,
                    })
                  }
                />
              </label>
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-primary py-3.5 text-base font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-primary/40 hover:translate-y-[-2px]"
            >
              Review Booking
            </button>
          </form>
        ) : (
          /* Step 2: Booking Summary */
          <div className="flex flex-col gap-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Booking Summary
              </span>
              <h2 className="text-2xl font-bold text-slate-900 leading-tight mt-1">
                Review & Confirm
              </h2>
            </div>

            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-medium text-red-600">
                🚨 {error}
              </div>
            )}

            {/* Summary Card */}
            <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-sky-50 p-5 space-y-4 border border-slate-100">
              {/* Item Details */}
              <div className="pb-3 border-b border-slate-200">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  {type === "package"
                    ? "Package"
                    : type === "tour"
                      ? "Tour"
                      : "Vehicle"}
                </p>
                <p className="text-lg font-bold text-slate-800 mt-1">
                  {item.title}
                </p>
              </div>

              {/* Customer Info */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Customer Details
                </p>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Name:</span>
                    <span className="font-medium text-slate-700">
                      {formData.customerName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Phone:</span>
                    <span className="font-medium text-slate-700">
                      {formData.customerPhone}
                    </span>
                  </div>
                  {formData.customerEmail && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Email:</span>
                      <span className="font-medium text-slate-700">
                        {formData.customerEmail}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Travel Details */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Travel Details
                </p>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Travelers:</span>
                    <span className="font-medium text-slate-700">
                      {formData.travelerCount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pickup Date:</span>
                    <span className="font-medium text-slate-700">
                      {new Date(formData.pickupDate).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </span>
                  </div>
                  {formData.pickupTime && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Pickup Time:</span>
                      <span className="font-medium text-slate-700">
                        {formData.pickupTime}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pickup Location:</span>
                    <span className="font-medium text-slate-700 text-right max-w-[60%]">
                      {formData.pickupLocation}
                    </span>
                  </div>
                  {formData.dropoffLocation && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Drop-off:</span>
                      <span className="font-medium text-slate-700 text-right max-w-[60%]">
                        {formData.dropoffLocation}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Special Requests */}
              {formData.specialRequests && (
                <div className="pt-2 border-t border-slate-200">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1">
                    Special Requests
                  </p>
                  <p className="text-sm text-slate-600 bg-white/60 rounded-lg p-2">
                    {formData.specialRequests}
                  </p>
                </div>
              )}

              {/* Total Price */}
              <div className="pt-3 border-t-2 border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-slate-600">
                    Total Price
                  </span>
                  <span className="text-2xl font-bold text-emerald-600">
                    LKR {calculateEstimatedPrice().toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  * Final price may vary based on additional services
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleBackToForm}
                disabled={loading}
                className="flex-1 rounded-xl border-2 border-slate-200 bg-white py-3.5 text-base font-bold text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 rounded-xl bg-emerald-500 py-3.5 text-base font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-600 hover:shadow-emerald-500/40 hover:translate-y-[-2px] disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {loading ? "Processing..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
