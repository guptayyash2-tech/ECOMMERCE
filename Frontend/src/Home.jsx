import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const guestLinks = [
    { to: "/user/registeruser", label: "User Register", style: "bg-white/90 text-indigo-700" },
    { to: "/user/loginuser", label: "User Login", style: "bg-indigo-600 text-white" },
    { to: "/adminregister", label: "Admin Register", style: "bg-fuchsia-600 text-white" },
    { to: "/admin/loginadmin", label: "Admin Login", style: "bg-blue-600 text-white" },
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

      {/* Header */}
      <div className="relative text-center px-6 mt-20 z-10">
        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
          🛍️ Welcome to ShopNow
        </h1>
        <p className="text-lg mb-6 text-white/90">
          Your one-stop shop for everything — Register or Login to get started.
        </p>
      </div>

      {/* Buttons Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 max-w-4xl">
        {guestLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`${link.style} font-semibold px-6 py-5 rounded-2xl text-center hover:scale-105 hover:shadow-2xl hover:brightness-110 transition-all duration-300`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Footer */}
      <p className="absolute bottom-4 text-sm text-white/80 z-10">
        © 2025 ShopNow. All rights reserved.
      </p>
    </div>
  );
};

export default Dashboard;
