import { NavLink, useLocation } from "react-router-dom";
import { useAuthStore } from "../hooks/useAuthStore.js";

const DashboardSidebar = ({ links }) => {
  const location = useLocation();
  const { user } = useAuthStore();

  return (
    <aside className="w-full shrink-0 self-start rounded-2xl bg-white p-4 shadow-soft md:sticky md:top-24 md:w-56">
      {/* User Profile Header */}
      <div className="mb-4 hidden md:block">
        <div className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 p-3">
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={`${user?.firstName}'s profile`}
              className="h-10 w-10 rounded-lg object-cover border-2 border-white/20"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-sm font-bold text-white">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">
              {user?.firstName}
            </p>
            <p className="truncate text-xs text-sky-100">{user?.email}</p>
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-1.5 text-sm font-medium text-slate-600">
        {links.map((link) => {
          if (link.to.startsWith("#")) {
            const active = location.hash === link.to;
            return (
              <a
                key={link.to}
                href={link.to}
                className={`rounded-xl px-4 py-3 transition ${
                  active
                    ? "bg-primary text-white shadow"
                    : "hover:bg-primary/10"
                }`}
              >
                {link.label}
              </a>
            );
          }

          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-xl px-4 py-3 transition ${
                  isActive
                    ? "bg-primary text-white shadow"
                    : "hover:bg-primary/10"
                }`
              }
            >
              {link.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
