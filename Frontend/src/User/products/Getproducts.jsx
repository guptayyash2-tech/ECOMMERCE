import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getallcompanyproducts } from "../Userapi";

// Helper to safely render Base64 images
const base64ToBlobUrl = (base64Data) => {
  if (!base64Data) return null;
  const [meta, data] = base64Data.split(",");
  const mime = meta?.match(/:(.*?);/)?.[1] || "image/jpeg";
  const byteChars = atob(data);
  const byteNumbers = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) {
    byteNumbers[i] = byteChars.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mime });
  return URL.createObjectURL(blob);
};

const GetAllProducts = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const navigate = useNavigate();

  // 🧠 Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getallcompanyproducts();
        setProducts(res);
      } catch (error) {
        console.error("❌ Failed to load products:", error);
        setMessage("❌ Failed to load products");
      }
    };
    fetchProducts();
  }, []);

  // 🏷️ Extract unique categories
  const categories = useMemo(() => {
    const cats = products.map((p) => p.category).filter(Boolean);
    return ["all", ...new Set(cats)];
  }, [products]);

  // 🔍 Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name
        ?.toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        category === "all" ||
        p.category?.toLowerCase() === category.toLowerCase();
      const price = p.discountPrice || p.price;
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, search, category, priceRange]);

  // 🛍️ Handlers
  const handleAddToCart = (product) => {
    setMessage(`🛒 ${product.name} added to cart`);
    setTimeout(() => setMessage(null), 2000);
  };

  const handleBuyNow = (product) => {
    alert(
      `You are buying "${product.name}" for ₹${product.discountPrice || product.price}`
    );
  };

  const handleViewProduct = (id) => {
    navigate(`/user/getallcompanyproducts/${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        🛍️ Products
      </h2>

      {/* 🧭 Filters Section */}
      <div className="bg-white p-4 mb-6 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* 🔍 Search */}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        {/* 🏷️ Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>

        {/* 💰 Price Range */}
        <div className="w-full md:w-1/3 flex flex-col">
          <label className="text-gray-700 text-sm mb-1">
            💰 Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
          </label>
          <input
            type="range"
            min="0"
            max="100000"
            step="1000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, Number(e.target.value)])}
            className="w-full accent-indigo-600"
          />
        </div>
      </div>

      {/* 🧾 Message */}
      {message && (
        <div
          className={`p-3 mb-4 rounded-md text-sm ${
            message.startsWith("🛒")
              ? "bg-blue-100 text-blue-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* 📦 Product Grid */}
      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const firstImage = product.images?.[0]
              ? base64ToBlobUrl(product.images[0])
              : null;

            return (
              <div
                key={product._id}
                onClick={() => handleViewProduct(product._id)}
                className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition cursor-pointer"
              >
                {/* 🖼️ Product Image */}
                {firstImage ? (
                  <img
                    src={firstImage}
                    alt={product.name}
                    className="w-full h-60 object-cover hover:opacity-90 transition"
                    onLoad={() => URL.revokeObjectURL(firstImage)}
                  />
                ) : (
                  <div className="w-full h-60 flex items-center justify-center bg-gray-200 text-gray-500">
                    No Image
                  </div>
                )}

                {/* 🧾 Product Info */}
                <div
                  className="p-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {product.category}
                  </p>

                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold text-green-600">
                      ₹{product.discountPrice || product.price}
                    </p>
                    {product.discountPrice && (
                      <p className="text-sm text-gray-400 line-through">
                        ₹{product.price}
                      </p>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {product.description}
                  </p>

                  {/* 🛍️ Action Buttons */}
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleBuyNow(product)}
                      className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GetAllProducts;
