import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../services/apiClient.js";
import SectionHeading from "../components/SectionHeading.jsx";

const PlanTrip = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data) => {
    try {
      await apiClient.post("/custom-requests", data);
      setSuccess(true);
      // Redirect to home after 3 seconds
      setTimeout(() => navigate("/"), 3000);
    } catch (error) {
      alert("Failed to submit request. Please login first.");
    }
  };

  if (success) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center animate-fade-in">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-slate-800">Request Received!</h2>
        <p className="text-slate-500 mt-2">
          Our travel agents will review your plan and contact you shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <SectionHeading
        title="Plan Your Dream Tour"
        subtitle="Tell us where you want to go, and we will handle the rest."
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 grid gap-6 rounded-3xl bg-white p-8 shadow-xl border border-slate-100"
      >
        {/* Destinations */}
        <div>
          <label className="mb-1 block text-sm font-bold text-slate-700">
            Where do you want to visit?
          </label>
          <input
            {...register("destinations", {
              required: "Please enter destinations",
            })}
            placeholder="e.g. Sigiriya, Ella, Mirissa"
            className="w-full rounded-xl border border-slate-200 p-3 focus:border-sky-500 focus:outline-none transition-colors"
          />
          {errors.destinations && (
            <span className="text-xs text-red-500">
              {errors.destinations.message}
            </span>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Start Date */}
          <div>
            <label className="mb-1 block text-sm font-bold text-slate-700">
              Start Date
            </label>
            <input
              type="date"
              {...register("startDate", { required: true })}
              min={new Date().toISOString().split("T")[0]}
              className="w-full rounded-xl border border-slate-200 p-3 focus:border-sky-500 focus:outline-none"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="mb-1 block text-sm font-bold text-slate-700">
              How many days?
            </label>
            <input
              type="number"
              min="1"
              {...register("durationDays", { required: true })}
              className="w-full rounded-xl border border-slate-200 p-3 focus:border-sky-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Travelers */}
          <div>
            <label className="mb-1 block text-sm font-bold text-slate-700">
              Number of Travelers
            </label>
            <input
              type="number"
              min="1"
              defaultValue={2}
              {...register("travelers")}
              className="w-full rounded-xl border border-slate-200 p-3 focus:border-sky-500 focus:outline-none"
            />
          </div>

          {/* Budget */}
          <div>
            <label className="mb-1 block text-sm font-bold text-slate-700">
              Estimated Budget (LKR)
            </label>
            <input
              placeholder="e.g. 100,000"
              {...register("budgetRange")}
              className="w-full rounded-xl border border-slate-200 p-3 focus:border-sky-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="mb-1 block text-sm font-bold text-slate-700">
            Any Special Requirements?
          </label>
          <textarea
            rows="4"
            {...register("notes")}
            placeholder="Need a luxury van? Vegetarian food? Let us know."
            className="w-full rounded-xl border border-slate-200 p-3 focus:border-sky-500 focus:outline-none resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-sky-500 py-4 font-bold text-white shadow-lg transition hover:bg-sky-600 disabled:opacity-70 hover:shadow-sky-500/30"
        >
          {isSubmitting ? "Sending Request..." : "Submit Custom Plan"}
        </button>
      </form>
    </div>
  );
};

export default PlanTrip;
