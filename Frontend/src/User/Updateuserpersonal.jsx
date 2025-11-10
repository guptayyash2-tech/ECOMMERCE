import React, { useEffect, useState } from "react";
import { getuserpersonal, updateuserpersonal } from "./Userapi";
import { useNavigate } from "react-router-dom";

const UpdateUserPersonal = () => {
  const navigate = useNavigate();
  const [personal, setPersonal] = useState(null);
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
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ✅ Load personal data safely
  useEffect(() => {
    const fetchPersonal = async () => {
      try {
        const response = await getuserpersonal();

        // ✅ Fix: handle both response shapes
        const data = response?.data || response || {};

        setPersonal(data);
        setFormData({
          name: data.name || "",
          address1: data.address1 || "",
          address2: data.address2 || "",
          address3: data.address3 || "",
          city: data.city || "",
          state: data.state || "",
          pincode: data.pincode || "",
          mobileNumber1: data.mobileNumber1 || "",
          mobileNumber2: data.mobileNumber2 || "",
        });
      } catch (err) {
        console.error("❌ Error fetching personal info:", err);
        setError("Failed to load personal details.");
      } finally {
        setLoading(false);
      }
    };
    fetchPersonal();
  }, []);

  // 🧩 Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 💾 Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage("");
      setError("");
      const res = await updateuserpersonal(formData);

      // ✅ fix structure
      setMessage(res.message || "Personal details updated successfully!");
      setPersonal(res.data || formData);
    } catch (err) {
      console.error("❌ Error updating personal info:", err);
      setError("Failed to update personal information.");
    } finally {
      setLoading(false);
    }
  };

  // 🌀 Loading & Error
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Loading personal details...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-2xl p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
          📝 Update Personal Information
        </h1>

        {message && (
          <div className="bg-green-100 text-green-700 px-4 py-2 mb-4 rounded-md text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Name */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Address Lines */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Address Line 1</label>
            <input
              type="text"
              name="address1"
              value={formData.address1}
              onChange={handleChange}
              placeholder="Near UcoBank ,Gangapur city,SawaiMadhopur District"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Address Line 2</label>
            <input
              type="text"
              name="address2"
              value={formData.address2}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Address Line 3</label>
            <input
              type="text"
              name="address3"
              value={formData.address3}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* City & State */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Pincode */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Pincode</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Mobile Numbers */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Mobile Number 1</label>
            <input
              type="text"
              name="mobileNumber1"
              value={formData.mobileNumber1}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Mobile Number 2</label>
            <input
              type="text"
              name="mobileNumber2"
              value={formData.mobileNumber2}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="md:col-span-2 flex justify-between mt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "💾 Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/user/getpersonaluser")}
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

export default UpdateUserPersonal;
