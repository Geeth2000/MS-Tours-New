import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import OwnerSidebar from "../components/OwnerSidebar.jsx";

const OwnerLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <OwnerSidebar />
          <div className="min-w-0 flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerLayout;
