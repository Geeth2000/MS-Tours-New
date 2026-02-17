import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../hooks/useAuthStore.js";

const ownerLinks = [
  { to: "/owner/dashboard", label: "Overview", icon: "📊", hash: null },
  {
    to: "/owner/dashboard#fleet",
    label: "My Vehicles",
    icon: "🚗",
    hash: "#fleet",
  },
  {
    to: "/owner/dashboard#packages",
    label: "My Packages",
    icon: "📦",
    hash: "#packages",
  },
  {
    to: "/owner/dashboard#bookings",
    label: "Bookings",
    icon: "📅",
    hash: "#bookings",
  },
];

const OwnerSidebar = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (link) => {
    if (link.hash) {
      return location.hash === link.hash;
    }
    return location.pathname === link.to && !location.hash;
  };

  const handleClick = (link) => {
    setIsMobileOpen(false);
    if (link.hash) {
      // Dispatch a custom event that OwnerDashboard will listen to
      window.dispatchEvent(
        new CustomEvent("ownerTabChange", {
          detail: link.hash.replace("#", ""),
        }),
      );
    } else {
      window.dispatchEvent(
        new CustomEvent("ownerTabChange", { detail: "overview" }),
      );
    }
  };

  const ProfileAvatar = ({ size = "h-10 w-10", textSize = "text-sm" }) =>
    user?.profileImage ? (
      <img
        src={user.profileImage}
        alt={`${user.firstName}'s profile`}
        className={`${size} rounded-xl object-cover`}
      />
    ) : (
      <div
        className={`flex ${size} items-center justify-center rounded-xl bg-white/20 ${textSize} font-bold text-white`}
      >
        {user?.firstName?.[0]}
        {user?.lastName?.[0]}
      </div>
    );

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="flex w-full items-center justify-between rounded-2xl bg-white p-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 overflow-hidden">
              <ProfileAvatar size="h-10 w-10" textSize="text-sm" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">
                {user?.firstName || "Owner"} Dashboard
              </p>
              <p className="text-xs text-slate-500">Manage your fleet</p>
            </div>
          </div>
          <span className="text-lg text-slate-400">
            {isMobileOpen ? "✕" : "☰"}
          </span>
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`w-full shrink-0 self-start rounded-2xl bg-white p-4 shadow-sm lg:sticky lg:top-24 lg:w-64 ${
          isMobileOpen ? "block" : "hidden lg:block"
        }`}
      >
        {/* Header */}
        <div className="mb-6 hidden lg:block">
          <div className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 overflow-hidden">
              <ProfileAvatar size="h-12 w-12" textSize="text-lg" />
            </div>
            <div>
              <p className="font-bold text-white">
                {user?.firstName || "Owner"}
              </p>
              <p className="text-xs text-sky-100">Manage your fleet</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1.5 text-sm font-medium text-slate-600">
          {ownerLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => handleClick(link)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                isActive(link)
                  ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-200"
                  : "hover:bg-sky-50 hover:text-sky-600"
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Quick Stats */}
        <div className="mt-6 rounded-xl bg-slate-50 p-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            Quick Actions
          </p>
          <div className="space-y-2">
            <NavLink
              to="/owner/dashboard#fleet"
              onClick={() => handleClick({ hash: "#fleet" })}
              className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm transition hover:bg-sky-50 hover:text-sky-600"
            >
              <span>➕</span>
              <span>Add New Vehicle</span>
            </NavLink>
            <NavLink
              to="/owner/dashboard#packages"
              onClick={() => handleClick({ hash: "#packages" })}
              className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm transition hover:bg-sky-50 hover:text-sky-600"
            >
              <span>📝</span>
              <span>Create Package</span>
            </NavLink>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 p-4">
          <div className="flex items-center gap-2 text-amber-600">
            <span className="text-lg">💡</span>
            <p className="text-xs font-bold">Pro Tip</p>
          </div>
          <p className="mt-2 text-xs text-amber-700">
            Add high-quality photos to your vehicles for better visibility and
            more bookings.
          </p>
        </div>
      </aside>
    </>
  );
};

export default OwnerSidebar;
