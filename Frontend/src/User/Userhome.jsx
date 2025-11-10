import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();

  // ✅ Check if user is logged in
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(() => !!localStorage.getItem("userToken"));
  const [search, setSearch] = useState("");

  // 🚪 Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("role");
    setIsUserLoggedIn(false);
    navigate("/"); // redirect to homepage
  };

  // 🧭 Navigation Links
  const userLinks = [
    { to: "/user/getuser", label: "👤 View Profile", style: "bg-blue-600 text-white" },
    { to: "/user/getpersonaluser", label: "Profile ", style: "bg-indigo-600 text-white" },
    { to: "/user/viewproducts", label: "🛍️ Browse Products", style: "bg-green-600 text-white" },
    { to: "/user/vieworders", label: "📦 My Orders", style: "bg-purple-600 text-white" },
  ];

  // 🔍 Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search for:", search);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* 🧭 Header Section */}
      <header className="w-full bg-white shadow-sm py-4 px-6 flex flex-col sm:flex-row justify-between items-center gap-4 sticky top-0 z-10">
        <h1 className="text-3xl font-bold text-indigo-700">🛒 User Dashboard</h1>

        {/* 🔍 Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 w-full sm:w-96">
          <input
            type="text"
            placeholder="Search products or orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            🔍
          </button>
        </form>

        {/* 🚪 Logout */}
        {isUserLoggedIn && (
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-5 py-2 rounded-lg font-semibold shadow transition-all"
          >
            🚪 Logout
          </button>
        )}
      </header>

      {/* 🔗 Navigation Buttons at Top */}
      <nav className="w-full bg-white shadow-sm py-6 px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {userLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`${link.style} font-semibold px-6 py-4 rounded-xl text-center hover:scale-105 hover:shadow-md hover:brightness-110 transition-all duration-300`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* 📦 Main Content Area */}
      <main className="flex-grow px-6 py-10 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Welcome back 👋
        </h2>
        <p className="text-gray-600 mb-6">
          Use the buttons above to manage your profile, view products, and track your orders.
        </p>

        {/* Example Placeholder for Page Content */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-gray-500 text-center">
            Select an option above to get started.
          </p>
        </div>
      </main>

      {/* 📜 Footer */}
      <footer className="w-full py-4 text-center text-sm text-gray-500 border-t">
        © 2025 ShopNow User Portal. All rights reserved.
      </footer>
    </div>
  );
};

export default UserDashboard;
