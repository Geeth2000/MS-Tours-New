import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import DashboardSidebar from "../components/DashboardSidebar.jsx";

const DashboardLayout = ({ links }) => (
  <div className="min-h-screen bg-slate-50">
    <Navbar />
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <DashboardSidebar links={links} />
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  </div>
);

export default DashboardLayout;
