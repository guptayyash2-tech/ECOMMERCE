import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder, getcartbyuser } from "../Userapi";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [orderData, setOrderData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    paymentMethod: "COD",
  });

  // 🧺 Load cart from backend (MongoDB)
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await getcartbyuser();
        if (res.success && res.cart && res.cart.items.length > 0) {
          setCart(res.cart.items);
          const totalAmount = res.cart.items.reduce((sum, item) => {
            const p = item.productId;
            return sum + (p.discountPrice || p.price || 0) * item.quantity;
          }, 0);
          setTotal(totalAmount);
        } else {
          setCart([]);
        }
      } catch (error) {
        console.error("❌ Failed to load cart:", error);
        setMessage("❌ Failed to load cart");
      }
    };
    fetchCart();
  }, []);

  // 🧠 Handle input change
  const handleChange = (e) => {
    setOrderData({ ...orderData, [e.target.name]: e.target.value });
  };

  // 🚀 Place Order
  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!cart || cart.length === 0) {
      setMessage("❌ Your cart is empty!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const userId = localStorage.getItem("userId");

      const orderPayload = {
        userId,
        products: cart.map((item) => ({
          productId: item.productId._id,
          name: item.productId.name,
          price: item.productId.discountPrice || item.productId.price,
          quantity: item.quantity,
        })),
        totalAmount: total,
        shippingAddress: {
          fullName: orderData.fullName,
          phone: orderData.phone,
          address: orderData.address,
          city: orderData.city,
          state: orderData.state,
          postalCode: orderData.postalCode,
        },
        paymentMethod: orderData.paymentMethod,
      };

      const res = await createOrder(orderPayload);
      setMessage("✅ Order placed successfully!");

      setTimeout(() => navigate("/user/orders"), 2000);
    } catch (error) {
      console.error("Order error:", error);
      setMessage("❌ Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  if (!cart)
    return (
      <div className="flex justify-center items-center h-96 text-gray-600">
        Loading cart...
      </div>
    );

  if (cart.length === 0)
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

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">🛍️ Checkout</h1>

        {/* 🧾 Cart Summary */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">🧺 Your Cart</h2>
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-center">Price</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-center">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{item.productId.name}</td>
                  <td className="p-3 text-center">
                    ₹{item.productId.discountPrice || item.productId.price}
                  </td>
                  <td className="p-3 text-center">{item.quantity}</td>
                  <td className="p-3 text-center">
                    ₹
                    {(item.productId.discountPrice || item.productId.price) *
                      item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-semibold">
                <td colSpan="3" className="p-3 text-right">
                  Total:
                </td>
                <td className="p-3 text-center text-green-600 text-lg">₹{total}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* 🚚 Shipping Form */}
        <form onSubmit={handleCheckout} className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">🚚 Shipping Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="fullName"
              value={orderData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="phone"
              value={orderData.phone}
              onChange={handleChange}
              placeholder="Phone"
              required
              className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="address"
              value={orderData.address}
              onChange={handleChange}
              placeholder="Address"
              required
              className="border p-3 rounded-lg sm:col-span-2 focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="city"
              value={orderData.city}
              onChange={handleChange}
              placeholder="City"
              required
              className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="state"
              value={orderData.state}
              onChange={handleChange}
              placeholder="State"
              required
              className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="postalCode"
              value={orderData.postalCode}
              onChange={handleChange}
              placeholder="Postal Code"
              required
              className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* 💳 Payment */}
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">💳 Payment Method</label>
            <select
              name="paymentMethod"
              value={orderData.paymentMethod}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-500"
            >
              <option value="COD">Cash on Delivery</option>
              <option value="UPI">UPI</option>
              <option value="CreditCard">Credit/Debit Card</option>
            </select>
          </div>

          {message && (
            <div
              className={`p-3 rounded-lg text-center font-medium ${
                message.startsWith("✅")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl mt-4 font-semibold hover:opacity-90 transition"
          >
            {loading ? "Processing..." : "✅ Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
