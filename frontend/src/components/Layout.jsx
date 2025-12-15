import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* 'Outlet' renders the child route (Dashboard, Expenses, etc.) */}
        <Outlet />
      </div>
    </div>
  );
}