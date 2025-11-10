import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // ✅ Check if admin is logged in
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => !!localStorage.getItem("adminToken"));

  // 🚪 Handle Admin Logout
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("role");
    setIsAdminLoggedIn(false);
    navigate("/"); // redirect to main dashboard
  };

  // 🧭 Admin Navigation Links
  const adminLinks = [
    { to: "/admin/registercompanyprofile", label: "🏢 Register Company", style: "bg-indigo-600 text-white" },
    { to: "/admin/getcompanyprofile", label: "🏙️ View Company Profiles", style: "bg-blue-600 text-white" },
    { to: "/admin/registerproduct", label: "🛒 Add Product", style: "bg-purple-600 text-white" },
    { to: "/admin/getregisterproduct", label: "📦 View Products", style: "bg-green-600 text-white" },
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-white relative overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/free-photo/arrangement-black-friday-shopping-carts-with-copy-space_23-2148667047.jpg?semt=ais_hybrid&w=740&q=80')",
      }}
    >
      {/* 🩶 Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      {/* 🚪 Logout button (top-right corner) */}
      {isAdminLoggedIn && (
        <button
          onClick={handleLogout}
          className="absolute top-6 right-6 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 font-semibold px-5 py-2 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 z-10"
        >
          🚪 Logout
        </button>
      )}

      {/* 🧾 Header */}
      <div className="relative text-center px-6 mt-10 z-10">
        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
          ⚙️ Admin Dashboard
        </h1>
        <p className="text-lg mb-6 text-white/90">
          Manage companies, products, and your eCommerce platform efficiently.
        </p>
      </div>

      {/* 🔗 Admin Links */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 max-w-4xl">
        {adminLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`${link.style} font-semibold px-6 py-5 rounded-2xl text-center hover:scale-105 hover:shadow-2xl hover:brightness-110 transition-all duration-300`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* 📜 Footer */}
      <p className="absolute bottom-4 text-sm text-white/80 z-10">
        © 2025 ShopNow Admin Portal. All rights reserved.
      </p>
    </div>
  );
};

export default AdminDashboard;
