import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteuserpersonal, getuserpersonal, user } from "./Userapi"; // reuse axios instance

const GetUserPersonal = () => {
  const navigate = useNavigate();
  const [personal, setPersonal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Fetch user personal info
  useEffect(() => {
    const fetchPersonal = async () => {
      try {
        const response = await getuserpersonal();
        const data = response?.data || response;
        setPersonal(data);
      } catch (err) {
        console.error("❌ Error fetching personal info:", err);
        setError("Failed to load personal info.");
      } finally {
        setLoading(false);
      }
    };
    fetchPersonal();
  }, []);

  const handleDelete = async () => {
  if (!window.confirm("Are you sure you want to delete your personal info?")) return;
  try {
    await deleteuserpersonal();
    alert("Personal info deleted successfully!");
    setPersonal(null);
  } catch (err) {
    console.error(err);
    alert("Failed to delete personal info.");
  }
};

  // 🌀 Loading
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Loading personal info...
      </div>
    );

  // ❌ Error
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        {error}
      </div>
    );

  // ➕ No data found — show “Add Personal Info” button only here
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

  // ✅ When personal info exists — show details + edit/delete buttons
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-2xl p-8 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-700">
            👤 Personal Information
          </h1>
          <button
            onClick={() => navigate("/user/updatepersonal")}
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
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition"
          >
            🗑 Delete Personal Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default GetUserPersonal;
