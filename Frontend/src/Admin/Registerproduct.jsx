import React, { useState } from "react";
import { postregisterproduct } from "./Adminapi"; // adjust path

const RegisterProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    discountPrice: "",
    stock: "",
    sku: "",
    tags: "",
  });

  const [images, setImages] = useState([]); // base64 image data
  const [message, setMessage] = useState(null);

  // 🧩 Handle text/number inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 📷 Convert selected images to base64 and preview
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const readers = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result); // base64 string
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers)
      .then((base64Images) => {
        setImages((prev) => [...prev, ...base64Images]); // append to existing
      })
      .catch((err) => console.error("Error reading images:", err));
  };

  // ❌ Remove one preview
  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 📨 Submit product
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (images.length < 4) {
      setMessage("❌ Please upload at least 4 images.");
      return;
    }

    try {
      const payload = {
        ...formData,
        tags: formData.tags
          ? formData.tags.split(",").map((t) => t.trim())
          : [],
        imageBase64Array: images,
      };

      const res = await postregisterproduct(payload);

      setMessage(res.message || "✅ Product registered successfully!");

      // Reset form
      setFormData({
        name: "",
        description: "",
        category: "",
        brand: "",
        price: "",
        discountPrice: "",
        stock: "",
        sku: "",
        tags: "",
      });
      setImages([]);
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.error || "❌ Error registering product");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        🛍️ Register New Product
      </h2>

      {message && (
        <div
          className={`p-3 mb-4 rounded-md text-sm ${
            message.startsWith("✅")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic info */}
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
          required
        />

        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={formData.brand}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
        />

        {/* Price section */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="border p-2 rounded-md"
            required
          />
          <input
            type="number"
            name="discountPrice"
            placeholder="Discount Price"
            value={formData.discountPrice}
            onChange={handleChange}
            className="border p-2 rounded-md"
          />
        </div>

        {/* Stock + SKU */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="stock"
            placeholder="Stock Quantity"
            value={formData.stock}
            onChange={handleChange}
            className="border p-2 rounded-md"
            required
          />
          <input
            type="text"
            name="sku"
            placeholder="SKU"
            value={formData.sku}
            onChange={handleChange}
            className="border p-2 rounded-md"
            required
          />
        </div>

        {/* Tags */}
        <input
          type="text"
          name="tags"
          placeholder='Tags (comma-separated, e.g. "electronics, gadget")'
          value={formData.tags}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
        />

        {/* Image upload */}
        <div>
          <label className="block mb-2 font-medium">
            Upload Images (min 4)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-700"
          />
        </div>

        {/* Image previews */}
        {images.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-3">
            {images.map((src, i) => (
              <div key={i} className="relative group">
                <img
                  src={src}
                  alt={`Preview ${i + 1}`}
                  className="w-full h-24 object-cover rounded-md border"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(i)}
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Register Product
        </button>
      </form>
    </div>
  );
};

export default RegisterProduct;
