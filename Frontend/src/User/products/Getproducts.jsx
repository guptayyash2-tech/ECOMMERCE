import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getallcompanyproducts } from "../Userapi";

// 🖼️ Base64 image helper
const base64ToBlobUrl = (base64Data) => {
  if (!base64Data) return null;
  const [meta, data] = base64Data.split(",");
  const mime = meta?.match(/:(.*?);/)?.[1] || "image/jpeg";
  const byteChars = atob(data);
  const byteArray = new Uint8Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) {
    byteArray[i] = byteChars.charCodeAt(i);
  }
  const blob = new Blob([byteArray], { type: mime });
  return URL.createObjectURL(blob);
};

const GetAllProducts = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
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

  // 🏷️ Unique Categories
  const categories = useMemo(() => {
    const cats = products.map((p) => p.category).filter(Boolean);
    return ["all", ...new Set(cats)];
  }, [products]);

  // 🔍 Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const nameMatch = p.name?.toLowerCase().includes(search.toLowerCase());
      const categoryMatch =
        category === "all" ||
        p.category?.toLowerCase() === category.toLowerCase();
      const price = p.discountPrice || p.price;
      const priceMatch =
        (!priceRange.min || price >= Number(priceRange.min)) &&
        (!priceRange.max || price <= Number(priceRange.max));
      return nameMatch && categoryMatch && priceMatch;
    });
  }, [products, search, category, priceRange]);

  // 🛒 Handlers
  const handleAddToCart = (product) => {
    setMessage(`🛒 ${product.name} added to cart`);
    setTimeout(() => setMessage(null), 2000);
  };

  const handleBuyNow = (product) => {
    alert(
      `You are buying "${product.name}" for ₹${product.discountPrice || product.price}`
    );
  };

  const handleViewProduct = (id) => navigate(`/user/getallcompanyproducts/${id}`);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-700 tracking-tight">
        🛍️ Explore Our Products
      </h2>

      {/* 🧭 Filters Section */}
      <div className="bg-white p-6 mb-8 rounded-2xl shadow-md flex flex-col md:flex-row gap-6 items-center justify-between border border-gray-100">
        {/* 🔍 Search */}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800"
        />

        {/* 🏷️ Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>

        {/* 💰 Price Range (Typed) */}
        <div className="flex gap-3 w-full md:w-1/3">
          <input
            type="number"
            placeholder="Min ₹"
            value={priceRange.min}
            onChange={(e) =>
              setPriceRange({ ...priceRange, min: e.target.value })
            }
            className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800"
          />
          <input
            type="number"
            placeholder="Max ₹"
            value={priceRange.max}
            onChange={(e) =>
              setPriceRange({ ...priceRange, max: e.target.value })
            }
            className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800"
          />
        </div>
      </div>

      {/* 🧾 Message */}
      {message && (
        <div
          className={`p-3 mb-4 rounded-md text-center text-sm font-medium ${
            message.startsWith("🛒")
              ? "bg-indigo-100 text-indigo-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* 📦 Product Grid */}
      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500 text-lg py-12">
          😕 No products found. Try different filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const firstImage = product.images?.[0]
              ? base64ToBlobUrl(product.images[0])
              : null;

            return (
              <div
                key={product._id}
                onClick={() => handleViewProduct(product._id)}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer border border-gray-100"
              >
                {/* 🖼️ Image */}
                {firstImage ? (
                  <img
                    src={firstImage}
                    alt={product.name}
                    className="w-full h-56 object-cover"
                    onLoad={() => URL.revokeObjectURL(firstImage)}
                  />
                ) : (
                  <div className="w-full h-56 flex items-center justify-center bg-gray-100 text-gray-400">
                    No Image
                  </div>
                )}

                {/* 🧾 Info */}
                <div
                  className="p-5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {product.category}
                  </p>

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl font-bold text-green-600">
                      ₹{product.discountPrice || product.price}
                    </span>
                    {product.discountPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ₹{product.price}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2">
                    {product.description}
                  </p>

                  {/* 🛍️ Buttons */}
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition font-medium"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleBuyNow(product)}
                      className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition font-medium"
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
