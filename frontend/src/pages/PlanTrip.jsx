import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../services/apiClient.js";

// Step configuration for cleaner code
const STEPS = [
  { id: 1, label: "Where", icon: "🗺️", color: "sky" },
  { id: 2, label: "When", icon: "📅", color: "emerald" },
  { id: 3, label: "Details", icon: "✨", color: "amber" },
];

const PlanTrip = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm();
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);

  const onSubmit = async (data) => {
    if (step !== 3) {
      setStep(step + 1);
      return;
    }

    try {
      await apiClient.post("/custom-requests", data);
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 3000);
    } catch (error) {
      alert("Failed to submit request. Please login first.");
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 px-4">
        <div className="text-center">
          <div className="relative mx-auto mb-8 h-32 w-32">
            <div className="absolute inset-0 animate-ping rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 opacity-30" />
            <div className="relative flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 text-6xl shadow-2xl shadow-emerald-300/50">
              <span className="animate-bounce">✓</span>
            </div>
          </div>
          <h2 className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-4xl font-bold text-transparent">
            Trip Request Submitted!
          </h2>
          <p className="mx-auto mt-4 max-w-md text-slate-600">
            🎉 Our travel experts are reviewing your request and will contact
            you within 24 hours with a customized itinerary.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-400">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span>Redirecting to dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-blue-50">
      {/* Hero Section with Animated Background */}
      <div className="relative overflow-hidden bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700 pb-32">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-white blur-3xl" />
          <div
            className="absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-cyan-300 blur-3xl"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 pt-16 pb-20">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-2 mb-4">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/90">
                Custom Trip Planner
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Design Your Perfect
              <span className="block mt-2 bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                Sri Lankan Adventure
              </span>
            </h1>
            <p className="text-lg text-sky-100 max-w-2xl mx-auto">
              Tell us your dream destinations and we'll craft a personalized
              itinerary just for you
            </p>
          </div>

          {/* Progress Indicators */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {STEPS.map((s, idx) => (
              <div key={s.id} className="flex items-center">
                <button
                  type="button"
                  onClick={() => setStep(s.id)}
                  className={`group flex items-center gap-3 rounded-2xl px-5 py-3 transition-all duration-300 ${
                    step === s.id
                      ? "bg-white shadow-2xl shadow-white/30 scale-110"
                      : step > s.id
                        ? "bg-emerald-500/20 backdrop-blur-sm hover:bg-emerald-500/30"
                        : "bg-white/10 backdrop-blur-sm hover:bg-white/20"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl transition-all ${
                      step === s.id
                        ? "bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg"
                        : step > s.id
                          ? "bg-emerald-400 text-white"
                          : "bg-white/20 text-white/70"
                    }`}
                  >
                    {step > s.id ? "✓" : s.icon}
                  </span>
                  <div
                    className={`text-left ${step === s.id ? "block" : "hidden sm:block"}`}
                  >
                    <div
                      className={`text-xs font-semibold uppercase tracking-wider ${
                        step === s.id ? "text-sky-600" : "text-white/70"
                      }`}
                    >
                      Step {s.id}
                    </div>
                    <div
                      className={`text-sm font-bold ${
                        step === s.id ? "text-slate-800" : "text-white"
                      }`}
                    >
                      {s.label}
                    </div>
                  </div>
                </button>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 w-8 transition-all duration-300 ${
                      step > s.id ? "bg-emerald-400" : "bg-white/20"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Card - Elevated */}
      <div className="relative mx-auto -mt-24 max-w-4xl px-4 pb-16">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative overflow-hidden rounded-3xl bg-white shadow-2xl"
        >
          {/* Gradient Border Effect */}
          <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 p-1 opacity-20" />

          <div className="p-8 md:p-12">
            {/* Step 1: Destination */}
            <div
              className={`transition-all duration-500 ${step === 1 ? "block" : "hidden"}`}
            >
              <div className="mb-8 flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-blue-100 text-3xl shadow-lg">
                  🗺️
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">
                    Where do you want to go?
                  </h3>
                  <p className="mt-1 text-slate-500">
                    Choose your dream destinations in Sri Lanka
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <input
                  {...register("destinations", {
                    required: "Please enter at least one destination",
                  })}
                  placeholder="e.g., Sigiriya, Ella, Mirissa, Kandy..."
                  className="w-full rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white px-6 py-4 text-lg text-slate-700 placeholder:text-slate-400 transition-all focus:border-sky-400 focus:shadow-lg focus:shadow-sky-100 focus:outline-none"
                />
                {errors.destinations && (
                  <p className="flex items-center gap-2 text-sm text-rose-500">
                    <span>⚠️</span> {errors.destinations.message}
                  </p>
                )}

                <div className="pt-4">
                  <p className="mb-3 text-sm font-semibold text-slate-600">
                    Popular Destinations
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Sigiriya",
                      "Ella",
                      "Mirissa",
                      "Kandy",
                      "Galle",
                      "Yala",
                      "Nuwara Eliya",
                      "Arugam Bay",
                    ].map((place) => (
                      <button
                        key={place}
                        type="button"
                        onClick={() => {
                          const current = document.querySelector(
                            'input[name="destinations"]',
                          ).value;
                          setValue(
                            "destinations",
                            current ? `${current}, ${place}` : place,
                          );
                        }}
                        className="group rounded-full border-2 border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-sky-400 hover:bg-gradient-to-r hover:from-sky-50 hover:to-blue-50 hover:shadow-md hover:scale-105"
                      >
                        {place}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Schedule */}
            <div
              className={`transition-all duration-500 ${step === 2 ? "block" : "hidden"}`}
            >
              <div className="mb-8 flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 text-3xl shadow-lg">
                  📅
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">
                    When & How Long?
                  </h3>
                  <p className="mt-1 text-slate-500">
                    Select your travel dates and duration
                  </p>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                    <span>📆</span> Start Date
                  </label>
                  <input
                    type="date"
                    {...register("startDate", { required: step >= 2 })}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white px-5 py-4 text-slate-700 transition-all focus:border-emerald-400 focus:shadow-lg focus:shadow-emerald-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                    <span>⏱️</span> Duration (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    placeholder="How many days?"
                    {...register("durationDays", { required: step >= 2 })}
                    className="w-full rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white px-5 py-4 text-slate-700 placeholder:text-slate-400 transition-all focus:border-emerald-400 focus:shadow-lg focus:shadow-emerald-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="mb-3 text-sm font-semibold text-slate-600">
                  Quick Select Duration
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { days: 3, label: "3 Days", desc: "Weekend" },
                    { days: 5, label: "5 Days", desc: "Short Trip" },
                    { days: 7, label: "7 Days", desc: "One Week" },
                    { days: 14, label: "14 Days", desc: "Two Weeks" },
                  ].map((option) => (
                    <button
                      key={option.days}
                      type="button"
                      onClick={() => setValue("durationDays", option.days)}
                      className="group flex flex-col items-center gap-2 rounded-2xl border-2 border-slate-200 bg-white p-4 text-center transition-all hover:border-emerald-400 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-teal-50 hover:shadow-lg hover:scale-105"
                    >
                      <span className="text-2xl">🗓️</span>
                      <div>
                        <div className="text-lg font-bold text-slate-800">
                          {option.label}
                        </div>
                        <div className="text-xs text-slate-500">
                          {option.desc}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3: Details */}
            <div
              className={`transition-all duration-500 ${step === 3 ? "block" : "hidden"}`}
            >
              <div className="mb-8 flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 text-3xl shadow-lg">
                  ✨
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">
                    Final Touches
                  </h3>
                  <p className="mt-1 text-slate-500">
                    Personalize your perfect journey
                  </p>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 mb-6">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                    <span>👥</span> Number of Travelers
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    defaultValue={2}
                    {...register("travelers")}
                    className="w-full rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white px-5 py-4 text-lg text-slate-700 transition-all focus:border-amber-400 focus:shadow-lg focus:shadow-amber-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                    <span>💰</span> Budget (LKR)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 150,000 - 200,000"
                    {...register("budgetRange")}
                    className="w-full rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white px-5 py-4 text-lg text-slate-700 placeholder:text-slate-400 transition-all focus:border-amber-400 focus:shadow-lg focus:shadow-amber-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                  <span>📱</span> WhatsApp Contact Number{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="e.g., +94 77 123 4567"
                  {...register("whatsappNumber", {
                    required:
                      step === 3 ? "WhatsApp number is required" : false,
                    pattern: {
                      value:
                        /^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/,
                      message: "Please enter a valid phone number",
                    },
                  })}
                  className="w-full rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white px-5 py-4 text-lg text-slate-700 placeholder:text-slate-400 transition-all focus:border-amber-400 focus:shadow-lg focus:shadow-amber-100 focus:outline-none"
                />
                {errors.whatsappNumber && (
                  <p className="mt-2 flex items-center gap-2 text-sm text-rose-500">
                    <span>⚠️</span> {errors.whatsappNumber.message}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                  <span>📝</span> Special Requests & Preferences
                </label>
                <textarea
                  rows="4"
                  {...register("notes")}
                  placeholder="Tell us about dietary requirements, accommodation preferences, activities you'd like to include, or any special needs..."
                  className="w-full resize-none rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white px-5 py-4 text-slate-700 placeholder:text-slate-400 transition-all focus:border-amber-400 focus:shadow-lg focus:shadow-amber-100 focus:outline-none"
                />
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-6 border-2 border-amber-100">
                <p className="mb-4 text-sm font-bold text-amber-900">
                  Quick Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { icon: "🚐", label: "Private Van" },
                    { icon: "🥗", label: "Vegetarian" },
                    { icon: "🏨", label: "Luxury" },
                    { icon: "🎒", label: "Budget" },
                    { icon: "👨‍👩‍👧‍👦", label: "Family" },
                    { icon: "🏄", label: "Adventure" },
                    { icon: "🧘", label: "Wellness" },
                    { icon: "📸", label: "Photography" },
                  ].map((tag) => (
                    <button
                      key={tag.label}
                      type="button"
                      className="flex items-center gap-2 rounded-full border-2 border-amber-200 bg-white px-4 py-2 text-sm font-medium text-amber-900 transition-all hover:border-amber-400 hover:bg-amber-100 hover:shadow-md hover:scale-105"
                    >
                      <span>{tag.icon}</span>
                      <span>{tag.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-10 flex items-center justify-between border-t-2 border-slate-100 pt-8">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="group flex items-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow-md"
                >
                  <span className="transition-transform group-hover:-translate-x-1">
                    ←
                  </span>
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="submit"
                  className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 px-8 py-4 font-bold text-white shadow-xl shadow-sky-200 transition-all hover:shadow-2xl hover:shadow-sky-300 hover:scale-105"
                >
                  <span>Continue</span>
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-10 py-4 font-bold text-white shadow-xl shadow-emerald-200 transition-all hover:shadow-2xl hover:shadow-emerald-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <div className="relative flex items-center gap-3">
                    {isSubmitting ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-3 border-white border-t-transparent" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Request</span>
                        <span className="text-xl">✨</span>
                      </>
                    )}
                  </div>
                  {!isSubmitting && (
                    <div className="absolute inset-0 -z-10 animate-pulse bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-0 group-hover:opacity-30 transition-opacity" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="border-t-2 border-slate-100 bg-gradient-to-br from-slate-50 to-blue-50 px-8 py-6 rounded-b-3xl">
            <div className="flex flex-wrap items-center justify-center gap-8">
              {[
                { icon: "🛡️", label: "Secure & Safe", color: "text-blue-600" },
                {
                  icon: "💬",
                  label: "24/7 Support",
                  color: "text-emerald-600",
                },
                {
                  icon: "⭐",
                  label: "5000+ Happy Travelers",
                  color: "text-amber-600",
                },
                {
                  icon: "🏆",
                  label: "Best Value Guarantee",
                  color: "text-purple-600",
                },
              ].map((trust) => (
                <div key={trust.label} className="flex items-center gap-2">
                  <span className="text-2xl">{trust.icon}</span>
                  <span className={`text-sm font-bold ${trust.color}`}>
                    {trust.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanTrip;
