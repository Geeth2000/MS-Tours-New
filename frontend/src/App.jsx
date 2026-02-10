import { Navigate, Route, Routes } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import Tours from "./pages/Tours.jsx";
import TourDetails from "./pages/TourDetails.jsx";
import Vehicles from "./pages/Vehicles.jsx";
import Packages from "./pages/Packages.jsx";
import AiAssistant from "./pages/AiAssistant.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AwaitingApproval from "./pages/AwaitingApproval.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";
import NotFound from "./pages/NotFound.jsx";
import UserDashboard from "./pages/dashboard/UserDashboard.jsx";
import OwnerDashboard from "./pages/dashboard/OwnerDashboard.jsx";
import AdminDashboard from "./pages/dashboard/AdminDashboard.jsx";
import AddTour from "./pages/admin/AddTour.jsx";
import { USER_ROLES } from "./services/config.js";
import PlanTrip from "./pages/PlanTrip.jsx";
import OwnerLayout from "./layouts/OwnerLayout.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

const travelerLinks = [
  { to: "/dashboard", label: "Overview" },
  { to: "/tours", label: "Browse Tours" },
  { to: "/vehicles", label: "Browse Vehicles" },
];

const ownerLinks = [
  { to: "/owner/dashboard", label: "Overview" },
  { to: "#vehicles", label: "My Vehicles" },
  { to: "#packages", label: "My Packages" },
  { to: "#bookings", label: "Bookings" },
];

const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/add-tour", label: "Add Tour" },
  { to: "#owners", label: "Vehicle Owners" },
  { to: "#users", label: "Users" },
];

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const App = () => (
  <GoogleOAuthProvider clientId={clientId}>
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="tours" element={<Tours />} />
        <Route path="tours/:slug" element={<TourDetails />} />
        <Route path="vehicles" element={<Vehicles />} />
        <Route path="packages" element={<Packages />} />
        <Route path="ai-assistant" element={<AiAssistant />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="awaiting-approval" element={<AwaitingApproval />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route path="plan-trip" element={<PlanTrip />} />
      </Route>

      {/* Auth Routes (Login/Register) */}
      <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      {/* Protected: Tourist */}
      <Route element={<ProtectedRoute roles={[USER_ROLES.TOURIST]} />}>
        <Route
          path="dashboard"
          element={<DashboardLayout links={travelerLinks} />}
        >
          <Route index element={<UserDashboard />} />
        </Route>
      </Route>

      {/* Protected: Vehicle Owner */}
      <Route element={<ProtectedRoute roles={[USER_ROLES.VEHICLE_OWNER]} />}>
        <Route path="owner" element={<OwnerLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<OwnerDashboard />} />
        </Route>
      </Route>

      {/* Protected: Admin */}
      <Route element={<ProtectedRoute roles={[USER_ROLES.ADMIN]} />}>
        <Route path="admin" element={<DashboardLayout links={adminLinks} />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />

          {/* 2. ADDED: Secure Route for Add Tour */}
          <Route path="add-tour" element={<AddTour />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  </GoogleOAuthProvider>
);

export default App;
