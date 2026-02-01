import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const OwnerLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      {/* A full-width container to let your Dashboard breathe */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default OwnerLayout;
