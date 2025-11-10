import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "./Adminapi";

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

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  // 🧠 Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        setProducts(res);
      } catch (error) {
        console.error("❌ Failed to load products:", error);
        setMessage("❌ Failed to load products");
      }
    };
    fetchProducts();
  }, []);

  // 🛍️ Handlers
  const handleAddToCart = (product) => {
    setMessage(`🛒 ${product.name} added to cart`);
  };

  const handleBuyNow = (product) => {
    alert(`You are buying "${product.name}" for ₹${product.discountPrice || product.price}`);
  };

  const handleViewProduct = (id) => {
    navigate(`/admin/getproductsbyid/${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">🛍️ Products</h2>

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
      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => {
            // Convert Base64 → Blob URL for first image
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
                  onClick={(e) => e.stopPropagation()} // Prevent navigation on button clicks
                >
                  <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{product.category}</p>

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

export default ProductListing;
