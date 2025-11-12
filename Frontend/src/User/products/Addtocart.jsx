import React, { useEffect, useState } from "react";
import { getcartbyuser } from "../Userapi";
import { useNavigate } from "react-router-dom";

const Addtocart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await getcartbyuser();
        console.log("🧺 CART RESPONSE:", res);
        if (res.success) {
          setCart(res.cart);
        }
      } catch (err) {
        console.error("❌ Error fetching cart:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-96 text-gray-600 text-lg">
        Loading your cart...
      </div>
    );

  if (!cart || !cart.items || cart.items.length === 0)
    return (
      <div className="flex flex-col justify-center items-center h-96 text-gray-600">
        <p className="text-xl mb-4">🛒 Your cart is empty</p>
        <button
          onClick={() => navigate("/user/products")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow-md"
        >
          Continue Shopping
        </button>
      </div>
    );

  const total = cart.items.reduce((sum, item) => {
    const p = item.productId;
    const price = p.discountPrice || p.price || 0;
    return sum + price * (item.quantity || 1);
  }, 0);

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">🛍️ Your Cart</h1>

      {cart.items.map((item) => {
        const p = item.productId;
        const image =
          p.images && p.images[0]
            ? p.images[0].startsWith("data:")
              ? p.images[0]
              : `data:image/jpeg;base64,${p.images[0]}`
            : "/placeholder.png";

        return (
          <div
            key={item._id}
            className="flex items-center justify-between border-b border-gray-200 py-4"
          >
            <div className="flex items-center gap-5">
              <img
                src={image}
                alt={p.name || "Product"}
                className="w-24 h-24 object-cover rounded-xl border"
              />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {p.name}
                </h2>
                <p className="text-gray-500 text-sm">
                  ₹{p.discountPrice || p.price}
                </p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
            </div>
            <div className="text-right font-semibold text-green-600">
              ₹{(p.discountPrice || p.price || 0) * (item.quantity || 1)}
            </div>
          </div>
        );
      })}

      {/* 🧾 Total */}
      <div className="flex justify-between items-center mt-6 border-t pt-4">
        <h2 className="text-2xl font-bold text-gray-900">Total:</h2>
        <p className="text-2xl font-bold text-green-600">₹{total}</p>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={() => navigate("/user/checkout", { state: { cart } })}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-all"
        >
          Proceed to Checkout →
        </button>
      </div>
    </div>
  );
};

export default Addtocart;
