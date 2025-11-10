import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getproductbyid } from "./Adminapi";

// Helper to convert Base64 → Blob URL
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

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [blobUrls, setBlobUrls] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getproductbyid(id);
        setProduct(res);

        // Convert Base64 → Blob URLs
        if (res.images && res.images.length > 0) {
          const urls = res.images.map((img) => base64ToBlobUrl(img));
          setBlobUrls(urls);
        }
      } catch (err) {
        console.error("❌ Failed to fetch product:", err);
      }
    };

    fetchProduct();

    // Cleanup blob URLs when component unmounts
    return () => blobUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [id]);

  if (!product) return <p className="text-center mt-6">Loading product details...</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h1 className="text-3xl font-semibold mb-4">{product.name}</h1>
      <p className="text-gray-600 mb-4">{product.category}</p>

      {/* 🖼️ Image gallery */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {blobUrls.map((url, i) => (
          <img
            key={i}
            src={url}
            alt={`Product ${i}`}
            className="rounded-xl shadow-md object-cover w-full h-48 hover:scale-105 transition-transform"
          />
        ))}
      </div>

      <p className="text-gray-700 text-lg mb-6">{product.description}</p>

      <div className="flex items-center gap-3">
        <p className="text-2xl font-bold text-green-600">
          ₹{product.discountPrice || product.price}
        </p>
        {product.discountPrice && (
          <p className="text-gray-400 line-through text-lg">₹{product.price}</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
