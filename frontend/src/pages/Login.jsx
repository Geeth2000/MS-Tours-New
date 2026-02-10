import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { login, googleLogin } from "../services/authService.js";
import { handleApiError } from "../services/apiClient.js";
import { useAuthStore } from "../hooks/useAuthStore.js";
import { USER_ROLES } from "../services/config.js";

const roleDashboards = {
  [USER_ROLES.ADMIN]: "/admin/dashboard",
  [USER_ROLES.TOURIST]: "/dashboard",
  [USER_ROLES.VEHICLE_OWNER]: "/owner/dashboard",
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();
  const [error, setError] = useState(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const onSubmit = async (formData) => {
    setError(null);
    try {
      const response = await login(formData);
      setAuth(response);
      toast.success("Welcome back!");
      const redirect =
        location.state?.from?.pathname ||
        roleDashboards[response.user.role] ||
        "/";
      navigate(redirect, { replace: true });
    } catch (err) {
      const errorMsg = handleApiError(err);
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError(null);
    setGoogleLoading(true);
    try {
      const response = await googleLogin(credentialResponse.credential);
      setAuth(response);
      toast.success("Welcome back!");
      const redirect =
        location.state?.from?.pathname ||
        roleDashboards[response.user.role] ||
        "/";
      navigate(redirect, { replace: true });
    } catch (err) {
      const errorMsg = handleApiError(err);
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    const errorMsg = "Google sign-in failed. Please try again.";
    setError(errorMsg);
    toast.error(errorMsg);
  };

  return (
    <div className="rounded-3xl bg-white p-8 shadow-soft">
      <h1 className="text-2xl font-semibold text-accent">Welcome back</h1>
      <p className="mt-2 text-sm text-slate-500">
        Sign in to manage bookings, vehicles, and personalized itineraries.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        {error && <p className="text-sm text-red-500">{error}</p>}
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
            {...register("password", { required: true })}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2"
            placeholder="Enter password"
          />
        </label>
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-slate-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            theme="outline"
            size="large"
            text="signin_with"
            shape="rectangular"
            width={350}
          />
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        New to M&S Tours?{" "}
        <Link to="/register" className="text-primary">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default Login;
