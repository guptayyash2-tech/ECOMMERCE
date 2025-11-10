import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getuserprofile, updateuser } from "./Userapi";

const UpdateUserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ✅ Fetch current user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getuserprofile();
        setUser(data);
        setFormData({
          name: data.name || "",
          email: data.email || "",
        });
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("⚠️ Failed to load profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // 🧩 Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 💾 Submit updated data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage("");
      setError("");

      const res = await updateuser(formData);
      setMessage(res.message || "✅ Profile updated successfully!");

      // optional redirect after 1.5s
      setTimeout(() => {
        navigate("/user/getuser");
      }, 1500);
    } catch (err) {
      console.error("Error updating user:", err);
      setError("❌ Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Loading profile...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8 border border-gray-200 mt-10">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-6 text-center">
          ✏️ Update Profile
        </h1>

        {message && (
          <div className="bg-green-100 text-green-700 px-4 py-2 mb-4 rounded-md text-center font-medium">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded-md text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Enter your email"
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "💾 Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/user/getuser")}
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

export default UpdateUserProfile;
