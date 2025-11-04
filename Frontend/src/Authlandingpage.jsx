import React from "react";
import { Link } from "react-router-dom";

const AuthSelection = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white px-4">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center">
        🔐 Welcome to HomeEase Portal
      </h1>
      <p className="text-lg mb-10 text-center max-w-xl">
        Choose how you want to log in or register — whether you’re a user or an admin.
      </p>

      {/* Auth Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl text-center">
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:bg-white/20 transition">
          <h2 className="text-2xl font-semibold mb-3">👤 User Access</h2>
          <div className="flex justify-center gap-4">
            <Link
              to="/login"
              className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-lg font-medium transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-lg font-medium transition"
            >
              Register
            </Link>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:bg-white/20 transition">
          <h2 className="text-2xl font-semibold mb-3">🧑‍💼 Admin Access</h2>
          <div className="flex justify-center gap-4">
            <Link
              to="/admin/login"
              className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-lg font-medium transition"
            >
              Login
            </Link>
            <Link
              to="/admin/register"
              className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-lg font-medium transition"
            >
              Register
            </Link>
          </div>
        </div>
      </div>

      <footer className="mt-10 text-sm text-gray-200">
        © {new Date().getFullYear()} HomeEase | Simplifying Rentals
      </footer>
    </div>
  );
};

export default AuthSelection;
