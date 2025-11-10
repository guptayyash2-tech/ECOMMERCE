import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createpersonal } from "./Userapi";

const CreateUserPersonal = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    address1: "",
    address2: "",
    address3: "",
    city: "",
    state: "",
    pincode: "",
    mobileNumber1: "",
    mobileNumber2: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // 🧩 Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 💾 Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await createpersonal(formData);
      setMessage(res.message || "Personal info created successfully!");
      setTimeout(() => navigate("/user/getpersonaluser"), 1500); // Redirect after success
    } catch (err) {
      console.error("❌ Error creating personal info:", err);
      setError(
        err.response?.data?.message || "Failed to create personal info."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-10 px-6">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-2xl p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
          🏠 Create Personal Info
        </h1>

        {/* ✅ Success / Error Message */}
        {message && (
          <div className="bg-green-100 text-green-700 px-4 py-2 mb-4 rounded-md text-center">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded-md text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Address Fields */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Address Line 1
              </label>
              <input
                type="text"
                name="address1"
                value={formData.address1}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Address Line 2
              </label>
              <input
                type="text"
                name="address2"
                value={formData.address2}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Address Line 3
            </label>
            <input
              type="text"
              name="address3"
              value={formData.address3}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* City, State, Pincode */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Pincode
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
                pattern="[0-9]{6}"
                title="Enter a valid 6-digit pincode"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Mobile Numbers */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Mobile Number 1
              </label>
              <input
                type="text"
                name="mobileNumber1"
                value={formData.mobileNumber1}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                title="Enter a valid 10-digit number"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Mobile Number 2
              </label>
              <input
                type="text"
                name="mobileNumber2"
                value={formData.mobileNumber2}
                onChange={handleChange}
                pattern="[0-9]{10}"
                title="Enter a valid 10-digit number"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "💾 Save Info"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/user")}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg transition"
            >
              🔙 Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserPersonal;
