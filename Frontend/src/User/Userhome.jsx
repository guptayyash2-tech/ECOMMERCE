import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GetAllProducts from "./products/Getproducts";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(
    () => !!localStorage.getItem("userToken")
  );

  // 🔍 Search, Filter, and Price States
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("role");
    setIsUserLoggedIn(false);
    navigate("/");
  };

  // 📦 Navigation Links
  const userLinks = [
    { to: "/user/getuser", label: "👤 View Profile", style: "from-indigo-500 to-blue-500" },
    { to: "/user/getpersonaluser", label: "🧾 My Info", style: "from-purple-500 to-pink-500" },
    { to: "/user/viewproducts", label: "🛍️ Browse Products", style: "from-emerald-500 to-green-500" },
    { to: "/user/addtocart", label: "🛒 My Cart", style: "from-yellow-500 to-orange-500" },
  ];

  // 🧠 Handle Search Submit
  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search filters:", {
      search,
      category,
      priceMin: priceRange.min,
      priceMax: priceRange.max,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900">
      {/* 🧭 Header */}
      <header className="w-full bg-white/80 backdrop-blur-md shadow-md py-4 px-6 flex flex-col sm:flex-row justify-between items-center gap-4 sticky top-0 z-10 border-b border-gray-200">
        <h1 className="text-3xl font-extrabold text-indigo-700 tracking-tight drop-shadow-sm">
          🛒 User Dashboard
        </h1>

        {/* 🚪 Logout */}
        {isUserLoggedIn && (
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-pink-600 hover:scale-105 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
          >
            🚪 Logout
          </button>
        )}
      </header>

      {/* 🔗 Navigation Buttons */}
      <nav className="w-full bg-white/60 backdrop-blur-sm py-8 px-6 border-b border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {userLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`bg-gradient-to-r ${link.style} text-white font-semibold px-6 py-4 rounded-2xl text-center 
                shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* 📦 Main Content */}
      <main className="flex-grow px-6 py-10 max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Welcome back 👋
          </h2>
          <p className="text-gray-500 text-base">
            Explore, shop, and manage your products with ease.
          </p>
        </div>

        {/* 🛍️ Products Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
          <GetAllProducts
            search={search}
            category={category}
            priceMin={priceRange.min}
            priceMax={priceRange.max}
          />
        </div>
      </main>

      {/* 📜 Footer */}
      <footer className="w-full py-5 text-center text-sm text-gray-500 border-t border-gray-200 bg-white/70 backdrop-blur-sm">
        © 2025 <span className="font-semibold text-indigo-600">ShopNow</span> — All rights reserved.
      </footer>
    </div>
  );
};

export default UserDashboard;
