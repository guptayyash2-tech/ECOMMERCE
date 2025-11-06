import React, { useState } from "react";
import { registeradminprofile } from "./Adminapi";

const AdminCompanyProfileForm = () => {
  const [form, setForm] = useState({
    companyName: "",
    type: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Build FormData for multipart/form-data
      const formData = new FormData();
      formData.append("companyName", form.companyName);
      formData.append("type", form.type);
      formData.append(
        "location",
        JSON.stringify({
          address: form.address,
          city: form.city,
          state: form.state,
          postalCode: form.postalCode,
          country: form.country,
        })
      );

      if (image) {
        formData.append("image", image);
      }

      const response = await registeradminprofile(formData);

      alert("✅ Company profile created successfully!");
      console.log("Response:", response);
    } catch (error) {
      console.error("❌ Error:", error);
      alert(error.response?.data?.error || "Failed to register company");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        🏢 Register Company Profile
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          value={form.companyName}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-lg"
        />

        <input
          type="text"
          name="type"
          placeholder="Company Type"
          value={form.type}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-lg"
        />

        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            required
            className="p-2 border rounded-lg"
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
            className="p-2 border rounded-lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            name="postalCode"
            placeholder="Postal Code"
            value={form.postalCode}
            onChange={handleChange}
            className="p-2 border rounded-lg"
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
            className="p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Company Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover rounded-lg border"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg font-semibold"
        >
          {loading ? "Submitting..." : "Register Company"}
        </button>
      </form>
    </div>
  );
};

export default AdminCompanyProfileForm;
