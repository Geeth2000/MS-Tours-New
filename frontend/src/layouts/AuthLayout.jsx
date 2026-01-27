import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const AuthLayout = () => (
  <div className="flex min-h-screen flex-col bg-slate-50">
    <Navbar />
    <main className="mx-auto flex flex-1 max-w-md flex-col gap-8 px-4 py-16">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default AuthLayout;
