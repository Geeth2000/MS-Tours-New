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

      {/* Logic:
        - If isHomePage is true: Use 'w-full' (Full Width) so the Hero image can stretch.
        - If isHomePage is false: Use 'max-w-6xl' and padding to center content for other pages.
      */}
      <main
        className={`flex-1 ${
          isHomePage ? "w-full" : "mx-auto w-full max-w-6xl px-4 py-12"
        }`}
      >
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default PublicLayout;
