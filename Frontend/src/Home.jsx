import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Check both tokens
    const adminToken = localStorage.getItem("adminToken");
    const userToken = localStorage.getItem("userToken");

    // If neither token exists → redirect to generic login
    if (!adminToken && !userToken) {
      navigate("/");
    }

    // If userToken exists but adminToken doesn't → redirect to user dashboard
    else if (userToken && !adminToken) {
      navigate("/user/dashboard");
    }

    // If adminToken exists but userToken doesn't → stay on admin dashboard
    // (no navigation needed)
  }, [navigate]);

  const handleLogout = () => {
    // Clear only admin token
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex flex-col items-center py-12 px-6 text-white">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-center">
        👨‍💼 Admin Dashboard
      </h1>

      <p className="text-lg md:text-xl mb-10 text-center max-w-2xl">
        Welcome back, Admin! Manage your homes, update your profile, and oversee listings.
      </p>

      {/* Dashboard Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        <Link
          to="/admin/registerhome"
          className="bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-2xl text-center shadow-lg hover:bg-opacity-20 transition duration-300"
        >
          <h2 className="text-2xl font-semibold mb-2">🏡 Register Home</h2>
          <p>Add new properties with images and details.</p>
        </Link>

        <Link
          to="/admin/getadmin"
          className="bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-2xl text-center shadow-lg hover:bg-opacity-20 transition duration-300"
        >
          <h2 className="text-2xl font-semibold mb-2">👤 Profile</h2>
          <p>View and update your profile info.</p>
        </Link>

        <Link
          to="/admin/getregisterhome"
          className="bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-2xl text-center shadow-lg hover:bg-opacity-20 transition duration-300"
        >
          <h2 className="text-2xl font-semibold mb-2">📋 My Homes</h2>
          <p>Manage your registered properties.</p>
        </Link>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-10 bg-red-500 hover:bg-red-600 px-8 py-3 rounded-xl font-semibold text-white transition duration-300 shadow-lg"
      >
        🚪 Logout
      </button>
    </div>
  );
};

export default AdminDashboard;
