import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getallcompanyproductsbyid, addtocart } from "../Userapi"; // ✅ import addtocart

// Helper: Base64 → Blob
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

const GetproductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [blobUrls, setBlobUrls] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getallcompanyproductsbyid(id);
        setProduct(res);

        if (res.images && res.images.length > 0) {
          const urls = res.images.map((img) => base64ToBlobUrl(img));
          setBlobUrls(urls);
          setMainImage(urls[0]);
        }
      } catch (err) {
        console.error("❌ Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    return () => blobUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [id]);

  // ✅ Add to Cart handler
  const handleAddToCart = async () => {
    try {
      const payload = {
        productId: product._id,
        quantity: 1, // you can make this dynamic later
      };

      const res = await addtocart(payload);
      alert(`✅ ${product.name} added to cart!`);
      navigate("/user/addtocart");
      console.log("Cart Response:", res);
    } catch (err) {
      console.error("❌ Failed to add to cart:", err);
      alert("Failed to add product to cart. Please try again.");
    }
  };

  const handleBuyNow = () => {
    navigate("/user/checkout", { state: { product } });
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-96 text-gray-600 text-lg">
        Loading product details...
      </div>
    );

  if (!product)
    return (
      <div className="flex justify-center items-center h-96 text-red-600 text-lg">
        Product not found.
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
      {/* 🔙 Back Button */}
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg shadow-sm transition-all duration-200"
        >
          <span className="text-lg">←</span> Back
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* 🖼️ Product Image */}
        <div>
          {mainImage ? (
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-[400px] object-cover rounded-2xl shadow-md mb-4 hover:scale-[1.02] transition-transform"
            />
          ) : (
            <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center rounded-2xl">
              No Image
            </div>
          )}

          <div className="flex gap-3 overflow-x-auto">
            {blobUrls.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Thumbnail ${i}`}
                className={`w-24 h-24 object-cover rounded-lg cursor-pointer border-2 ${
                  mainImage === url
                    ? "border-indigo-600 scale-105"
                    : "border-gray-200"
                } transition-transform hover:scale-105`}
                onClick={() => setMainImage(url)}
              />
            ))}
          </div>
        </div>

        {/* 🏷️ Product Info */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <p className="text-gray-500 mb-4 capitalize">
              Category: <span className="font-semibold">{product.category}</span>
            </p>

            <div className="flex items-center gap-3 mb-4">
              <p className="text-3xl font-extrabold text-green-600">
                ₹{product.discountPrice || product.price}
              </p>
              {product.discountPrice && (
                <p className="text-gray-400 line-through text-xl">
                  ₹{product.price}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-gray-700 mb-6">
              <p><span className="font-semibold">Brand:</span> {product.brand || "—"}</p>
              <p><span className="font-semibold">SKU:</span> {product.sku || "—"}</p>
              <p>
                <span className="font-semibold">Stock:</span>{" "}
                {product.stock > 0 ? (
                  <span className="text-green-600">In Stock ({product.stock})</span>
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </p>
              <p><span className="font-semibold">Category:</span> {product.category || "—"}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description || "No description available."}
              </p>
            </div>
          </div>

          {/* 🛒 Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all duration-200"
            >
              🛒 Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all duration-200"
            >
              ⚡ Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetproductDetails;
