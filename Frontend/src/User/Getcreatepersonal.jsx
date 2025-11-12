import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteuserpersonal, getuserpersonal } from "./Userapi";

const GetUserPersonal = () => {
  const navigate = useNavigate();
  const [personal, setPersonal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [deleting, setDeleting] = useState(false);

  // ✅ Fetch user personal info
  const fetchPersonal = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getuserpersonal();
      const data = response?.data || response;
      setPersonal(data);
    } catch (err) {
      console.error("❌ Error fetching personal info:", err);

      // ✅ If backend returns 404, treat it as "no personal info found"
      if (err.response?.status === 404) {
        setPersonal(null);
      } else {
        setError("Failed to load personal info.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonal();
  }, []);

  // 🗑 Handle delete
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your personal info?")) return;
    setDeleting(true);
    try {
      await deleteuserpersonal();
      setPersonal(null);
      setMessage("✅ Personal info deleted successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to delete personal info.");
    } finally {
      setDeleting(false);
    }
  };

  // 🌀 Loading state
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Loading personal info...
      </div>
    );

  // ❌ Error state
  if (error)
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-600 space-y-4">
        <p>{error}</p>
        <button
          onClick={fetchPersonal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
        >
          🔄 Retry
        </button>
      </div>
    );

  // ➕ No data found (404) — show “Add Personal Info”
  if (!personal) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-700">
        <p className="text-lg mb-4">No personal info found.</p>
        <button
          onClick={() => navigate("/user/createpersonaluser")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg transition"
        >
          ➕ Add Personal Info
        </button>

        {message && (
          <div className="mt-4 text-green-700 bg-green-100 px-4 py-2 rounded-md">
            {message}
          </div>
        )}
      </div>
    );
  }

  // ✅ When personal info exists
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-2xl p-8 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-700">
            👤 Personal Information
          </h1>
          <button
            onClick={() => navigate("/user/updatepersonaluser")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
          >
            ✏️ Edit
          </button>
        </div>

        {message && (
          <div className="bg-green-100 text-green-700 px-4 py-2 mb-4 rounded-md text-center">
            {message}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 text-gray-700">
          <div>
            <p className="font-semibold">Full Name:</p>
            <p>{personal.name}</p>
          </div>

          <div>
            <p className="font-semibold">City:</p>
            <p>{personal.city}</p>
          </div>

          <div>
            <p className="font-semibold">State:</p>
            <p>{personal.state}</p>
          </div>

          <div>
            <p className="font-semibold">Pincode:</p>
            <p>{personal.pincode}</p>
          </div>

          <div className="md:col-span-2">
            <p className="font-semibold">Address 1:</p>
            <p>{personal.address1}</p>
          </div>

          {personal.address2 && (
            <div className="md:col-span-2">
              <p className="font-semibold">Address 2:</p>
              <p>{personal.address2}</p>
            </div>
          )}

          {personal.address3 && (
            <div className="md:col-span-2">
              <p className="font-semibold">Address 3:</p>
              <p>{personal.address3}</p>
            </div>
          )}

          <div>
            <p className="font-semibold">Mobile Number 1:</p>
            <p>{personal.mobileNumber1}</p>
          </div>

          <div>
            <p className="font-semibold">Mobile Number 2:</p>
            <p>{personal.mobileNumber2 || "—"}</p>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <button
            onClick={() => navigate("/user")}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg transition"
          >
            🔙 Back to Dashboard
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className={`${
              deleting ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
            } text-white px-6 py-2 rounded-lg transition`}
          >
            {deleting ? "Deleting..." : "🗑 Delete Personal Info"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GetUserPersonal;
