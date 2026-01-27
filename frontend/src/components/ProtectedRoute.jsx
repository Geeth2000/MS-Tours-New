import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../hooks/useAuthStore.js";

const ProtectedRoute = ({ roles }) => {
  const location = useLocation();
  const { user, token } = useAuthStore();

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
