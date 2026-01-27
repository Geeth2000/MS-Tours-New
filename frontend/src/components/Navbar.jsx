import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../hooks/useAuthStore.js";
import { USER_ROLES } from "../services/config.js";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/tours", label: "Tours" },
  { to: "/vehicles", label: "Vehicles" },
  { to: "/packages", label: "Packages" },
  { to: "/ai-assistant", label: "AI Assistant" },
];

const roleDashboards = {
  [USER_ROLES.ADMIN]: "/admin/dashboard",
  [USER_ROLES.TOURIST]: "/dashboard",
  [USER_ROLES.VEHICLE_OWNER]: "/owner/dashboard",
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (!confirmed) return;
    logout();
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const isAdminPage = location.pathname.includes("/admin");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
      <div className="flex w-full items-center justify-between px-6 py-4 sm:px-12 lg:px-16">
        {/* 1. Logo */}
        <NavLink
          to="/"
          className="text-2xl font-extrabold tracking-tight text-slate-900 transition hover:opacity-80"
        >
          M&S <span className="text-sky-500">Tours</span>
        </NavLink>

        {/* 2. Desktop Navigation (Hidden on Mobile) */}
        {!isAdminPage && (
          <nav className="hidden gap-8 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `group relative text-sm font-semibold tracking-wide transition-colors ${
                    isActive
                      ? "text-sky-600"
                      : "text-slate-600 hover:text-sky-600"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 w-full origin-left transform rounded-full bg-sky-500 transition-transform duration-300 ease-out ${
                        isActive
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        )}

        {/* 3. Desktop Action Buttons (Hidden on Mobile) */}
        <div className="hidden items-center gap-4 md:flex">
          <AuthButtons
            user={user}
            isAdminPage={isAdminPage}
            handleLogout={handleLogout}
            navigate={navigate}
            roleDashboards={roleDashboards}
          />
        </div>

        {/* 4. Mobile Menu Toggle Button */}
        {!isAdminPage && (
          <button
            className="flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* 5. Mobile Menu Dropdown */}
      {isMobileMenuOpen && !isAdminPage && (
        <div className="border-t border-slate-100 bg-white/95 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col p-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-base font-semibold transition-colors ${
                    isActive
                      ? "bg-sky-50 text-sky-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div className="my-2 border-t border-slate-100" />

            <div className="flex flex-col gap-3 p-2">
              <AuthButtons
                user={user}
                isAdminPage={isAdminPage}
                handleLogout={handleLogout}
                navigate={navigate}
                roleDashboards={roleDashboards}
                isMobile={true}
                closeMenu={() => setIsMobileMenuOpen(false)}
              />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

// --- Sub-component for buttons to avoid duplication ---
const AuthButtons = ({
  user,
  isAdminPage,
  handleLogout,
  navigate,
  roleDashboards,
  isMobile,
  closeMenu,
}) => {
  const onNavigate = (path) => {
    navigate(path);
    if (closeMenu) closeMenu();
  };

  if (user) {
    return (
      <>
        {isAdminPage ? (
          <button
            onClick={() => onNavigate("/")}
            className={`rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 ${isMobile ? "w-full" : ""}`}
          >
            Go to Home ↗
          </button>
        ) : (
          <button
            onClick={() =>
              onNavigate(roleDashboards[user.role] || "/dashboard")
            }
            className={`rounded-full border border-sky-100 bg-sky-50 px-5 py-2.5 text-sm font-bold text-sky-600 transition hover:bg-sky-100 hover:text-sky-700 ${isMobile ? "w-full" : ""}`}
          >
            Dashboard
          </button>
        )}
        <button
          onClick={handleLogout}
          className={`rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800 ${isMobile ? "w-full" : ""}`}
        >
          Logout
        </button>
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => onNavigate("/login")}
        className={`font-bold text-slate-600 transition hover:text-sky-600 ${isMobile ? "w-full rounded-full border border-slate-200 py-2.5" : ""}`}
      >
        Login
      </button>
      <button
        onClick={() => onNavigate("/register")}
        className={`rounded-full bg-sky-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/30 transition hover:bg-sky-400 ${isMobile ? "w-full" : ""}`}
      >
        Sign Up
      </button>
    </>
  );
};

export default Navbar;
