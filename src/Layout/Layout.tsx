import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar";

export default function Layout() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
  const isProfilePage = location.pathname === "/profile" || location.pathname.startsWith("/user/") || location.pathname === "/suggestions";
  const isHomePage = location.pathname === "/" || location.pathname === "/home";

  if (isAuthPage) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar />
      <main className={`flex-1 w-full ${isProfilePage || isHomePage ? "" : "max-w-4xl mx-auto px-4 sm:px-6"} py-6`}>
        <Outlet />
      </main>
    </div>
  );
}
