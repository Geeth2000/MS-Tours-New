import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { register as registerUser } from "../services/authService.js";
import { handleApiError } from "../services/apiClient.js";
import { useAuthStore } from "../hooks/useAuthStore.js";
import { USER_ROLES } from "../services/config.js";
import uploadfile from "../utils/mediaUpload.js";

const Register = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfileImage = () => {
    setProfileFile(null);
    setProfilePreview(null);
  };

  const onSubmit = async (formData) => {
    setError(null);
    try {
      setIsUploading(true);

      // Upload profile image if selected
      let profileImageUrl = null;
      if (profileFile) {
        profileImageUrl = await uploadfile(profileFile);
      }

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
        profileImage: profileImageUrl,
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
    } finally {
      setIsUploading(false);
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

        {/* Profile Photo Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-600">
            Profile Photo (Optional)
          </label>
          <div className="flex items-center gap-4">
            {profilePreview ? (
              <div className="relative">
                <img
                  src={profilePreview}
                  alt="Profile preview"
                  className="h-20 w-20 rounded-full object-cover border-2 border-sky-200"
                />
                <button
                  type="button"
                  onClick={removeProfileImage}
                  className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-slate-300 bg-slate-50">
                <svg
                  className="h-8 w-8 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            )}
            <div className="flex-1">
              <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Choose Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden"
                />
              </label>
              <p className="mt-1 text-xs text-slate-500">JPG, PNG up to 5MB</p>
            </div>
          </div>
        </div>

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
          disabled={isSubmitting || isUploading}
        >
          {isSubmitting || isUploading
            ? "Creating account..."
            : "Create Account"}
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
