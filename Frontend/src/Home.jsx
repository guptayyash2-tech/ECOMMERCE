import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// 🌐 Guest (not logged in)
const guestLinks = [
  { to: "/register", label: "User Register", style: "bg-gradient-to-r from-white to-indigo-200 text-indigo-700" },
  { to: "/login", label: "User Login", style: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white" },
  { to: "/adminregister", label: "Admin Register", style: "bg-gradient-to-r from-fuchsia-500 via-purple-600 to-indigo-600 text-white shadow-lg" },
  { to: "/admin/loginadmin", label: "Admin Login", style: "bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white shadow-lg" },
];

// 👩‍💻 User dashboard links
const userLinks = [
  { to: "/getpersonalinfo", label: "Personal Info", style: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl" },
  { to: "/usergetprofile", label: "User Profile", style: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-xl" },
  { to: "/applyjob", label: "Show Job Detail", style: "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-xl" },
  { to: "/applications", label: "Track Job", style: "bg-gradient-to-r from-teal-500 to-green-600 text-white shadow-xl" },
];

// ⚙️ Admin dashboard links
const adminLinks = [
  { to: "/admingetprofile", label: "Admin Profile", style: "bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white shadow-xl" },
  { to: "/getjoblistings", label: "Job Listings", style: "bg-gradient-to-r from-indigo-500 via-blue-600 to-cyan-400 text-white shadow-xl" },
  { to: "/getcompanyinfo", label: "Company Info", style: "bg-gradient-to-r from-blue-500 via-sky-500 to-teal-400 text-white shadow-xl" },
  { to: "/getjobapplications", label: "Job Applications", style: "bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 text-white shadow-xl" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));
  const [role, setRole] = useState(() => localStorage.getItem("role"));

  // 🧠 Sync login status with localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // 🚪 Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole(null);
    navigate("/");
  };

  // 🎨 Dynamic background themes
  const bgClass = !isLoggedIn
    ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
    : role === "user"
    ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600"
    : "bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600";

  const welcomeMessage = !isLoggedIn
    ? "Welcome to Job.com 🚀"
    : role === "user"
    ? "Welcome, Job Seeker 👩‍💻"
    : "Welcome, Admin ⚙️";

  const subMessage = !isLoggedIn
    ? "Please register or login to continue."
    : role === "user"
    ? "Explore opportunities and manage your applications."
    : "Manage companies, jobs, and applications efficiently.";

  const linksToShow = !isLoggedIn ? guestLinks : role === "admin" ? adminLinks : userLinks;

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center text-white relative overflow-hidden ${bgClass} animate-gradient-slow bg-[length:200%_200%]`}>
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

      {/* Header */}
      <div className="relative text-center px-6 mt-20 z-10">
        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg animate-pulse">
          {welcomeMessage}
        </h1>
        <p className="text-lg mb-6 text-white/90">{subMessage}</p>
      </div>

      {/* Links grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl">
        {linksToShow.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`${link.style} font-semibold px-6 py-5 rounded-2xl text-center hover:scale-105 hover:shadow-2xl hover:brightness-110 transition-all duration-300`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Logout button (only if logged in) */}
      {isLoggedIn && (
        <button
          onClick={handleLogout}
          className="relative mt-12 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 font-semibold px-8 py-3 rounded-xl shadow-xl hover:scale-110 transition-all duration-300 z-10"
        >
          🚪 Logout
        </button>
      )}

      {/* Footer */}
      <p className="absolute bottom-4 text-sm text-white/70 z-10">
        &copy; 2025 Job.com Dashboard. All rights reserved.
      </p>
    </div>
  );
};

export default Dashboard;
