import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { register as registerUser } from "../services/authService.js";
import { handleApiError } from "../services/apiClient.js";
import { useAuthStore } from "../hooks/useAuthStore.js";
import { USER_ROLES } from "../services/config.js";

const Register = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      role: USER_ROLES.TOURIST,
    },
  });

  // Watch the role to show/hide the extra fields
  const role = watch("role");

  const onSubmit = async (formData) => {
    setError(null);
    try {
      // 1. Separate the "document" fields from the rest of the form data
      const {
        nicNumber,
        drivingLicenseNumber,
        vehicleRegistrationNumber,
        ...baseData
      } = formData;

      // 2. Build the payload exactly how your User.js model wants it
      const payload = {
        ...baseData, // firstName, lastName, email, etc.
        onboarding:
          baseData.role === USER_ROLES.VEHICLE_OWNER
            ? {
                documents: {
                  nicNumber,
                  drivingLicenseNumber,
                  vehicleRegistrationNumber,
                },
              }
            : undefined,
      };

      const response = await registerUser(payload);
      setAuth(response);

      if (response.user.role === USER_ROLES.VEHICLE_OWNER) {
        navigate("/awaiting-approval", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  return (
    <div className="rounded-3xl bg-white p-8 shadow-soft">
      <h1 className="text-2xl font-semibold text-accent">
        Create your M&S Tours account
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Access curated travel experiences and manage your bookings.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-600">
            First Name
            <input
              {...register("firstName", { required: true })}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2"
              placeholder="First name"
            />
          </label>
          <label className="text-sm font-medium text-slate-600">
            Last Name
            <input
              {...register("lastName", { required: true })}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2"
              placeholder="Last name"
            />
          </label>
        </div>

        <label className="block text-sm font-medium text-slate-600">
          Email
          <input
            type="email"
            {...register("email", { required: true })}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2"
            placeholder="you@example.com"
          />
        </label>

        <label className="block text-sm font-medium text-slate-600">
          Password
          <input
            type="password"
            {...register("password", { required: true, minLength: 8 })}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2"
            placeholder="Minimum 8 characters"
          />
        </label>

        <label className="block text-sm font-medium text-slate-600">
          Phone
          <input
            {...register("phone")}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2"
            placeholder="Optional"
          />
        </label>

        <label className="block text-sm font-medium text-slate-600">
          Registering as
          <select
            {...register("role")}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2"
          >
            <option value={USER_ROLES.TOURIST}>Tourist / Customer</option>
            <option value={USER_ROLES.VEHICLE_OWNER}>
              Vehicle Owner / Driver
            </option>
          </select>
        </label>

        {/* These inputs collect the data, but onSubmit moves them to the right place */}
        {role === USER_ROLES.VEHICLE_OWNER && (
          <div className="space-y-4 rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm font-semibold text-primary">
              Vehicle owners require admin approval. Provide your verification
              details below.
            </p>
            <label className="block text-sm font-medium text-slate-600">
              NIC Number
              <input
                {...register("nicNumber", { required: true })}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2"
              />
            </label>
            <label className="block text-sm font-medium text-slate-600">
              Driving License Number
              <input
                {...register("drivingLicenseNumber", { required: true })}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2"
              />
            </label>
            <label className="block text-sm font-medium text-slate-600">
              Vehicle Registration Number
              <input
                {...register("vehicleRegistrationNumber", { required: true })}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2"
              />
            </label>
          </div>
        )}

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link to="/login" className="text-primary">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;
