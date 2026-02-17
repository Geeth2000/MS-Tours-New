import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../hooks/useAuthStore.js";

const AwaitingApproval = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Redirect to dashboard since approval is no longer required
  useEffect(() => {
    if (user?.role === "vehicleOwner") {
      navigate("/owner/dashboard", { replace: true });
    } else if (user) {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="rounded-3xl bg-white p-6 text-center shadow-soft">
      <h1 className="text-2xl font-semibold text-accent">Redirecting...</h1>
      <p className="mt-3 text-sm text-slate-600">
        Taking you to your dashboard.
      </p>
    </div>
  );
};

export default AwaitingApproval;
