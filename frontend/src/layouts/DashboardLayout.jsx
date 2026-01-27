import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import DashboardSidebar from "../components/DashboardSidebar.jsx";

const DashboardLayout = ({ links, title, description }) => (
  <div className="min-h-screen bg-slate-50">
    <Navbar />
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-accent">{title}</h1>
        {description && <p className="mt-2 text-sm text-slate-500">{description}</p>}
      </header>
      <div className="flex flex-col gap-6 md:flex-row">
        <DashboardSidebar links={links} />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  </div>
);

export default DashboardLayout;
