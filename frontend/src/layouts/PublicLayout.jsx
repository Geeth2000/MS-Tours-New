import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const PublicLayout = () => {
  const location = useLocation();

  // Check if the current route is the Home page ("/")
  const isHomePage = location.pathname === "/";

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      {/* Full width layout for all pages */}
      <main className="w-full flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default PublicLayout;
