import { NavLink, useLocation } from "react-router-dom";

const DashboardSidebar = ({ links }) => {
  const location = useLocation();

  return (
    <aside className="w-full rounded-2xl bg-white p-6 shadow-soft md:w-72">
      <nav className="flex flex-col gap-2 text-sm font-medium text-slate-600">
        {links.map((link) => {
          if (link.to.startsWith("#")) {
            const active = location.hash === link.to;
            return (
              <a
                key={link.to}
                href={link.to}
                className={`rounded-xl px-4 py-3 transition ${
                  active ? "bg-primary text-white shadow" : "hover:bg-primary/10"
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
                  isActive ? "bg-primary text-white shadow" : "hover:bg-primary/10"
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
